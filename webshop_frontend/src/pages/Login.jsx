import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import productService from '../services/products'
import Register from '../components/register'
import Togglable from '../components/Togglable'

const Login = ({ setUser, setErrorMessage, setMessage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register, setRegister] = useState(true)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        email: email, 
        password: password,
      })

      window.localStorage.setItem(
        'loggedStoreappUser', JSON.stringify(user)
      )

      productService.setToken(user.token)
      setUser(user)
      navigate('/')
      setEmail('')
      setPassword('')
    } catch (exception) {
        console.error('Login error:', exception)
      setErrorMessage('Wrong email or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }
 
  return (
      <div className="login-container">
      <h2>Log in to Webshop</h2>
      <form onSubmit={handleLogin}>
          <div className="login-group">
          <label>Email</label>
          <input
              type="text"
              value={email}
              name="Email"
              onChange={({ target }) => setEmail(target.value)}
          />
          </div>
          <div className='login-group'>
          <label>Password</label>
          <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
          </div>
          <button type="submit" className="login-btn">Login</button>
      </form>
      <Togglable buttonLabel="Register">
        <Register onRegisterSuccess={() => setRegister(false)} setErrorMessage={setErrorMessage} 
         setMessage={setMessage} />
      </Togglable>
    </div>
  )
}

export default Login