import { Router } from "express";

import { createClassroom, getAllClassrooms, updateClassroomById } from "../controller/classroom";

const router = Router();

router.post("/classrooms", createClassroom);
router.get("/classrooms", getAllClassrooms);
router.patch("/classrooms/:classroomId", updateClassroomById);

export default router;