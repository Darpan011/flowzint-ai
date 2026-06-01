import { Router, Request, Response } from "express";
import { getLead } from "../controllers/lead.fetch.controller";
import { analyzeLead } from "../controllers/lead.controller";
import { getAllLeads } from "../controllers/lead.list.controller";
import { searchLeads } from "../controllers/lead.search.controller";
import { getStats } from "../controllers/lead.stats.controller";
import { deleteLeadController } from "../controllers/lead.delete.controller";
import { processLead } from "../services/lead.service";

const router = Router();

router.post("/analyze", analyzeLead);
router.post("/process", async (req: Request, res: Response) => {
  const { lead, product } = req.body;
  if (!lead) return res.status(400).json({ error: "lead is required" });
  try {
    const result = await processLead(lead, product);
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
});

router.get("/", getAllLeads);
router.get("/search", searchLeads);
router.get("/stats", getStats);

router.get("/test-ollama", async (req, res) => {
  try {
    const { ollamaCall } = await import("../lib/ollama");
    const result = await ollamaCall("Say hello in one sentence.");
    res.json({ success: true, response: result });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/test-serper", async (req, res) => {
  try {
    const { serperSearch } = await import("../lib/serper");
    const result = await serperSearch("openai.com company employees funding");
    res.json({ success: true, response: result });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/test-enrich", async (req, res) => {
  try {
    const { enrichLead } = await import("../services/lead.enrichment");
    const result = await enrichLead("OpenAI", "openai.com");
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

router.get("/test-score", async (req, res) => {
  const { enrichLead } = await import("../services/lead.enrichment");
  const { scoreLead } = await import("../services/lead.score");
  const enriched = await enrichLead("OpenAI", "openai.com");
  const score = await scoreLead(enriched);
  res.json({ success: true, data: score });
});

router.get("/test-db", async (req, res) => {
  try {
    const supabase = (await import("../db/supabase")).default;
    const { data, error } = await supabase.from("leads").select("id").limit(1);
    if (error) throw new Error(error.message);
    res.json({ success: true, message: "DB connected", data });
  } catch (e) {
    res.status(500).json({ success: false, error: (e as Error).message });
  }
});

// /:id routes MUST be last
router.delete("/:id", deleteLeadController);
router.get("/:id", getLead);

export default router;
