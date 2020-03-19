import { Model } from "objection"
import RecipeModel from "../Recipes/RecipeModel"

class UserModel extends Model implements Express.User
{
    static get tableName(): string {
        return 'users'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['email', 'password'],
        
            properties: {
                id: { type: 'integer' },
                password: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string',  minLength: 1, maxLength: 255 },
                profile_img_src: { type: ['string', 'null']}
            }
        };
    }
    
    id!: number
    email!: string
    password!: string
    profile_img_src!: string

    static relationMappings = {
        recipes: {
            relation: Model.HasManyRelation,
            modelClass: RecipeModel,
            join: {
                from: 'users.id',
                to: 'recipes.user_id',
            }
        }
    }
}

export default UserModel