import { useState } from 'react'

const UpdatingProduct = ({ product, updateProduct }) => {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('')

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
          <label htmlFor="image">Image URL:</label>
          <input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg"
          />
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