import client from '../../lib/SearchClient'
import Config from './../../lib/Config'

export default async function deleteRecipesIndex() {
    await client.indices.delete({
        index: Config.ELASTICSEARCH_RECIPES_INDEX,
    })
    console.log('Recipes index deleted')
}
