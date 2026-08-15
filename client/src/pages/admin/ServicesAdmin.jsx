import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', icon: 'fa-house-chimney', linkText: 'Learn More', order: 0
  });

  const fetchServices = () => {
    setLoading(true);
    API.get('/services')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.services)
            ? res.data.services
            : [];
        setServices(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (s) => {
    setCurrentService(s);
    setIsEditing(true);
    setForm({
      title: s.title || '',
      description: s.description || '',
      icon: s.icon || 'fa-house-chimney',
      linkText: s.linkText || 'Learn More',
      order: s.order || 0
    });
  };

  const handleAddNew = () => {
    setCurrentService(null);
    setIsEditing(true);
    setForm({
      title: '', description: '', icon: 'fa-house-chimney', linkText: 'Learn More', order: services.length
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Failed to delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentService) {
        await API.put(`/services/${currentService._id}`, form);
      } else {
        await API.post('/services', form);
      }
      setIsEditing(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert('Failed to save service.');
    }
  };

  if (loading && !isEditing) return <div className="loading"><div className="spinner"></div></div>;

  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div className="page-transition">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Services Management</h1>
          <p style={{ color: 'var(--muted)' }}>Manage Harrington Property Group service offerings</p>
        </div>
        {!isEditing && (
          <button className="btn btn-gold" onClick={handleAddNew}>
            <i className="fa-solid fa-plus"></i> Add Service
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{currentService ? 'Edit Service' : 'Add New Service'}</h2>
          
          <div className="field">
            <label>Service Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required></textarea>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Icon Class (Font Awesome class name, e.g. fa-house-chimney)</label>
              <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} required />
            </div>
            <div className="field">
              <label>Link Text</label>
              <input type="text" value={form.linkText} onChange={e => setForm({ ...form, linkText: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} required />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-gold">Save Service</button>
            <button type="button" className="btn btn-outline-navy" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Title</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeServices.map((s, i) => (
                <tr key={s._id || i}>
                  <td style={{ fontSize: '1.25rem', color: 'var(--gold-dark)' }}><i className={`fa-solid ${s.icon}`}></i></td>
                  <td style={{ fontWeight: '600' }}>{s.title}</td>
                  <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.description}</td>
                  <td>{s.order}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(s)}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button className="delete" onClick={() => handleDelete(s._id)}><i className="fa-solid fa-trash"></i> Delete</button>
                  </td>
                </tr>
              ))}
              {safeServices.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
