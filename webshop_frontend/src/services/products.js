import axios from 'axios'
const baseUrl = '/api/products'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getProduct = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async (newProduct) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newProduct, config)
  return response.data
}

const update = async (id, updatedProduct) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedProduct, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, getProduct, create, update, remove, setToken }