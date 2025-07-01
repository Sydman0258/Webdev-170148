import { useState } from "react";
import { Link } from "react-router-dom";
import '../Styles/EmptyHeader.css';

const EmptyHeader = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="empty-header">
            <Link to="/" className="empty-logo">VROOM TRACK</Link>
            <nav className={`empty-nav ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/about">About</a></li>
                
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <button className="empty-menu-toggle" onClick={toggleMenu}>
                {isOpen ? 'Close' : 'Menu'}
            </button>
        </header>
    );
};

export default EmptyHeader;