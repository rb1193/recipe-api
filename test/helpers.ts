import bcrypt from "bcrypt"
import UserModel from "../src/Users/UserModel"
import request from "supertest"
import app from '../src/app';

export const authenticate = async () => {
    const password = "testpassword"
    const email = "testemail@test.com"
    const hash = await bcrypt.hash(password, 10)
    const user = await UserModel.query().insert({
        email: email,
        password: hash,
    })

    const response = await request(app)
        .post('/login')
        .send({
            username: email,
            password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
    
    return { user, cookies: response.headers['set-cookie'] };
}