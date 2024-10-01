import { Page, Model } from "objection";

const ModelCollection = {
    page: <M extends Model>(items: M[], perPage: number, currentPage: number): Page<M> => {
        const start = (currentPage - 1) * perPage
        const end = currentPage * perPage
        return {
            total: items.length,
            results: items.slice(start, end)
        }
    }
}

export default ModelCollection