import { Factory } from 'fishery'
import RecipeModel from '../src/Recipes/RecipeModel'
import { faker } from '@faker-js/faker'

export const recipeFactory = Factory.define<RecipeModel>(({ onCreate, params }) => {
    onCreate(async (recipe) => await RecipeModel.query().insert(recipe).returning('*'))

    return RecipeModel.fromJson({
        user_id: params.user_id,
        name: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        servings: faker.random.numeric(),
        url: faker.internet.url(),
        method: faker.lorem.paragraph(),
        ingredients: faker.lorem.paragraph()
    })
})