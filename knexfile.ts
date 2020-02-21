import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "./.env") })

module.exports = {

  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    migrations: {
      extension: 'ts'
    }
  },

  staging: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
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
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};
