import { Router, Request, Response } from "express";

const router = Router();

router.post("/lead", async (req: Request, res: Response) => {
  const lead = req.body;

  if (!lead?.domain) {
    return res.status(400).json({ error: "Invalid payload — domain required" });
  }

  const segment = lead.segment || lead.icp_score?.segment || "COLD";

  console.log(`\n📨 Webhook received: ${lead.domain} [${segment}]`);

  res.json({
    received: true,
    domain: lead.domain,
    segment,
    message: "Lead queued for agent processing",
  });

  setImmediate(async () => {
    try {
      const { processAgentLead } = await import("../services/agent.service");
      await processAgentLead(lead);
    } catch (err) {
      console.error("Agent processing error:", err);
    }
  });
});

export default router;
