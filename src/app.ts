import { Application, NextFunction, Request, Response } from 'express'
import e = require('express')
import session = require('express-session')
import methodoverride = require('method-override')
import { resolve } from 'path'
import { config } from 'dotenv'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { findUser, serializeUser, deserializeUser } from './Auth/UserProvider'
import knexConfig from './knexfile'
import Knex from 'knex'
import { Model } from 'objection'
import asyncProtectedRoute from './lib/asyncProtectedRoute'
import RecipesController from './Recipes/RecipesController'
import RecipeModel from './Recipes/RecipeModel'

// Load config
config({ path: resolve(__dirname, '../.env') })

// Configure database and ORM
const knex = Knex(knexConfig[process.env.APP_ENV || 'production'])
Model.knex(knex)

// Configure application
const app: Application = e()

app.use(methodoverride('X-HTTP-Method-Override'))
app.use(e.json())
app.use(
    session({
        store: new (require('connect-pg-simple')(session))(),
        secret: process.env.COOKIE_SECRET || 'secret',
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
app.post('/login', passport.authenticate('local'), function(
    req: Request,
    res: Response,
) {
    res.status(200).json(req.user)
})

app.route('/recipes')
    .post(asyncProtectedRoute<RecipeModel>(RecipesController.store))
    .get(asyncProtectedRoute<RecipeModel[]>(RecipesController.list))
app.route('/recipes/:recipe')
    .get(asyncProtectedRoute<RecipeModel>(RecipesController.show))
    .put(asyncProtectedRoute<RecipeModel>(RecipesController.update))
    .delete(asyncProtectedRoute<void>(RecipesController.remove))

// Fall back to 404 page
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Page not found')
})

// Start server
app.listen(3000)
