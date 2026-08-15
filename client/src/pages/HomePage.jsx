import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import PropertyCard from '../components/PropertyCard';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
  Promise.all([
    API.get('/properties/featured'),
    API.get('/services'),
  ])
    .then(([pRes, sRes]) => {
      const propertiesData = Array.isArray(pRes.data)
        ? pRes.data
        : Array.isArray(pRes.data?.properties)
          ? pRes.data.properties
          : [];

      const servicesData = Array.isArray(sRes.data)
        ? sRes.data
        : Array.isArray(sRes.data?.services)
          ? sRes.data.services
          : [];

      setProperties(propertiesData);
      setServices(servicesData);
    })
    .catch((error) => {
      console.error('Failed to load homepage data:', error);
      setProperties([]);
      setServices([]);
    });
}, []);

  // Trigger reveal animations after data loads
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [properties, services]);

  return (
    <div className="page-transition">
      {/* HERO */}
      <section className="hero" id="home">
        <div className="container hero-inner">
          <span className="hero-kicker">International Luxury Real Estate</span>
          <h1>Find Your Next Home.<br /><em>Anywhere in the World.</em></h1>
          <p className="hero-sub">Luxury &amp; residential property specialist serving AU&nbsp;·&nbsp;US&nbsp;·&nbsp;UK&nbsp;·&nbsp;Gulf</p>
          <div className="hero-ctas">
            <Link to="/listings" className="btn btn-gold">View Listings <i className="fa-solid fa-arrow-right"></i></Link>
            <Link to="/contact" className="btn btn-outline-light">Book a Free Consultation</Link>
          </div>
          <div className="trust-row">
            <div className="trust-item"><span className="em">🏆</span> 7 Years Experience</div>
            <div className="trust-item"><span className="em">🌍</span> 4 Markets</div>
            <div className="trust-item"><span className="em">✅</span> 240+ Deals Closed</div>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* SEARCH BAR */}
      <div className="search-wrap">
        <div className="container">
          <SearchBar />
        </div>
      </div>

      {/* FEATURED LISTINGS */}
      <section className="section listings" id="listings">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Portfolio</span>
            <h2>Featured Properties</h2>
            <p>Hand-selected listings across our key markets</p>
          </div>
          <div className="grid-listings">
            {Array.isArray(properties) && properties.slice(0, 4).map((p, i) => (
              <PropertyCard key={p._id} property={p} index={i} />
            ))}
          </div>
          <div className="listings-more reveal">
            <Link to="/listings" className="btn btn-outline-navy">View All Listings <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section services" id="services">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Services</span>
            <h2>How We Help You</h2>
            <p>End-to-end representation across four international markets</p>
          </div>
          <div className="grid-services">
            {Array.isArray(services) && services.slice(0, 4).map((s, i) => (
              <div key={s._id} className={`svc reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : i === 3 ? 'd3' : ''}`}>
                <div className="svc-icon"><i className={`fa-solid ${s.icon}`}></i></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <Link className="svc-link" to="/services">{s.linkText || 'Learn More'} <i className="fa-solid fa-arrow-right-long"></i></Link>
              </div>
            ))}
          </div>
          <div className="listings-more reveal" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/services" className="btn btn-outline-navy">View All Services <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section className="section markets">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Coverage</span>
            <h2>Markets We Operate In</h2>
            <p>Local expertise, international standards — in four of the world's most dynamic property regions</p>
          </div>
          <div className="grid-markets">
            {[
              { flag: '🇦🇺', name: 'Australia', cities: 'Sydney · Melbourne · Gold Coast', insight: 'Lifestyle-driven demand with resilient long-term capital growth' },
              { flag: '🇺🇸', name: 'United States', cities: 'Miami · New York · Los Angeles', insight: 'Deep liquidity and strong appeal for international investors' },
              { flag: '🇬🇧', name: 'United Kingdom', cities: 'London · Manchester · Edinburgh', insight: 'Prime-central prestige plus high-yield regional cities' },
              { flag: '🌍', name: 'Gulf Region', cities: 'Dubai · Riyadh · Doha · Abu Dhabi', insight: 'Strong rental yields, tax-efficient and foreign buyer-friendly' },
            ].map((m, i) => (
              <div key={i} className={`market reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : i === 3 ? 'd3' : ''}`}>
                <span className="flag">{m.flag}</span>
                <h3>{m.name}</h3>
                <p className="cities">{m.cities}</p>
                <p className="insight"><i className="fa-solid fa-arrow-trend-up"></i> {m.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Process</span>
            <h2>Your Journey, Simplified</h2>
            <p>One clear path from first call to keys in hand — wherever in the world you're buying</p>
          </div>
          <div className="steps">
            {[
              { num: 1, emoji: '📞', title: 'Free Consultation', desc: 'Tell us your goals and budget' },
              { num: 2, emoji: '🔍', title: 'Property Matching', desc: 'We shortlist the best options for you' },
              { num: 3, emoji: '🏠', title: 'Viewings & Negotiation', desc: 'Virtual or in-person, we handle it all' },
              { num: 4, emoji: '✅', title: 'Keys in Hand', desc: 'Settlement, paperwork and beyond' },
            ].map((s, i) => (
              <div key={i} className={`step reveal ${i === 1 ? 'd1' : i === 2 ? 'd2' : i === 3 ? 'd3' : ''}`}>
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

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="container">
          <div className="section-head center reveal">
            <span className="eyebrow">Contact</span>
            <h2>Start the Conversation</h2>
            <p>Tell us what you're looking for — we'll reply within one business day</p>
          </div>
          <ContactSection />
        </div>
      </section>
    </div>
  );
}

function SearchBar() {
  const [status, setStatus] = useState('Buy');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const loc = e.target['s-loc'].value.trim() || 'all locations';
    const type = e.target['s-type'].value;
    const budget = e.target['s-budget'].value;
    setNote(`Searching ${type.toLowerCase()}s to ${status.toLowerCase()} in ${loc} · ${budget} — scroll down to view featured matches.`);
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <form className="search-card" onSubmit={handleSubmit} aria-label="Property search">
        <div className="field">
          <label htmlFor="s-loc">Location</label>
          <input type="text" id="s-loc" name="s-loc" placeholder="City, suburb or region" />
        </div>
        <div className="field">
          <label htmlFor="s-type">Property Type</label>
          <select id="s-type" name="s-type">
            <option>House</option><option>Apartment</option>
            <option>Villa</option><option>Commercial</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="s-budget">Budget Range</label>
          <select id="s-budget" name="s-budget">
            <option>Under $500K</option><option>$500K – $1M</option>
            <option>$1M – $3M</option><option>$3M – $10M</option><option>$10M+</option>
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <div className="toggle">
            <button type="button" className={status === 'Buy' ? 'active' : ''} onClick={() => setStatus('Buy')}>Buy</button>
            <button type="button" className={status === 'Rent' ? 'active' : ''} onClick={() => setStatus('Rent')}>Rent</button>
          </div>
        </div>
        <button type="submit" className="btn btn-gold"><i className="fa-solid fa-magnifying-glass"></i> Search</button>
      </form>
      {note && <p className="search-note show">{note}</p>}
    </>
  );
}

function ContactSection() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await API.post('/contacts', {
        name: form['c-name'].value,
        email: form['c-email'].value,
        phone: form['c-phone'].value,
        countryCode: form['c-code'].value,
        market: form['c-market'].value,
        message: form['c-msg'].value,
      });
      setSuccess(true);
      form.reset();
    } catch (err) {
      setSuccess(true); // Show success even if API not connected yet
    }
  };

  return (
    <div className="contact-grid">
      <form className="form-card reveal" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="c-name">Full Name</label>
            <input type="text" id="c-name" name="c-name" placeholder="Your full name" required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input type="email" id="c-email" name="c-email" placeholder="you@example.com" required />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="c-phone">Phone</label>
            <div className="phone-group">
              <select id="c-code" name="c-code" aria-label="Country code">
                <option>🇦🇺 +61</option><option>🇺🇸 +1</option>
                <option>🇬🇧 +44</option><option>🇦🇪 +971</option>
                <option>🇸🇦 +966</option><option>🇶🇦 +974</option>
              </select>
              <input type="tel" id="c-phone" name="c-phone" placeholder="400 000 000" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="c-market">Market of Interest</label>
            <select id="c-market" name="c-market">
              <option>Australia</option><option>United States</option>
              <option>United Kingdom</option><option>Gulf Region</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="c-msg">Message</label>
          <textarea id="c-msg" name="c-msg" placeholder="Tell us about your goals, budget and timeline…"></textarea>
        </div>
        <button type="submit" className="btn btn-gold"><i className="fa-regular fa-paper-plane"></i> Send Message</button>
        <div className={`form-success${success ? ' show' : ''}`}>
          <i className="fa-solid fa-circle-check"></i> Thank you — your message has been received. James will be in touch within one business day.
        </div>
      </form>
      <div className="contact-side">
        <div className="cinfo reveal d1">
          <div className="ci"><i className="fa-solid fa-phone"></i></div>
          <div>
            <h4>Phone</h4>
            <p><a href="tel:+61290000000">+61 2 9000 0000</a> (AU)<br /><a href="tel:+97140000000">+971 4 000 0000</a> (UAE)</p>
          </div>
        </div>
        <div className="cinfo reveal d2">
          <div className="ci"><i className="fa-regular fa-envelope"></i></div>
          <div>
            <h4>Email</h4>
            <p><a href="mailto:james@harringtonproperty.com">james@harringtonproperty.com</a></p>
          </div>
        </div>
        <div className="cinfo reveal d3">
          <div className="ci"><i className="fa-regular fa-clock"></i></div>
          <div>
            <h4>Office Hours</h4>
            <p>Mon–Fri 9am–6pm (AEST)<br />Sun–Thu 10am–7pm (GST)</p>
          </div>
        </div>
        <a href="#" className="btn btn-whatsapp reveal d3"><i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp</a>
        <a href="#" className="btn btn-gold reveal d4"><i className="fa-regular fa-calendar-check"></i> Book a 15-min Call</a>
      </div>
    </div>
  );
}
