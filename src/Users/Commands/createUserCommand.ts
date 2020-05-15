import UserModel from '../UserModel'
import { UniqueViolationError } from 'objection'
import bcrypt from 'bcrypt'

export default async function createUserCommand(email: string, password: string) {
    try {
        const hash = await bcrypt.hash(password, 10)
        const user = await UserModel.query().insert({
            email: email,
            password: hash,
        })
        console.log(`Account created for ${user.email}`)
    } catch (error) {
        if (error instanceof UniqueViolationError) {
            console.log(`Account already exists for ${email}`)
            return
        }
        console.log(error)
    }
}