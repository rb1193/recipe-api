
import { SearchHit } from "./SearchClient";
import { Page, Model } from "objection";

const ModelCollection = {
    sortBySearchScore: <M extends Model>(items: M[], hits: SearchHit[]): M[] => {
        return items.sort((a, b) => {
            const aIndex = hits.findIndex((hit) => hit.id === a.$id().toString())
            const bIndex = hits.findIndex((hit) => hit.id === b.$id().toString())

            if (aIndex === -1 || bIndex === -1) {
                throw new Error('Search result not found')
            }

            return Math.sign(hits[aIndex].score - hits[bIndex].score)
        })
    },
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