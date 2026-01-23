# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript REST API for managing recipes, built with Express 5, Objection.js ORM, and PostgreSQL. The API supports user authentication via Passport.js with session-based auth, and includes a recipe web scraper that extracts recipe data from URLs using JSON-LD and microdata.

## Development Commands

```bash
# Build TypeScript to dist/
npm run build

# Watch mode (rebuilds on changes)
npm run watch

# Run development server with hot reload (requires built dist/)
npm run dev

# Run tests (resets database, runs migrations, executes mocha tests)
npm test

# Run migrations
npm run migrate

# Reset database and run migrations
npm run migrate.fresh
```

## Local Development Setup

1. Create SSL certs using mkcert: `recipes-api.arbee.me.crt` and `recipes-api.arbee.me.pem` in `./certs/`
2. Create `.env` file with: `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_URL`, `COOKIE_SECRET`, `CORS_ORIGIN`, `APP_ENV`
3. Run `docker compose up`
4. Run `npm run watch` in a separate terminal for TypeScript compilation
5. Run migrations: `docker-compose exec web npm run migrate`

## CLI Commands

Run via Docker: `docker-compose exec web node dist/cli.js <command>`

- `create-user <email> <password>` - Create a user account

## Architecture

**Entry Points:**
- `src/server.ts` - HTTP server startup
- `src/app.ts` - Express app configuration, middleware, and route definitions
- `src/cli.ts` - CLI command runner using Commander.js

**Database:**
- PostgreSQL with Knex query builder and Objection.js ORM
- `src/database.ts` - Database connection setup
- `src/knexfile.ts` - Knex configuration (development uses separate host/user/password, production uses connection string)
- Migrations live in `migrations/` directory

**Models (Objection.js):**
- `src/Users/UserModel.ts` - User model with `recipes` relation
- `src/Recipes/RecipeModel.ts` - Recipe model with JSON schema validation

**Controllers:**
- `src/Recipes/RecipesController.ts` - Recipe CRUD operations + scrape endpoint

**Key Libraries:**
- `src/lib/RecipeWebScraper.ts` - Scrapes recipe data from URLs using JSON-LD/microdata (schema.org Recipe format)
- `src/lib/ApiResource.ts` - Response formatting for items and paginated collections
- `src/lib/asyncProtectedRoute.ts` - Wraps async route handlers with auth check and optional JSON schema validation

**Authentication:**
- `src/Auth/UserProvider.ts` - Passport.js local strategy implementation
- Session storage via `connect-session-knex` in database

## Testing

Tests use Mocha with Supertest for HTTP assertions.
- `test/setup.ts` - Global test setup/teardown
- `test/helpers.ts` - `authenticate()` helper creates user and returns session cookies
- `test/factories.ts` - Test data factories using Fishery

Run a single test file: `npm run migrate.fresh && npx mocha -r ts-node/register -r test/setup.ts -r test/hooks.ts test/path/to/file.test.ts`

## Deployment

Pushing to master triggers deployment to Fly.io via GitHub Actions. After deployment, SSH into Fly machine (`fly ssh console`) to run migrations if needed.
