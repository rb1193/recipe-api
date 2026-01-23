import Knex from 'knex'
import { Model } from 'objection'
import Config from './lib/Config.js'
import knexConfig from './knexfile.js'

const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
Model.knex(knex)

export default knex;
