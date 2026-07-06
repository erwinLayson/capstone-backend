import "express";

import { KEY_ROLES } from "./constant/user";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string,
        role: KEY_ROLES
      }
    }
  }
}

export { };