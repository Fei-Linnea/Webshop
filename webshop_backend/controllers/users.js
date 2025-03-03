const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Cart = require('../models/cart')

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const users = await User.findById(request.params.id)
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { name, email, password, isAdmin } = request.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return response.status(400).json({error: 'email must be unique'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      name,
      email,
      passwordHash,
      isAdmin
    })
    const savedUser = await user.save()
    const cart = new Cart({
      userId: savedUser._id,
      products: []
    })
    await cart.save()
    savedUser.cart = cart._id
    await savedUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

usersRouter.delete('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    if (!user) {
      return response.status(404).json({error: 'User not found'})
    }
    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart)
    }
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter