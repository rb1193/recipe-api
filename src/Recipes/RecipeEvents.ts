import { EventEmitter } from 'events'
import RecipeModel from './RecipeModel'
import RecipeSearch from './RecipeSearch'

class RecipeEventEmitter extends EventEmitter {}

const emitter = new RecipeEventEmitter

emitter.on('created', (recipe: RecipeModel) => {
    RecipeSearch.index(recipe)
})

emitter.on('updated', (recipe: RecipeModel) => {
    RecipeSearch.index(recipe)
})

emitter.on('deleted', (recipeId: number) => {
    RecipeSearch.delete(recipeId)
})

export default emitter