import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/LoginHeader.css";

const LoginHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="lh-header">
      <div className="lh-logo">VROOM TRACK</div>

      <nav className="lh-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {user && (
        <div className="lh-user-menu">
          <div className="lh-username" onClick={toggleDropdown}>
            {user.username || user.email || "User"} <span className="lh-arrow">▼</span>
          </div>
          {dropdownOpen && (
            <div className="lh-dropdown">
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout} className="logout-btn-link">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default LoginHeader;
