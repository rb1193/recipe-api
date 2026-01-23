import { describe } from 'mocha'
import supertest from 'supertest'
import app from '../../src/app.js'
import { recipeFactory } from '../factories.js'
import { authenticate } from '../helpers.js'
import assert from 'assert'
import RecipeModel from '../../src/Recipes/RecipeModel.js'

describe("The all recipes endpoint", () => {
    it('returns a list of recipes', async () => {
        const { user, cookies } = await authenticate()

        const recipes = await recipeFactory.params({ user_id: user.id }).createList(5)

        const response = await supertest(app)
            .get('/recipes/all')
            .set('Cookie', cookies)
            .set('Accept', 'application/json')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')

        assert(response.body.data.length === 5)

        Object.keys(recipes[0]).forEach(key => {
            assert(key in response.body.data[0])
        })

        const recipeIds = recipes.map(recipe => recipe.id)
        const resultRecipeIds = response.body.data.map((recipe: RecipeModel) => recipe.id)
        recipeIds.forEach(recipeId => resultRecipeIds.includes(recipeId))
    })
})