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
    <div className="product-detail-container">
      <div className="product-detail-card">
        <img
          src={product.image || 'https://via.placeholder.com/250'}
          alt={product.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
        <p className="product-detail-brand">{product.brand}</p>
          <h3 className="product-detail-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price"><strong>Price:</strong> {product.price} €</p>
          <p className="product-stock"><strong>Stock:</strong> {product.stock}</p>
          <p className="product-category"><strong>Category:</strong> {product.category}</p>

          <div className="product-buttons">
            <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
            {showButton && (
              <>
                <button className="delete-btn" onClick={() => toggleDelete(product.id)}>Remove</button>
                <div className="update-btn">
                  <Togglable buttonLabel="Update this product" ref={updateFormRef}>
                    <UpdatingProduct product={product} updateProduct={updateProduct} />
                  </Togglable>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail