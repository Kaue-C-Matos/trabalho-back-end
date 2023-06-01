const prisma = require("./prisma")

const findRecipes = (userId) =>{
    return prisma.recipe.findMany({
        where: {
            userId
        }
    })
}

const findRecipeId = (id, userId) =>{
    return prisma.recipe.findUnique({
        where:{
            userId: userId,
        },
        where: {
            id: id
        }
    })
}

const saveRecipe = (recipe, userId) =>{
    return prisma.recipe.create({
        data: {
            nome: recipe.nome,
            descricao: recipe.descricao,
            tempoDePreparo: recipe.tempoDePreparo,
            userId: userId
        }
    })
}

const updateRecipe = (recipe, id, userId) =>{
    return prisma.recipe.update({
        where: {
            id
        },
        data: {
            nome: recipe.nome,
            descricao: recipe.descricao,
            tempoDePreparo: recipe.tempoDePreparo,
            userId: userId
        }
    })
}

const deleteRecipe = (id, userId) =>{
    return prisma.recipe.delete({
        where:{
            userId: userId,
        },
        where: {
            id: id
        }
    })
}

module.exports = {
    findRecipes,
    saveRecipe,
    updateRecipe,
    deleteRecipe,
    findRecipeId
}