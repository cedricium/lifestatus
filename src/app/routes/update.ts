import { Router } from "express";

import * as updateController from "../controllers/update";

const router = Router();

router.get("/", updateController.listUpdates);

export default router;
