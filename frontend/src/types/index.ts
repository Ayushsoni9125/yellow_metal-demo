// ─── Loan Plans ───────────────────────────────────────────────────────────────

export interface LoanPlan {
  id: string
  name: string
  interestRate: string | number
  maxLtv: string | number
  createdAt: string
}

// ─── Lead Submission ───────────────────────────────────────────────────────────

export interface SubmitLeadPayload {
  customerName: string
  mobileNumber: string
  grossWeightGrams: number
  netWeightGrams: number
  purityKarat: number
  selectedPlanId: string
}

export interface SubmitLeadResponse {
  message: string
  applicationId: string
  lead: {
    customerName: string
    netWeightGrams: string | number
    purityKarat: number
    pureGoldWeightGrams: string | number
    goldValue: string | number
    eligibleLoanAmount: string | number
    selectedPlan: {
      id: string
      name: string
      interestRate: string | number
      maxLtv: string | number
    }
    status: string
  }
}

// ─── Admin Leads ──────────────────────────────────────────────────────────────

export interface LeadRecord {
  applicationId: string
  customerName: string
  mobileNumber: string
  netWeightGrams: string | number
  purityKarat: number
  pureGoldWeightGrams: string | number
  goldValue: string | number
  eligibleLoanAmount: string | number
  selectedPlan: {
    id: string
    name: string
    interestRate: string | number
    maxLtv: string | number
  }
  status: string
  createdAt: string
}

export interface GetLeadsResponse {
  count: number
  leads: LeadRecord[]
}

// ─── Multi-step form data ─────────────────────────────────────────────────────

export interface ApplicationFormData {
  // Step 1 — Customer
  customerName: string
  mobileNumber: string

  // Step 2 — Gold
  grossWeightGrams: number | ''
  netWeightGrams: number | ''
  purityKarat: 18 | 22 | 24 | ''

  // Step 3 — Scheme
  selectedPlanId: string
}

export type ApplicationStep = 1 | 2 | 3 | 4 | 5
