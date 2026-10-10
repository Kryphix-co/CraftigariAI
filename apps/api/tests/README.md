# API tests

Run `npm test` from `apps/api`. The suite covers health, CORS, OTP security rules, test-mode restrictions, signed sessions, onboarding, profile validation, product authorization, centralized errors, and the optional Making Process schema.

Live MongoDB CRUD verification requires a configured `MONGODB_URI` and test artisan data.
