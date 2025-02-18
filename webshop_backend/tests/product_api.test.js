const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Product = require('../models/product')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Cart = require('../models/cart')
const { loginUser } = require('./test_helper')

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


test('products are returned as json', async () => {
  await api
    .get('/api/products')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three products', async () => {
  const response = await api.get('/api/products')
  expect(response.body).toHaveLength(3)
})

test('the name of the first product is Laptop', async () => {
  const response = await api.get('/api/products')
  expect(response.body[0].name).toBe('Laptop')
})

test('all products are returned', async () => {
  const response = await api.get('/api/products')
  expect(response.body).toHaveLength(helper.initialProducts.length)
})

test('the number of products increases by one', async () => {
  const newProduct = { 
    name: 'Socks', 
    brand: 'Puma',
    price: 6, 
    description: 'Warm socks', 
    stock: 12, 
    category: 'Clothing' 
  }

  const token = await loginUser(api)
  console.log('Token:', token)

  await api
    .post('/api/products')
    .set('Authorization', `Bearer ${token}`)
    .send(newProduct)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/products')
  const names = response.body.map(product => product.name)
  expect(names).toHaveLength(4)
})

describe('deletion of a product', () => {
  test('a product can be deleted', async () => {
    const productsAtStart = await helper.productsInDb()
    const productToDelete = productsAtStart[0]

    const token = await loginUser(api)
    console.log('Token:', token)
    
    await api
      .delete(`/api/products/${productToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
    
    const productsAtEnd = await helper.productsInDb()

    expect(productsAtEnd).toHaveLength(2)

    const names = productsAtEnd.map(r => r.name)
    expect(names).not.toContain(productToDelete.name)
  })
})

describe('when there is three users at db', () => {
  test('creation succeeds with a fresh user', async () => {
    const newUser = { 
      name: 'Pekka', 
      email: 'pekka@example.com', 
      password: 'randompassword',
      isAdmin: false 
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(3)

    const emails = usersAtEnd.map(u => u.email)
    expect(emails).toContain(newUser.email)
  })

  test('creation fails with proper statuscode and message if email already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { 
      name: 'Uusi Alice', 
      email: 'alice@example.com', 
      password: 'randompass',
      isAdmin: false 
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('email must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})