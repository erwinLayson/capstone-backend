import { Router } from "express";

import { createClassroom, getAllClassrooms, getClassroomsById, updateClassroomById , getClassroomStudents} from "../controller/classroom";

const router = Router();

// Create Classrooms
router.post("/classrooms", createClassroom);

// Get all classrooms
router.get("/classrooms", getAllClassrooms);
// get classroom by Id
// Single classroom
router.get("/classrooms/:classroomId", getClassroomsById);
router.get("/classrooms/students/:classroomId", getClassroomStudents);
// Update classroom by Id
router.patch("/classrooms/:classroomId", updateClassroomById);
export default router;