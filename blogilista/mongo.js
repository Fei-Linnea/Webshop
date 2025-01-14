const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://feitzu03:${password}@fei-linnea.10a69mj.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Fei-Linnea`
mongoose.set('strictQuery', false)
mongoose.connect(url)