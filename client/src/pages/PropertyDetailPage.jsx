import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [gIndex, setGIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    API.get(`/properties/${slug}`)
      .then(({ data }) => {
        setProperty(data);
        setGIndex(0);
        return API.get('/properties', { params: { limit: 6 } });
      })
      .then(({ data }) => {
        const list = data.properties || data || [];
        setSimilar(list.filter(p => p.slug !== slug).slice(0, 3));
      })
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  // Trigger reveal animations for cards (e.g. Similar Properties) after loading
  useEffect(() => {
    if (loading) return;
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [loading, similar, property]);

  const setGallery = useCallback((i) => {
    if (!property) return;
    const len = property.images.length;
    const next = ((i % len) + len) % len;
    setFading(true);
    setTimeout(() => { setGIndex(next); setFading(false); }, 160);
  }, [property]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') setGallery(gIndex - 1);
      if (e.key === 'ArrowRight') setGallery(gIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gIndex, setGallery]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    try {
      await API.post('/enquiries', {
        name: e.target['e-name'].value,
        email: e.target['e-email'].value,
        message: e.target['e-msg'].value,
        property: property._id,
        propertyTitle: property.title,
      });
    } catch {}
    setEnquirySuccess(true);
    e.target['e-name'].value = '';
    e.target['e-email'].value = '';
  };

  if (loading) return <div style={{ paddingTop: 140 }}><div className="loading"><div className="spinner"></div></div></div>;
  if (!property) return null;

  const p = property;
  const details = p.details instanceof Map ? Object.fromEntries(p.details) : (p.details || {});

  return (
    <div className="page-transition" style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/listings')}>
          <i className="fa-solid fa-arrow-left-long"></i> Back to Listings
        </button>

        <div className="detail-head">
          <div>
            <div className="detail-tags">
              <span className="tag gold">Featured</span>
              <span className="tag navy">{p.status}</span>
              <span className="tag line">{p.type}</span>
            </div>
            <h1>{p.title}</h1>
            <p className="detail-loc"><i className="fa-solid fa-location-dot"></i> <span>{p.loc}</span></p>
          </div>
          <div className="detail-price-wrap">
            <div className="detail-price">{p.price}</div>
            <div className="detail-price-note">Guide Price</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="gallery">
          <div className="gallery-main">
            <img
              src={p.images[gIndex]}
              alt={`${p.title} — photo ${gIndex + 1}`}
              className={fading ? 'fading' : ''}
            />
            <button className="g-arrow prev" onClick={() => setGallery(gIndex - 1)} aria-label="Previous photo">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="g-arrow next" onClick={() => setGallery(gIndex + 1)} aria-label="Next photo">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <span className="g-counter">{gIndex + 1} / {p.images.length}</span>
          </div>
          <div className="gallery-thumbs">
            {p.images.map((src, k) => (
              <button
                key={k}
                className={k === gIndex ? 'active' : ''}
                onClick={() => setGallery(k)}
                aria-label={`View photo ${k + 1}`}
              >
                <img src={src.replace('w=1400', 'w=400')} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-main">
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="qstat"><i className="fa-solid fa-bed"></i><strong>{p.beds}</strong><span>Bedrooms</span></div>
              <div className="qstat"><i className="fa-solid fa-bath"></i><strong>{p.baths}</strong><span>Bathrooms</span></div>
              <div className="qstat"><i className="fa-solid fa-car"></i><strong>{p.garage}</strong><span>Garage</span></div>
              <div className="qstat"><i className="fa-solid fa-ruler-combined"></i><strong>{p.area}</strong><span>Internal</span></div>
              <div className="qstat"><i className="fa-solid fa-calendar"></i><strong>{p.year}</strong><span>Year Built</span></div>
              <div className="qstat"><i className="fa-solid fa-building"></i><strong>{p.type}</strong><span>Type</span></div>
            </div>

            {/* Description */}
            <div className="dsection">
              <h2 className="serif">About This Property</h2>
              <div className="gold-rule"></div>
              {p.desc.map((d, i) => <p key={i}>{d}</p>)}
            </div>

            {/* Features */}
            <div className="dsection">
              <h2 className="serif">Features &amp; Amenities</h2>
              <div className="gold-rule"></div>
              <div className="feat-grid">
                {p.features.map((f, i) => (
                  <div key={i} className="feat"><i className="fa-solid fa-check"></i>{f}</div>
                ))}
              </div>
            </div>

            {/* Details Table */}
            <div className="dsection">
              <h2 className="serif">Property Details</h2>
              <div className="gold-rule"></div>
              <div className="dtable">
                {Object.entries(details).map(([k, v]) => (
                  <div key={k} className="drow"><span>{k}</span><span>{v}</span></div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="dsection">
              <h2 className="serif">Location</h2>
              <div className="gold-rule"></div>
              <div className="map-ph">
                <div>
                  <i className="fa-solid fa-location-dot"></i>
                  <strong>{p.mapTitle}</strong>
                  <span>{p.mapNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-side">
            <div className="agent-card">
              <div className="agent-top">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="James Harrington" />
                <div>
                  <strong>James Harrington</strong>
                  <span>Principal Agent · Harrington Property Group</span>
                </div>
              </div>
              <div className="agent-lines">
                <p><i className="fa-solid fa-phone"></i> <a href="tel:+61290000000">+61 2 9000 0000</a></p>
                <p><i className="fa-regular fa-envelope"></i> <a href="mailto:james@harringtonproperty.com">james@harringtonproperty.com</a></p>
                <p><i className="fa-regular fa-clock"></i> Replies within one business day</p>
              </div>
              <Link to="/contact" className="btn btn-gold"><i className="fa-regular fa-calendar-check"></i> Request a Viewing</Link>
              <a href="#" className="btn btn-whatsapp"><i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
            </div>

            <div className="enquiry-card">
              <h3 className="serif">Enquire About This Property</h3>
              <form onSubmit={handleEnquiry}>
                <div className="field"><input type="text" name="e-name" placeholder="Full name" required /></div>
                <div className="field"><input type="email" name="e-email" placeholder="Email address" required /></div>
                <div className="field">
                  <textarea
                    name="e-msg"
                    defaultValue={`Hi James, I'd like more information about ${p.title} (${p.price}).`}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-gold"><i className="fa-regular fa-paper-plane"></i> Send Enquiry</button>
                <p className={`enquiry-success${enquirySuccess ? ' show' : ''}`}>
                  <i className="fa-solid fa-circle-check"></i> Enquiry sent — James will be in touch shortly.
                </p>
              </form>
            </div>
          </aside>
        </div>

        {/* Similar Properties */}
        {similar.length > 0 && (
          <div className="similar">
            <h2 className="serif">Similar Properties</h2>
            <div className="grid-listings">
              {similar.map((sp, i) => <PropertyCard key={sp._id} property={sp} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
