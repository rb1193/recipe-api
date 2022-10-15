import Knex from 'knex'
import { Model } from 'objection'
import Config from './lib/Config'
import knexConfig from './knexfile'

const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
Model.knex(knex)

export default knex;
