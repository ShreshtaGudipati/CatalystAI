import React from 'react';
import { Bell, User } from 'lucide-react';

const Navbar = ({ activePage }) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Executive Dashboard';
      case 'create': return 'New Decision Case';
      case 'live-analysis': return 'Live Agent Orchestration';
      case 'decision-case': return 'Due Diligence Report';
      case 'memory': return 'Memory Learning Center';
      case 'knowledge': return 'Regulatory Knowledge Base';
      case 'analytics': return 'Decision Analytics';
      case 'settings': return 'System Settings';
      default: return 'CatalystAI';
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      marginBottom: '32px'
    }}>
      <div>
        <h1 style={{ margin: 0 }}>{getPageTitle()}</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
          Venture Capital Due Diligence & Decision Intelligence Platform
        </p>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          cursor: 'pointer'
        }}>
          <Bell size={18} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f3f9' }}>Jane Doe</p>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Lead Partner</p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00f0ff'
          }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
