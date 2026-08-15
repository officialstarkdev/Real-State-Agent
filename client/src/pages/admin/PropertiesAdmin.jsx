import { useState, useEffect } from 'react';
import API from '../../utils/api';

export default function PropertiesAdmin() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProp, setCurrentProp] = useState(null);
  
  // Form fields
  const [form, setForm] = useState({
    title: '', slug: '', flag: '', market: '', loc: '', price: '', priceNumeric: '',
    status: 'For Sale', type: 'Villa', beds: 0, baths: 0, garage: 0, area: '', land: '—',
    year: new Date().getFullYear(), images: '', desc: '', features: '',
    mapTitle: '', mapNote: '', featured: false,
    detailsKeyVal: '' // Key-value details as key:val\nkey2:val2
  });

  const fetchProperties = () => {
    setLoading(true);
    API.get('/properties?limit=100')
      .then((res) => setProperties(res.data.properties))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (prop) => {
    setCurrentProp(prop);
    setIsEditing(true);

    // Convert map/object details back to string key:val
    let detStr = '';
    const detailsObj = prop.details instanceof Map ? Object.fromEntries(prop.details) : (prop.details || {});
    Object.entries(detailsObj).forEach(([k, v]) => {
      detStr += `${k}:${v}\n`;
    });

    setForm({
      title: prop.title || '',
      slug: prop.slug || '',
      flag: prop.flag || '',
      market: prop.market || '',
      loc: prop.loc || '',
      price: prop.price || '',
      priceNumeric: prop.priceNumeric || '',
      status: prop.status || 'For Sale',
      type: prop.type || 'Villa',
      beds: prop.beds || 0,
      baths: prop.baths || 0,
      garage: prop.garage || 0,
      area: prop.area || '',
      land: prop.land || '—',
      year: prop.year || new Date().getFullYear(),
      images: prop.images ? prop.images.join('\n') : '',
      desc: prop.desc ? prop.desc.join('\n\n') : '',
      features: prop.features ? prop.features.join(', ') : '',
      mapTitle: prop.mapTitle || '',
      mapNote: prop.mapNote || '',
      featured: prop.featured || false,
      detailsKeyVal: detStr.trim()
    });
  };

  const handleAddNew = () => {
    setCurrentProp(null);
    setIsEditing(true);
    setForm({
      title: '', slug: '', flag: '', market: '', loc: '', price: '', priceNumeric: '',
      status: 'For Sale', type: 'Villa', beds: 0, baths: 0, garage: 0, area: '', land: '—',
      year: new Date().getFullYear(), images: '', desc: '', features: '',
      mapTitle: '', mapNote: '', featured: false,
      detailsKeyVal: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await API.delete(`/properties/${id}`);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert('Failed to delete property.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process inputs
    const imagesArr = form.images.split('\n').map(s => s.trim()).filter(Boolean);
    const descArr = form.desc.split('\n\n').map(s => s.trim()).filter(Boolean);
    const featuresArr = form.features.split(',').map(s => s.trim()).filter(Boolean);
    
    const detailsObj = {};
    form.detailsKeyVal.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        detailsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    });

    const payload = {
      ...form,
      priceNumeric: Number(form.priceNumeric) || 0,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      garage: Number(form.garage) || 0,
      year: Number(form.year) || new Date().getFullYear(),
      images: imagesArr,
      desc: descArr,
      features: featuresArr,
      details: detailsObj
    };

    try {
      if (currentProp) {
        await API.put(`/properties/${currentProp._id}`, payload);
      } else {
        await API.post('/properties', payload);
      }
      setIsEditing(false);
      fetchProperties();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving property.');
    }
  };

  if (loading && !isEditing) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="page-transition">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Properties Management</h1>
          <p style={{ color: 'var(--muted)' }}>Add, update, or remove properties from the listing registry</p>
        </div>
        {!isEditing && (
          <button className="btn btn-gold" onClick={handleAddNew}>
            <i className="fa-solid fa-plus"></i> Add Property
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
          <h2>{currentProp ? 'Edit Property' : 'Add New Property'}</h2>
          
          <div className="form-row">
            <div className="field">
              <label>Property Title</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Slug (URL-friendly string)</label>
              <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Market (e.g. Sydney, Miami)</label>
              <input type="text" value={form.market} onChange={e => setForm({ ...form, market: e.target.value })} required />
            </div>
            <div className="field">
              <label>Flag Emoji (e.g. 🇦🇺)</label>
              <input type="text" value={form.flag} onChange={e => setForm({ ...form, flag: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Location / Address</label>
            <input type="text" value={form.loc} onChange={e => setForm({ ...form, loc: e.target.value })} required />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Price Display String (e.g. AUD 1,250,000)</label>
              <input type="text" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="field">
              <label>Numeric Price (for filtering)</label>
              <input type="number" value={form.priceNumeric} onChange={e => setForm({ ...form, priceNumeric: e.target.value })} required />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>For Sale</option>
                <option>For Rent</option>
                <option>Sold</option>
              </select>
            </div>
            <div className="field">
              <label>Type</label>
              <input type="text" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
            </div>
          </div>

          <div className="form-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="field">
              <label>Beds</label>
              <input type="number" value={form.beds} onChange={e => setForm({ ...form, beds: e.target.value })} />
            </div>
            <div className="field">
              <label>Baths</label>
              <input type="number" value={form.baths} onChange={e => setForm({ ...form, baths: e.target.value })} />
            </div>
            <div className="field">
              <label>Garage</label>
              <input type="number" value={form.garage} onChange={e => setForm({ ...form, garage: e.target.value })} />
            </div>
            <div className="field">
              <label>Year Built</label>
              <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Internal Area (e.g. 420 sqm / 2,340 sqft)</label>
              <input type="text" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            </div>
            <div className="field">
              <label>Land Size (optional)</label>
              <input type="text" value={form.land} onChange={e => setForm({ ...form, land: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label>Images (one URL per line)</label>
            <textarea value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} placeholder="https://..." style={{ minHeight: '120px' }}></textarea>
          </div>

          <div className="field">
            <label>Description Paragraphs (separate paragraphs with double-newlines)</label>
            <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Paragraph 1&#10;&#10;Paragraph 2" style={{ minHeight: '150px' }}></textarea>
          </div>

          <div className="field">
            <label>Features & Amenities (comma separated)</label>
            <input type="text" value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Pool, Views, Marble ensuite" />
          </div>

          <div className="field">
            <label>Property Details (one key:value per line)</label>
            <textarea value={form.detailsKeyVal} onChange={e => setForm({ ...form, detailsKeyVal: e.target.value })} placeholder="Property ID:HPG-AU-0142&#10;Tenure:Freehold" style={{ minHeight: '100px' }}></textarea>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Map Neighborhood Title</label>
              <input type="text" value={form.mapTitle} onChange={e => setForm({ ...form, mapTitle: e.target.value })} />
            </div>
            <div className="field">
              <label>Map Note / Details</label>
              <input type="text" value={form.mapNote} onChange={e => setForm({ ...form, mapNote: e.target.value })} />
            </div>
          </div>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
            <input
              type="checkbox" id="featured" checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
              style={{ width: 'auto', transform: 'scale(1.2)' }}
            />
            <label htmlFor="featured" style={{ marginBottom: 0, cursor: 'pointer' }}>Feature this listing on the homepage</label>
          </div>

          <div className="btn-row">
            <button type="submit" className="btn btn-gold">Save Property</button>
            <button type="button" className="btn btn-outline-navy" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Market</th>
                <th>Price</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td style={{ fontWeight: '600' }}>{p.title}</td>
                  <td>{p.flag} {p.market}</td>
                  <td>{p.price}</td>
                  <td>
                    <span className={p.status === 'Sold' ? 'badge-read' : 'badge-unread'} style={{ fontSize: '.75rem' }}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(p)}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button className="delete" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash"></i> Delete</button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                    No properties added yet.
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
