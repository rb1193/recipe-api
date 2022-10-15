import UserModel from '../src/Users/UserModel'
import bcrypt from 'bcrypt'
import request from 'supertest'
import assert from 'assert'
import app from '../src/app';

describe('The login endpoint', function () {
    const email = "test@test.com"
    const password = "test1234"
    
    it('returns a 200 with a token if the credentials are valid', async () => {
        const hash = await bcrypt.hash(password, 10)
        await UserModel.query().insert({
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
            
        assert(response.body.data.email === email)
    })

    it('returns a 401 response if the credentials are invalid', async () => {
        await request(app)
            .post('/login')
            .send({
                username: email,
                password
            })
            .set('Accept', 'application/json')
            .expect(401)
    })
})