import React, { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import api from '../services/api';

const MonetaryDonationForm = ({ onDonationSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const { Razorpay } = useRazorpay();

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) return;

        setLoading(true);

        try {
            // 1. Create order on backend
            const { data } = await api.post('payments/create-order/', { amount });

            const options = {
                key: data.razorpay_key,
                amount: data.donation.amount * 100, // in paise
                currency: data.donation.currency,
                name: 'TDMS NGO',
                description: 'Thank you for your generous contribution',
                order_id: data.order_id,
                handler: async (response) => {
                    // 2. Verify payment on backend
                    try {
                        await api.post('payments/verify/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        alert('Payment successful!');
                        setAmount('');
                        if (onDonationSuccess) onDonationSuccess();
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        alert('Payment failed verification.');
                    }
                },
                theme: {
                    color: '#10b981', // success color
                }
            };

            const rzpay = new Razorpay(options);
            rzpay.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            alert('Error initiating payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ borderTop: '4px solid var(--success)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1rem' }}>Make a Financial Contribution</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your monetary donations help us cover logistics and purchase essential items for those in need.</p>
            
            <form onSubmit={handlePayment}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label">Amount (INR)</label>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: '1rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>₹</span>
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="input-field"
                            style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading || !amount}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'linear-gradient(to right, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: loading || !amount ? 'not-allowed' : 'pointer',
                        opacity: loading || !amount ? 0.7 : 1,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                    onMouseOver={e => !loading && amount && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => !loading && amount && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    {loading ? 'Processing...' : 'Donate Securely via Razorpay'}
                </button>
            </form>
        </div>
    );
};

export default MonetaryDonationForm;
