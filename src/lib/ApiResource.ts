import Objection, { Model } from "objection";

export interface PaginatedCollection<M> {
    code: number,
    data: M[],
    meta: {
        current_page: number,
        per_page: number,
        last_page: number,
    }
}

const ApiResource = {
    paginatedCollection: <M extends Model>(collection: Objection.Page<M>, perPage: number, currentPage: number): PaginatedCollection<M> => {
        return {
            code: 200,
            data: collection.results,
            meta: {
                current_page: currentPage,
                per_page: perPage,
                last_page: Math.ceil(collection.total / Math.max(collection.results.length, 1)),
            }
        }
    }
}

export default ApiResource