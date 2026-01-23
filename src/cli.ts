import { Command } from 'commander'
import Config from './lib/Config.js'
import createUserCommand from './Users/Commands/createUserCommand.js'
import knexConfig from './knexfile.js'
import Knex from 'knex'
import { Model } from 'objection'

// Configure database and ORM
const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
Model.knex(knex)

async function main() {
    const program = new Command()

    program.command('create-user <email> <password>')
        .description('Create the system user for the application')
        .action((email, password) => createUserCommand(email, password))

    await program.parseAsync(process.argv)
}

main().then(() => {
    process.exit()
})

export default main