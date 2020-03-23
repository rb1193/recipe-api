import Config from './lib/Config'

const knexConfig: {[key: string]: any} = {

    development: {
        client: "postgresql",
        connection: Config.DATABASE_URL,
        migrations: {
            directory: '../migrations',
            extension: 'ts'
        }
    },

    staging: {
        client: "postgresql",
        connection: Config.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    },

    production: {
        client: "postgresql",
        connection: Config.DATABASE_URL,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations"
        }
    }
}

export default knexConfig

// Export so that ts-node can use the knexfile during migrations
module.exports = knexConfig
