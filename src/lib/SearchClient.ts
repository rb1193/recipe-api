import { Client } from '@elastic/elasticsearch'
import Config from './Config'

export interface SearchResponse<T> {
    hits: {
        hits: Array<{
            _id: string,
            _score: number,
            _source: T;
        }>
    }
}

export interface SearchHit {
    id: string,
    score: number,
}

const client = new Client({ 
    auth: {
        username: Config.ELASTIC_USER,
        password: Config.ELASTIC_PASSWORD,
    },
    node: Config.ELASTICSEARCH_URL,
})

export default client