const config = require('./utils/config')
const express = require('express')
const path = require('path')
const app = express()
require('express-async-errors')
const cors = require('cors')
const productsRouter = require('./controllers/products')
const usersRouter = require('./controllers/users')
const cartsRouter = require('./controllers/carts')
const loginRouter = require('./controllers/login')
const contactRouter = require('./controllers/contact')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/contact', contactRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app