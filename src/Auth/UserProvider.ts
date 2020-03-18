import { IVerifyOptions } from "passport-local"
import UserModel from "../Users/UserModel"
import bcrypt from "bcrypt"
import { NotFoundError } from "objection"

export async function findUser(username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) {
    try {
        const user = await UserModel.query().findOne('email', '=', username).throwIfNotFound()
        bcrypt.compare(password, user.password, (err, result) => {
            if (result === false) {
                done(null, false, { message: "Invalid credentials" })
            }

            done(null, user)
        })
    } catch (err) {
        if (err instanceof NotFoundError) {
            done(null, false, { message: "Invalid credentials" })
        }
        done(err)
    }
}

export function serializeUser(user: UserModel, done: (error: any, id: number) => void) {
    done(null, user.id)
}

export async function deserializeUser(id: number, done: (error: any, user?: UserModel) => void) {
    try {
        const user = await UserModel.query().findById(id).throwIfNotFound()
        done(null, user)
    } catch (err) {
        done(err)
    }
}