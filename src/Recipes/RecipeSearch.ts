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
                    "multi_match" : {
                        "query": query, 
                        "fields": [ "name", "description", "ingredients" ] 
                    }
                }
            }
        })
        return searchResults.body.hits.hits.map((hit) => ({id: hit._id, score: hit._score}))
    }
}

export default RecipeSearch