const PRODUCT_STORAGE_KEY = "craftigari.demo-products.v1";
const DATABASE_NAME = "craftigari-demo-catalog";
const DATABASE_VERSION = 1;
const ASSET_STORE = "product-assets";

export const DEMO_CATALOG_EVENT = "craftigari:demo-catalog-change";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.addEventListener("upgradeneeded", () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(ASSET_STORE)) {
        database.createObjectStore(ASSET_STORE);
      }
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

async function storeAsset(key, blob) {
  const database = await openDatabase();
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(ASSET_STORE, "readwrite");
    transaction.objectStore(ASSET_STORE).put(blob, key);
    transaction.addEventListener("complete", resolve);
    transaction.addEventListener("error", () => reject(transaction.error));
  });
  database.close();
}

async function readAsset(key) {
  const database = await openDatabase();
  const blob = await new Promise((resolve, reject) => {
    const transaction = database.transaction(ASSET_STORE, "readonly");
    const request = transaction.objectStore(ASSET_STORE).get(key);
    request.addEventListener("success", () => resolve(request.result ?? null));
    request.addEventListener("error", () => reject(request.error));
  });
  database.close();
  return blob;
}

export function getDemoProductRecords() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    const records = stored ? JSON.parse(stored) : [];
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function saveDemoProductRecord(product) {
  const current = getDemoProductRecords().filter(
    (storedProduct) => storedProduct.id !== product.id,
  );
  window.localStorage.setItem(
    PRODUCT_STORAGE_KEY,
    JSON.stringify([product, ...current]),
  );
  window.dispatchEvent(new Event(DEMO_CATALOG_EVENT));
}

export async function publishDraftProduct({
  draft,
  makingProcessImages,
  photos,
}) {
  const productId =
    draft.publishedProductId ??
    `demo-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
  const imageKeys = [];

  for (const [index, photo] of photos.entries()) {
    const assetKey = `${productId}:product:${index}`;
    try {
      await storeAsset(assetKey, photo.file);
      imageKeys.push(assetKey);
    } catch {
      // Metadata is still published so the UI can degrade without a fake image.
    }
  }

  const makingProcess = [];
  for (const step of draft.makingProcess) {
    const processImage = makingProcessImages[step.id];
    let imageKey = null;
    if (processImage?.file) {
      imageKey = `${productId}:process:${step.id}`;
      try {
        await storeAsset(imageKey, processImage.file);
      } catch {
        imageKey = null;
      }
    }
    makingProcess.push({
      id: step.id,
      stage: step.stage,
      title: step.title,
      description: step.description,
      imageKey,
    });
  }

  const product = {
    id: productId,
    name: draft.summary.title || "Untitled craft product",
    description:
      draft.summary.description || draft.transcript || "Description not added.",
    artisanId: "ram-singh",
    artisan: "Master Ram Singh",
    region: "Rajasthan",
    category: draft.summary.craftType || "Pottery & Ceramics",
    craftType: draft.summary.craftType || "Craft type not added",
    material: draft.summary.material || "Material not added",
    price:
      draft.selectedPrice === "minimum"
        ? 850
        : draft.selectedPrice === "premium"
          ? 1450
          : 1150,
    minQty: 1,
    leadTime: draft.summary.effort || "Contact artisan",
    batch: `LOCAL-${productId.slice(-6).toUpperCase()}`,
    featured: true,
    isLocalDemo: true,
    publishedAt: new Date().toISOString(),
    imageKeys,
    makingProcess,
  };

  saveDemoProductRecord(product);
  return product;
}

export async function hydrateDemoProduct(record) {
  const objectUrls = [];
  const images = [];

  for (const assetKey of record.imageKeys ?? []) {
    try {
      const blob = await readAsset(assetKey);
      if (blob) {
        const url = URL.createObjectURL(blob);
        objectUrls.push(url);
        images.push(url);
      }
    } catch {
      // Missing browser storage is represented by an empty image state.
    }
  }

  const makingProcess = [];
  for (const step of record.makingProcess ?? []) {
    let image = null;
    if (step.imageKey) {
      try {
        const blob = await readAsset(step.imageKey);
        if (blob) {
          image = URL.createObjectURL(blob);
          objectUrls.push(image);
        }
      } catch {
        image = null;
      }
    }
    makingProcess.push({ ...step, image });
  }

  return {
    ...record,
    image: images[0] ?? null,
    images,
    makingProcess,
    _objectUrls: objectUrls,
  };
}

export function isDemoCatalogStorageEvent(event) {
  return event.key === PRODUCT_STORAGE_KEY;
}
