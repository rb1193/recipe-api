import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').createTableIfNotExists('user_roles', (table) => {
        table.increments()
        table.integer('user_id')
        table.integer('role_id')
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
        table.foreign('role_id').references('id').inTable('roles').onDelete('cascade')
    })
}


export async function down(knex: Knex): Promise<any> {
    knex.schema.withSchema('public').table('user_roles', (table) => {
        table.dropForeign(['user_id', 'role_id'])
    })
    knex.schema.withSchema('public').dropTableIfExists('user_roles')
}

