
exports.up = async function(knex) {
    return await knex.schema.withSchema('public').hasTable('recipes').then(() => {
        return knex.schema.withSchema('public').raw('ALTER TABLE recipes ALTER COLUMN cooking_time DROP NOT NULL')
    }).then(() => "Made cooking time column nullable")
}


exports.down = async function(knex) {
    // Can't reverse this migration as the data almost certainly won't permit this
}
