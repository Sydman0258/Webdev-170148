// filepath: src/Public_Components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import '../Styles/Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <div className="logo">VROOM TRACK</div>
            <nav className={`nav ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <div className="auth-links">
                <Link to="/login" className="bton">Login</Link>
                <Link to="/register" className="bton">Register</Link>
            </div>
            <button className="menu-toggle" onClick={toggleMenu}>
                {isOpen ? 'Close' : 'Menu'}
            </button>
        </header>
    );
}
export default Header;