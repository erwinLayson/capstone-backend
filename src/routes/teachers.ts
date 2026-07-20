import { Router } from "express";

import {createTeacher, getAllTeacher, updateTeacherById, getTeacherWithNoAdvisory } from "../controller/teacher";

const router = Router();

router.post("/teachers", createTeacher);
router.patch("/teachers/:teacherId", updateTeacherById);
router.get("/teachers", getAllTeacher);
router.get("/teachers/available-adviser", getTeacherWithNoAdvisory);

export default router;