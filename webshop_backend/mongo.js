const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fei-linnea:${password}@cluster1.g66r1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`
mongoose.set('strictQuery', false)
mongoose.connect(url)