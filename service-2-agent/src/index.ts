import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import webhookRoute from "./routes/webhook.route";
import objectionRoute from "./routes/objection.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ZintSales AI Agent running", port: process.env.PORT });
});

app.use("/webhook", webhookRoute);
app.use("/objection", objectionRoute);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🤖 Service 2 running on port ${PORT}`);
});

export default app;
