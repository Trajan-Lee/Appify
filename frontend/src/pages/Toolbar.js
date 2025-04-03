import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authUtils from '../utils/authUtils';
import logo from '../assets/images/appify_logo.svg';

const Toolbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
  
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: 'white' }}>
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <img
            src={logo}// Placeholder logo
            alt="Logo"
            style={{ height: '50px', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')} // Clicking the logo navigates to the dashboard
          />
        </div>
  
        {/* Hamburger Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleMenu}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
  
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                backgroundColor: '#444',
                borderRadius: '5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: '10px' }}>
                <li style={{ margin: '10px 0' }}>
                  <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                    Dashboard
                  </Link>
                </li>
                <li style={{ margin: '10px 0' }}>
                  <Link to="/tasks" style={{ color: 'white', textDecoration: 'none' }}>
                    Task List
                  </Link>
                </li>
                <li style={{ margin: '10px 0' }}>
                  <Link to="/tasks/create" style={{ color: 'white', textDecoration: 'none' }}>
                    Create Task
                  </Link>
                </li>
                <li style={{ margin: '10px 0' }}>
                  <button
                    onClick={authUtils.handleLogout}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Toolbar;