import { Router } from "express";

import {createTeacher, getAllTeacher, updateTeacherById } from "../controller/teacher";

const router = Router();

router.post("/teachers", createTeacher);
router.patch("/teachers/:teacherId", updateTeacherById);
router.get("/teachers", getAllTeacher);

export default router;