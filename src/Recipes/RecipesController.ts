import AuthenticatedRequest from "../lib/AuthenticatedRequest"
import RecipeModel from "./RecipeModel"
import ApiResource from "../lib/ApiResource"
import RecipeSearch from "./RecipeSearch"
import ModelCollection from '../lib/ModelCollection'

async function store(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').insert(req.body)
}

async function list(req: AuthenticatedRequest) {
    const hits = await RecipeSearch.byFulltext(req.query.query, req.user)
    const perPage = 10
    const recipes = await req.user.$relatedQuery<RecipeModel>('recipes').findByIds(hits.map((hit) => hit.id))
    const paginatedRecipes = ModelCollection.page(ModelCollection.sortBySearchScore(recipes, hits), perPage, req.query.page)
    return ApiResource.paginatedCollection<RecipeModel>(paginatedRecipes, perPage, req.query.page)
}

async function show(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').findById(req.params.recipe).throwIfNotFound()
}

async function update(req: AuthenticatedRequest) {
    return await req.user.$relatedQuery<RecipeModel>('recipes').updateAndFetchById(
        req.params.recipe,
        req.body
    ).throwIfNotFound()
}

async function remove(req: AuthenticatedRequest) {
    await req.user.$relatedQuery('recipes').deleteById(req.params.recipe).throwIfNotFound()
}

const RecipesController = {
    store: store,
    list: list,
    show: show,
    update: update,
    remove: remove,
}

export default RecipesController