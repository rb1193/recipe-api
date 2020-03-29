import { Application, NextFunction, Request, Response } from 'express'
import e = require('express')
import session = require('express-session')
import methodoverride = require('method-override')
import cors = require('cors')
import Config from './lib/Config'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUser, serializeUser, deserializeUser } from './Auth/UserProvider'
import knexConfig from './knexfile'
import Knex from 'knex'
import { Model, ValidationError, NotFoundError } from 'objection'
import asyncProtectedRoute from './lib/asyncProtectedRoute'
import RecipesController from './Recipes/RecipesController'
import RecipeModel from './Recipes/RecipeModel'
import ApiResource, { PaginatedCollection, Item } from './lib/ApiResource'
import handleModelValidationError from './lib/handleModelValidationError'
import UserModel from './Users/UserModel'

// Configure database and ORM
const knex = Knex(knexConfig[Config.APP_ENV || 'production'])
Model.knex(knex)

// Configure application
const app: Application = e()

app.use(methodoverride('X-HTTP-Method-Override'))
app.use(cors({ origin: 'http://localhost:3001', credentials: true }))
app.use(e.json())
app.use(
    session({
        store: new (require('connect-pg-simple')(session))(),
        secret: Config.COOKIE_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    }),
)

passport.use(new LocalStrategy(findUser))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
app.use(passport.initialize())
app.use(passport.session())

// Define routes
app.options('*', cors())

app.post('/login', passport.authenticate('local', { failWithError: true }), (req: Request, res: Response) => {
    res.status(200).json(ApiResource.item(req.user as UserModel))
})

app.post('/logout', (req: Request, res: Response) => {
    req.logOut()
    res.status(200).end()
})

app.get('/user', (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json(ApiResource.item(req.user as UserModel))
    }
    res.status(401).end()
})

app.route('/recipes')
    .post(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.store))
    .get(asyncProtectedRoute<PaginatedCollection<RecipeModel>>(RecipesController.list))
app.route('/recipes/:recipe')
    .get(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.show))
    .put(asyncProtectedRoute<Item<RecipeModel>>(RecipesController.update))
    .delete(asyncProtectedRoute<null>(RecipesController.remove))

// Fall back to 404 page
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Page not found')
})

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ValidationError) {
        res.status(400).json(handleModelValidationError(err))
        return
    }
    if (err instanceof NotFoundError) {
        res.status(404).json({data: {message: 'Not found'}})
    }

    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Start server
app.listen(3000)
