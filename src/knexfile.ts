import Config from './lib/Config'

const knexConfig: {[key: string]: any} = {

    development: {
        client: "postgresql",
        connection: {
            host : Config.DATABASE_URL,
            user : Config.DATABASE_USER,
            password : Config.DATABASE_PASSWORD,
            database : 'postgres',
            port: 5432,
        },
        migrations: {
            directory: '../migrations',
            extension: 'ts'
        }
    },

    production: {
        client: "postgresql",
        connection: {
            host : Config.DATABASE_URL,
            user : Config.DATABASE_USER,
            password : Config.DATABASE_PASSWORD,
            database : 'postgres',
            port: 5432,
        },
        migrations: {
            directory: '../migrations',
            extension: 'ts'
        }
    }
}

export default knexConfig

// Export so that ts-node can use the knexfile during migrations
module.exports = knexConfig
