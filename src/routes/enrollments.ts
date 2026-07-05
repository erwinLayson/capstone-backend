import { Router } from "express";

import { createEnrollment } from "../controller/enrollments";

const router = Router();

router.post("/enrollments", createEnrollment)

export default router;