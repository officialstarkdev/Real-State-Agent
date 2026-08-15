import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-sub">Join Harrington Property Group</p>
        {error && <div className="auth-error"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="reg-name">Full Name</label>
            <input type="text" id="reg-name" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email</label>
            <input type="email" id="reg-email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="reg-password">Password</label>
            <input type="password" id="reg-password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="reg-phone">Phone (optional)</label>
            <input type="tel" id="reg-phone" name="phone" placeholder="+61 400 000 000" value={form.phone} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-gold" disabled={loading}>
            {loading ? 'Creating account...' : <><i className="fa-solid fa-user-plus"></i> Create Account</>}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
