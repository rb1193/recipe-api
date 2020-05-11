import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then(() => {
        return knex.schema.withSchema('public').alterTable('recipes', function (table) {
            table.string('url', 255);
        })
    }).then(() => "Url column added to recipes");
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (!exists) return;
        return knex.schema.withSchema('public').table('recipes', (table) => {
            table.dropColumn('url');
        })
    }).then(() => {"Url column removed from recipes table"})
}
