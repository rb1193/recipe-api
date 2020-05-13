import RecipeModel from '../Recipes/RecipeModel'
import { frame } from 'jsonld'
import Objection from 'objection'
import { Recipe } from 'schema-dts'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import moment from 'moment'

export class RecipeScrapingError extends Error {
    constructor (recipeUrl: string) {
        super(`We were unable to successfully fetch a recipe from ${recipeUrl}`)
        this.name = 'RecipeScrapingError'
        Error.captureStackTrace(this, RecipeScrapingError)
    }
}

export async function scrapeRecipe(url: string): Promise<Objection.PartialModelObject<RecipeModel>> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new RecipeScrapingError(url)
    }
    const resText = await response.text()
    const $ = cheerio.load(resText)
    try {
        return await extractRecipeFromJsonLd($)
    } catch (err) {
        throw new RecipeScrapingError(url)
    }
}

async function extractRecipeFromJsonLd(doc: CheerioStatic): Promise<Objection.PartialModelObject<RecipeModel>> {
    const jsonLd = doc('script[type="application/ld+json"]').html()
    if (!jsonLd) throw new Error("Unable to extract recipe from jsonld")

    const recipeJson = await frame(
        JSON.parse(jsonLd),
        {
            "@context": "https://schema.org",
            "@type": "Recipe"
        }
    ) as Recipe

    return new Promise((resolve) => {
        if (!recipeJson.name) throw new Error()
        const recipe = {
            name: parseStringValue(recipeJson.name),
            description: parseLongTextValue(recipeJson.description || ''),
            method: parseInstructions(recipeJson.recipeInstructions || ''),
            // @todo make cooking_time nullable
            cooking_time: moment.duration(recipeJson.totalTime?.toString() || 'PT0M').asMinutes(),
            ingredients: parseLongTextValue(recipeJson.recipeIngredient || ''),
            url: doc('link[rel="canonical"]').attr('href')
        }
        resolve(recipe)
    })
}

function parseStringValue(value: string | readonly string[]): string {
    if (value instanceof Array) {
        return value.join(', ')
    }
    return value.toString()
}

function parseLongTextValue(value: string | readonly string[]): string {
    if (value instanceof Array) {
        return value.join('\n\n')
    }
    return value ? value.toString() : ''
}

function parseInstructions(value: Recipe['recipeInstructions']): string {
    if (value instanceof Array) {
        return value.map((instruction) => {
            if (typeof instruction === "string") {
                return instruction
            }
            if (instruction['type'] === "HowToStep") {
                return instruction['text']
            }
        }).join('\n\n')
    }

    return value ? value.toString() : ''
}

/*
async function extractRecipeFromMicrodata(doc: Document): Promise<Objection.PartialModelObject<RecipeModel>> {
    const microdataNode = doc.querySelector(
        '[itemscope itemType="http://schema.org/Recipe"]',
    )
    if (isNull(microdataNode)) throw new Error("Unable to extract recipe from microdata")
}
*/
