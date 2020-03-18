import { Application, NextFunction, Request, Response } from "express"
import e = require("express")
import session = require("express-session")
import { resolve } from "path"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { config } from "dotenv"
import { findUser, serializeUser, deserializeUser } from "./Auth/UserProvider"
import RecipesController from "./Recipes/RecipesController"

config({ path: resolve(__dirname, "../.env") })

const app: Application = e()

app.use(e.json())
app.use(session({
    store: new (require('connect-pg-simple')(session))(),
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

passport.use(new LocalStrategy(findUser))
passport.serializeUser(serializeUser)
passport.deserializeUser(deserializeUser)
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req: Request, res: Response) => res.send(`Hello ${req.query.name}. This is ${process.env.APP_NAME}`))
app.post('/login', passport.authenticate('local'), function (req: Request, res: Response) {
    res.status(200).end()
})

app.post('/recipes', (req: Request, res: Response) => res.json(RecipesController.store(req)))

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send("Page not found")
})

app.listen(3000)