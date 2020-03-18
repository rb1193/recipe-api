import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (exists) return// throw new Error("Recipes table exists")
    }).then(() => {
        return knex.schema.withSchema('public').createTable('recipes', (table) => {
            table.increments()
            table.integer('user_id').unsigned().notNullable()
            table.string('name').notNullable()
            table.string('description').notNullable()
            table.integer('cooking_time').notNullable()
            table.text('method')
            table.text('ingredients')
            table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
        })
    }).then(() => "Recipes table created")
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (!exists) throw new Error("Recipes table missing")
    }).then(() => {
        return knex.schema.withSchema('public').table('recipes', function (table) {
            table.dropForeign(['user_id'])
        })
    }).then(() => {
        return knex.schema.withSchema('public').dropTable('recipes')
    }).then(() => "Recipes table deleted")
}