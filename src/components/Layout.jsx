import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  TicketIcon, 
  BookOpenIcon, 
  CogIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'agent', 'user'] },
    { name: 'Tickets', href: '/tickets', icon: TicketIcon, roles: ['admin', 'agent', 'user'] },
    { name: 'Knowledge Base', href: '/kb', icon: BookOpenIcon, roles: ['admin', 'agent'] },
    { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f9fafb'}}>
      {/* Mobile sidebar */}
      <div className={sidebarOpen ? 'mobile-sidebar-overlay' : 'mobile-sidebar-hidden'}>
        <div className="mobile-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        <div className="mobile-sidebar">
          <div className="sidebar-header">
            <h1 className="text-xl font-bold text-white">Wexa AI Intelligence</h1>
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn">
              <XMarkIcon style={{width: '24px', height: '24px'}} />
            </button>
          </div>
          <nav className="sidebar-nav">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon style={{width: '24px', height: '24px', marginRight: '12px'}} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="text-xl font-bold text-white">Wexa AI Intelligence</h1>
          </div>
          <nav className="sidebar-nav">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
              >
                <item.icon style={{width: '24px', height: '24px', marginRight: '12px'}} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <UserIcon style={{width: '32px', height: '32px', color: '#9ca3af'}} />
              <div className="user-details">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-sm text-gray-300" style={{textTransform: 'capitalize'}}>{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon style={{width: '24px', height: '24px'}} />
          </button>

          <div className="top-bar-content">
            <div className="flex flex-1"></div>
            <div className="user-section">
              <div className="user-divider" />
              <div className="user-info-top">
                <span className="text-sm text-gray-800">{user?.name}</span>
                <span className="user-role-badge" style={{textTransform: 'capitalize'}}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="container">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-auto py-4 border-t border-white/10">
          <div className="container text-center">
            <p className="text-xs opacity-50">
              Made with ❤️ by <span className="font-semibold">Shubham Silyan</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
