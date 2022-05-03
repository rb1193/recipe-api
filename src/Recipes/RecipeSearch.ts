import UserModel from "../Users/UserModel";
import RecipeModel from './RecipeModel';
import SearchClient, { SearchResponse, SearchHit } from '../lib/SearchClient'
import Config from "../lib/Config"
import { ApiResponse } from "@elastic/elasticsearch"

const RecipeSearch = {
    byFulltext: async(query: string, user: UserModel): Promise<SearchHit[]> => {
        const searchResults: ApiResponse<SearchResponse<RecipeModel>> = await SearchClient.search({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
            body: {
                query: {
                    "bool": {
                        "must": {
                            "multi_match" : {
                                "query": query, 
                                "fields": [ "name", "description", "ingredients" ] 
                            },
                        },
                        "filter": {
                            "term": { "user_id": user.$id().toString() }
                        }
                    }
                },
            }
        })
        return searchResults.body.hits.hits.map((hit) => ({id: hit._id, score: hit._score}))
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
    delete: async(recipeId: number): Promise<void> => {
        await SearchClient.deleteByQuery({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
            max_docs: 1,
            body: {
                query: {
                    "filter": {
                        "term": { id: recipeId }
                    }
                }
            }
        })
    }
}

export default RecipeSearch