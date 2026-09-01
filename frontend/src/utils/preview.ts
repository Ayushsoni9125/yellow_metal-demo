/**
 * Frontend loan estimate preview utility.
 *
 * This mirrors the backend calculation for UI display purposes only.
 * The backend remains the authoritative source — final values are
 * confirmed when POST /api/v1/leads/submit responds.
 *
 * Gold price is read from VITE_GOLD_PRICE_PER_GRAM so it stays
 * in sync with the backend environment variable.
 */

const GOLD_PRICE_PER_GRAM =
  Number(import.meta.env.VITE_GOLD_PRICE_PER_GRAM) || 7000

const REGULATORY_MAX_LTV = 75

export interface LoanPreview {
  pureGoldWeightGrams: number
  goldValue: number
  eligibleLoanAmount: number
  goldPricePerGram: number
}

/**
 * Computes a real-time loan estimate from gold details entered by the user.
 * Returns null if inputs are incomplete.
 */
export function previewLoanCalc(
  netWeightGrams: number | '',
  purityKarat: 18 | 22 | 24 | '',
): LoanPreview | null {
  if (netWeightGrams === '' || purityKarat === '') return null
  if (netWeightGrams <= 0) return null

  const pureGoldWeightGrams = Number(netWeightGrams) * (Number(purityKarat) / 24)
  const goldValue = pureGoldWeightGrams * GOLD_PRICE_PER_GRAM
  const eligibleLoanAmount = goldValue * (REGULATORY_MAX_LTV / 100)

  return {
    pureGoldWeightGrams: Number(pureGoldWeightGrams.toFixed(2)),
    goldValue: Number(goldValue.toFixed(2)),
    eligibleLoanAmount: Number(eligibleLoanAmount.toFixed(2)),
    goldPricePerGram: GOLD_PRICE_PER_GRAM,
  }
}
