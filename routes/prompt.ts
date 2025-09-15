import { Router } from "express";
import { handleSlackPrompt } from "../controllers/handleSlackPrompt";

const router = Router();

// POST /challenge
router.post("/", handleSlackPrompt);

export default router;
