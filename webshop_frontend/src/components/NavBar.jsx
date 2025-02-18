import { Link } from 'react-router-dom'
import CartIcon from './CartIcon'

const Navbar = ({ cartItems, user, handleLogout }) => {
    const padding = {
        padding: 10
    }


    return (
    <nav className="navbar">
        <Link style={padding} to="/">Home </Link>
        <Link style={padding} to="/products">Products </Link>
        <Link style={padding} to="/contact">Contact Us </Link>
        <CartIcon cartItems={cartItems} />
        {user ? (
            <div>
                <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
            </div>
            ) : (
            <Link style={padding} to="/login">Login </Link>
        )}
    </nav>
  )
}

export default Navbar