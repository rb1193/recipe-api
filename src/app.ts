import { Application, NextFunction, Request, Response } from 'express'
import e from "express"
import session from "express-session"
import methodoverride from "method-override"
import cors from "cors"
import Config from './lib/Config'
import knex from './database'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUser, serializeUser, deserializeUser } from './Auth/UserProvider'
import { ValidationError as AjvValidationError } from 'ajv'
import { ValidationError, NotFoundError } from 'objection'
import asyncProtectedRoute from './lib/asyncProtectedRoute'
import RecipesController, { scrapeRequestSchema } from './Recipes/RecipesController'
import RecipeModel from './Recipes/RecipeModel'
import ApiResource, { PaginatedCollection, Item } from './lib/ApiResource'
import { handleModelValidationError, handleRequestValidationError } from './lib/ErrorHandlers'
import UserModel from './Users/UserModel'
import { ConnectSessionKnexStore } from 'connect-session-knex'


// Configure application
const app: Application = e()

app.use(methodoverride('X-HTTP-Method-Override'))
app.use(cors({ origin: Config.CORS_ORIGIN, credentials: true }))
app.use(e.json())
app.use(
    session({
        store: new ConnectSessionKnexStore({ knex, tableName: 'session' }),
        secret: Config.COOKIE_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }, // 30 days
    }),
)

passport.use(new LocalStrategy(findUser))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
app.use(passport.initialize())
app.use(passport.session())

// Define routes
app.options('*', () => cors())

app.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.status(200).json(ApiResource.item(req.user as UserModel))
})

app.post('/logout', (req: Request, res: Response, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error)
        }
        res.status(200).end()
    })
})

app.get('/user', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json(ApiResource.item(req.user as UserModel))
    }
    res.status(401).end()
})

app.route('/recipes')
    .post(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.store))
    .get(asyncProtectedRoute<PaginatedCollection<RecipeModel>>(RecipesController.search))
app.route('/recipes/all')
    .get(asyncProtectedRoute<PaginatedCollection<RecipeModel>>(RecipesController.list))
app.route('/recipes/:recipe')
    .get(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.show))
    .put(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.update))
    .delete(asyncProtectedRoute<null>(RecipesController.remove))
app.post('/recipes/scrape', asyncProtectedRoute<Item<RecipeModel>>(RecipesController.scrape, scrapeRequestSchema))

// Fall back to 404 page
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Page not found')
})

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AjvValidationError) {
        res.status(400).json(handleRequestValidationError(err))
        return
    }

    if (err instanceof ValidationError) {
        res.status(400).json(handleModelValidationError(err))
        return
    }
    if (err instanceof NotFoundError) {
        res.status(404).json({data: {message: 'Not found'}})
        return
    }

    if (err.name && err.name == "RecipeScrapingError") {
        res.status(424).json({data: {message: err.message}})
        return
    }

    console.error(err.stack)
    res.status(500).send('Something broke!')
})

export default app
