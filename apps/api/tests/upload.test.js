import assert from "node:assert/strict";
import { Writable } from "node:stream";
import { test } from "node:test";
import { uploadImageBuffer } from "../src/lib/cloudinary.js";
import {
  detectImageFormat,
  uploadArtisanImages,
  validateImageFile,
} from "../src/modules/uploads/upload.service.js";

const ARTISAN_ID = "507f1f77bcf86cd799439011";
const JPEG_BUFFER = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]);

function cloudinaryConfig(overrides = {}) {
  return {
    cloudinaryApiKey: "test-key",
    cloudinaryApiSecret: "test-secret",
    cloudinaryCloudName: "test-cloud",
    ...overrides,
  };
}

function cloudinaryClient({ error = null, result } = {}) {
  let options;
  const client = {
    capturedOptions: () => options,
    uploader: {
      upload_stream(nextOptions, callback) {
        options = nextOptions;
        return new Writable({
          write(_chunk, _encoding, done) {
            done();
          },
          final(done) {
            callback(
              error,
              result ?? {
                format: "jpg",
                height: 800,
                public_id: `${nextOptions.folder}/${nextOptions.public_id}`,
                resource_type: "image",
                secure_url: "https://res.cloudinary.com/test/image/upload/image.jpg",
                width: 1200,
              },
            );
            done();
          },
        });
      },
    },
    url(publicId, transformations) {
      return `https://res.cloudinary.com/test/image/upload/c_${transformations.crop},w_${transformations.width},q_${transformations.quality},f_${transformations.fetch_format}/${publicId}`;
    },
  };
  return client;
}

test("image content detection accepts JPEG, PNG, and WebP signatures", () => {
  const webp = Buffer.from("RIFF0000WEBP", "ascii");
  assert.equal(detectImageFormat(JPEG_BUFFER), "jpeg");
  assert.equal(detectImageFormat(PNG_BUFFER), "png");
  assert.equal(detectImageFormat(webp), "webp");
  assert.equal(detectImageFormat(Buffer.from("not an image")), null);
});

test("declared MIME type must match the actual image bytes", () => {
  assert.throws(
    () => validateImageFile({ buffer: JPEG_BUFFER, mimetype: "image/png" }),
    (error) => error.code === "INVALID_IMAGE_CONTENT",
  );
});

test("Cloudinary uploads use deterministic IDs and artisan-specific folders", async () => {
  const client = cloudinaryClient();
  const uploaded = await uploadImageBuffer(
    { artisanId: ARTISAN_ID, buffer: JPEG_BUFFER },
    { client, config: cloudinaryConfig() },
  );
  const options = client.capturedOptions();

  assert.equal(options.folder, `craftigari/artisans/${ARTISAN_ID}/products`);
  assert.match(options.public_id, /^image-[a-f0-9]{32}$/);
  assert.equal(options.overwrite, true);
  assert.equal(options.resource_type, "image");
  assert.equal(options.timeout, 15000);
  assert.equal(uploaded.publicId.startsWith(options.folder), true);
  assert.match(uploaded.url, /c_limit,w_1600,q_auto,f_auto/);
});

test("stalled Cloudinary uploads fail with a clear timeout", async () => {
  const client = {
    uploader: {
      upload_stream() {
        return new Writable({
          write(_chunk, _encoding, done) {
            done();
          },
        });
      },
    },
  };

  await assert.rejects(
    () =>
      uploadImageBuffer(
        { artisanId: ARTISAN_ID, buffer: JPEG_BUFFER },
        { client, config: cloudinaryConfig(), timeoutMs: 5 },
      ),
    (error) => error.statusCode === 504 && error.code === "IMAGE_UPLOAD_TIMEOUT",
  );
});

test("missing Cloudinary credentials fail safely", async () => {
  await assert.rejects(
    () =>
      uploadImageBuffer(
        { artisanId: ARTISAN_ID, buffer: JPEG_BUFFER },
        {
          client: cloudinaryClient(),
          config: cloudinaryConfig({ cloudinaryApiSecret: "" }),
        },
      ),
    (error) => error.code === "IMAGE_STORAGE_NOT_CONFIGURED",
  );
});

test("Cloudinary failures are sanitized", async () => {
  await assert.rejects(
    () =>
      uploadImageBuffer(
        { artisanId: ARTISAN_ID, buffer: JPEG_BUFFER },
        {
          client: cloudinaryClient({ error: new Error("secret response") }),
          config: cloudinaryConfig(),
        },
      ),
    (error) =>
      error.code === "IMAGE_UPLOAD_FAILED" &&
      !error.message.includes("secret response"),
  );
});

test("upload service preserves file order and authenticated artisan scope", async () => {
  const received = [];
  const files = [
    { buffer: JPEG_BUFFER, mimetype: "image/jpeg", originalname: "one.jpg" },
    { buffer: PNG_BUFFER, mimetype: "image/png", originalname: "two.png" },
  ];
  const images = await uploadArtisanImages(ARTISAN_ID, files, {
    uploader: async (input) => {
      received.push(input);
      return {
        publicId: `public-${received.length}`,
        url: `https://example.test/${received.length}.jpg`,
      };
    },
  });

  assert.equal(received.every((input) => input.artisanId === ARTISAN_ID), true);
  assert.deepEqual(
    images.map((image) => image.originalName),
    ["one.jpg", "two.png"],
  );
});
