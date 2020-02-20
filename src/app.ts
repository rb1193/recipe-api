import { Application, Request, Response } from "express";
import e = require("express");

const app: Application = e();
const port = 3000;

app.get('/', (req: Request, res: Response) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))