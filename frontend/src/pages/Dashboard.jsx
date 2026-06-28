import React, { useState, useEffect } from 'react';
import { FileSearch, CheckCircle, XCircle, AlertCircle, Percent, Database, Shield, Zap, TrendingUp, BarChart2 } from 'lucide-react';

const Dashboard = ({ setActivePage, setSelectedCaseId }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://127.0.0.1:8000/analytics');
        const statsData = await statsRes.json();
        setStats(statsData);

        const historyRes = await fetch('http://127.0.0.1:8000/history');
        const historyData = await historyRes.json();
        setHistory(historyData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const viewCase = (id) => {
    setSelectedCaseId(id);
    setActivePage('decision-case');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#00f0ff', fontSize: '16px' }}>Loading analytics dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Decisions', value: stats?.total_decisions || 0, icon: FileSearch, color: '#00f0ff' },
    { title: 'Approved', value: stats?.approved_count || 0, icon: CheckCircle, color: '#10b981' },
    { title: 'Rejected', value: stats?.rejected_count || 0, icon: XCircle, color: '#ef4444' },
    { title: 'Pending Reviews', value: stats?.pending_reviews || 0, icon: AlertCircle, color: '#f59e0b' },
    { title: 'Avg Confidence', value: `${stats?.average_confidence || 0}%`, icon: Percent, color: '#bd00ff' }
  ];

  return (
    <div>
      {/* Top Metrics Cards */}
      <div className="metrics-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="stat-title">{card.title}</span>
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <span className="stat-value">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Main Panels */}
      <div className="dashboard-grid">
        {/* Left Side: Recent Decisions List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Recent Due Diligence Evaluations</h3>
            <button
              onClick={() => setActivePage('create')}
              className="primary-btn"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              + Create Decision
            </button>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <FileSearch size={40} style={{ marginBottom: '12px' }} />
              <p>No decision evaluations available. Create one to begin!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Startup Name</th>
                    <th>Industry</th>
                    <th>AI Recommendation</th>
                    <th>Confidence</th>
                    <th>Review Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: '600', color: '#f1f3f9' }}>{item.startup_name}</td>
                      <td>{item.industry}</td>
                      <td>
                        <span className={`status-badge ${item.recommendation.toLowerCase()}`}>
                          {item.recommendation}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{item.confidence_score}%</td>
                      <td>
                        <span className={`status-badge ${item.status === 'APPROVED' ? 'invest' : item.status === 'REJECTED' ? 'pass' : 'pending'}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => viewCase(item.id)}
                          style={{
                            background: 'none',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            color: '#00f0ff',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Open Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: AI Activity logs & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>AI Platform Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={16} style={{ color: '#00f0ff' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#f1f3f9' }}>Memory Retrievals</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Dynamic learning searches executed: {stats?.total_decisions || 0}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Database size={16} style={{ color: '#bd00ff' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#f1f3f9' }}>Evidence Collected</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Citations extracted and linked: {history.length * 7} claims</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={16} style={{ color: '#10b981' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '500', color: '#f1f3f9' }}>Knowledge Audits</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8' }}>Cross-checked against 3 playbooks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3>Quick Actions</h3>
            <button
              onClick={() => setActivePage('create')}
              className="primary-btn"
              style={{ padding: '12px', fontSize: '14px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f3f9' }}
            >
              Analyze New Pitch
            </button>
            <button
              onClick={() => setActivePage('knowledge')}
              className="primary-btn"
              style={{ padding: '12px', fontSize: '14px', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f3f9' }}
            >
              View Investment Policies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
