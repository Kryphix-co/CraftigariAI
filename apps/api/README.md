# Craftigari API

Express owns Craftigari business data and integrations with MongoDB, Cloudinary, Razorpay, and the internal AI service.

## Development

Copy the repository-root `.env.example` to the repository-root `.env`, fill the required values, install dependencies with `npm install`, and start with `npm run dev`.

`GET /health` and published-product reads are public. Artisan profiles and product draft operations use the signed HTTP-only session cookie created after OTP verification. The internal API key remains separate and is not a browser credential.

Development OTP responses are available only when `OTP_TEST_MODE=true`, the environment is not production, and the normalized phone number appears in `OTP_TEST_PHONE_NUMBERS`.

Run the built-in checks with `npm test`.
