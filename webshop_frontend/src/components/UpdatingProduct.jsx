import { useState } from 'react'
import axios from 'axios'

const UpdatingProduct = ({ product, updateProduct }) => {
  const [name, setName] = useState(product.name)
  const [brand, setBrand] = useState(product.brand)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [image, setImage] = useState('')
  const [stock, setStock] = useState(product.stock)
  const [category, setCategory] = useState(product.category)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'product_images')

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dqaxnzlpa/image/upload', formData)
      setUploading(false)
      setImage(response.data.secure_url)
    } catch (error) {
      setUploading(false)
      console.error('Error uploading image:', error)
      alert('Image upload failed!')
    }
  }

  const update = (event) => {
      event.preventDefault()
      updateProduct(product.id, { 
      name, 
      brand,
      description, 
      price: Number(price), 
      image, 
      stock: Number(stock), 
      category 
      })
      setName('')
      setBrand('')
      setDescription('')
      setPrice('')
      setImage('')
      setStock('')
      setCategory('')
  }

  return (
      <form onSubmit={update}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Brand:</label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price (€):</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUpload">Upload a new image:</label>
          <input 
          id="imageUpload" 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          /> {uploading && <p>Uploading image...</p>}
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update product</button>
      </form>
  )
}

export default UpdatingProduct