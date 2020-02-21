import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').createTableIfNotExists('users', function (table) {
        table.increments()
        table.string('username')
        table.string('email')
        table.string('profile_img_src')
        table.string('password')
        table.timestamps()
        table.index('email')
    })
}


export async function down(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').dropTableIfExists('users')
}

