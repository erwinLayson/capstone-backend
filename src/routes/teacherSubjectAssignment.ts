import { Router } from "express";

// Controller
import { createTSA} from "../controller/teacherSubejctAssignment";

const router = Router();

router.post("/subjects/teachers", createTSA);

export default router;