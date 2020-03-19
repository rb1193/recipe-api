import commander from 'commander'
import { resolve } from "path"
import { config } from "dotenv"
import createUserCommand from './Users/Commands/createUserCommand'
import knexConfig from './knexfile'
import Knex from 'knex'
import { Model } from 'objection'

//Load config
config({ path: resolve(__dirname, "../.env") })

// Configure database and ORM
const knex = Knex(knexConfig[process.env.APP_ENV || 'production'])
Model.knex(knex)

async function main() {
    const program = new commander.Command()

    program.command('create-user')
        .description('Create the system user for the application')
        .action(createUserCommand)

    await program.parseAsync(process.argv)
}

main().then(() => {
    process.exit()
})