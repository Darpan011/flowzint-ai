import { Router } from "express";

import { getAnalyticsSummaryController } from "../controllers/analytics.summary.controller";

const router = Router();

router.get(
    "/summary",
    getAnalyticsSummaryController
);

export default router;