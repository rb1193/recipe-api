import Knex, {Knex as IKnex} from 'knex'
import { Model } from 'objection'
import Config from './lib/Config'
import knexConfig from './knexfile'

type Database = {
    startTransaction: () => Promise<void>,
    rollbackTransaction: () => Promise<void>,
    destroyConnection: () => Promise<void>,
}

const connect = () => {
    // Configure database and ORM
    const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
    Model.knex(knex)
    let trx: IKnex.Transaction;

    const startTransaction = async () => {
        trx = await knex.transaction()
    }

    const rollbackTransaction = async () => {
        if (trx) {
            await trx.rollback()
            console.debug('Rolled back database transaction')
        }
    }

    const destroyConnection = async () => {
        await knex.destroy()
        console.log('Destroyed connection')
    }

    return {
        startTransaction,
        rollbackTransaction,
        destroyConnection,
    }
}

let db: Database|undefined = undefined;

if (!db) {
    db = connect()
}

export default db;
