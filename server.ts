import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
import {router as userRouter} from "./routes/users"

const prisma = new PrismaClient()

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
//This middleware allows to access info from forms
app.use(express.urlencoded({ extended: true }));

app.use(express.json())

app.set("view engine", "ejs");


// app.get("/", logger, (req, res) => {
//     console.log("Here");
//     res.status(200).render("index", { text: "World" });

// });




app.use("/users", userRouter);
function logger(req: Request, res: Response, next: NextFunction) {
    console.log(req.originalUrl);
    next();
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});