import type {
  LoanPlan,
  SubmitLeadPayload,
  SubmitLeadResponse,
  GetLeadsResponse,
} from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5004'

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  const json = await res.json()

  if (!res.ok) {
    // Surface the backend's error message if available
    throw new ApiError(
      json?.message ?? 'An unexpected error occurred.',
      res.status,
      json?.errors,
    )
  }

  return json as T
}

// ─── ApiError ─────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** GET /api/v1/loan-schemes */
export async function getLoanSchemes(): Promise<LoanPlan[]> {
  return apiFetch<LoanPlan[]>('/api/v1/loan-schemes')
}

/** POST /api/v1/leads/submit */
export async function submitLead(
  payload: SubmitLeadPayload,
): Promise<SubmitLeadResponse> {
  return apiFetch<SubmitLeadResponse>('/api/v1/leads/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** GET /api/v1/leads */
export async function getLeads(): Promise<GetLeadsResponse> {
  return apiFetch<GetLeadsResponse>('/api/v1/leads')
}
