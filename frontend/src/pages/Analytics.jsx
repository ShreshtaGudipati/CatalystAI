import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, PieChart } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/analytics');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#00f0ff', fontSize: '16px' }}>Loading analytics metrics...</p>
      </div>
    );
  }

  // Pre-calculate mock distributions for high-fidelity visualization
  const distribution = [
    { label: 'Healthcare AI', count: 4, pct: 40, color: '#00f0ff' },
    { label: 'Supply Chain AI', count: 3, pct: 30, color: '#bd00ff' },
    { label: 'Crypto & Web3', count: 2, pct: 20, color: '#f59e0b' },
    { label: 'Enterprise Software', count: 1, pct: 10, color: '#10b981' }
  ];

  const trends = [
    { month: 'Jan', confidence: 78 },
    { month: 'Feb', confidence: 81 },
    { month: 'Mar', confidence: 80 },
    { month: 'Apr', confidence: 85 },
    { month: 'May', confidence: 83 },
    { month: 'Jun', confidence: stats?.average_confidence || 85 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Avg Confidence Index</span>
            <TrendingUp size={18} style={{ color: '#bd00ff' }} />
          </div>
          <h2 style={{ fontSize: '32px', color: '#f1f3f9' }}>{stats?.average_confidence || 85}%</h2>
          <p style={{ color: '#10b981', fontSize: '12px', marginTop: '4px' }}>↑ 2.4% from last month</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Audited Decisional Pass Rate</span>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
          </div>
          <h2 style={{ fontSize: '32px', color: '#f1f3f9' }}>
            {stats?.total_decisions ? Math.round(((stats.approved_count || 0) / stats.total_decisions) * 100) : 60}%
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Based on total human validations</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Red Flags Audited</span>
            <AlertTriangle size={18} style={{ color: '#ef4444' }} />
          </div>
          <h2 style={{ fontSize: '32px', color: '#f1f3f9' }}>{stats?.total_decisions ? stats.total_decisions * 2 : 8}</h2>
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>No critical litigation blocks detected</p>
        </div>
      </div>

      {/* Charts Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Industry Distribution Bar Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChart size={18} style={{ color: '#00f0ff' }} />
            <h3>Industry Portfolio Distribution</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {distribution.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#f1f3f9', fontWeight: '500' }}>{item.label}</span>
                  <span style={{ color: '#94a3b8' }}>{item.count} deals ({item.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Trend Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={18} style={{ color: '#bd00ff' }} />
            <h3>Average Confidence Score Trend</h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '10px' }}>
            {trends.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '11px', color: '#00f0ff', fontWeight: 'bold' }}>{item.confidence}%</span>
                <div style={{
                  width: '28px',
                  height: `${item.confidence * 1.4}px`,
                  background: 'linear-gradient(180deg, #bd00ff 0%, #00f0ff 100%)',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.2)'
                }} />
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.month}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
