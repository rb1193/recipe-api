import { Model } from "objection"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

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

    static get relationMappings() {
        // Import inside getter to avoid circular dependency at module load time
        // By the time this getter is called, all modules are fully initialized
        const RecipeModel = require("../Recipes/RecipeModel.js").default
        return {
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
}

export default UserModel