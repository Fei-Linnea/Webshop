import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Contact from '../components/Contact'
import '@testing-library/jest-dom'

const mockSetErrorMessage = jest.fn()
const mockSetMessage = jest.fn()

describe('<Contact />', () => {
  test('renders the form with all input fields', () => {
    render(<Contact setErrorMessage={mockSetErrorMessage} setMessage={mockSetMessage} />)

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message content:/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument()
  })

  test('allows the user to type in input fields', () => {
    render(<Contact setErrorMessage={mockSetErrorMessage} setMessage={mockSetMessage} />)

    const nameInput = screen.getByLabelText(/Name:/i)
    const emailInput = screen.getByLabelText(/Email:/i)
    const subjectInput = screen.getByLabelText(/Subject:/i)
    const contentTextarea = screen.getByLabelText(/Message content:/i)

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Testing Subject' } })
    fireEvent.change(contentTextarea, { target: { value: 'This is a test message.' } })

    expect(nameInput.value).toBe('John Doe')
    expect(emailInput.value).toBe('john@example.com')
    expect(subjectInput.value).toBe('Testing Subject')
    expect(contentTextarea.value).toBe('This is a test message.')
  })

  test('submits form and resets inputs on successful submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true
      })
    )
    render(<Contact setErrorMessage={mockSetErrorMessage} setMessage={mockSetMessage} />)

    const nameInput = screen.getByLabelText(/Name:/i)
    const emailInput = screen.getByLabelText(/Email:/i)
    const subjectInput = screen.getByLabelText(/Subject:/i)
    const contentTextarea = screen.getByLabelText(/Message content:/i)
    const submitButton = screen.getByRole('button', { name: /Send Message/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Testing Subject' } })
    fireEvent.change(contentTextarea, { target: { value: 'This is a test message.' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSetMessage).toHaveBeenCalledWith('Your message has been sent successfully!')
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(subjectInput.value).toBe('')
      expect(contentTextarea.value).toBe('')
    })
  })
})
