import { Router } from "express";

import * as snapshotController from "../controllers/snapshot";

const router = Router();

router.get("/", snapshotController.listSnapshots);

export default router;
