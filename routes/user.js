const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");
const { findUserByEmail, saveUser } = require("../database/user");
const jwt = require("jsonwebtoken");

const UserSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

router.post("/register", async (req, res) => {
    try {
        const user = UserSchema.parse(req.body);
        const isEmailAlreadyBeingUsed = await findUserByEmail(user.email);
        if (isEmailAlreadyBeingUsed)
            return res.status(400).json({
                message: "email em uso",
            });
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashedPassword;
        const savedUser = await saveUser(user);
        delete savedUser.password;
        res.json({ user: savedUser });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "erro interno do servidor",
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const data = LoginSchema.parse(req.body);
        const user = await findUserByEmail(data.email);
        if (!user) return res.status(401).send();
        const isSamePassword = bcrypt.compareSync(data.password, user.password);
        if (!isSamePassword) return res.status(401).send();
        const token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.SECRET
        );
        res.json({
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: error.errors,
            });
        }
        res.status(500).json({
            message: "erro interno do servidor",
        });
    }
});
//teste


const { addComic, getComics } = require("../database/comics");
const auth = require("../middleware/auth");

const comicSchema = require("../schemas/comicSchema");

router.get("/comics", async (req, res) => {
    try {
        const comics = await getComics();
        res.status(200).json({ comics });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/comic", auth, async (req, res) => {
    try {
        const comicData = comicSchema.parse(req.body);
        const comic = await addComic(comicData, req.userId);
        res.status(201).json({ comic });
    } catch (error) {
        if (error instanceof z.ZodError)
            return res.status(422).json({ message: error });
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
