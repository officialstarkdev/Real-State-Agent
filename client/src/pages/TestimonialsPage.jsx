import { useState, useEffect } from 'react';
import API from '../utils/api';
import TestimonialCarousel from '../components/TestimonialCarousel';
import RevealOnScroll from '../components/RevealOnScroll';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    API.get('/testimonials').then(r => setTestimonials(r.data)).catch(() => {});
  }, []);

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Client Stories</span>
          <h1>Testimonials</h1>
          <p>What clients from Sydney to Dubai say about working with us</p>
        </div>
      </div>

      {/* Carousel */}
      {testimonials.length > 0 && (
        <section className="section testimonials">
          <div className="container">
            <RevealOnScroll>
              <TestimonialCarousel testimonials={testimonials} />
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
            {testimonials.map((t, i) => (
              <div key={t._id || i} className="tcard">
                <span className="quote-mark">&ldquo;</span>
                <div className="stars">{'★'.repeat(t.rating)}</div>
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
          </div>
        </div>
      </section>
    </div>
  );
}
