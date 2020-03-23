import { Client } from '@elastic/elasticsearch'
import Config from './Config'

const client = new Client({ node: Config.ELASTICSEARCH_URL || 'recipes' })

export default client