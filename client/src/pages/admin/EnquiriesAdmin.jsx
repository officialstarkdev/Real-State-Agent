import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function EnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = () => {
    setLoading(true);
    API.get('/enquiries')
      .then((res) => setEnquiries(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/enquiries/${id}/read`);
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-transition">
      <div className="admin-header">
        <h1>Property Enquiries</h1>
        <p style={{ color: 'var(--muted)' }}>Submissions asking about specific property pages</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Property</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e._id} style={e.read ? {} : { fontWeight: '600', backgroundColor: 'rgba(201,168,76,.03)' }}>
                <td style={{ fontSize: '.8rem' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td>{e.name}</td>
                <td><a href={`mailto:${e.email}`} style={{ color: 'var(--gold-dark)', textDecoration: 'underline' }}>{e.email}</a></td>
                <td>
                  {e.property ? (
                    <a href={`/property/${e.property.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--navy)', textDecoration: 'underline' }}>
                      {e.property.title}
                    </a>
                  ) : (
                    <span>{e.propertyTitle || 'Unknown Property'}</span>
                  )}
                </td>
                <td style={{ maxWidth: '300px', wordBreak: 'break-word', fontSize: '.85rem' }}>{e.message}</td>
                <td>
                  <span className={e.read ? 'badge-read' : 'badge-unread'}>
                    {e.read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="actions">
                  {!e.read && (
                    <button onClick={() => handleMarkAsRead(e._id)} style={{ color: 'var(--gold-dark)', borderColor: 'var(--gold)' }}>
                      <i className="fa-solid fa-check"></i> Mark Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
