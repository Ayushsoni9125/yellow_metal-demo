import { Router } from "express";
import {
  submitLead,
  getLeads,
} from "../controllers/lead.controller.js";

const router = Router();

router.post("/submit", submitLead);
router.get("/", getLeads);

export default router;