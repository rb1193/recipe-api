import Knex from 'knex'
import knexConfig from '../src/knexfile'
import Config from '../src/lib/Config'
import { Model } from "objection"

let knex: any

export const mochaGlobalSetup = async () => {
    knex = Knex(knexConfig[Config.APP_ENV || 'production'])
    Model.knex(knex)
}

export const mochaGlobalTeardown = async () => {
    knex.destroy(() => {
        console.log('Connection destroyed')
    })
}