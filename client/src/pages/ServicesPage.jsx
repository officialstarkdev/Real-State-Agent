import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import RevealOnScroll from '../components/RevealOnScroll';

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    API.get('/services').then(r => setServices(r.data)).catch(() => {});
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [services]);

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">What We Do</span>
          <h1>Our Services</h1>
          <p>End-to-end representation across four international markets</p>
        </div>
      </div>

      <section className="section services">
        <div className="container">
          <div className="grid-services">
            {services.map((s, i) => (
              <div key={s._id} className={`svc reveal ${['', 'd1', 'd2', 'd3'][i] || ''}`}>
                <div className="svc-icon"><i className={`fa-solid ${s.icon}`}></i></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link className="svc-link" to="/contact">{s.linkText || 'Learn More'} <i className="fa-solid fa-arrow-right-long"></i></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Process</span>
            <h2>Your Journey, Simplified</h2>
            <p>One clear path from first call to keys in hand</p>
          </div>
          <div className="steps">
            {[
              { num: 1, emoji: '📞', title: 'Free Consultation', desc: 'Tell us your goals and budget' },
              { num: 2, emoji: '🔍', title: 'Property Matching', desc: 'We shortlist the best options for you' },
              { num: 3, emoji: '🏠', title: 'Viewings & Negotiation', desc: 'Virtual or in-person, we handle it all' },
              { num: 4, emoji: '✅', title: 'Keys in Hand', desc: 'Settlement, paperwork and beyond' },
            ].map((s, i) => (
              <div key={i} className={`step reveal ${['', 'd1', 'd2', 'd3'][i]}`}>
                <div className="step-num">{s.num}</div>
                <div>
                  <span className="emoji">{s.emoji}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="section markets">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Coverage</span>
            <h2>Markets We Operate In</h2>
          </div>
          <div className="grid-markets">
            {[
              { flag: '🇦🇺', name: 'Australia', cities: 'Sydney · Melbourne · Gold Coast', insight: 'Lifestyle-driven demand with resilient long-term capital growth' },
              { flag: '🇺🇸', name: 'United States', cities: 'Miami · New York · Los Angeles', insight: 'Deep liquidity and strong appeal for international investors' },
              { flag: '🇬🇧', name: 'United Kingdom', cities: 'London · Manchester · Edinburgh', insight: 'Prime-central prestige plus high-yield regional cities' },
              { flag: '🌍', name: 'Gulf Region', cities: 'Dubai · Riyadh · Doha · Abu Dhabi', insight: 'Strong rental yields, tax-efficient and foreign buyer-friendly' },
            ].map((m, i) => (
              <div key={i} className={`market reveal ${['', 'd1', 'd2', 'd3'][i]}`}>
                <span className="flag">{m.flag}</span>
                <h3>{m.name}</h3>
                <p className="cities">{m.cities}</p>
                <p className="insight"><i className="fa-solid fa-arrow-trend-up"></i> {m.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ marginBottom: 16 }}>Ready to Get Started?</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 500, marginInline: 'auto' }}>Book a free consultation and let us guide you through the process</p>
            <Link to="/contact" className="btn btn-gold"><i className="fa-regular fa-calendar-check"></i> Book a Free Consultation</Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
