const express = require("express")
const userRouter = require("./routes/user")
const recipeRouter = require("./routes/recipe")

const server = express()

server.use(express.json())
server.use(userRouter)
server.use(recipeRouter)

module.exports = server