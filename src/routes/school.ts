import { Router } from "express";

import { getSchoolInfo,  createSchoolInfo, updateSchoolinfo} from "../controller/school";

const router = Router();

router.post("/schools", createSchoolInfo)
router.patch("/schools/:schoolOldId", updateSchoolinfo)
router.get("/schools", getSchoolInfo)

export default router;