import PropTypes from 'prop-types'

const Cart = ({ removeItem, updateQuantity, cartItems, user }) => {
    const totalPrice = Math.round(
        cartItems.reduce((sum, product) => sum + product.productId.price * product.quantity, 0) * 100
    ) / 100
    console.log('cartItems:', cartItems)
    
    return (
        <div>
        <h2>Shopping Cart</h2>
        <ul>
            {cartItems.length === 0 ? <p>Cart is empty</p> : cartItems.map(product => (
            <li key={product.productId.id} className="cart-item">
                <h3>{product.productId.name}</h3>
                <p>Price: {product.productId.price} €</p>
                <p>Stock: {product.productId.stock} kpl</p>
                <p>
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
                <button onClick={() => removeItem(user.id, product.productId.id, user.token)}>Remove</button>
            </li>
            ))}
        </ul>
        <h3>Total price: {totalPrice} €</h3>
        <button>Proceed to Payment</button>
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