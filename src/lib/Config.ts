import { resolve } from "path"
import { config } from "dotenv"

//Load config
config({ path: resolve(__dirname, "../../.env") })

type Config = {
    APP_ENV: string
    APP_NAME: string
    COOKIE_SECRET: string
    DATABASE_URL: string
    USER_EMAIL: string
    USER_PASSWORD: string
    ELASTICSEARCH_URL: string
    ELASTICSEARCH_RECIPES_INDEX: string
}

const Config = process.env as Config

export default Config