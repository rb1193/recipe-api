import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').raw(`
        CREATE INDEX recipes_textsearch_idx ON recipes USING GIN (searchable_text);
`).then(() => "Search index added to recipes table");
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (!exists) return;
        return knex.schema.withSchema('public').raw(`
            DROP INDEX recipes_textsearch_idx   
        `)
    }).then(() => "Search index removed from recipes table")
}

