import { Model } from "objection"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
        return {
            recipes: {
                relation: Model.HasManyRelation,
                // Use path string to avoid circular dependency
                modelClass: join(__dirname, '..', 'Recipes', 'RecipeModel.js'),
                join: {
                    from: 'users.id',
                    to: 'recipes.user_id',
                }
            }
        }
    }
}

export default UserModel