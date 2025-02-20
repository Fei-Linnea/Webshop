import { useState } from 'react'

const Contact = ({ user, setErrorMessage, setMessage }) => {
  const [name, setName] = useState(user ? user.name : '')
  const [email, setEmail] = useState(user ? user.email : '')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Bug report')


  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, category, subject, content }),
      })

      if (response.ok) {
        setMessage('Your message has been sent successfully!')
        setTimeout(() => {
            setMessage(null)
          }, 4000)
        setName('')
        setEmail('')
        setSubject('')
        setContent('')
      } else {
        setErrorMessage('Please fill out all required fields.')
        setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.')
    }
  }

  return (
    <div>
      <h1>Contact Us</h1>
      <p>Have a question or need assistance? Send us a message!</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
          />
        </div>
        <div>
        <label htmlFor="category">Category: </label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Bug Report">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Billing Issue">Billing Issue</option>
            <option value="Product return">Product return</option>
            <option value="Delivery issue">Delivery issue</option>
            <option value="Partnership Inquiry">Partnership Inquiry</option>
            <option value="Other">Other</option>
        </select>
        </div>
        <div>
          <label htmlFor="subject">Subject: </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
        </div>
        <div>
          <label htmlFor="message content">Message content: </label>
          <textarea
            id="message content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your message"
            required
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}

export default Contact