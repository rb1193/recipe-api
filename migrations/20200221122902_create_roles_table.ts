import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').createTableIfNotExists('roles', function (table) {
        table.increments()
        table.string('label')
        table.string('key')
        table.index('key')
    })
}


export async function down(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').dropTableIfExists('roles')
}

