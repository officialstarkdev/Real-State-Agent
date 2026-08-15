import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const [form, setForm] = useState({
    name: '', initials: '', flag: '', rating: 5, quote: '', subtitle: '', order: 0
  });

  const fetchTestimonials = () => {
    setLoading(true);
    API.get('/testimonials')
      .then((res) => setTestimonials(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (t) => {
    setCurrentTestimonial(t);
    setIsEditing(true);
    setForm({
      name: t.name || '',
      initials: t.initials || '',
      flag: t.flag || '',
      rating: t.rating || 5,
      quote: t.quote || '',
      subtitle: t.subtitle || '',
      order: t.order || 0
    });
  };

  const handleAddNew = () => {
    setCurrentTestimonial(null);
    setIsEditing(true);
    setForm({
      name: '', initials: '', flag: '', rating: 5, quote: '', subtitle: '', order: testimonials.length
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await API.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert('Failed to delete testimonial.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTestimonial) {
        await API.put(`/testimonials/${currentTestimonial._id}`, form);
      } else {
        await API.post('/testimonials', form);
      }
      setIsEditing(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert('Failed to save testimonial.');
    }
  };

  if (loading && !isEditing) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-transition">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Testimonials Management</h1>
          <p style={{ color: 'var(--muted)' }}>Manage client reviews displayed on the website</p>
        </div>
        {!isEditing && (
          <button className="btn btn-gold" onClick={handleAddNew}>
            <i className="fa-solid fa-plus"></i> Add Testimonial
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{currentTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>

          <div className="form-row">
            <div className="field">
              <label>Client Name (with flag or location label)</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Sarah M. 🇦🇺" />
            </div>
            <div className="field">
              <label>Initials (for avatar)</label>
              <input type="text" value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} required placeholder="e.g. SM" maxLength="3" />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Flag emoji (optional)</label>
              <input type="text" value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} placeholder="e.g. 🇦🇺" />
            </div>
            <div className="field">
              <label>Rating (1 to 5 stars)</label>
              <select value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Subtitle (e.g. Waterfront home · Sydney, Australia)</label>
            <input type="text" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} required />
          </div>

          <div className="field">
            <label>Quote Content</label>
            <textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} required style={{ minHeight: '120px' }}></textarea>
          </div>

          <div className="field">
            <label>Display Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} required />
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-gold">Save Testimonial</button>
            <button type="button" className="btn btn-outline-navy" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Subtitle</th>
                <th>Quote preview</th>
                <th>Rating</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="avatar" style={{ width: '38px', height: '38px', fontSize: '.8rem' }}>{t.initials}</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{t.name}</td>
                  <td>{t.subtitle}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.quote}</td>
                  <td style={{ color: 'var(--gold)' }}>{'★'.repeat(t.rating)}</td>
                  <td>{t.order}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(t)}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button className="delete" onClick={() => handleDelete(t._id)}><i className="fa-solid fa-trash"></i> Delete</button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No testimonials found.
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
