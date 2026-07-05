import { Router } from "express";

// Controller
import { createSubject } from "../controller/subejct";

const router = Router();

router.post("/subjects", createSubject)

export default router;