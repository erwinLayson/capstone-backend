import { Router } from "express";

// Controller
import { createSubject, getAllSubjects,getAllSubjectWithAllTeacherAndClass, getAllTeacherWithiutThisSubject, updateSubject } from "../controller/subject";

const router = Router();

router.post("/subjects", createSubject)
router.post("/subjects/edit/:subjectId", updateSubject)
router.get("/subjects", getAllSubjects)
router.get("/subjects/assigned-teachers/:subjectId", getAllSubjectWithAllTeacherAndClass)
router.get("/subjects/not-assigned-teachers/:subjectId", getAllTeacherWithiutThisSubject)

export default router;