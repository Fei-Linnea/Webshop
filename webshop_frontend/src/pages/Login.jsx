import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import productService from '../services/products'

const Login = ({ setUser, setErrorMessage }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        email: email, 
        password: password,
      })
      console.log('User logged in:', user)

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
      <div>
      <h2>Log in to Webshop</h2>
      <form onSubmit={handleLogin}>
          <div>
          Email
          <input
              type="text"
              value={email}
              name="Email"
              onChange={({ target }) => setEmail(target.value)}
          />
          </div>
          <div>
          Password
          <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
          </div>
          <button type="submit">Login</button>
      </form>
      </div>
  )
}

export default Login