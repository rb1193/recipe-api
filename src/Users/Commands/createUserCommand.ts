import UserModel from '../UserModel'
import { UniqueViolationError } from 'objection'
import bcrypt from 'bcrypt'

export default async function createUserCommand() {
    try {
        const password = await bcrypt.hash(process.env.USER_PASSWORD, 10)
        const user = await UserModel.query().insert({
            email: process.env.USER_EMAIL,
            password: password,
        })
        console.log(`Account created for ${user.email}`)
    } catch (error) {
        if (error instanceof UniqueViolationError) {
            console.log(`Account already exists for ${process.env.USER_EMAIL}`)
            return
        }
        console.log(error)
    }
}