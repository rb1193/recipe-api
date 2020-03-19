import { Request } from "express";
import UserModel from "../Users/UserModel"

export default interface AuthenticatedRequest extends Request {
    user: UserModel
}

export function isAuthenticatedRequest(req: Request): req is AuthenticatedRequest {
    return req.isAuthenticated()
}