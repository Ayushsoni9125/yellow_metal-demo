# GoldCredit — Gold Loan Application Portal

A full-stack web application for gold loan intake and partner management. Partners or prospective borrowers enter gold collateral metrics to receive a preliminary loan eligibility estimate. Applications are stored in PostgreSQL with deduplication, and an admin dashboard provides a summary view of all submitted leads.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js · Express 5 · TypeScript |
| Database | PostgreSQL (via Prisma ORM + `@prisma/adapter-pg`) |
| Validation | Zod |
| Frontend | React 18 · Vite · TypeScript |
| Forms | React Hook Form |
| Styling | Vanilla CSS (custom design system) |
| Icons | Lucide React |

---

## Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local or cloud)
- Git

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ayushsoni9125/yellow-metal-demo.git
cd yellow-metal-demo
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5004
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GOLD_PRICE_PER_GRAM=7000
```

Run database migrations and seed loan plans:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Start the backend:

```bash
npm run dev       # development (tsx watch)
npm start         # production
```

Backend will be available at: `http://localhost:5004`

---

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `.env`:

```bash
cp .env.example .env   # or create manually
```

`.env` contents:

```env
VITE_API_BASE_URL=http://localhost:5004
VITE_GOLD_PRICE_PER_GRAM=7000
```

Start the frontend:

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Running Both Together

Open two terminal tabs:

```bash
# Tab 1 — Backend
cd backend && npm run dev

# Tab 2 — Frontend
cd frontend && npm run dev
```

---

## Application Routes

| URL | Description |
|---|---|
| `http://localhost:5173/apply` | Customer loan application (5-step flow) |
| `http://localhost:5173/admin` | Partner dashboard (password: `gold@123`) |

---

## API Reference

### `GET /api/v1/loan-schemes`
Returns available loan plans.

**Response:**
```json
[
  {
    "id": "PLAN_BULLET_01",
    "name": "Bullet Repayment Plan",
    "interestRate": "12",
    "maxLtv": "75",
    "createdAt": "..."
  }
]
```

---

### `POST /api/v1/leads/submit`
Submit a gold loan application.

**Request body:**
```json
{
  "customerName": "Rahul Sharma",
  "mobileNumber": "9876543210",
  "grossWeightGrams": 50,
  "netWeightGrams": 45,
  "purityKarat": 22,
  "selectedPlanId": "PLAN_BULLET_01"
}
```

**Response (201):**
```json
{
  "message": "Loan application submitted successfully",
  "applicationId": "GL-1788265470466",
  "lead": {
    "customerName": "Rahul Sharma",
    "pureGoldWeightGrams": "41.25",
    "goldValue": "288750",
    "eligibleLoanAmount": "216562.5",
    "selectedPlan": { "name": "Bullet Repayment Plan", "interestRate": "12", "maxLtv": "75" },
    "status": "SUBMITTED"
  }
}
```

**Error responses:**
| Status | Reason |
|---|---|
| `400` | Validation failure (missing/invalid fields) |
| `409` | Duplicate mobile number submitted within 7 days |
| `500` | Internal server error |

---

### `GET /api/v1/leads`
Returns all submitted leads (mobile number masked).

---

## Project Structure

```
gold-loan-portal/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # LoanPlan + Lead models
│   │   ├── seed.ts                # Seeds Bullet + EMI plans
│   │   └── migrations/
│   ├── src/
│   │   ├── server.ts              # Express app entry
│   │   ├── routes/
│   │   │   ├── loanScheme.routes.ts
│   │   │   └── lead.routes.ts
│   │   ├── controllers/
│   │   │   └── lead.controller.ts
│   │   ├── services/
│   │   │   └── loanCalculation.service.ts
│   │   ├── validations/
│   │   │   └── lead.validation.ts
│   │   ├── middleware/
│   │   │   └── error.middleware.ts
│   │   └── lib/
│   │       └── prisma.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/loanApi.ts         # All API calls
    │   ├── types/index.ts         # Shared TypeScript types
    │   ├── utils/
    │   │   ├── format.ts          # INR formatter, grams, date
    │   │   └── preview.ts         # Real-time loan estimate calc
    │   ├── components/
    │   │   ├── layout/            # PageHeader, PageShell
    │   │   └── application/       # StepIndicator
    │   └── pages/
    │       ├── apply/             # 5-step application flow
    │       │   └── steps/         # CustomerStep, GoldStep, SchemeStep,
    │       │                      # ReviewStep, SuccessStep
    │       └── admin/             # AdminPage (password gate + dashboard)
    └── package.json
```

---

## Financial Calculation Logic

```
pureGoldWeightGrams = netWeightGrams × (purityKarat / 24)
goldValue           = pureGoldWeightGrams × goldPricePerGram
eligibleLoanAmount  = goldValue × min(planMaxLTV, 75%) / 100
```

The backend is the authoritative source for all calculations. The frontend shows a real-time indicative estimate during scheme selection; final values are confirmed by the backend on submission.

---

## Business Rules

- Net weight must be ≤ gross weight
- Mobile number must be a valid 10-digit Indian number (starting with 6–9)
- Purity must be 18K, 22K, or 24K
- Same mobile number cannot submit more than one application within 7 days (HTTP 409)
- LTV capped at 75% per RBI regulation
