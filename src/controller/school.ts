import { Request, Response, NextFunction } from "express";

import {
  createSchoolInfo as createService,
  getSchoolInfo as getSchoolService,
  updateSchoolInfo as updateSchoolService
} from "../service/school";

import { School, updateSchoolInfoProps} from "../constant/school";

// Helper
import successResponse from "../helper/successResponse";
import { stringNormalize } from "../helper/stringNormalize";

export const createSchoolInfo = async (req: Request<{}, {}, School>, res: Response, next: NextFunction) => {

  try {
    const { schoolId, name, district, division, region } = req.body;
    const result = await createService({
      schoolId,
      name: stringNormalize(name),
      district: stringNormalize(district),
      division: stringNormalize(division),
      region: stringNormalize(region)
    });
    return res.status(201).json(successResponse(result, "School information successfully created"));
  } catch (err) {
    next(err)
  }
}

export const updateSchoolinfo = async (req: Request<{schoolOldId: number}, {}, updateSchoolInfoProps>, res: Response, next: NextFunction) => {
  try {
    const { schoolOldId } = req.params;
    const { schoolId, name, district, division, region } = req.body;

    const updatedSchoolInfo = {
      ...(schoolId && {schoolId}),
      ...(name && {name: stringNormalize(name)}),
      ...(division && {division: stringNormalize(division)}),
      ...(district && {district: stringNormalize(district)}),
      ...(region && {region: stringNormalize(region)}),
    }

    const result = await updateSchoolService(schoolOldId, updatedSchoolInfo)
    return res.status(201).json(successResponse(updatedSchoolInfo));
  } catch (err) {
    next(err);
  }
  
}

export const getSchoolInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getSchoolService();
    return res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
} 