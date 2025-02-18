const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Contact = require('../models/contact')

beforeEach(async () => {
  await Contact.deleteMany({})
  await Contact.insertMany(helper.initialContacts)
})

test('contact messages are returned as JSON', async () => {
  await api
    .get('/api/contact')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all contact messages are returned', async () => {
  const response = await api.get('/api/contact')
  expect(response.body).toHaveLength(2)
})

test('a valid contact message can be added', async () => {
  const newContact = {
    name: 'Alice Brown',
    email: 'alicebrown@example.com',
    category: 'Technical Issue',
    subject: 'Website is not loading',
    content: 'I am unable to access the website. Please check.',
  }

  await api
    .post('/api/contact')
    .send(newContact)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/contact')
  expect(response.body).toHaveLength(3)

  const subjects = response.body.map(c => c.subject)
  expect(subjects).toContain(newContact.subject)
})

test('contact message without subject and content is not added', async () => {
  const invalidContact = {
    name: 'Invalid User',
    email: 'invalid@example.com',
    category: 'Other'
  }

  const response = await api
    .post('/api/contact')
    .send(invalidContact)
    .expect(400)

  expect(response.body.message).toBe('Subject and message are required.')

  const contactsAtEnd = await api.get('/api/contact')
  expect(contactsAtEnd.body).toHaveLength(2)
})

test('a contact message can be deleted', async () => {
  const contactsAtStart = await api.get('/api/contact')
  const contactToDelete = contactsAtStart.body[0]

  await api
    .delete(`/api/contact/${contactToDelete.id}`)
    .expect(204)

  const contactsAtEnd = await api.get('/api/contact')
  expect(contactsAtEnd.body).toHaveLength(1)

  const subjects = contactsAtEnd.body.map(c => c.subject)
  expect(subjects).not.toContain(contactToDelete.subject)
})

afterAll(async () => {
  await mongoose.connection.close()
})
