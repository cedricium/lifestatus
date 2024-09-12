import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import * as monitorController from "../controllers/monitor";
import * as updateController from "../controllers/update";

const router = Router();

router.get("/", monitorController.listMonitors);
router.get("/status", monitorController.getAverageMonitorStatus);
router.post("/", requireAuth, monitorController.createMonitor);

router.post("/:id/updates", requireAuth, updateController.recordUpdate);

export default router;
