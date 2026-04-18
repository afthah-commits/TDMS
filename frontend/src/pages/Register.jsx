import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { UserPlus, User, Lock, Mail, Tag, ArrowRight } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'DONOR'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const response = await api.post('users/google-auth/', { token: credentialResponse.credential });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('hasRegistered', 'true');
            navigate('/donor-dashboard');
        } catch (err) {
            setError('Google signup failed. Please try again or use the form below.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await api.post('users/register/', formData);
            localStorage.setItem('hasRegistered', 'true');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.username?.[0] || err.response?.data?.password?.[0] || 'Registration failed. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative', overflow: 'hidden' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '28rem', zIndex: 10 }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ margin: '0 auto', height: '3.5rem', width: '3.5rem', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <UserPlus style={{ width: '2rem', height: '2rem' }} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Create an account</h2>
                    <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ fontWeight: 500, color: 'var(--primary)', textDecoration: 'none' }}>
                            Sign in here
                        </Link>
                    </p>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link
                            to="/login"
                            className="btn btn-secondary"
                            style={{ width: '100%', padding: '0.9rem 1rem', background: 'rgba(15, 23, 42, 0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', display: 'inline-block', textDecoration: 'none', fontWeight: 600 }}
                        >
                            Existing user? Login instead
                        </Link>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 500, textAlign: 'center', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}
                    
                    <div style={{ marginBottom: '1rem' }}>
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
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Email address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <Mail style={{ height: '1.25rem', width: '1.25rem', color: 'var(--text-secondary)' }} />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                style={{ paddingLeft: '3rem', marginBottom: 0 }}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
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
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="input-label">Test Role</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                                <Tag style={{ height: '1.25rem', width: '1.25rem', color: 'var(--text-secondary)' }} />
                            </div>
                            <select
                                name="role"
                                className="input-field"
                                style={{ paddingLeft: '3rem', marginBottom: 0, appearance: 'none', backgroundColor: 'rgba(0,0,0,0.4)' }}
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="DONOR">Donor</option>
                                <option value="VOLUNTEER">Volunteer</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', opacity: isSubmitting ? 0.75 : 1 }}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                        {!isSubmitting && <ArrowRight style={{ marginLeft: '0.5rem', height: '1rem', width: '1rem' }} />}
                    </button>

                    <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ margin: '0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google signup failed. Please try again or use the form above.')}
                            text="signup_with"
                            theme="dark"
                            size="large"
                        />
                    </div>
                </form>
            </div>
            
            {/* Background Decorations */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '10%', right: '10%', width: '40rem', height: '40rem', borderRadius: '50%', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.15 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '30rem', height: '30rem', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1 }}></div>
            </div>
        </div>
    );
};

export default Register;
