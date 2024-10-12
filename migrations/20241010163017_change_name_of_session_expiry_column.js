
exports.up = async function(knex) {
    return await knex.schema.withSchema('public').hasTable('session').then((exists) => {
        return knex.schema.withSchema('public').raw(`
            DROP INDEX "IDX_session_expire";
            ALTER TABLE "session" RENAME "expire" to "expired";
            CREATE INDEX "IDX_session_expired" ON "session" ("expired");`)
    }).then(() => "Session table created")
}


exports.down = async function(knex) {
    return await knex.schema.withSchema('public').hasTable('session').then((exists) => {
        return knex.schema.withSchema('public').raw(`
            DROP INDEX "IDX_session_expired";
            ALTER TABLE "session" RENAME "expired" to "expire";
            CREATE INDEX "IDX_session_expire" ON "session" ("expire");`)
    }).then(() => "Session table deleted")
}

