import client from '../../lib/SearchClient'
import Config from './../../lib/Config'

export default async function createRecipesIndex() {
    try {
        await client.indices.create({
            index: Config.ELASTICSEARCH_RECIPES_INDEX,
        })
        console.log('Recipes index created')
    } catch (error) {
        console.log(error)
        return
    }
}
