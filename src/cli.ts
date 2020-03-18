import commander from 'commander'
import { resolve } from "path"
import { config } from "dotenv"
import createUserCommand from './Users/Commands/createUserCommand'

config({ path: resolve(__dirname, "../.env") })

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