import { Router} from "express";

// Controller
import { createStudent, getAllstudents, getStudentById } from "../controller/student";

const router = Router();

router.post("/students", createStudent);
router.get("/students", getAllstudents);
router.get("/students/:studentId", getStudentById);

export default router;