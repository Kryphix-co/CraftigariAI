# Craftigari

Craftigari is a multilingual, AI-assisted marketplace built to help Indian artisans turn their craft stories into trustworthy digital products, price their work fairly, negotiate with buyers, and manage orders from one place.

The platform combines a buyer-facing marketplace with an artisan workspace and an admin console. Artisans can create listings using photos and voice, while buyers get transparent pricing, verified craft context, direct inquiries, quotations, payments, and a digital craft passport.

## What it does

- **Voice-first product creation** — artisans can describe a product naturally instead of filling long forms.
- **AI-assisted cataloguing** — product titles, descriptions, missing details, and making-process steps are generated from artisan input and images.
- **Smart pricing** — calculates a fair price from material, labour, overhead, and margin inputs.
- **Deal Saathi** — helps artisans evaluate buyer offers and negotiate without losing sight of their floor price.
- **Multilingual experience** — supports regional-language voice transcription and translation through Sarvam AI, with BHASHINI retained as a fallback.
- **Direct commerce** — buyer inquiries, quotations, Razorpay payments, and order tracking are part of the same flow.
- **Digital Craft Passport** — gives published products a shareable record of their maker, process, and provenance.
- **Admin operations** — dedicated views for artisans, products, inquiries, orders, and AI review.

## Architecture

```text
Browser
  |
  v
Next.js web app (:3000)
  |
  v
Express API (:4000) ------> MongoDB
  |                         Cloudinary
  |                         Razorpay
  v
FastAPI AI service (:8000)
  |
  +--> Gemini
  +--> Sarvam AI / BHASHINI
```

The browser communicates only with the Express API. Express owns authentication, business data, uploads, payments, and order workflows; it calls the internal FastAPI service for AI-specific work.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Business API | Node.js, Express 5, Mongoose |
| AI service | Python, FastAPI, Pydantic, Google GenAI |
| Data and media | MongoDB, Cloudinary |
| Payments | Razorpay |
| Voice and translation | Sarvam AI, BHASHINI fallback |

## Repository structure

```text
CRAFTIGARI/
├── apps/
│   ├── web/              # Buyer, artisan, and admin Next.js interfaces
│   └── api/              # Express business API and integrations
├── services/
│   └── ai/               # FastAPI AI, speech, translation, and deal support
├── shared/contracts/     # Example request/response contracts between services
├── docs/                 # Product, architecture, demo, and pitch notes
├── research/             # Artisan and pricing research
├── ui-reference/         # Design references used by the frontend
└── workspaces/           # Team editor workspaces
```

## Local setup

### Prerequisites

- Node.js 20.9 or newer
- npm
- Python 3.11 or newer
- MongoDB (local or hosted)
- Credentials for the external services you want to exercise

### 1. Configure the environment

From the repository root:

```powershell
Copy-Item .env.example .env
```

Fill in `.env`. At minimum, a full local flow needs:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/craftigari
SESSION_SECRET=replace-with-a-long-random-value
OTP_HASH_SECRET=replace-with-another-long-random-value
INTERNAL_API_KEY=shared-secret-between-api-and-ai-service
GEMINI_API_KEY=your-gemini-key
SARVAM_API_KEY=your-sarvam-key
```

Cloudinary and Razorpay values are required only for their respective upload and payment flows. Never commit the populated `.env` file.

For local OTP login without sending SMS, set:

```dotenv
OTP_TEST_MODE=true
OTP_TEST_PHONE_NUMBERS=919999999999
```

Test mode is disabled in production and works only for explicitly allowlisted numbers.

### 2. Install dependencies

```powershell
cd apps/web
npm install

cd ../api
npm install

cd ../../services/ai
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Start the services

Open three terminals from the repository root.

**AI service**

```powershell
cd services/ai
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Express API**

```powershell
cd apps/api
npm run dev
```

**Web app**

```powershell
cd apps/web
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Local service URLs

| Service | URL |
| --- | --- |
| Web application | `http://localhost:3000` |
| Express health check | `http://localhost:4000/health` |
| FastAPI health check | `http://localhost:8000/health` |
| FastAPI interactive docs | `http://localhost:8000/docs` |

## Main application areas

- `/` and `/products` — buyer marketplace
- `/login` — artisan OTP sign-in
- `/artisan/dashboard` — artisan workspace
- `/artisan/products/new` — guided product creation
- `/artisan/inquiries` and `/artisan/orders` — deal and fulfilment workflows
- `/admin` — operations dashboard

## Available commands

Run these inside the relevant application directory:

| Directory | Command | Purpose |
| --- | --- | --- |
| `apps/web` | `npm run dev` | Start the Next.js development server |
| `apps/web` | `npm run build` | Create a production build |
| `apps/web` | `npm run lint` | Run frontend linting |
| `apps/api` | `npm run dev` | Start Express with file watching |
| `apps/api` | `npm start` | Start Express without file watching |
| `services/ai` | `uvicorn app.main:app --reload --port 8000` | Start the AI service |

## Documentation

- [System flow](docs/architecture/system-flow.md)
- [API flow](docs/architecture/api-flow.md)
- [Shared service contracts](shared/contracts/README.md)
- [Demo script](docs/demo/demo-script.md)

## Security notes

- Authentication uses a signed, HTTP-only artisan session cookie.
- The internal API key is server-to-server only and must never be exposed to the browser.
- Production deployments should use HTTPS, secure cookies, strict CORS origins, strong secrets, and provider webhook verification.
- Keep `.env`, provider credentials, and customer data out of version control.

---

Built to bring artisan stories, fair value, and direct buyer relationships into one digital marketplace.
