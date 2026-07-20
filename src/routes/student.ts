import { Router} from "express";

// Controller
import { createStudent, getAllstudents, getStudentById } from "../controller/student";

import verifyToken from "../middleware/verifyToken"; 

const router = Router();

router.post("/students", createStudent);
router.get("/students", verifyToken, getAllstudents);
router.get("/students/:studentId", getStudentById);

export default router;