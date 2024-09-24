import { Router } from "express";
import { handler } from "../controllers/events/github";

const router = Router();

router.post("/github", handler);

export default router;
