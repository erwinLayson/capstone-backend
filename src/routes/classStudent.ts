import { Router } from "express";

import { createClassStudent } from "../controller/classStudents";

const router = Router()

router.post("/classroom/students", createClassStudent);

export default router;