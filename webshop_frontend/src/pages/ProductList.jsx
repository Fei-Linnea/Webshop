import { Link } from 'react-router-dom'
import Togglable from '../components/Togglable'
import CreatingProduct from '../components/CreatingProduct'

const ProductList = ({ user, products, addProduct, productFormRef }) => {
  const showButton = user?.isAdmin

  return (
    <div>
      <h1>Webshop</h1>
      <h2>Electronics</h2>
      {user && showButton && (
        <Togglable buttonLabel="Create a new product" ref={productFormRef}>
          <CreatingProduct createProduct={addProduct} />
        </Togglable>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id}>
            <img
              src={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="product-image"
            />
            <div>
              <p className="product-brand">{product.brand}</p>
              <Link to={`/products/${product.id}`} className="product-name">
                {product.name}
              </Link>
              <p className="product-price">{product.price} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
  
export default ProductList