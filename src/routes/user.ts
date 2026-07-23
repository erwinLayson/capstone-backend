import { Router } from "express";

// Controller
import { createUser, getAllUser } from "../controller/user";
// Version 2
import {createUser_v2, getAllUser_v2 } from "../controller/users.v2";
 
// middleware
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUser);


// Version 2
router.post('/users-v2', createUser_v2);
router.get('/users-v2', getAllUser_v2);

export default router;