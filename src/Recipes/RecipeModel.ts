import { Model } from "objection"
import UserModel from "../Users/UserModel"

class RecipeModel extends Model
{
    static get tableName(): string {
        return 'recipes'
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'description', 'cooking_time'],
        
            properties: {
                id: { type: 'integer' },
                user_id: { type: 'integer' },
                name: { type: 'string', minLength: 1 },
                description: { type: 'string', minLength: 1 },
                method: { type: 'string' },
                ingredients: { type: 'string' },
                cooking_time: {type: 'integer' }
            }
        };
    }
    
    id!: number
    user_id!: number
    name!: string
    description!: string
    method!: string
    ingredients!: string
    cooking_time!: number

    static relationMappings = {
        owner: {
            relation: Model.HasManyRelation,
            modelClass: UserModel,
            join: {
                from: 'recipes.user_id',
                to: 'users.id',
            }
        }
    }
}

export default RecipeModel