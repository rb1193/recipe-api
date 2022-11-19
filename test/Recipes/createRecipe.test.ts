import { describe } from "mocha";
import { authenticate } from "../helpers";
import request from "supertest"
import app from "../../src/app"
import assert from "assert"

describe('The create recipe endpoint', () => {
    it('persists valid input to the database', async () => {
        const { user, cookies } = await authenticate()

        const testRecipe = {
            name: "Test Recipe",
            description: "A test recipe",
            method: "Cook",
            ingredients: "Some food",
            cooking_time: 20,
            url: null,
            servings: "Four",
        }
        
        const response = await request(app)
            .post('/recipes')
            .send(testRecipe)
            .set('Cookie', cookies )
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8');

        assert("id" in response.body.data)
        assert(response.body.data.user_id === user.id)
        for (const [key, value] of Object.entries(testRecipe)) {
            assert(response.body.data[key] === value)
        }
    })

    it('returns a bad request error if the input is not valid', async () => {
        const { cookies } = await authenticate()

        const testRecipe = {
            description: "A test recipe",
            ingredients: "Some food",
            cooking_time: 20,
            url: null,
            servings: "Four",
        }
        
        await request(app)
            .post('/recipes')
            .send(testRecipe)
            .set('Cookie', cookies )
            .set('Accept', 'application/json')
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8');
    })
})