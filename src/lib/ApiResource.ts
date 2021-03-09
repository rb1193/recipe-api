import Objection, { Model } from "objection";

export interface PaginatedCollection<M> {
    data: M[],
    meta: {
        current_page: number,
        per_page: number,
        last_page: number,
    }
}

export interface Item<M> {
    data: M,
}

const ApiResource = {
    item: <M extends Model>(item: M): Item<M> => {
        return {
            data: item,
        }
    },
    paginatedCollection: <M extends Model>(collection: Objection.Page<M>, perPage: number, currentPage: string): PaginatedCollection<M> => {
        return {
            data: collection.results,
            meta: {
                current_page: +currentPage,
                per_page: perPage,
                last_page: Math.ceil(collection.total / perPage),
            }
        }
    }
}

export default ApiResource