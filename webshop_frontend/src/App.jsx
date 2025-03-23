import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Cart from './components/Cart'
import productService from './services/products'
import cartService from './services/carts'
import loginService from './services/login'
import ErrorMessage from './components/ErrorMessage'
import Notification from './components/Notification'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Contact from './components/Contact'

const App = () => {
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const productFormRef = useRef()

  useEffect(() => {
    productService.getAll().then(products =>
      setProducts(products))
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedStoreappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      loginService.setToken(user.token)
    }
  }, [])
  
  useEffect(() => {
    if (user?.token) {
      productService.setToken(user.token)
    }
  }, [user])
  
  useEffect(() => {
    const fetchCart = async () => {
        try {
          const storedUser = localStorage.getItem('loggedStoreappUser')
          if (!storedUser) {
            console.warn("No user found in localStorage")
            return
          }
          const user = JSON.parse(storedUser)
          if (!user?.id || !user?.token) {
            console.error("User ID or token is missing")
            return
          }
          const items = await cartService.getCart(user.id, user.token)
          setCartItems(items?.products || [])
        } catch (error) {
            console.error('Error fetching cart:', error)
        }
    }
    fetchCart()
}, [user])

  const showMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(null), 4000)
  }

  const showError = (message) => {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 4000)
  }

  const addProduct = (productObject) => {
    productFormRef.current.toggleVisibility()
    productService
      .create(productObject)
        .then(returnedProduct => {
        setProducts(products.concat(returnedProduct))
        setMessage(`A new product "${returnedProduct.name}" added`)
        setTimeout(() => {
          setMessage(null)
        }, 4000)
      })
  }

  const updateProduct = (id, productObject) => {
    productService
      .update(id, productObject)
      .then(returnedProduct => {
        setProducts(products.map(product => product.id !== id ? product : returnedProduct))
        setMessage(`Updated ${returnedProduct.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 4000)
      })
  }

  const toggleDeleteOf = id => {
    const product = products.find(n => n.id === id)
    const confirmDelete = window.confirm(`Remove ${product.name}?`)
    if (confirmDelete) {
      productService
        .remove(id)
        .then(() => {
          setProducts(products.filter(product => product.id !== id))
          setMessage(`Removed ${product.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 4000)
        })
    } 
  }

  const addToCart = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem('loggedStoreappUser'))
      if (!user) {
        showError('User not logged in')
        return
      }
      if (product.stock === 0) {
          showError('Product is out of stock')
          return
      }
      const updatedCart = await cartService.addToCart(user.id, product.id, 1, user.token)
      setCartItems(updatedCart.products) 
    } catch (error) {
        console.error('Error adding to cart:', error)
    }
  }

  const updateQuantity = async (userId, productId, quantity, token) => {
    if (quantity < 1) {
      quantity = 1
      return quantity
    }
    const product = await productService.getProduct(productId)
    if (quantity > product.stock) {
      showError(`Cannot add more than ${product.stock} items (stock limit)`)
      return
    }
    try {
      await cartService.updateQuantity(userId, productId, quantity, token)
      setCartItems(cartItems.map(item => item.productId.id === productId ? { ...item, quantity: quantity } : item))
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }
  
  const removeItem = async (userId, productId, token) => {
    try {
      await cartService.removeFromCart(userId, productId, token)
      setCartItems(cartItems.filter(item => item.productId.id !== productId))
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedStoreappUser')
    setUser(null)
    setCartItems([])
  }

  return (
    <Router>
      <Navbar cartItems={cartItems} user={user} handleLogout={handleLogout} />
      <ErrorMessage errorMessage={errorMessage} />
      <Notification message={message} />
      <Routes>
        <Route path="/login" element={user ? (<Navigate to="/" />) : 
            (<Login setUser={setUser} setErrorMessage={setErrorMessage} setMessage={setMessage} />)} />
        <Route path="/"  element={<Home />} />
        <Route path="/products" element={<ProductList user={user} products={products} 
        addProduct={addProduct} productFormRef={productFormRef} />} />
        <Route path="/products/:id" element={<ProductDetail products={products} addToCart={addToCart} 
        toggleDelete={toggleDeleteOf} updateProduct={updateProduct} user={user} />} />
        <Route path="/carts" element={<Cart cartItems={cartItems} removeItem={removeItem} 
        updateQuantity={updateQuantity} user={user} />} />
        <Route path="/contact" element={<Contact user={user} setErrorMessage={setErrorMessage}
        setMessage={setMessage}/>} />
      </Routes>
      <div>
        <i>Webshop, Department of Computer Science 2025</i>
      </div>
    </Router> 
  )
}

export default App