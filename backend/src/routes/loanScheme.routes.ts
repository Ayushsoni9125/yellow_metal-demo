import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const loanPlans = await prisma.loanPlan.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(loanPlans);
  } catch (error) {
    console.error("Error fetching loan schemes:", error);

    res.status(500).json({
      message: "Failed to fetch loan schemes",
    });
  }
});

export default router;