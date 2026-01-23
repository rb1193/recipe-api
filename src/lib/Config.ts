import { resolve, dirname, join } from "path"
import { fileURLToPath } from "url"
import { config } from "dotenv"

// Load config - resolve .env path relative to this file's location
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = resolve(__dirname, '../../.env')
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
}

const Config = process.env as Config

export default Config