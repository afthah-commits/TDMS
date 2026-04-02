import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HeartHandshake, LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    let dashboardLink = '/';
    if (user) {
        if (user.role === 'DONOR') dashboardLink = '/donor-dashboard';
        else if (user.role === 'VOLUNTEER') dashboardLink = '/volunteer-dashboard';
        else if (user.role === 'ADMIN') dashboardLink = '/admin-dashboard';
    }

    return (
        <nav className="glass-header">
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* Logo Section */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{
                        padding: '0.5rem', background: 'linear-gradient(to top right, var(--primary), var(--accent))',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <HeartHandshake style={{ color: 'white', width: '20px', height: '20px' }} />
                    </div>
                    <span className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                        TDMS
                    </span>
                </Link>

                {/* Navigation Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to={dashboardLink} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
                                <span style={{ fontSize: '0.875rem', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '0.25rem 0.75rem', fontWeight: 600 }}>
                                    {user.username}
                                </span>
                                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.3s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
                                <LogIn size={16} /> Login
                            </Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                                <UserPlus size={16} style={{ marginRight: '0.5rem' }} /> Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
