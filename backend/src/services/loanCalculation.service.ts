const GOLD_PRICE_PER_GRAM = Number(
  process.env.GOLD_PRICE_PER_GRAM
);

const REGULATORY_MAX_LTV_PERCENT = 75;

if (!GOLD_PRICE_PER_GRAM || GOLD_PRICE_PER_GRAM <= 0) {
  throw new Error(
    "GOLD_PRICE_PER_GRAM must be a positive number"
  );
}

export interface LoanCalculationInput {
  netWeightGrams: number;
  purityKarat: number;
  planMaxLtv: number;
}

export interface LoanCalculationResult {
  pureGoldWeightGrams: number;
  goldValue: number;
  effectiveLtv: number;
  eligibleLoanAmount: number;
}

export function calculateLoanEligibility(
  input: LoanCalculationInput
): LoanCalculationResult {
  const {
    netWeightGrams,
    purityKarat,
    planMaxLtv,
  } = input;

  const pureGoldWeightGrams =
    netWeightGrams * (purityKarat / 24);

  const goldValue =
    pureGoldWeightGrams * GOLD_PRICE_PER_GRAM;

  const effectiveLtv = Math.min(
    planMaxLtv,
    REGULATORY_MAX_LTV_PERCENT
  );

  const eligibleLoanAmount =
    goldValue * (effectiveLtv / 100);

  return {
    pureGoldWeightGrams: Number(
      pureGoldWeightGrams.toFixed(2)
    ),
    goldValue: Number(
      goldValue.toFixed(2)
    ),
    effectiveLtv,
    eligibleLoanAmount: Number(
      eligibleLoanAmount.toFixed(2)
    ),
  };
}