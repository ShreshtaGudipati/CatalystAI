import React, { useState, useEffect } from 'react';
import { Database, Lightbulb, UserCheck, Calendar } from 'lucide-react';
import { API_URL } from '../config';

const MemoryCenter = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch(`${API_URL}/memory`);
        const data = await res.json();
        setMemories(data);
      } catch (err) {
        console.error("Error loading memories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#00f0ff', fontSize: '16px' }}>Loading memory timeline...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3>Shared Memory Center</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
          This page displays pattern-based lessons learned dynamically accumulated from previous human reviews. 
          The Planner Agent queries these memories before executing specialist nodes.
        </p>
      </div>

      {memories.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
          <Database size={40} style={{ marginBottom: '12px' }} />
          <p>Memory Center is currently empty. Complete a case review to register the first pattern lesson.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {memories.map((entry, idx) => (
            <div key={idx} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderLeft: '4px solid var(--accent-teal)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#00f0ff', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Industry: {entry.industry} | Stage: {entry.startup_stage}
                </span>
                <span className={`status-badge ${entry.human_decision === 'APPROVED' ? 'invest' : 'pass'}`}>
                  {entry.human_decision}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Lightbulb size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#f1f3f9' }}>Pattern Lesson Learned</p>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
                    "{entry.learning}"
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '24px',
                fontSize: '11px',
                color: '#64748b',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                paddingTop: '8px',
                marginTop: '4px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={12} />
                  Lesson Approved Post-Evaluation
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  {entry.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryCenter;
