const express = require("express")
const z = require("zod")
const { findRecipes, saveRecipe, updateRecipe, deleteRecipe, findRecipeId } = require("../database/recipe")
const auth = require("../middleware/auth")
const { recipe } = require("../database/prisma")

const router = express.Router()

const recipeSchema = z.object({
    nome: z.string(),
    descricao: z.string(),
    tempoDePreparo: z.number().positive()
})

router.get("/receita", auth, async(req, res)=>{
    const recipes = await findRecipes(req.userId)
    res.json({
        recipes
    })
})

router.post("/receita", auth, async(req, res)=>{
    try {
        const recipe = recipeSchema.parse(req.body)
        const userId = req.userId
        const savedRecipe = await saveRecipe(recipe, userId)

        res.status(201).json({
            savedRecipe
        })
    } catch (error) {
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

router.put("/receita/:id", auth, async(req, res)=>{
    const id = Number(req.params.id)
    const userId = req.userId
    try {
        const recipe = recipeSchema.parse(req.body)
        const updatedRecipe = await updateRecipe(recipe, id, userId)

        res.status(201).json({
            updatedRecipe
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(422).json({
            message: error.errors,
          });
        } else {
          const validatedId = await findRecipeId(id, userId);
          if (!validatedId) {
            res.status(404).json({
              message: "id inválido",
            });
          } else {
            res.status(500).json({
              message: "erro no servidor",
            });
          }
        }
      }
})

router.delete("/receita/:id", auth, async(req, res)=>{
    const id = Number(req.params.id)
    const userId = req.userId
    try {
        await deleteRecipe(id, userId)
    
        res.status(201).send(
            "Receita número " + id + " deletada com sucesso"
        )
        
    } catch (error) {
        const validatedId = await findRecipeId(id, userId)
        if (!validatedId){
            res.status(404).json({
                message: "id inválido"
            })
        }
    }
})

module.exports = router