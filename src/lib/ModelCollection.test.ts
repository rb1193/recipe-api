import ModelCollection from './ModelCollection'
import { Model } from 'objection'
import { SearchHit } from './SearchClient'

class TestModel extends Model
{
    static get tableName(): string {
        return 'test'
    }
}

test('it sorts the collection by each item\'s search score', () => {
    let models = []
    for (let index = 0; index < 10; index++) {
        const model = new TestModel()
        model.$id(index + 1)
        models[index] = model
    }

    const hits: SearchHit[] = [
        {id: '3', score: 1.2},
        {id: '7', score: 1.1},
        {id: '5', score: 1.02},
        {id: '1', score: 0.87},
        {id: '6', score: 0.84},
        {id: '2', score: 0.74},
        {id: '9', score: 0.61},
        {id: '8', score: 0.5},
        {id: '10', score: 0.4},
        {id: '4', score: 0.3},
    ]

    const result = ModelCollection.sortBySearchScore(models, hits)
    const resultIds = result.map<string>((result) => result.$id().toString())
    const hitIds = hits.map((hit) => hit.id)

    for (let index = 0; index < hits.length; index++) {
        expect(resultIds[index]).toBe(hitIds[index])
    }
})

test('it throws an error when a search result is not found', () => {
    let models: Model[] = []
    for (let index = 0; index < 2; index++) {
        const model = new TestModel()
        model.$id(index + 1)
        models[index] = model
    }

    const hits: SearchHit[] = [
        {id: '2', score: 0.87},
    ]

    const sortFn = () => ModelCollection.sortBySearchScore(models, hits)
    expect(sortFn).toThrow('Search result not found')
})