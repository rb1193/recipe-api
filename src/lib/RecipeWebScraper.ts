import RecipeModel from '../Recipes/RecipeModel'
import Objection from 'objection'
import { HowToStep, Recipe, WithContext } from 'schema-dts'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import striptags from 'striptags'
import mc = require('microdata-node')
import moment = require('moment')

export class RecipeScrapingError extends Error {
    constructor(recipeUrl: string) {
        super(`We were unable to successfully fetch a recipe from ${recipeUrl}`)
        this.name = 'RecipeScrapingError'
        Error.captureStackTrace(this, RecipeScrapingError)
    }
}

export async function scrapeRecipe(
    url: string,
): Promise<Objection.PartialModelObject<RecipeModel>> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new RecipeScrapingError(url)
    }
    const resText = await response.text()
    const $ = cheerio.load(resText)

    const structuredData = {
        jsonLd: $('script[type="application/ld+json"]').html(),
        microdata: $.html('[itemscope][itemType="http://schema.org/Recipe"]'),
    }
    const jsonLd = structuredData.jsonLd
        ? JSON.parse(structuredData.jsonLd)
        : mc.toJsonld(structuredData.microdata)
    
    return extractRecipeFromJsonLd(jsonLd)
}

function extractRecipeFromJsonLd(
    jsonLd: WithContext<Recipe>,
): Partial<RecipeModel> {
    const cookingTime = moment.duration(jsonLd.totalTime?.toString()).asMinutes();
    const ingredients = parseIngredients(jsonLd.recipeIngredient || jsonLd.ingredients);
    return {
        name: jsonLd.name?.toString(),
        description: jsonLd.description?.toString(),
        method: parseInstructions(jsonLd.recipeInstructions as string | HowToStep[]),
        // @todo make cooking_time nullable
        cooking_time: cookingTime,
        ingredients,
        url: jsonLd.url?.toString(),
        servings: jsonLd.recipeYield?.toString(),
    };
}

function parseInstructions(value: string | HowToStep[]): string {
    if (value instanceof Array) {
        return value
            .map((instruction) => {
                if (typeof instruction === 'string') {
                    return instruction
                }
                if (instruction.text) {
                    return instruction.text
                }
            })
            .map((instruction) => sanitize(instruction?.toString() || ''))
            .join('\n\n')
    }
    const sanitized = sanitize(value?.toString() || '')
    return value ? sanitized : ''
}

function parseIngredients(value: unknown): string {
    if (Array.isArray(value)) {
        return value.join("\r\n")
    }

    if (value && typeof value === 'object') {
        return value.toString()
    }

    if (typeof value === 'string') {
        return value
    }

    return ''
}

function sanitize(value: string): string {
    return striptags(value).replace(/  +/g, ' ').trim()
}
