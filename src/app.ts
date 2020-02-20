import { Application, NextFunction, Request, Response } from "express"
import e = require("express")
import { resolve } from "path"
import { config } from "dotenv"

config({ path: resolve(__dirname, "../.env") })

const app: Application = e()

app.get('/', (req: Request, res: Response) => res.send(`Hello ${req.query.name}. This is ${process.env.APP_NAME}`))

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send("Page not found")
})

app.listen(3000)