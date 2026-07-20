import {Router}  from "express"

import { getTestingFunction} from "../testing/test";
const router = Router();

router.get("/test",getTestingFunction);

export default router;