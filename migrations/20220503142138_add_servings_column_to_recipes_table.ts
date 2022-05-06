import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then(() => {
        return knex.schema.withSchema('public').alterTable('recipes', function (table) {
            table.string('servings', 50).nullable();
        })
    }).then(() => "Servings column added to recipes table");
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (!exists) return;
        return knex.schema.withSchema('public').table('recipes', (table) => {
            table.dropColumn('servings');
        })
    }).then(() => "Servings column removed from recipes table")
}

