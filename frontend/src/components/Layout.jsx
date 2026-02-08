import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Gift, Home, Users, Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../services/api';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((data) => setUnreadCount(data.unreadCount))
      .catch(() => {});

    const interval = setInterval(() => {
      getNotifications()
        .then((data) => setUnreadCount(data.unreadCount))
        .catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-inner container">
          <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
            <Gift size={24} />
            <span>Darceky</span>
          </div>

          <button className="mobile-menu-btn btn-ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
            <NavLink to="/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Home size={18} />
              <span>My Lists</span>
            </NavLink>
            <NavLink to="/shared" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Users size={18} />
              <span>Shared</span>
            </NavLink>
            <NavLink to="/notifications" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Bell size={18} />
              <span>Notifications</span>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </NavLink>
          </div>

          <div className={`navbar-right ${mobileMenuOpen ? 'open' : ''}`}>
            <span className="user-name">{user?.displayName || user?.username}</span>
            <button className="btn btn-ghost btn-icon" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <Outlet context={{ refreshNotifications: () => getNotifications().then(d => setUnreadCount(d.unreadCount)).catch(() => {}) }} />
        </div>
      </main>
    </div>
  );
}
