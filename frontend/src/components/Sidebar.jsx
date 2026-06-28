import React from 'react';
import { LayoutDashboard, FileText, Database, ShieldAlert, BarChart3, Settings, HelpCircle, LogOut } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create', label: 'Create Decision', icon: FileText },
    { id: 'memory', label: 'Memory Center', icon: Database },
    { id: 'knowledge', label: 'Knowledge Base', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #00f0ff 0%, #bd00ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#0a0b0d'
        }}>C</div>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em', color: '#f1f3f9' }}>CatalystAI</h2>
      </div>
      
      <div className="nav-menu" style={{ flex: 1 }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-link ${activePage === item.id || (item.id === 'create' && activePage === 'live-analysis') || (item.id === 'create' && activePage === 'decision-case') ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className="nav-menu" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
        <button
          onClick={() => setActivePage('settings')}
          className={`nav-link ${activePage === 'settings' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="nav-link"
          style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
