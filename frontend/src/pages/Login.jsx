import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('lead.partner@xlventures.com');
  const [password, setPassword] = useState('password');

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      handleLogin();
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #181d29 0%, #0a0b0d 100%)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '420px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #bd00ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0a0b0d'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>CatalystAI Portal</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
            Sign in to access XL Ventures investment due diligence platform
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="name@company.com"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#94a3b8' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#00f0ff' }} />
              <span>Remember me</span>
            </label>
            <a href="#forgot" style={{ color: '#00f0ff', textDecoration: 'none' }}>Forgot password?</a>
          </div>

          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '8px' }}>
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
