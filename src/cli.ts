import commander from 'commander'
import Config from './lib/Config'
import createUserCommand from './Users/Commands/createUserCommand'
import knexConfig from './knexfile'
import Knex from 'knex'
import { Model } from 'objection'

// Configure database and ORM
const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
Model.knex(knex)

async function main() {
    const program = new commander.Command()

    program.command('create-user <email> <password>')
        .description('Create the system user for the application')
        .action((email, password) => createUserCommand(email, password))

    await program.parseAsync(process.argv)
}

main().then(() => {
    process.exit()
})