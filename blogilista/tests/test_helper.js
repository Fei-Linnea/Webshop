const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
    title: 'otsikko',
    author: 'kirjailija',
    url: 'osoite',
    likes: 2,
    },
    {
    title: 'Toinen Blogi',
    author: 'Matti Meikäläinen',
    url: 'sffevsmjan34n54n6',
    likes: 0,
    }
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovesoon',
    author: 'Poistaja',
    url: 'urlll',
    likes: 4, 
})
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}