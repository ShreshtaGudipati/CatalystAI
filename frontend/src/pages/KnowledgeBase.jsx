import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Calendar, Search } from 'lucide-react';
import { API_URL } from '../config';

const KnowledgeBase = () => {
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch(`${API_URL}/knowledge`);
        const data = await res.json();
        setDocs(data);
      } catch (err) {
        console.error("Error loading knowledge documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKnowledge();
  }, []);

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#00f0ff', fontSize: '16px' }}>Loading investment guidelines...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3>Regulatory Knowledge Base</h3>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
            Investment playbooks, checklist policies, and template guidelines loaded into the decision engine.
          </p>
        </div>
        
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '14px', color: '#64748b' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search playbooks..."
            className="input-field"
            style={{ paddingLeft: '44px' }}
          />
        </div>
      </div>

      {/* Docs Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', color: '#f1f3f9' }}>{doc.title}</h3>
              <span className="status-badge pending" style={{ fontSize: '11px' }}>
                {doc.category}
              </span>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
              {doc.content}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#64748b',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '8px',
              marginTop: '4px'
            }}>
              <Calendar size={12} />
              <span>Last Sync: {doc.updated_at}</span>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No policy playbooks matching search terms.</p>
        )}
      </div>
      
    </div>
  );
};

export default KnowledgeBase;
