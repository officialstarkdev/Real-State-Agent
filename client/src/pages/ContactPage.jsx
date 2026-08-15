import { useState, useEffect } from 'react';
import API from '../utils/api';
import RevealOnScroll from '../components/RevealOnScroll';

export default function ContactPage() {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

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
    } catch {}
    setSuccess(true);
    form.reset();
  };

  return (
    <div className="page-transition">
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>Tell us what you're looking for — we'll reply within one business day</p>
        </div>
      </div>

      <section className="section contact">
        <div className="container">
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
        </div>
      </section>
    </div>
  );
}
