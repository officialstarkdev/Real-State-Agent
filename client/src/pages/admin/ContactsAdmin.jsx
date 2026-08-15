import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = () => {
    setLoading(true);
    API.get('/contacts')
      .then((res) => setContacts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/contacts/${id}/read`);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await API.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-transition">
      <div className="admin-header">
        <h1>Contacts Registry</h1>
        <p style={{ color: 'var(--muted)' }}>Submissions from the main website contact form</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Market</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id} style={c.read ? {} : { fontWeight: '600', backgroundColor: 'rgba(201,168,76,.03)' }}>
                <td style={{ fontSize: '.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{c.name}</td>
                <td><a href={`mailto:${c.email}`} style={{ color: 'var(--gold-dark)', textDecoration: 'underline' }}>{c.email}</a></td>
                <td>{c.countryCode} {c.phone}</td>
                <td>{c.market}</td>
                <td style={{ maxWidth: '250px', wordBreak: 'break-word', fontSize: '.85rem' }}>{c.message}</td>
                <td>
                  <span className={c.read ? 'badge-read' : 'badge-unread'}>
                    {c.read ? 'Read' : 'Unread'}
                  </span>
                </td>
                <td className="actions">
                  {!c.read && (
                    <button onClick={() => handleMarkAsRead(c._id)} style={{ color: 'var(--gold-dark)', borderColor: 'var(--gold)' }}>
                      <i className="fa-solid fa-check"></i> Mark Read
                    </button>
                  )}
                  <button className="delete" onClick={() => handleDelete(c._id)}><i className="fa-solid fa-trash"></i> Delete</button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
