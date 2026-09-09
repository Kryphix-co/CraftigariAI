# Contributing

1. Work in the application or support area assigned in `OWNERSHIP.md`.
2. Never commit secrets; copy the nearest `.env.example` into a local ignored environment file.
3. Keep the frontend-to-AI boundary intact: web calls Express, and Express calls FastAPI.
4. Update shared contracts when a service interface changes.
5. Run the relevant checks before opening a pull request.
