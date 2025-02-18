import PropTypes from 'prop-types'

const Product = ({ product }) => {

  return (
    <li className="product">
      <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} width="150" />
      <h3>{product.name}</h3>
      <p>{product.brand}</p>
      <p>{product.description}</p>
      <p><strong>Price:</strong> {product.price} €</p>
      <p><strong>Stock:</strong> {product.stock} kpl</p>
      <p><strong>Category:</strong> {product.category}</p>
    </li>
  )
}

Product.propTypes = {
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      brand: PropTypes.string,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string,
      stock: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.object.isRequired,
  }

Product.displayName = 'Product'

export default Product
