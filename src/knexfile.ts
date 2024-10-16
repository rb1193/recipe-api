import Config from './lib/Config'

const knexConfig: {[key: string]: any} = {

    development: {
        client: 'pg',
        connection: {
            host: Config.DATABASE_URL,
            user : Config.DATABASE_USER,
            password : Config.DATABASE_PASSWORD,
            database : Config.DATABASE_NAME,
            port: 5432,
        },
        migrations: {
            directory: '../migrations',
            extension: 'ts'
        },
        pool: {
            min: 0,
            max: 2,
        }
    },

    production: {
        client: 'pg',
        connection: Config.DATABASE_URL,
        migrations: {
            directory: '../migrations',
            extension: 'ts'
        },
        pool: {
            min: 0,
            max: 7,
        }
    }
}

export default knexConfig

// Export so that ts-node can use the knexfile during migrations
module.exports = knexConfig
