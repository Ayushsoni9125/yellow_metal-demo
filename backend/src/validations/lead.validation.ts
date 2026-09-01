import { z } from "zod";

export const leadSubmissionSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, "Customer name must be at least 2 characters")
      .max(100, "Customer name must not exceed 100 characters"),

    mobileNumber: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Mobile number must be a valid 10-digit number"
      ),

    grossWeightGrams: z
      .number()
      .positive("Gross weight must be greater than 0"),

    netWeightGrams: z
      .number()
      .positive("Net weight must be greater than 0"),

    purityKarat: z
      .number()
      .refine(
        (value) => [18, 22, 24].includes(value),
        "Purity must be 18K, 22K, or 24K"
      ),

    selectedPlanId: z
      .string()
      .trim()
      .min(1, "Loan plan is required"),
  })
  .refine(
    (data) => data.netWeightGrams <= data.grossWeightGrams,
    {
      message: "Net weight must be less than or equal to gross weight",
      path: ["netWeightGrams"],
    }
  );  