import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('session').then((exists) => {
        if (exists) return //throw new Error("Session table already exists")
    }).then(() => {
        return knex.schema.withSchema('public').raw(`CREATE TABLE "session" (
            "sid" varchar NOT NULL COLLATE "default",
              "sess" json NOT NULL,
              "expire" timestamp(6) NOT NULL
          )
          WITH (OIDS=FALSE);
          
          ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
          
          CREATE INDEX "IDX_session_expire" ON "session" ("expire");`)
    }).then(() => "Session table created")
}


export async function down(knex: Knex): Promise<any> {
    return await knex.schema.withSchema('public').hasTable('session').then((exists) => {
        if (!exists) throw new Error("Session table missing")
    }).then(() => {
        return knex.schema.withSchema('public').dropTable('session')
    }).then(() => "Session table deleted")
}

