import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand">Business Nexus</Link>
      {user ? (
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/businesses">Businesses</Link>
          {user.role === 'investor' && <Link to="/recommendations">Recommendations</Link>}
          <Link to="/bids">Bids</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout} style={{ marginLeft: 18 }}>Logout</button>
        </nav>
      ) : (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      )}
    </div>
  );
}
