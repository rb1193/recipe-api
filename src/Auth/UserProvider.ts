import { IVerifyOptions } from "passport-local"
import UserModel from "../Users/UserModel"
import bcrypt from "bcrypt"
import { NotFoundError } from "objection"

export async function findUser(username: string, password: string, done: (error: any, user?: any, options?: IVerifyOptions) => void) {
    try {
        const user = await UserModel.query().findOne('email', '=', username).throwIfNotFound()
        const result = await bcrypt.compare(password, user.password)

        result === false ? done(null, false, { message: "Invalid credentials" }) : done(null, user)
    } catch (err) {
        if (err instanceof NotFoundError) {
            done(null, false, { message: "Invalid credentials" })
            return
        }
        done(err)
    }
}

export function serializeUser(user: Express.User, done: (err: any, id: number) => void) {
    const userModel = user as UserModel
    done(null, userModel.id)
}

export async function deserializeUser(id: number, done: (error: any, user?: UserModel) => void) {
    try {
        const user = await UserModel.query().findById(id).throwIfNotFound()
        done(null, user)
    } catch (err) {
        done(err)
    }
}