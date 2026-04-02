import React from 'react';

const TransparencyTimeline = ({ logs }) => {
    if (!logs || logs.length === 0) {
        return <p className="text-secondary" style={{ fontStyle: 'italic', fontSize: '0.875rem' }}>No timeline data available yet.</p>;
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>Transparency Timeline</h4>
            <div style={{ position: 'relative', borderLeft: '2px solid rgba(255, 255, 255, 0.1)', marginLeft: '0.75rem', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {logs.map((log) => (
                    <div key={log.id} style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '-2.05rem', top: '0.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.25rem', height: '1.25rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', border: '4px solid var(--bg-color)', zIndex: 1 }}>
                            <div style={{ width: '0.5rem', height: '0.5rem', background: 'var(--primary)', borderRadius: '50%' }}></div>
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {(log.from_status || '').replace('_', ' ')} &rarr; {(log.to_status || '').replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                {new Date(log.created_at).toLocaleString()}
                            </span>
                            {log.changed_by_name && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                    Updated by: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{log.changed_by_name}</span>
                                </span>
                            )}
                            {log.notes && (
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>"{log.notes}"</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransparencyTimeline;
