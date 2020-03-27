import SearchClient from '../RecipeSearch'
import Recipe from '../RecipeModel'
import Client from '../../lib/SearchClient'

export default async function indexRecipes() {
    const recipes = await Recipe.query()
    Promise.all(recipes.map(async (recipe) => {
        SearchClient.index(recipe)
        console.log(`${recipe.name} indexed successfully`)
    }))
    await Client.indices.refresh({ index: 'recipes' })
}