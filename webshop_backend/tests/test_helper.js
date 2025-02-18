const Product = require('../models/product')
const User = require('../models/user')
const Cart = require('../models/cart')

const initialProducts = [
  { name: 'Laptop', brand: 'Lenovo', price: 1200, description: 'High-performance laptop', stock: 10, category: 'Electronics' },
  { name: 'Phone', brand: 'OnePlus', price: 800, description: 'Smartphone with great features', stock: 15, category: 'Electronics' },
  { name: 'Headphones', brand: 'Sony', price: 150, description: 'Noise-cancelling headphones', stock: 20, category: 'Electronics' },
]

const initialUsers = [
  { name: 'Alice', email: 'alice@example.com', passwordHash: 'password1', isAdmin: true},
  { name: 'Bob', email: 'bob@example.com', passwordHash: 'password22', isAdmin: false},
]

const initialCarts = async (users, products) => [
  {
    userId: users[0]._id,
    products: [
      { productId: products[0]._id, quantity: 1 },
      { productId: products[2]._id, quantity: 2 },
    ],
  },
  {
    userId: users[1]._id,
    products: [
      { productId: products[1]._id, quantity: 5 },
    ],
  },
]

const initialContacts = [
  {
    name: 'John Doe',
    email: 'johndoe@example.com',
    category: 'Technical Support',
    subject: 'Need help with my order',
    content: 'I have not received my order yet. Can you check?',
  },
  {
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    category: 'Partnership Inquiry',
    subject: 'Business Partnership',
    content: 'I would like to discuss a potential partnership.',
  }
]

const loginUser = async (api) => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      email: 'alice@example.com',
      password: 'password1',
    })
    console.log('Login response:', loginResponse.body)
  return loginResponse.body.token
}

const nonExistingId = async () => {
  const product = new Product({ 
    name: 'Drink',
    brand: 'Juissi',
    price: 4,
    description: 'Hot drink',
    stock: 10,
    category: 'Electronics' 
})
  await product.save()
  await product.deleteOne()

  return product._id.toString()
}

const createUserWithCart = async (userData) => {
  const user = new User(userData)
  await user.save()

  const cart = new Cart({ userId: user._id, products: [] })
  await cart.save()

  return { user, cart }
}

const productsInDb = async () => {
  const products = await Product.find({})
  return products.map(product => product.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const cartsInDb = async () => {
  const carts = await Cart.find({})
  return carts.map(cart => cart.toJSON())
}

module.exports = {
  initialProducts, initialUsers, initialCarts, initialContacts, nonExistingId, 
  createUserWithCart, productsInDb, usersInDb, cartsInDb , loginUser
}