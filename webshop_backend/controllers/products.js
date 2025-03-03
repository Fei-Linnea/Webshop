const productsRouter = require('express').Router()
const Product = require('../models/product')
const { authenticateUser, authorizeAdmin } = require('../utils/middleware')

productsRouter.get('/', async (request, response) => {
    try {
        const products = await Product.find({})
        response.json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:id', async (request, response) => {
    try {
        const products = await Product.findById(request.params.id)
        response.json(products)
    } catch (error) {
        next(error)
    }
})

productsRouter.post('/', authenticateUser, authorizeAdmin, async (request, response, next) => {
    try {
        const body = request.body
        const product = new Product({
            name: body.name,
            brand: body.brand,
            description: body.description,
            price: body.price,
            image: body.image,
            stock: body.stock,
            category: body.category
        })
        const savedProduct = await product.save()
        response.status(201).json(savedProduct)
    } catch (error) {
        console.error("Error saving product:", error)
        next(error)
    }
})

productsRouter.delete('/:id', authenticateUser, authorizeAdmin, async (request, response) => {
    try {
        await Product.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

productsRouter.put('/:id', authenticateUser, authorizeAdmin, async (request, response, next) => {
    try {
        const body = request.body
        const product = {
            id: body.id,
            name: body.name,
            brand: body.brand,
            description: body.description,
            price: body.price,
            image: body.image,
            stock: body.stock,
            category: body.category
        }  
        const updatedProduct = await Product.findByIdAndUpdate(request.params.id, product, { new: true })
        if (updatedProduct) {
            response.json(updatedProduct)
        } else {
            response.status(404).json('Product not found')
        }
    } catch (error) {
        next(error)
    }
})

module.exports = productsRouter