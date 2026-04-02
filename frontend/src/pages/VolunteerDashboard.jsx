import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransparencyTimeline from '../components/TransparencyTimeline';

const VolunteerDashboard = () => {
    const [donations, setDonations] = useState([]);
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

    const updateStatus = async (donationId, newStatus) => {
        setLoading(true);
        try {
            await api.post(`donations/physical/${donationId}/update-status/`, {
                status: newStatus,
                notes: `Marked as ${newStatus.replace('_', ' ')} by Volunteer`
            });
            fetchDonations();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Error updating status');
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
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Volunteer & Admin Dashboard</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {donations.map((donation) => {
                    const statusInfo = getStatusTextAndStyle(donation.status);
                    return (
                        <div key={donation.id} className="glass-panel" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)' }}>{donation.item_type} (x{donation.quantity})</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Donor: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{donation.donor_name}</span></p>
                                </div>
                                <span className={statusInfo.className}>
                                    {statusInfo.text}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Description:</strong> {donation.description}</p>
                            <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', fontSize: '1rem' }}><strong style={{ color: 'var(--text-secondary)' }}>Pickup Location:</strong> {donation.pickup_location}</p>

                            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)', marginBottom: '1.5rem' }}>
                                <TransparencyTimeline logs={donation.status_logs} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Update Status:</p>
                                {donation.status === 'PENDING' && (
                                    <button
                                        onClick={() => updateStatus(donation.id, 'VERIFIED')}
                                        disabled={loading}
                                        style={{ background: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                                    >
                                        Mark Verified
                                    </button>
                                )}
                                {donation.status === 'VERIFIED' && (
                                    <button
                                        onClick={() => updateStatus(donation.id, 'PICKED_UP')}
                                        disabled={loading}
                                        style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                                    >
                                        Mark Picked Up
                                    </button>
                                )}
                                {donation.status === 'PICKED_UP' && (
                                    <button
                                        onClick={() => updateStatus(donation.id, 'DELIVERED')}
                                        disabled={loading}
                                        style={{ background: 'var(--success)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                                    >
                                        Mark Delivered
                                    </button>
                                )}
                                {donation.status === 'DELIVERED' && (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: 600, fontStyle: 'italic' }}>Donation cycle complete.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
                {donations.length === 0 && (
                    <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>No donations available to manage.</p>
                )}
            </div>
        </div>
    );
};

export default VolunteerDashboard;
