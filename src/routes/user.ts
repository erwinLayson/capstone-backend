import { Router } from "express";

// Controller
import { createUser, getAllUser} from "../controller/user";

// middleware
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post('/users', createUser);
router.get('/users', getAllUser);

export default router;