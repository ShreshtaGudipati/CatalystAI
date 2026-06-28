import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateDecision from './pages/CreateDecision';
import LiveAnalysis from './pages/LiveAnalysis';
import DecisionCase from './pages/DecisionCase';
import MemoryCenter from './pages/MemoryCenter';
import KnowledgeBase from './pages/KnowledgeBase';
import Analytics from './pages/Analytics';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  
  // Params to trigger live analysis
  const [liveAnalysisParams, setLiveAnalysisParams] = useState(null);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  if (!isLoggedIn) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        handleLogout={handleLogout} 
      />
      
      <div className="main-content">
        <Navbar activePage={activePage} />
        
        {activePage === 'dashboard' && (
          <Dashboard 
            setActivePage={setActivePage} 
            setSelectedCaseId={setSelectedCaseId} 
          />
        )}
        
        {activePage === 'create' && (
          <CreateDecision 
            setActivePage={setActivePage} 
            setLiveAnalysisParams={setLiveAnalysisParams} 
          />
        )}
        
        {activePage === 'live-analysis' && (
          <LiveAnalysis 
            params={liveAnalysisParams} 
            setActivePage={setActivePage} 
            setSelectedCaseId={setSelectedCaseId} 
          />
        )}
        
        {activePage === 'decision-case' && (
          <DecisionCase 
            decisionId={selectedCaseId} 
            setActivePage={setActivePage} 
          />
        )}
        
        {activePage === 'memory' && (
          <MemoryCenter />
        )}
        
        {activePage === 'knowledge' && (
          <KnowledgeBase />
        )}
        
        {activePage === 'analytics' && (
          <Analytics />
        )}
        
        {activePage === 'settings' && (
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3>System Settings</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
              Configure models, backend endpoints, and workspace preferences.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>API Server Endpoint</label>
                <input type="text" defaultValue="http://127.0.0.1:8000" className="input-field" disabled />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>Reasoning Model</label>
                <input type="text" defaultValue="gemini-2.5-flash (dynamic fallback)" className="input-field" disabled />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
