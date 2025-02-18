const Contact = require('../models/contact')
const contactRouter = require('express').Router()

contactRouter.get('/', async (request, response) => {
    try {
        const conact = await Contact.find({})
        response.json(conact)
    } catch (error) {
        next(error)
    }
})

contactRouter.post('/', async (request, response) => {
  const { name, email, category, subject, content } = request.body

  // Validate required fields
  if (!subject || !content) {
    return response.status(400).json({ message: 'Subject and message are required.' });
  }

  try {
    // Create a new contact message document
    const newMessage = new Contact({
      name,
      email,
      category,
      subject,
      content,
    })

    // Save the message to the database
    await newMessage.save()

    // Respond with success
    response.status(201).json({ message: 'Message received and saved successfully!' });
  } catch (error) {
    console.error('Error saving message to database:', error);
    response.status(500).json({ message: 'Failed to save the message. Please try again later.' });
  }
})

contactRouter.delete('/:id', async (request, response) => {
    try {
        await Contact.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = contactRouter