import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('payments/analytics/');
            setAnalytics(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading analytics...</div>;
    if (!analytics) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--danger)' }}>Failed to load data. Ensure you are an Admin.</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Impact Analytics</h2>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-3" style={{ marginBottom: '3rem' }}>
                <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <p className="kpi-title">Total Pledges</p>
                    <p className="kpi-value">{analytics.total_physical_pledges}</p>
                </div>

                <div className="glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <p className="kpi-title">Items Delivered</p>
                    <p className="kpi-value">{analytics.items_delivered}</p>
                </div>

                <div className="glass-panel" style={{ borderLeft: '4px solid var(--success)' }}>
                    <p className="kpi-title">Total Funds Raised</p>
                    <p className="kpi-value">₹{parseFloat(analytics.total_funds_raised).toLocaleString()}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recent Monetary Contributions</h3>
                {analytics.recent_funds.length === 0 ? (
                    <p className="text-secondary">No recent funds raised.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Donor</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.recent_funds.map((fund, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{fund.donor__username}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>₹{parseFloat(fund.amount).toLocaleString()}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(fund.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
