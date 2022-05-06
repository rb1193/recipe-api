import UserModel from "../Users/UserModel";
import RecipeModel from './RecipeModel';
import SearchClient, { SearchHit } from '../lib/SearchClient'
import Config from "../lib/Config"

const RecipeSearch = {
    byFulltext: async(query: string, user: UserModel): Promise<SearchHit[]> => {
        const searchBody = {
            query: {
                bool: {
                    must : {
                        multi_match : {
                            query, 
                            fields: [ "name", "description", "ingredients" ] 
                        },
                    },
                    filter: {
                        term: { user_id: user.$id().toString() }
                    }
                }
            },
        }
        const searchResults = await SearchClient.search({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
            body: searchBody,
        })
        return searchResults.hits.hits.map((hit) => ({id: hit._id, score: hit._score || 0}))
    },
    index: async(recipe: RecipeModel): Promise<void> => {
        await SearchClient.index({
            id: recipe.id.toString(),
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
            op_type: 'index',
            body: {
                user_id: recipe.user_id,
                name: recipe.name,
                description: recipe.description,
                cooking_time: recipe.cooking_time,
                ingredients: recipe.ingredients,
                servings: recipe.servings,
            }
        })
    },
    delete: async(recipeId: string): Promise<void> => {
        await SearchClient.delete({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
            id: recipeId,
        })
    }
}

export default RecipeSearch