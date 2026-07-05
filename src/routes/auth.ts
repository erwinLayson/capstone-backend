import { Router } from "express";

// middleware
import LoginAuthentication from "../middleware/authentication";
import verifyToken from "../middleware/verifyToken";

// controller
import {verifyUser } from "../controller/auth";
const router = Router();

router.post("/auth", LoginAuthentication);
router.post("/auth/verify/me", verifyToken,  verifyUser)

export default router;