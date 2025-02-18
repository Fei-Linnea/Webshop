import { Link } from 'react-router-dom'
import Togglable from '../components/Togglable'
import CreatingProduct from '../components/CreatingProduct'

const ProductList = ({ user, products, addProduct, productFormRef }) => {
  const showButton = user?.isAdmin

  return (
    <div>
      <h2>Webshop</h2>
      <h3>A list of the products</h3>
      {user && (
          <div>
            {showButton && (
              <Togglable buttonLabel="Create a new product" ref={productFormRef}>
              <CreatingProduct createProduct={addProduct} />
              </Togglable>
            )}
          </div>
        )}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name} - {product.brand} </Link>
            <img src={product.image || 'https://via.placeholder.com/150'} width="150" />
          </li>
        ))}
      </ul>
    </div>
  )
}
  
export default ProductList