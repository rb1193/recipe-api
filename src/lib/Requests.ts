import { Request } from "express";
import UserModel from "../Users/UserModel"

export interface AuthenticatedRequest extends Request {
    user: UserModel
}

export interface PaginatedResponseRequest extends Request {
    query: { page?: string, query?: string },
}

export function isAuthenticatedRequest(req: Request): req is AuthenticatedRequest {
    return req.isAuthenticated()
}