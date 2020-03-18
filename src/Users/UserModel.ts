import { Model } from "objection"
import Knex from 'knex'
import knexConfig from '../knexfile'

const knex = Knex(knexConfig[process.env.APP_ENV || 'production'])
Model.knex(knex)

class UserModel extends Model
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
}

export default UserModel