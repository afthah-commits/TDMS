import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            redirectUser(user.role);
        }
    }, [user, loading, navigate]);

    const redirectUser = (role) => {
        if (role === 'ADMIN') navigate('/admin-dashboard');
        else if (role === 'VOLUNTEER') navigate('/volunteer-dashboard');
        else navigate('/donor-dashboard');
    };

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            const loggedInUser = await login(credentials.username, credentials.password);
            if (loggedInUser) {
                redirectUser(loggedInUser.role);
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '28rem', zIndex: 10 }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ margin: '0 auto', height: '3.5rem', width: '3.5rem', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Shield style={{ width: '2rem', height: '2rem' }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome back</h2>
                    <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}>
                            Sign up today
                        </Link>
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 500, textAlign: 'center', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <User style={{ height: '1.25rem', width: '1.25rem', color: 'var(--text-secondary)' }} />
                            </div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                placeholder="Enter your username"
                                value={credentials.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <Lock style={{ height: '1.25rem', width: '1.25rem', color: 'var(--text-secondary)' }} />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.75 : 1 }}
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                        {!isSubmitting && <ArrowRight style={{ marginLeft: '0.5rem', height: '1rem', width: '1rem' }} />}
                    </button>
                </form>
            </div>
            
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40rem', height: '40rem', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '30rem', height: '30rem', borderRadius: '50%', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.1 }}></div>
            </div>
        </div>
    );
};

export default Login;
