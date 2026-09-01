# AI_LOG.md — AI Assistance Audit

## Tools Used

| Tool | Purpose |
|---|---|
| **Antigravity IDE** (powered by Claude Sonnet) | Primary AI coding assistant — used throughout backend and frontend development for code generation, debugging, and architecture decisions |

---

## Prompt 1 — Backend Validation Rules

**Context:** Generating the Zod validation schema for the lead submission endpoint.

**Exact prompt used:**

> "Write a Zod validation schema for the gold loan lead submission payload. Fields: customerName (string, min 2, max 100), mobileNumber (string, must match valid Indian 10-digit format starting with 6-9), grossWeightGrams (positive number), netWeightGrams (positive number), purityKarat (must be exactly 18, 22, or 24), selectedPlanId (non-empty string). Add a cross-field refinement that ensures netWeightGrams is less than or equal to grossWeightGrams."

**Output generated (`lead.validation.ts`):**
```typescript
export const leadSubmissionSchema = z
  .object({
    customerName: z.string().trim().min(2, "...").max(100, "..."),
    mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, "..."),
    grossWeightGrams: z.number().positive("..."),
    netWeightGrams: z.number().positive("..."),
    purityKarat: z.number().refine(v => [18, 22, 24].includes(v), "..."),
    selectedPlanId: z.string().trim().min(1, "..."),
  })
  .refine(
    data => data.netWeightGrams <= data.grossWeightGrams,
    { message: "Net weight must be ≤ gross weight", path: ["netWeightGrams"] }
  )
```

**Assessment:** Output was accurate and complete. No corrections needed for the validation logic itself.

---

## Prompt 2 — Multi-Step Form State Management

**Context:** Generating the shared form state and step orchestration for the React multi-step application form.

**Exact prompt used:**

> "Build a React multi-step form orchestrator component in TypeScript. The form has 5 steps: Customer (name + mobile), Gold (grossWeight, netWeight, purityKarat as 18|22|24|''), Scheme (selectedPlanId string), Review (read-only summary), and Success (shows API response). Use useState for step (1–5) and formData (ApplicationFormData interface). Fetch loan schemes once on mount using useCallback and useEffect. The submit handler calls the backend POST API. On success, advance to step 5. On failure, surface the error message in step 4. Each step component receives its slice of defaultValues and an onNext callback that merges data back into shared state."

**Output generated (`ApplyPage.tsx`):** The orchestrator structure was correct — shared state, scheme fetching with retry, error propagation, and clean step transitions.

---

## Instance of Flawed AI Output — PORT Environment Variable

**What happened:**

When scaffolding the backend server, the AI generated:

```typescript
// server.ts
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

The server started successfully on the first run with the output:
```
Server running on http://localhost:5000
```

However, when the server was restarted, the output showed:
```
Server running on http://localhost:undefined
```

And `curl http://localhost:5000` returned no response.

**Root cause identified by manual audit:**

Two compounding bugs:

1. **Missing fallback:** `process.env.PORT` was used without a default. If the `.env` file is missing or unreadable, `PORT` is `undefined`, and `app.listen(undefined)` silently picks a random OS-assigned port — not port 5000.

2. **Wrong `.env` location:** The `.env` file was placed at the project root (`/gold/.env`) rather than inside the backend directory (`/gold/gold-loan-portal/backend/.env`). The `dotenv.config()` call searches only the current working directory, so `PORT` was never loaded.

The first time, the server happened to work because a previous process had already bound port 5000. On restart, the random port was different, causing `curl` to fail silently.

**Manual fix applied:**

```typescript
// Fix 1: Added fallback default
const PORT = process.env.PORT || 5000;

// Fix 2: Moved .env to backend/ directory
// (the correct working directory when npm run dev is executed)
```

**Lesson:** AI-generated code often assumes environment variables will always be present. In production and CI environments, missing env vars should cause an explicit, loud failure — not silent undefined behaviour. For critical config like database URLs, the AI's pattern of `throw new Error("DATABASE_URL is not defined")` (which it used in `src/lib/prisma.ts`) is the correct approach and should be applied consistently to all required env vars.

---

## General Audit Notes

- All Zod validations were cross-checked against the backend's business rules manually
- The 7-day deduplication query was reviewed to confirm the `gte` comparator was correct (greater than or equal to `sevenDaysAgo`, meaning "within the last 7 days")
- The `effectiveLtv = Math.min(planMaxLtv, REGULATORY_MAX_LTV_PERCENT)` formula was verified to correctly cap LTV at 75% even if a plan specifies a higher value
- Mobile masking pattern `${mobile.slice(0, 4)}XXXX${mobile.slice(-2)}` was verified to produce the format `9876XXXX10` as specified in the assignment
