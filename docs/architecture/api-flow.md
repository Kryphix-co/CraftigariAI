# API flow

1. The browser sends requests to the Express API.
2. Express authenticates, validates, and coordinates business operations.
3. Express calls FastAPI for approved AI tasks.
4. FastAPI calls Gemini or BHASHINI through provider adapters.
5. Results return through Express, which decides what business data to persist.

TODO: Add endpoint-specific sequence diagrams after contracts are approved.
