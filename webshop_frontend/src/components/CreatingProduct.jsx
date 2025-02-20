import { useState } from 'react'
import axios from 'axios'

const CreatingProduct = ({ createProduct }) => {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const uploadImage = async (file) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'product_images')

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dqaxnzlpa/image/upload', formData)
      setUploading(false)
      return response.data.secure_url
    } catch (error) {
      setUploading(false)
      if (error.response && error.response.data) {
        alert(`Cloudinary Error: ${JSON.stringify(error.response.data)}`)
      } else {
        setErrorMessage('Image upload failed!')
      }
    }
  }

  const addProduct = async (event) => {
    event.preventDefault()
    let imageUrl = ''
    if (image) {
      imageUrl = await uploadImage(image)
    }
    if (imageUrl) {
      createProduct({ 
        name, 
        brand,
        description, 
        price: Number(price), 
        image: imageUrl,
        stock: Number(stock), 
        category 
      })
    } else {
      alert('Failed to upload image!')
    }
    setName('')
    setBrand('')
    setDescription('')
    setPrice('')
    setImage('')
    setStock('')
    setCategory('')
  }

  return (
    <form onSubmit={addProduct}>
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
        <label htmlFor="image">Image:</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
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
      <button type="submit" disabled={uploading}>Add product</button>
    </form>
  )
}

export default CreatingProduct