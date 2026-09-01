import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { leadSubmissionSchema } from "../validations/lead.validation.js";
import { calculateLoanEligibility } from "../services/loanCalculation.service.js";

export async function submitLead(req: Request, res: Response) {
  try {
    // 1. Validate request body
    const validationResult = leadSubmissionSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = validationResult.data;

    // 2. Check whether the mobile number was used
    // within the previous 7 days.
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const existingLead = await prisma.lead.findFirst({
      where: {
        mobileNumber: data.mobileNumber,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    if (existingLead) {
      return res.status(409).json({
        message:
          "An application with this mobile number was already submitted within the last 7 days",
      });
    }

    // 3. Verify that the selected loan plan exists
    const selectedPlan = await prisma.loanPlan.findUnique({
      where: {
        id: data.selectedPlanId,
      },
    });

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Invalid loan plan",
      });
    }

    // 4. Calculate loan eligibility
   const calculation = calculateLoanEligibility({
  netWeightGrams: data.netWeightGrams,
  purityKarat: data.purityKarat,
  planMaxLtv: Number(selectedPlan.maxLtv),
});

    // 5. Generate application ID
    const applicationId = `GL-${Date.now()}`;

    // 6. Save the application
    const lead = await prisma.lead.create({
      data: {
        applicationId,

        customerName: data.customerName,
        mobileNumber: data.mobileNumber,

        grossWeightGrams: data.grossWeightGrams,
        netWeightGrams: data.netWeightGrams,
        purityKarat: data.purityKarat,

        pureGoldWeightGrams: calculation.pureGoldWeightGrams,
        goldValue: calculation.goldValue,
        eligibleLoanAmount: calculation.eligibleLoanAmount,

        selectedPlanId: selectedPlan.id,

        status: "SUBMITTED",
      },
    });

    // 7. Return successful response
    return res.status(201).json({
      message: "Loan application submitted successfully",
      applicationId: lead.applicationId,
      lead: {
        customerName: lead.customerName,
        netWeightGrams: lead.netWeightGrams,
        purityKarat: lead.purityKarat,
        pureGoldWeightGrams: lead.pureGoldWeightGrams,
        goldValue: lead.goldValue,
        eligibleLoanAmount: lead.eligibleLoanAmount,
        selectedPlan: {
          id: selectedPlan.id,
          name: selectedPlan.name,
          interestRate: selectedPlan.interestRate,
          maxLtv: selectedPlan.maxLtv,
        },
        status: lead.status,
      },
    });
  } catch (error) {
    console.error("Error submitting lead:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getLeads(
  _req: Request,
  res: Response
) {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        status: "SUBMITTED",
      },
      include: {
        selectedPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedLeads = leads.map((lead) => ({
      applicationId: lead.applicationId,
      customerName: lead.customerName,

      mobileNumber: `${lead.mobileNumber.slice(0, 4)}XXXX${lead.mobileNumber.slice(-2)}`,

      netWeightGrams: lead.netWeightGrams,
      purityKarat: lead.purityKarat,
      pureGoldWeightGrams: lead.pureGoldWeightGrams,
      goldValue: lead.goldValue,
      eligibleLoanAmount: lead.eligibleLoanAmount,

      selectedPlan: {
        id: lead.selectedPlan.id,
        name: lead.selectedPlan.name,
        interestRate: lead.selectedPlan.interestRate,
        maxLtv: lead.selectedPlan.maxLtv,
      },

      status: lead.status,
      createdAt: lead.createdAt,
    }));

    return res.status(200).json({
      count: formattedLeads.length,
      leads: formattedLeads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);

    return res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
}