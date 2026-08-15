import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-transition">
      <div className="admin-header">
        <h1>Dashboard</h1>
        <p style={{ color: 'var(--muted)' }}>Overview of Harrington Property Group operations</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-building"></i></div>
          <div className="stat-number">{stats?.properties || 0}</div>
          <div className="stat-label">Properties</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-envelope"></i></div>
          <div className="stat-number">{stats?.contacts || 0}</div>
          <div className="stat-label">Total Contacts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-paper-plane"></i></div>
          <div className="stat-number">{stats?.enquiries || 0}</div>
          <div className="stat-label">Total Enquiries</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
          <div className="stat-number">{stats?.users || 0}</div>
          <div className="stat-label">Users / Members</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '36px' }}>
        <div className="admin-table-wrap" style={{ padding: '24px' }}>
          <h2 className="serif" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Unread Submissions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
              <span>Unread Contact Forms</span>
              <span className={stats?.unreadContacts > 0 ? 'badge-unread' : 'badge-read'}>
                {stats?.unreadContacts || 0}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Unread Property Enquiries</span>
              <span className={stats?.unreadEnquiries > 0 ? 'badge-unread' : 'badge-read'}>
                {stats?.unreadEnquiries || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="admin-table-wrap" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 className="serif" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Admin Quick Notes</h2>
          <p style={{ fontSize: '.9rem', color: 'var(--muted)', lineHeight: '1.6' }}>
            Welcome to the Harrington Property Group administration panel. Here you can add, edit, or delete listings, manage testimonials, services, and check incoming contacts/enquiries. All changes take effect immediately on the live client website.
          </p>
        </div>
      </div>
    </div>
  );
}
