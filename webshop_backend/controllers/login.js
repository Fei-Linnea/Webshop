const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    console.log('Login request received:', request.body) 
    const { email, password } = request.body

    const user = await User.findOne({ email })
    if (!user) {
      return response.status(404).json({ message: 'User not found' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    console.log('Hashattu salasana:', user.passwordHash)
    console.log('Annettu salasana:', password)
    console.log('Salasana oikein:', passwordCorrect)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'Invalid email or password'
      })
    }

    const userForToken = {
      email: user.email,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    console.log('Token generated:', token)

    response
      .status(200)
      .send({ token, name: user.name, email: user.email, isAdmin: user.isAdmin, id: user._id.toString() })
  } catch (error) {
      next(error)
    }
  })

module.exports = loginRouter