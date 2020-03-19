import { NextFunction, Request, Response } from "express"
import AuthenticatedRequest, { isAuthenticatedRequest } from "../lib/AuthenticatedRequest"

export default function asyncProtectedRoute<T>(fn: (req: AuthenticatedRequest) => Promise<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!isAuthenticatedRequest(req)) {
            res.status(401).end()
            return
        }
        fn(req).then((value: T) => res.json(value)).catch((err) => next(err))
    }
}