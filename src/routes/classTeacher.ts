import { Router } from "express";

import { createClassTeacher } from "../controller/classTeacher";

const router = Router();

router.post('/classroom/teachers', createClassTeacher)

export default router;