import database from '../src/database.js'

export const mochaGlobalSetup = async () => {
    
}

export const mochaGlobalTeardown = async () => {
    database?.destroy()
}