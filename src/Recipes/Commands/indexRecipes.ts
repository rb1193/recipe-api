import Config from '../../lib/Config'
import Recipe from '../RecipeModel'
import Client from '../../lib/SearchClient'

export default async function indexRecipes() {
    const recipes = await Recipe.query()
    Promise.all(recipes.map(async (recipe) => {
        Client.index({
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
        })
        console.log(`${recipe.name} indexed successfully`)
    }))
    await Client.indices.refresh({ index: 'recipes' })
}