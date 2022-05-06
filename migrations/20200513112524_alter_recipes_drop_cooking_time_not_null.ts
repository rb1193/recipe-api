import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then(() => {
        return knex.schema.withSchema('public').raw('ALTER TABLE recipes ALTER COLUMN cooking_time DROP NOT NULL')
    }).then(() => "Made cooking time column nullable")
}


export async function down(knex: Knex): Promise<any> {
    // Can't reverse this migration as the data almost certainly won't permit this
}
