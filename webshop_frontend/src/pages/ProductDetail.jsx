import { useParams } from 'react-router-dom'
import Togglable from '../components/Togglable'
import UpdatingProduct from '../components/UpdatingProduct'

const ProductDetail = ({ products, addToCart, toggleDelete, updateProduct, updateFormRef, user }) => {
  const { id } = useParams()
  const product = products.find(p => p.id === id)

  if (!product) {
    return <div>Product not found</div>
  }
  
  const showButton = user?.isAdmin

  return (
    <div>
      <h2>{product.name}</h2>
      <p><strong>{product.brand}</strong></p>
      <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} width="150" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> {product.price} €</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      {showButton && 
      <button onClick={() => toggleDelete(product.id)}>Remove</button>}
      {showButton && 
      <Togglable buttonLabel="Update this product" ref={updateFormRef}>
        <UpdatingProduct product={product} updateProduct={updateProduct} />
      </Togglable>}
    </div>
  )
}

export default ProductDetail