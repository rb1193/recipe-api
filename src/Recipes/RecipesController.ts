import {AuthenticatedRequest, PaginatedResponseRequest} from "../lib/Requests"
import RecipeModel from "./RecipeModel"
import ApiResource from "../lib/ApiResource"
import RecipeSearch from "./RecipeSearch"
import RecipeEventEmitter from './RecipeEvents'
import ModelCollection from '../lib/ModelCollection'
import { scrapeRecipe } from '../lib/RecipeWebScraper'
import { JSONSchema7 } from "json-schema"

export const scrapeRequestSchema: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    properties: {
        url: {
            type: "string",
            format: "uri"
        }
    },
    required: ["url"]
}

async function scrape(req: AuthenticatedRequest) {
    const recipeData = await scrapeRecipe(req.body.url)
    const recipe = await req.user.$relatedQuery<RecipeModel>('recipes').insert(recipeData).returning('*')
    RecipeEventEmitter.emit('created', recipe)
    return ApiResource.item(recipe)
}

async function store(req: AuthenticatedRequest) {
    const recipe = await req.user.$relatedQuery<RecipeModel>('recipes').insert(req.body).returning('*')
    RecipeEventEmitter.emit('created', recipe)
    return ApiResource.item(recipe)
}

async function list(req: AuthenticatedRequest) {
    const perPage = 10
    const recipes = await req.user.$relatedQuery<RecipeModel>('recipes').page(parseInt(req.query.page?.toString() || "1") - 1, perPage)
    return ApiResource.paginatedCollection<RecipeModel>(recipes, perPage, req.query.page?.toString() || "1")
}

async function search(req: AuthenticatedRequest & PaginatedResponseRequest) {
    const hits = await RecipeSearch.byFulltext(req.query.query as string, req.user)
    const perPage = 10
    const recipes = await req.user.$relatedQuery<RecipeModel>('recipes').findByIds(hits.map((hit) => hit.id))
    const paginatedRecipes = ModelCollection.page(ModelCollection.sortBySearchScore(recipes, hits), perPage, parseInt(req.query.page || '1', 10))
    return ApiResource.paginatedCollection<RecipeModel>(paginatedRecipes, perPage, req.query.page as string)
}

async function show(req: AuthenticatedRequest) {
    const recipe = await req.user.$relatedQuery<RecipeModel>('recipes').findById(req.params.recipe).throwIfNotFound()
    return ApiResource.item(recipe)
}

async function update(req: AuthenticatedRequest) {
    const recipe = await req.user.$relatedQuery<RecipeModel>('recipes')
        .updateAndFetchById(req.params.recipe, req.body)
        .throwIfNotFound()
    RecipeEventEmitter.emit('updated', recipe)
    return ApiResource.item(recipe)
}

async function remove(req: AuthenticatedRequest) {
    await req.user.$relatedQuery('recipes').deleteById(req.params.recipe).throwIfNotFound()
    RecipeEventEmitter.emit('deleted', req.params.recipe)
    return null
}

const RecipesController = {
    scrape: scrape,
    search: search,
    store: store,
    list: list,
    show: show,
    update: update,
    remove: remove,
}

export default RecipesController