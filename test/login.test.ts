import UserModel from '../src/Users/UserModel'
import bcrypt from 'bcrypt'
import request from 'supertest'
import assert from 'assert'

describe('The login endpoint', () => {
    const email = "test@test.com"
    const password = "test1234"

    before(async () => {
        const hash = await bcrypt.hash(password, 10)
        await UserModel.query().insert({
            email: email,
            password: hash,
        })
    })

    after(async () => {
        await UserModel.query().delete()
    })
    
    it('returns a 200 with a token if the credentials are valid', (done) => {
        request('http://localhost:3000')
            .post('/login')
            .send({
                username: email,
                password
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .then((res) => {
                assert(res.body.data.email === email)
                done()
            })
    })

    it('returns a 401 response if the credentials are invalid', (done) => {
        request('http://localhost:3000')
            .post('/login')
            .send({
                username: email,
                password: 'invalid'
            })
            .set('Accept', 'application/json')
            .expect(401, done)
    })
})