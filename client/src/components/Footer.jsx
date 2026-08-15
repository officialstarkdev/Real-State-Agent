import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand">
              <span className="brand-name">Harrington <span>Property Group</span></span>
              <span className="brand-rule"></span>
            </Link>
            <p className="footer-about">Luxury &amp; residential property representation across Australia, the United States, the United Kingdom and the Gulf region.</p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/listings">Listings</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About James</Link></li>
              <li><Link to="/testimonials">Testimonials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Our Markets</h4>
            <ul>
              <li><Link to="/listings?market=Australia">Australia</Link></li>
              <li><Link to="/listings?market=United States">United States</Link></li>
              <li><Link to="/listings?market=United Kingdom">United Kingdom</Link></li>
              <li><Link to="/listings?market=Gulf">Gulf Region</Link></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Licence Information</a></li>
              <li><a href="#">Complaints Procedure</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bar">
          <span>© 2026 Harrington Property Group · <a href="#">Privacy Policy</a> · All Rights Reserved</span>
          <span>AU · US · UK · Gulf</span>
        </div>
      </div>
    </footer>
  );
}
