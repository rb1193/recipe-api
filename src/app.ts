import { Application, NextFunction, Request, Response } from "express";
import e = require("express");

const app: Application = e();
const port = 3000;

app.get('/', (req: Request, res: Response) => res.send("Hello {req.query.name}!"));

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send("Page not found")
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))