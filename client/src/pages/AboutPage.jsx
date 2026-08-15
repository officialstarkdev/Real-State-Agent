import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Your Agent</span>
          <h1>About James Harrington</h1>
          <p>Twelve years of international property expertise across four continents</p>
        </div>
      </div>

      <section className="section">
        <div className="container about-grid">
          <div className="about-photo reveal">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80" alt="James Harrington" />
            <div className="about-frame-tag">
              <strong>AUD 280M+</strong>
              <span>Career Sales Volume</span>
            </div>
          </div>
          <div className="about-text reveal d1">
            <span className="eyebrow">Principal Agent</span>
            <h2>James Harrington</h2>
            <div className="gold-rule"></div>
            <p>James Harrington has spent twelve years guiding buyers, sellers and investors through some of the world's most competitive property markets. What began in Sydney's harbourside suburbs has grown into a truly international practice spanning Australia, the United States, the United Kingdom and the Gulf region.</p>
            <p>James specialises in high-net-worth clients — expatriates, investors and relocating families who need a single trusted advisor across borders. His network of vetted local partners, from conveyancers in London to escrow officers in Miami, means every transaction runs to one standard: his.</p>
            <p>Fluent in the local nuances of each market — foreign-buyer rules in Australia, leasehold structures in the UK, freehold zones in Dubai — James turns cross-border complexity into a clear, confident path to keys in hand.</p>
            <div className="about-stats">
              <div><strong>340+</strong><span>Properties Sold</span></div>
              <div><strong>12</strong><span>Years Experience</span></div>
              <div><strong>4</strong><span>Countries Active</span></div>
              <div><strong>AUD 280M+</strong><span>In Sales</span></div>
            </div>
            <div className="about-actions">
              <Link to="/contact" className="btn btn-gold"><i className="fa-regular fa-calendar-check"></i> Book a Consultation</Link>
              <div className="socials">
                <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="section markets">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Coverage</span>
            <h2>Markets We Operate In</h2>
            <p>Local expertise, international standards</p>
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
    </div>
  );
}
