import PropTypes from 'prop-types'

const Cart = ({ removeItem, updateQuantity, cartItems, user }) => {
    const totalPrice = Math.round(
        cartItems.reduce((sum, product) => sum + product.productId.price * product.quantity, 0) * 100
    ) / 100
    
    return (
        <div className="cart-page">
        <h2 className="cart-title">Shopping Cart</h2>
        <ul className="cart-item-list">
            {cartItems.length === 0 ? <p className="empty-cart-message">Cart is empty</p> : cartItems.map(product => (
            <li key={product.productId.id} className="cart-item">
                <img src={product.productId.image} alt={product.productId.name} className="cart-item-image"/>
                <h3 className="cart-item-name">{product.productId.name}</h3>
                <p className="cart-item-price">Price: {product.productId.price} €</p>
                <p className="cart-item-stock">Stock: {product.productId.stock} kpl</p>
                <p className="cart-item-quantity">
                Quantity: 
                <input 
                    type="number" 
                    value={product.quantity} 
                    min="1"
                    onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                            if (newQuantity >= 1) {
                                updateQuantity(user.id, product.productId.id, newQuantity, user.token)
                            }
                        }
                    }
                />
                </p>
                <button className="remove-btn" onClick={() => removeItem(user.id, product.productId.id, user.token)}>Remove</button>
            </li>
            ))}
        </ul>
        <h3 className="cart-total-price">Total price: {totalPrice} €</h3>
        <button className="proceed-btn">Proceed to payment</button>
        </div>
    )
}

Cart.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            productId: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
            }).isRequired,
            quantity: PropTypes.number.isRequired,
        })
    ).isRequired,
    removeItem: PropTypes.func.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
}

Cart.displayName = 'Cart'

export default Cart