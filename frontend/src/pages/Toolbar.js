import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authUtils from '../utils/authUtils';
import logo from '../assets/images/appify_logo.svg';

const Toolbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    useEffect(() => {
        const checkUserRole = async () => {
            const role = await authUtils.getUserRole();
            setIsManager(role === 'manager');
        };

        checkUserRole();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', backgroundColor: '#333', color: 'white' }}>
            <div style={{ flex: 1 }}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ height: '50px', cursor: 'pointer' }}
                    onClick={() => {
                        navigate('/dashboard');
                        closeMenu();
                    }}
                />
            </div>

            <div style={{ position: 'relative' }} ref={menuRef}>
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
                                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }} onClick={closeMenu}>
                                    Dashboard
                                </Link>
                            </li>
                            <li style={{ margin: '10px 0' }}>
                                <Link to="/tasks" style={{ color: 'white', textDecoration: 'none' }} onClick={closeMenu}>
                                    Task List
                                </Link>
                            </li>
                            <li style={{ margin: '10px 0' }}>
                                <Link to="/tasks/create" style={{ color: 'white', textDecoration: 'none' }} onClick={closeMenu}>
                                    Create Task
                                </Link>
                            </li>
                            {isManager && (
                                <li style={{ margin: '10px 0' }}>
                                    <Link to="/projects" style={{ color: 'white', textDecoration: 'none' }} onClick={closeMenu}>
                                        Manage Projects
                                    </Link>
                                </li>
                            )}
                            {isManager && (
                                <li style={{ margin: '10px 0' }}>
                                    <Link to="/users" style={{ color: 'white', textDecoration: 'none' }} onClick={closeMenu}>
                                        Manage Users
                                    </Link>
                                </li>
                            )}
                            <li style={{ margin: '10px 0' }}>
                                <button
                                    onClick={() => {
                                        authUtils.handleLogout();
                                        closeMenu();
                                    }}
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