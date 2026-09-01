import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loanSchemeRouter from "./routes/loanScheme.routes.js";
import leadRouter from "./routes/lead.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/loan-schemes", loanSchemeRouter);
app.use("/api/v1/leads", leadRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Gold Loan API is running",
  });
});

// Error handler — must come after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // 5-minute keep-alive ping for cloud deployments (URL loaded from process.env)
  const pingUrl = process.env.RENDER_EXTERNAL_URL;
  if (pingUrl) {
    console.log(`[Keep-Alive Job] Configured to ping ${pingUrl} every 5 minutes`);
    setInterval(async () => {
      try {
        const res = await fetch(pingUrl);
        console.log(`[Keep-Alive Job] Pinged ${pingUrl} - Status: ${res.status}`);
      } catch (err) {
        console.error("[Keep-Alive Job] Ping failed:", err);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
});