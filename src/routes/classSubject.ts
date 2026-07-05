import { Router } from "express";
import { createClassSubject } from "../controller/classSubject";

const router = Router();

router.post("/classroom/subjects", createClassSubject)

export default router