# System flow

```text
Next.js frontend
    -> Express API
        -> MongoDB
        -> Cloudinary
        -> Razorpay
        -> FastAPI AI service
            -> Gemini
            -> BHASHINI
```

The Express API owns business data. FastAPI receives only the context required for AI work and does not own MongoDB business records.
