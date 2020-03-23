import client from '../../lib/SearchClient'
import Config from './../../lib/Config'
import { ResponseError } from '@elastic/elasticsearch/lib/errors'

export default async function createRecipesIndex() {
    try {
        await client.indices.create({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
        })
        console.log('Recipes index created')
    } catch (error) {
        if (error instanceof ResponseError) {
            console.log(error.body)
        }
        return
    }
}
