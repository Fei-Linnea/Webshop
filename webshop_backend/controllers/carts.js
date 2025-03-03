const mongoose = require('mongoose')
const Cart = require('../models/cart')
const cartsRouter = require('express').Router()
const Product = require('../models/product')

cartsRouter.get('/', async (request, response) => {
    try {
        const cart = await Cart.find({})
        response.json(cart)
    } catch (error) {
        next(error)
    }
})

cartsRouter.get('/:userId', async (request, response) => {
    try {
        const userId = new mongoose.Types.ObjectId(request.params.userId)
        const cart = await Cart.findOne({ userId }).populate({ path: 'products.productId', select: '-createdAt -updatedAt' })
        if (!cart) {
            return response.status(404).json({ error: 'Cart not found' })
        }
        response.json(cart)
    } catch (error) {
        next(error)
    }
})

cartsRouter.post('/:userId', async (request, response, next) => {
    try {
        const userId = request.params.userId
        const { products } = request.body
        if (!Array.isArray(products) || products.length === 0) {
            return response.status(400).json({ error: "Invalid products array" })
        }
        const { productId, quantity = 1 } = products[0]
        const product = await Product.findById(productId)
        if (!productId) {
            return response.status(400).json({ error: "productId is required" })
        }
        if (product.stock === 0) {
            return response.status(400).json({ error: 'Product is out of stock' })
        }
        const cart = await Cart.findOne({ userId })
        if (cart) {
            const existingProduct = cart.products.find(p => p.productId.toString() === productId)
            if (existingProduct) {
                existingProduct.quantity += 1
            } else {
                cart.products.push({ productId, quantity})
            }
            await cart.save()
            const populatedCart = await Cart.findById(cart._id).populate('products.productId')
            return response.status(201).json(populatedCart)
        }
    } catch (error) {
        next(error)
    }
})

cartsRouter.put('/:userId', async (request, response, next) => {
    try {
        const { userId } = request.params
        const { productId, quantity } = request.body
        if (!productId || !quantity) {
            return response.status(400).send('ProductId and quantity are required')
        }
        const validatedQuantity = quantity < 1 ? 1 : quantity
        const product = await Product.findById(productId)
        if (quantity > product.stock) {
            return response.status(400).json({ error: `Cannot add more than ${product.stock} items (stock limit)` })
        }
        const cart = await Cart.findOneAndUpdate(
            { userId: userId, 'products.productId': productId },
            { $set: { 'products.$.quantity': validatedQuantity } },
            { new: true }
        )
        response.status(200).json(cart)
    } catch (error) {
        next(error)
    }
})

cartsRouter.post('/:userId/remove', async (request, response, next) => {
    const { userId } = request.params
    const { productId } = request.body
    if (!productId) {
        return response.status(400).send('ProductId is required')
    }
    try {
        await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: productId } } },
            { new: true }
        )
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = cartsRouter