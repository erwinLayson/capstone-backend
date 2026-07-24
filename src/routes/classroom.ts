import { Router } from "express";

import { createClassroom, getAllClassrooms, getClassroomsById, updateClassroomById } from "../controller/classroom";

const router = Router();

router.post("/classrooms", createClassroom);
router.get("/classrooms", getAllClassrooms);
router.get("/classrooms/:classroomId", getClassroomsById);
router.patch("/classrooms/:classroomId", updateClassroomById);

export default router;