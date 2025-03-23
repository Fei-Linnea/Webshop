import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../services/users'

const Register = ({ setErrorMessage, onRegisterSuccess, setMessage }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async (event) => {
        event.preventDefault()
        console.log("Admin value before submission:", isAdmin) 
        try {
            await userService.register({ name, email, password, isAdmin })
            setName('')
            setEmail('')
            setPassword('')
            setIsAdmin(false)
            onRegisterSuccess()
            setMessage('Registration successful!')
            setTimeout(() => {
                setMessage(null)
              }, 4000)
            navigate('/login')
          } catch (exception) {
            console.error('Register error:', exception)
          setErrorMessage('Failed to register a user')
          setTimeout(() => {
            setErrorMessage(null)
          }, 4000)
        }
    }

    return (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="login-group">
              Name: <input type="text" value={name} onChange={({ target }) => setName(target.value)} required />
            </div>
            <div className="login-group">
              Email: <input type="email" value={email} onChange={({ target }) => setEmail(target.value)} required />
            </div>
            <div className="login-group">
              Password: <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} required />
            </div>
            <div className="login-group">
                isAdmin: <input type="checkbox" checked={isAdmin} onChange={({ target }) => setIsAdmin(target.checked)} />
            </div>
            <button type="submit" className="login-btn" >Register</button>
          </form>
        </div>
    )
}

export default Register
