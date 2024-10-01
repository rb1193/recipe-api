import UserModel from "../Users/UserModel";
import RecipeModel from './RecipeModel';

const RecipeSearch = {
    byFulltext: async(query: string, user: UserModel): Promise<[]> => {
        return []
    },
}

export default RecipeSearch