import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartPulse, Truck, Package } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-wrapper" style={{ padding: '6rem 0' }}>
            {/* Hero Section */}
            <div className="container text-center" style={{ position: 'relative', zIndex: 10, margin: '3rem auto 5rem' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                    borderRadius: '9999px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem'
                }}>
                    <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                        <span className="animate-fade-in" style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--accent)', opacity: 0.75 }}></span>
                        <span style={{ position: 'relative', borderRadius: '50%', height: '8px', width: '8px', background: 'var(--accent)' }}></span>
                    </span>
                    Now Live for Donations
                </div>
                
                <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.1 }}>
                    Digitizing the <br />
                    <span className="text-gradient">Charity Lifecycle</span>
                </h1>
                
                <p style={{ maxWidth: '42rem', margin: '0 auto 3rem', fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    A transparent, secure, and verifable "paper trail" for clothes, toys, and monetary contributions. Know exactly where your donation goes.
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                        <HeartPulse style={{ width: '20px', height: '20px', marginRight: '8px' }} /> Start Donating
                    </Link>
                    <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                        View Dashboard
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <div className="grid md:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="glass-panel">
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ShieldCheck />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>100% Transparent</h3>
                        <p className="text-secondary">
                            No more 'black boxes'. Track your donation's exact status from the moment of pledge to final delivery.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-panel">
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Package />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Physical & Digital</h3>
                        <p className="text-secondary">
                            Whether it's winter coats, gently used toys, or a monetary pledge via secure gateways—we handle it all.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-panel">
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Truck />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Efficient Logistics</h3>
                        <p className="text-secondary">
                            Dedicated volunteer dashboards streamline the pickup and delivery process, ensuring items reach beneficiaries fast.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Background Orbs */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40rem', height: '40rem', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15 }}></div>
                <div style={{ position: 'absolute', top: '20%', right: '-5%', width: '30rem', height: '30rem', borderRadius: '50%', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.1 }}></div>
            </div>
        </div>
    );
};

export default Home;
