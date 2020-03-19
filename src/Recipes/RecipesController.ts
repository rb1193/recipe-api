import AuthenticatedRequest from "../lib/AuthenticatedRequest"
import RecipeModel from "./RecipeModel"

async function store(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').insert(req.body)
}

async function list(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes')
}

async function show(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').findById(req.params.recipe)
}

async function update(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').updateAndFetchById(
        req.params.recipe,
        req.body
    )
}

async function remove(req: AuthenticatedRequest) {
    await req.user.$relatedQuery('recipes').deleteById(req.params.recipe)
}

const RecipesController = {
    store: store,
    list: list,
    show: show,
    update: update,
    remove: remove,
}

export default RecipesController