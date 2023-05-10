import { resolve } from "path"
import { config } from "dotenv"

//Load config
const envPath = resolve(__dirname, "../../.env");
config({ path: envPath })

type Config = {
    APP_ENV: string
    APP_NAME: string
    COOKIE_SECRET: string
    CORS_ORIGIN: string
    DATABASE_NAME: string
    DATABASE_PASSWORD: string
    DATABASE_USER: string
    DATABASE_URL: string
    ELASTIC_USER: string
    ELASTIC_PASSWORD: string
    ELASTICSEARCH_URL: string
    ELASTICSEARCH_RECIPES_INDEX: string
}

const Config = process.env as Config

export default Config