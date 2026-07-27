import { Router } from "express";

import { createEnrollment, getEnrolledStudentByClassId, getClassroomByGradeLevel, getClassroomGroupByGradeLevel } from "../controller/enrollments";

const router = Router();

router.post("/enrollments", createEnrollment)
router.get("/enrollments/classrooms", getClassroomGroupByGradeLevel)
router.get("/enrollments/classrooms/:classId", getEnrolledStudentByClassId)
router.get("/enrollments/grade-level/:gradeLevel", getClassroomByGradeLevel)

export default router;