import Config from '../../lib/Config'
import Recipe from '../RecipeModel'
import Client from '../../lib/SearchClient'
import { ResponseError } from '@elastic/elasticsearch/lib/errors'
import { Index } from '@elastic/elasticsearch/api/requestParams'

export default async function indexRecipes() {
    const recipes = await Recipe.query()
    console.log(recipes)
    recipes.forEach(async (recipe) => {
        try {
            const req: Index = {
                id: recipe.id.toString(),
                index: Config.ELASTICSEARCH_RECIPES_INDEX,
                op_type: 'index',
                body: {
                    user_id: recipe.user_id,
                    name: recipe.name,
                    description: recipe.description,
                    cooking_time: recipe.cooking_time,
                    ingredients: recipe.ingredients,
                }
            }
            await Client.index(req)
            console.log(`${recipe.name} indexed successfully`)
        } catch (error) {
            if (error instanceof ResponseError) {
                console.log(error.message)
            }
        }
    })
    await Client.indices.refresh({ index: 'recipes' })
}