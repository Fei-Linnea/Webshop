import axios from 'axios'
const baseUrl = '/api/carts'

const getCart = async (userId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.get(`${baseUrl}/${userId}`, config)
  return response.data
}

const addToCart = async (userId, productId, quantity, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  
  const response = await axios.post(`${baseUrl}/${userId}`, { 
    products: [{ productId, quantity }]}, config)
  return response.data
}

const updateQuantity = async (userId, productId, quantity, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const body = {
    productId: productId,
    quantity: quantity
  } 

  const response = await axios.put(`${baseUrl}/${userId}`, body, config)
  return response.data
}

const removeFromCart = async (userId, productId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const body = {productId: productId}
  
  try {
    const response = await axios.post(`${baseUrl}/${userId}/remove`, body, config)
    return response.data

  } catch (error) {
    console.error('Error removing product from cart:', error)
    throw error 
  }
}

export default { getCart, addToCart, updateQuantity, removeFromCart }
