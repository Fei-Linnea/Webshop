import { Link } from 'react-router-dom'
import CartIcon from './CartIcon'

const Navbar = ({ cartItems, user, handleLogout }) => {

    return (
    <nav className="navbar">
        <div className="nav-links">
            <Link to="/">Home </Link>
            <Link to="/products">Products </Link>
            <Link to="/contact">Contact Us </Link>
        </div>
        <nav className="nav-login-info">
            <div className="cart-and-user">
                <div className="nav-cart-icon">
                    <CartIcon cartItems={cartItems} />
                </div>
                {user ? (
                    <div className="nav-user-info">
                        <p>{user.name} logged in <button onClick={handleLogout} className="nav-logout-btn">Logout</button></p>
                    </div>
                    ) : (
                    <Link to="/login" className="nav-login-link">Login </Link>
                )}
            </div>
        </nav>
    </nav>
  )
}

export default Navbar