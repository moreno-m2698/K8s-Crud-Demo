import express, { NextFunction, Request, Response } from 'express';
export const router = express.Router();

interface userRequest extends Request {
    user?: any
}

const users: any[] = [{ name: "Kyle" }, { name: "Sallye" }];

router.get("/", (req: userRequest, res: Response) => {
    //http://localhost:3000/users?name=bob
    console.log(req.query.name)
    res.send(users);
});

router.get("/new", (req: userRequest, res: Response) => {
    res.render("users/new", { firstName: "Test" })
});


router.post("/", (req: userRequest, res: Response) => {
    const isValid = true
    if (isValid) {
        users.push({name: req.body.firstName})
        res.redirect(`/users/${users.length - 1}`)
    } else {
        console.log("Error")
        res.render("users/new", { firstName: req.body.firstName })
    }
});

router
    .route("/:id")
    .get((req: userRequest, res: Response) => {
        console.log(req.user)
        res.send(`User Get id: ${req.params.id}`);
    })
    .put((req: userRequest, res: Response) => {
        res.send(`Update User id: ${req.params.id}`);
    })
    .delete((req: userRequest, res: Response) => {
        res.send(`Delete User id: ${req.params.id}`);
    });



router.param("id", (req: userRequest, res: Response, next: NextFunction, id: number) => {
    req.user = users[id]
    next();
})

