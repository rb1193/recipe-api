import { NextFunction, Request, Response } from "express"
import { AuthenticatedRequest, isAuthenticatedRequest } from "./Requests"
import { JSONSchema7 } from "json-schema"
import Ajv, { ValidationError } from "ajv"
import addFormats from "ajv-formats"

export default function asyncProtectedRoute<T>(fn: (req: AuthenticatedRequest) => Promise<T>, rules?: JSONSchema7) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!isAuthenticatedRequest(req)) {
            res.status(401).end()
            return
        }

        if (rules) {
            const ajv = new Ajv()
            addFormats(ajv)
            ajv.validate(rules, req.body)
            if (ajv.errors) {
                throw new ValidationError(ajv.errors)
            }
        }
        

        fn(req).then((value: T) => {
            const status = value ? 200 : 204
            res.status(status).json(value)
        }).catch((err) => next(err))
    }
}