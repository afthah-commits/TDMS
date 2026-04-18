import React, { useState } from 'react';
import { useRazorpay } from 'react-razorpay';
import api from '../services/api';

const MonetaryDonationForm = ({ onDonationSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const { Razorpay } = useRazorpay();

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return;

        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const { data } = await api.post('payments/create-order/', { amount });

            if (!data.order_id || !data.razorpay_key) {
                const serverMessage = data.error || 'Unable to create payment order. Please check Razorpay settings.';
                throw new Error(serverMessage);
            }

            if (!Razorpay) {
                throw new Error('Razorpay checkout script failed to load. Reload the page.');
            }

            const options = {
                key: data.razorpay_key,
                amount: Number(amount) * 100,
                currency: data.donation.currency,
                name: 'TDMS NGO',
                description: 'Thank you for your generous contribution',
                order_id: data.order_id,
                handler: async (response) => {
                    try {
                        await api.post('payments/verify/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        setSuccessMessage('Donation successful! Thank you for supporting TDMS.');
                        setAmount('');
                        if (onDonationSuccess) onDonationSuccess();
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        setError('Payment failed verification. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        if (!successMessage) setLoading(false);
                    }
                },
                theme: {
                    color: '#10b981'
                }
            };

            const rzpay = new Razorpay(options);
            rzpay.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
            setError(error.message || 'Error initiating payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ borderTop: '4px solid var(--success)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '1rem' }}>Make a Financial Contribution</h2>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Your monetary donations help us cover logistics and purchase essential items for those in need.</p>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: 500, marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}
            {successMessage && (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 500, marginBottom: '1.5rem' }}>
                    {successMessage}
                </div>
            )}

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
                    onMouseOver={(e) => !loading && amount && (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={(e) => !loading && amount && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    {loading ? 'Processing...' : 'Donate Securely'}
                </button>
            </form>

        </div>
    );
};

export default MonetaryDonationForm;
