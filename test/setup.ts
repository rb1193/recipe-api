import knex from '../src/database'

export const mochaGlobalSetup = async () => {
    
}

export const mochaGlobalTeardown = async () => {
    knex.destroy(() => console.log('Database connection destroyed'))
}