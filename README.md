# Craftigari

Craftigari is organized as a small service-oriented monorepo:

```text
Next.js web app -> Express API -> FastAPI AI service -> Gemini / BHASHINI
```

The Express API owns MongoDB business data and the Cloudinary and Razorpay integrations. FastAPI owns AI orchestration only. The web app communicates with Express and never calls AI providers directly.

## Projects

- `apps/web`: Next.js frontend
- `apps/api`: Express API
- `services/ai`: FastAPI AI service
- `shared/contracts`: service interface examples
- `research`, `qa`, and `docs`: supporting project work

See each application README for local setup. Feature files currently contain architecture placeholders only.
