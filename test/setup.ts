import database from '../src/database'

export const mochaGlobalSetup = async () => {
    
}

export const mochaGlobalTeardown = async () => {
    database?.destroy()
}