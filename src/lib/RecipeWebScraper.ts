import RecipeModel from '../Recipes/RecipeModel'
import { isNull } from 'util'
import { flatten, frame } from 'jsonld'
import Objection from 'objection'
import { Recipe } from 'schema-dts'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

export class RecipeScrapingError extends Error {
    constructor (recipeUrl: string) {
        super(`We were unable to successfully fetch a recipe from ${recipeUrl}`)
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
    if (!jsonLd) throw Error("Unable to extract recipe from jsonld")

    const recipeJson = await frame(
        JSON.parse(jsonLd),
        {
            "@context": "https://schema.org",
            "@type": "Recipe"
        }
    ) as Required<Recipe>

    return new Promise((resolve) => {
        resolve({
            name: parseStringValue(recipeJson.name),
            description: parseStringValue(recipeJson.description),
            method: recipeJson.recipeInstructions.toString(),
            cooking_time: parseFloat(recipeJson.totalTime.toString()),
            ingredients: recipeJson.recipeIngredient.toString(),
            url: recipeJson.url.toString()
        })
    })
}

function parseStringValue(value: string | readonly string[]): string {
    if (value instanceof Array) {
        return value.join(', ')
    }
    return value.toString()
}

/*
async function extractRecipeFromMicrodata(doc: Document): Promise<Objection.PartialModelObject<RecipeModel>> {
    const microdataNode = doc.querySelector(
        '[itemscope itemType="http://schema.org/Recipe"]',
    )
    if (isNull(microdataNode)) throw new Error("Unable to extract recipe from microdata")
}
*/
