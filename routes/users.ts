import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export const router = express.Router();
const prisma = new PrismaClient();
interface userRequest extends Request {
    user?: any
}

router.get("/", async (req: userRequest, res: Response) => {

    if (req.query.name != undefined) {
        try {
            const queryName = req.query.name.toString()
            const user = await prisma.user.findFirstOrThrow({
                where: { name: queryName}
            })
            res.json(user)
        } catch {
            res.send(`User by name of ${req.query.name} not found`)
        }
    } else {
        const users = await prisma.user.findMany()
        res.json(users)
    }
});

router.get("/new", (req: userRequest, res: Response) => {
    res.render("users/new", { firstName: "Test", email: "Test" })
});

router.get("/new/random", async (req: Request, res: Response) => {
    const amount = req.query.amount || 5
    const fetchReq = await fetch(`https://randomuser.me/api/?results=${amount}`)
    const fetchJson:any = await fetchReq.json();
    const simpleUsers= fetchJson.results.map((person:any) => createSmallUser(person))
    const users = await prisma.user.createMany({
        data: simpleUsers
    })
    console.log(`Created ${amount} new users!`)
    res.redirect(`/users`)

})


const createSmallUser = (person: any) => {
    const email = person.email
    const name = person.name.first
    return { name: name, email: email }
}


router.post("/", async (req: userRequest, res: Response) => {
    
    const emailCheck = await prisma.user.findFirst({
        where: { email: req.body.email }
    })


    if (emailCheck == undefined) {
        const user = await prisma.user.create({
            data: {
                name: req.body.firstName,
                email: req.body.email
            }
        })
        console.log(`Created new user: ${req.body.firstName}`)
        res.redirect(`/users`)
    } else {
        console.log("Error: User already exists")
        res.render("users/new", { firstName: req.body.firstName, email: req.body.email })
    }
});

router
    .route("/:id")
    .get(async (req: userRequest, res: Response) => {
        const user = await prisma.user.findFirst({
            where: { id: req.params.id}
        })
        res.json(user);
    })
    .delete(async (req: userRequest, res: Response) => {
        const deleteUser = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })
        res.redirect(`/users`)
    });


