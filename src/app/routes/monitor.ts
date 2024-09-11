import { Router } from "express";

import * as monitorController from "../controllers/monitor";
import * as updateController from "../controllers/update";

const router = Router();

router.get("/", monitorController.listMonitors);
router.post("/", monitorController.createMonitor);
router.get("/status", monitorController.getAverageMonitorStatus);

router.post("/:id/updates", updateController.recordUpdate);

export default router;
