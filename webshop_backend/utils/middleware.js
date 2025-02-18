const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

// Tokenin haku
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log('Authorization header:', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
  } 
  console.log('Extracted token:', authorization.replace('Bearer ', '')) 
  return null
}

const authenticateUser = async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('Decoded token:', decodedToken) 
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

    request.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    response.status(401).json({ error: 'invalid or expired token' })
  }
}

const authorizeAdmin = (request, response, next) => {
  if (!request.user || !request.user.isAdmin) {
    return response.status(403).json({ error: 'access denied, admin rights required' })
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authenticateUser,
  authorizeAdmin
}