import { Link } from 'react-router-dom'

const CartIcon = ({ cartItems }) => {
  const totalItems = Array.isArray(cartItems)
  ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
  : 0

  return (
    <div className="cart-icon">
      <Link to="/carts">
        🛒 <span className="cart-count">{totalItems}</span>
      </Link>
    </div>
  )
}

export default CartIcon