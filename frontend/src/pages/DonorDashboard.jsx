import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransparencyTimeline from '../components/TransparencyTimeline';
import MonetaryDonationForm from '../components/MonetaryDonationForm';

const DonorDashboard = () => {
    const [donations, setDonations] = useState([]);
    const [formData, setFormData] = useState({
        item_type: 'CLOTHES',
        quantity: 1,
        description: '',
        name: '',
        house_name: '',
        pincode: '',
        landmark: '',
        city: '',
        district: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await api.get('donations/physical/');
            setDonations(response.data);
        } catch (error) {
            console.error('Failed to fetch donations:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const pickup_location = `Name: ${formData.name}, House name: ${formData.house_name}, Pincode: ${formData.pincode}, Landmark: ${formData.landmark}, City: ${formData.city}, District: ${formData.district}`;
            await api.post('donations/physical/', {
                item_type: formData.item_type,
                quantity: formData.quantity,
                description: formData.description,
                pickup_location
            });
            alert('Donation submitted successfully!');
            setFormData({ item_type: 'CLOTHES', quantity: 1, description: '', name: '', house_name: '', pincode: '', landmark: '', city: '', district: '' });
            fetchDonations();
        } catch (error) {
            console.error('Failed to submit donation:', error);
            alert('Error submitting donation');
        }
        setLoading(false);
    };

    const getStatusTextAndStyle = (status) => {
        switch(status) {
            case 'PENDING': return { text: 'Pending', className: 'badge pending' };
            case 'VERIFIED': return { text: 'Verified', className: 'badge verified' };
            case 'PICKED_UP': return { text: 'Picked Up', className: 'badge picked_up' };
            case 'DELIVERED': return { text: 'Delivered', className: 'badge delivered' };
            default: return { text: status, className: 'badge' };
        }
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="grid md:grid-cols-2">
                
                {/* Donation Form */}
                <div className="glass-panel">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>Make a Physical Donation</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="input-label">Item Type</label>
                            <select
                                name="item_type"
                                value={formData.item_type}
                                onChange={handleInputChange}
                                className="input-field"
                                style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.2)' }}
                            >
                                <option value="CLOTHES">Clothes</option>
                                <option value="TOYS">Toys</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="input-label">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="input-label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="input-field"
                                style={{ resize: 'vertical' }}
                                placeholder="e.g. 5 gently used winter coats"
                            ></textarea>
                        </div>
                        <div>
                            <label className="input-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <label className="input-label">House Name</label>
                            <input
                                type="text"
                                name="house_name"
                                value={formData.house_name}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="House/flat name"
                            />
                        </div>
                        <div>
                            <label className="input-label">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="Postal code"
                            />
                        </div>
                        <div>
                            <label className="input-label">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="Nearby landmark"
                            />
                        </div>
                        <div>
                            <label className="input-label">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <label className="input-label">District</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                                placeholder="District"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Submitting...' : 'Pledge Physical Item'}
                        </button>
                    </form>
                </div>

                {/* Financial Donation Form */}
                <MonetaryDonationForm onDonationSuccess={() => console.log("Monetary Donation Created")} />

                {/* Donation History */}
                <div className="glass-panel" style={{ gridColumn: '1 / -1' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>My Physical Pledge History</h2>
                    {donations.length === 0 ? (
                        <p className="text-secondary">You haven't made any donations yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {donations.map((donation) => {
                                const statusInfo = getStatusTextAndStyle(donation.status);
                                return (
                                    <div key={donation.id} style={{ border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '0.75rem', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'} onMouseOut={e => e.currentTarget.style.background='rgba(255, 255, 255, 0.02)'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{donation.item_type} (x{donation.quantity})</h3>
                                            <span className={statusInfo.className}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{donation.description}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Pledged on: {new Date(donation.created_at).toLocaleDateString()}</p>
                                        
                                        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                                            <TransparencyTimeline logs={donation.status_logs} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
