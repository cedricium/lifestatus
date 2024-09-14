import { Router } from "express";

import { requireAuth } from "../middleware/auth";
import * as monitorController from "../controllers/monitor";
import { getSnapshots } from "../../services/snapshot";

const router = Router();

router.get("/", async (req, res) => {
  const snapshots = await getSnapshots();
  res.status(200).json({ snapshots });
});

export default router;
