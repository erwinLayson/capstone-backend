import { NextFunction, Request, Response } from "express";
import { UserProps } from "../model/users.v2";

import {createNewUser_v2, getAllUsers_v2} from "../service/users.v2"
import successResponse from "../helper/successResponse";

export const createUser_v2 = async (req: Request<{}, {}, UserProps>, res: Response, next: NextFunction) => {
  const {email, password, role } = req.body;
  try {
    await createNewUser_v2({email, password, role});
    return res.status(201).json(successResponse(null, "User created successful"));
  } catch (err) {
    next(err);
  }
}

export async function getAllUser_v2(req: Request, res: Response, next: NextFunction){
  try {
    const result = await getAllUsers_v2();
    res.status(200).json(successResponse(result));
  } catch (err) {
    next(err);
  }
}