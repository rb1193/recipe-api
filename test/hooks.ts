import '../src/database'
import { transaction, Model, Transaction } from "objection";

export const mochaHooks = () => {
    let trx: Transaction;
    const knex = Model.knex();

    return {
        beforeEach: async () => {
            trx = await transaction.start(knex);
            Model.knex(trx);
        },

        afterEach: async () => {
            await trx.rollback();
            Model.knex(knex);
        },
    }
};