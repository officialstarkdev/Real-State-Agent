import { useState, useEffect } from 'react';
import API from '../utils/api';
import TestimonialCarousel from '../components/TestimonialCarousel';
import RevealOnScroll from '../components/RevealOnScroll';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    API.get('/testimonials')
      .then(r => {
        const list = Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data?.testimonials)
            ? r.data.testimonials
            : [];
        setTestimonials(list);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Client Stories</span>
          <h1>Testimonials</h1>
          <p>What clients from Sydney to Dubai say about working with us</p>
        </div>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <>
          {/* Carousel */}
          {safeTestimonials.length > 0 && (
            <section className="section testimonials">
              <div className="container">
                <RevealOnScroll>
                  <TestimonialCarousel testimonials={safeTestimonials} />
                </RevealOnScroll>
              </div>
            </section>
          )}

          {/* Grid */}
          <section className="section">
            <div className="container">
              <div className="section-head center">
                <span className="eyebrow">All Reviews</span>
                <h2>Every Client Story</h2>
              </div>
              <div className="testimonial-grid">
                {safeTestimonials.map((t, i) => (
                  <div key={t._id || i} className="tcard">
                    <span className="quote-mark">&ldquo;</span>
                    <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                    <blockquote>{t.quote}</blockquote>
                    <div className="tmeta">
                      <div className="avatar">{t.initials}</div>
                      <div className="who">
                        <strong>{t.name}</strong>
                        <span>{t.subtitle}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {safeTestimonials.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--muted)', width: '100%' }}>
                    No testimonials found.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
