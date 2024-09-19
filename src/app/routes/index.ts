import { Request, Response, Router } from "express";
import monitorRoutes from "../routes/monitor";
import snapshotRoutes from "../routes/snapshot";
import updateRoutes from "../routes/update";

const router = Router();

router.use("/monitors", monitorRoutes);
router.use("/snapshots", snapshotRoutes);
router.use("/updates", updateRoutes);
router.get("/healthz", (req: Request, res: Response) => {
  return res.status(200).json({ ts: Date.now() });
});

export default router;
