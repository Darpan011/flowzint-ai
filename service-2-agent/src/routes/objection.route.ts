import { Router, Request, Response } from "express";
import { handleObjection } from "../services/objection.service";

const router = Router();

router.post("/handle", async (req: Request, res: Response) => {
  const { objection, company, segment } = req.body;

  if (!objection || !company) {
    res.status(400).json({ error: "objection and company are required" });
    return;
  }

  const result = await handleObjection(objection, company, segment ?? "WARM");

  res.json(result);
});

export default router;
