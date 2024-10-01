import { describe } from 'mocha'
import supertest from 'supertest'
import app from '../../src/app'
import { recipeFactory } from '../factories'
import { authenticate } from '../helpers'
import assert from 'assert'

describe("The search recipes endpoint", () => {
    it('returns a list of recipes', async () => {
        const { user, cookies } = await authenticate()

        const recipes = await recipeFactory.params({ user_id: user.id }).createList(5)
        const searchQuery = recipes[0].name.split(" ")[0]

        const response = await supertest(app)
            .get(`/recipes?query=${searchQuery}`)
            .set('Cookie', cookies)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

        assert(response.body.data.length > 0)

        Object.keys(recipes[0]).forEach(key => {
            assert(key in response.body.data[0])
        })
    })
})