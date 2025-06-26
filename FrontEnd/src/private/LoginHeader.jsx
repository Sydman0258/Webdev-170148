// filepath: src/Public_Components/LoginHeader.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import './ LoginHeader.css';

const LoginHeader = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // Replace with dynamic user from context/localStorage
    const username = "JohnDoe";

    return (
        <header className="header">
            <div className="logo">VROOM TRACK</div>

            <nav className="nav">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>

            <div className="user-menu">
                <div className="username" onClick={toggleDropdown}>
                    {username} <span className="arrow">▼</span>
                </div>
                {dropdownOpen && (
                    <div className="dropdown">
                        <Link to="/profile">Profile</Link>
                        <Link to="/settings">Settings</Link>
                        <Link to="/logout">Logout</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default LoginHeader;
