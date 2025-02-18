const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')

beforeEach(async () => {
  await Cart.deleteMany({})
  await Product.deleteMany({})
  await User.deleteMany({})

  await User.insertMany(helper.initialUsers)
  await Product.insertMany(helper.initialProducts)

  const storedUsers = await User.find({})
  const storedProducts = await Product.find({})

  const initialCarts = await helper.initialCarts(storedUsers, storedProducts)
  await Cart.insertMany(initialCarts)
})
  
test('carts are returned as json', async () => {
  await api
    .get('/api/carts')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two carts', async () => {
  const response = await api.get('/api/carts')
  expect(response.body).toHaveLength(2)
})

test('the userId of the first cart belongs to Alice', async () => {
  const users = await helper.usersInDb()
  const alice = users.find(user => user.name === 'Alice')

  const response = await api.get('/api/carts')
  
  expect(response.body[0].userId).toBe(alice.id)
})

test('all carts are returned', async () => {
  const response = await api.get('/api/carts')
  expect(response.body).toHaveLength(helper.initialCarts.length)
})

test('a new user automatically gets an empty cart', async () => {
  const { user } = await helper.createUserWithCart({
    name: 'TestUser',
    email: 'testuser@example.com',
    passwordHash: 'somepassword',
    isAdmin: false
  })

  const userCart = await Cart.findOne({ userId: user._id })
  expect(userCart).not.toBeNull()
  expect(userCart.products.length).toBe(0)
})

describe('deletion of a product from a cart', () => {
  test('a product can be removed from a cart', async () => {
    const users = await helper.usersInDb()
    const products = await helper.productsInDb()

    const userId = users[0].id
    const productId = products[0].id

    await Cart.findOneAndUpdate(
        { userId: userId },
        { $push: { products: { productId: productId, quantity: 1 } } },
        { new: true, upsert: true }
    )

    let cartBefore = await Cart.findOne({ userId: userId })
    expect(cartBefore.products.some(p => p.productId.toString() === productId)).toBe(true)

    await api
        .post(`/api/carts/${userId}/remove`)
        .send({ productId })
        .expect(204)

    let cartAfter = await Cart.findOne({ userId: userId })
    expect(cartAfter.products.some(p => p.productId.toString() === productId)).toBe(false)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})