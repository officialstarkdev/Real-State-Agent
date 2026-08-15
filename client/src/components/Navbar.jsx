import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const navClass = `nav${scrolled || !isHome ? ' scrolled' : ''}`;

  return (
    <>
      <header className={navClass} id="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand" aria-label="Harrington Property Group — home">
            <span className="brand-name">Harrington <span>Property Group</span></span>
            <span className="brand-rule"></span>
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/listings" className={location.pathname === '/listings' ? 'active' : ''}>Listings</Link>
            <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
            <Link to="/testimonials" className={location.pathname === '/testimonials' ? 'active' : ''}>Testimonials</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </nav>
          {user ? (
            <div className="nav-user-info">
              <span>{user.name}</span>
              {isAdmin && <Link to="/admin" className="btn btn-gold nav-cta" style={{padding:'9px 18px',fontSize:'.78rem'}}>Admin</Link>}
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-gold nav-cta">Sign Up</Link>
            </div>
          )}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            {isAdmin && <Link to="/admin">Admin Panel</Link>}
            <button className="btn btn-gold" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-gold">Sign Up</Link>
          </>
        )}
      </div>
    </>
  );
}
