import { Router } from "express";

import { createEnrollment, getStudentEnrolledByClass } from "../controller/enrollments";

const router = Router();

router.post("/enrollments", createEnrollment)
router.get("/enrollments/:classId", getStudentEnrolledByClass)

export default router;