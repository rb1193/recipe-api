import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').raw(`
        ALTER TABLE recipes
        ADD COLUMN searchable_text tsvector GENERATED ALWAYS AS (
            to_tsvector('english', name || ' ' || description || ' ' || ingredients)
        ) STORED;
`).then(() => "Searchable text column added to recipes table");
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('recipes').then((exists) => {
        if (!exists) return;
        return knex.schema.withSchema('public').table('recipes', (table) => {
            table.dropColumn('searchable_text');
        })
    }).then(() => "Searchable text column removed from recipes table")
}

