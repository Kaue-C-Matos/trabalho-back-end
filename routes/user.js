const express = require("express")
const bcrypt = require("bcrypt")
const z = require("zod")
const jwt = require("jsonwebtoken")
const { findUserByEmail, saveUser } = require("../database/user")

const router = express.Router()

const userSchema = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string()
})

router.post("/register", async (req, res)=>{
    try {
        const user = userSchema.parse(req.body)
        const isEmailAlredyBeingUsed = await findUserByEmail(user.email)
        
        if (isEmailAlredyBeingUsed) return res.status(400).json({
            message: "o email já está em uso"
        })

        const hashedPassword = bcrypt.hashSync(user.senha, 10)

        user.senha = hashedPassword

        const savedUser = await saveUser(user)
        delete savedUser.senha

        res.json({savedUser})
    } 
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({
                message: error.errors
            })
        }
        res.status(500).json({
            message: "erro no servidor"
        })
    }
    
})

router.post("/login", async(req, res)=>{
    try {
        const data = loginSchema.parse(req.body)
        const user = await findUserByEmail(data.email)
        if (!user) return res.status(401).send()
        
        const isSamePassword = bcrypt.compareSync(data.senha, user.senha)
        if (!isSamePassword) return res.status(401).send()

        const token = jwt.sign({
            userId: user.id
        }, process.env.SECRET)

        res.json({token})
    } 
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(422).json({
                message: error.errors
            })
        }
        res.status(500).json({
            message: "erro no servidor"
        })
    }
})

module.exports = router