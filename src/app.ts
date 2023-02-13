import express from "express";
import {Request, Response} from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!");
});

app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});