import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: '/admin/properties', label: 'Properties', icon: 'fa-building' },
    { path: '/admin/services', label: 'Services', icon: 'fa-house-chimney' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: 'fa-comments' },
    { path: '/admin/contacts', label: 'Contacts', icon: 'fa-envelope' },
    { path: '/admin/enquiries', label: 'Enquiries', icon: 'fa-paper-plane' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ marginTop: '24px' }}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </a>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
