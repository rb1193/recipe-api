import UserModel from '../UserModel'
import { UniqueViolationError } from 'objection'

export default async function createUserCommand() {
    try {
        const user = await UserModel.query().insert({
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
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