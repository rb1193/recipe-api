import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then(() => {
        return knex.schema.withSchema('public').raw('ALTER TABLE recipes ALTER COLUMN description TYPE text;')
    }).then(() => "Recipe description column altered to text type")
}


export async function down(knex: Knex): Promise<any> {
    // Can't migrate backwards as data will likely not permit this
}
