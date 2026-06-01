import { Router } from "express";

import { getLead } from "../controllers/lead.fetch.controller";

import { updateLeadStatus } from "../controllers/lead.status.controller";

import { assignLeadController } from "../controllers/lead.assign.controller";

import { createLeadController } from "../controllers/lead.create.controller";

import { analyzeLead } from "../controllers/lead.controller";

import { getAllLeads } from "../controllers/lead.list.controller";

import { searchLeads } from "../controllers/lead.search.controller";

import { getStats } from "../controllers/lead.stats.controller";

import { deleteLeadController } from "../controllers/lead.delete.controller";

import { createNoteController } from "../controllers/note.create.controller";

import { fetchTimelineController } from "../controllers/timeline.fetch.controller";

const router = Router();

router.post(
    "/analyze",
    analyzeLead
);

router.post(
    "/create",
    createLeadController
);

router.post(
    "/:id/note",
    createNoteController
);

router.get(
    "/",
    getAllLeads
);

router.get(
    "/search",
    searchLeads
);

router.get(
    "/stats",
    getStats
);

router.get(
    "/:id/timeline",
    fetchTimelineController
);

router.patch(
    "/:id/status",
    updateLeadStatus
);

router.patch(
    "/:id/assign",
    assignLeadController
);

router.delete(
    "/:id",
    deleteLeadController
);

router.get(
    "/:id",
    getLead
);

export default router;