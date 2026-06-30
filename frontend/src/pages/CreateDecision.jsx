import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Database, UserCheck, HelpCircle } from 'lucide-react';
import { API_URL } from '../config';

const CreateDecision = ({ setActivePage, setLiveAnalysisParams }) => {
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('Seed');

  // File slot states
  const [pitchDeck, setPitchDeck] = useState(null);
  const [resume, setResume] = useState(null);
  const [financial, setFinancial] = useState(null);
  const [market, setMarket] = useState(null);
  const [notes, setNotes] = useState(null);
  const [crm, setCrm] = useState(null);
  const [additional, setAdditional] = useState(null);
  
  const [uploading, setUploading] = useState(false);

  const fileSlots = [
    { id: 'pitch', label: 'Pitch Deck', required: true, desc: 'Used by: Planner Agent + Pitch Deck Agent', state: pitchDeck, setState: setPitchDeck },
    { id: 'resume', label: 'Founder Resume', required: true, desc: 'Used by: Founder Agent', state: resume, setState: setResume },
    { id: 'financial', label: 'Financial Projection', required: true, desc: 'Used by: Financial Agent', state: financial, setState: setFinancial },
    { id: 'market', label: 'Market Research', required: true, desc: 'Used by: Market Agent', state: market, setState: setMarket },
    
    { id: 'notes', label: 'Meeting Notes', required: false, desc: 'Used by: Risk Agent + Recommendation Agent', state: notes, setState: setNotes },
    { id: 'crm', label: 'Emails / CRM History', required: false, desc: 'Used by: Memory Manager', state: crm, setState: setCrm },
    { id: 'additional', label: 'Additional Documents', required: false, desc: 'Used by: Risk Agent', state: additional, setState: setAdditional }
  ];

  const handleFileSlotChange = (e, setState) => {
    if (e.target.files && e.target.files[0]) {
      setState(e.target.files[0]);
    }
  };

  const clearSlot = (setState) => {
    setState(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let caseId = null;

      // Filter all attached files
      const attachedFiles = fileSlots
        .filter(slot => slot.state !== null)
        .map(slot => slot.state);

      if (attachedFiles.length > 0) {
        const formData = new FormData();
        attachedFiles.forEach(file => {
          formData.append('files', file);
        });

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        caseId = uploadData.case_id;
      }

      setLiveAnalysisParams({
        case_id: caseId,
        startup_name: startupName,
        industry: industry,
        startup_stage: stage
      });

      setActivePage('live-analysis');
    } catch (err) {
      console.error("Error setting up case run:", err);
      alert("Failed to initiate case. Check if backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: 'bold' }}>Setup Due Diligence Evaluation</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Startup Name</label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="e.g. AetherHealth AI"
                className="input-field"
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Startup Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Healthcare AI"
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="input-field"
              >
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Required Documents
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {fileSlots.filter(s => s.required).map(slot => (
                <div key={slot.id} className="glass-panel" style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: slot.state ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255,255,255,0.01)',
                  borderColor: slot.state ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f3f9' }}>{slot.label} (Required)</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{slot.desc}</span>
                    {slot.state && (
                      <span style={{ fontSize: '12px', color: '#00f0ff', marginTop: '4px', fontWeight: '500' }}>✓ {slot.state.name}</span>
                    )}
                  </div>
                  
                  {slot.state ? (
                    <button
                      type="button"
                      onClick={() => clearSlot(slot.setState)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Clear
                    </button>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <button type="button" className="primary-btn" style={{ padding: '8px 16px', fontSize: '12px' }}>
                        Upload
                      </button>
                      <input
                        type="file"
                        onChange={(e) => handleFileSlotChange(e, slot.setState)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '14px', color: '#bd00ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Optional Documents
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {fileSlots.filter(s => !s.required).map(slot => (
                <div key={slot.id} className="glass-panel" style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: slot.state ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255,255,255,0.01)',
                  borderColor: slot.state ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#f1f3f9' }}>{slot.label}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{slot.desc}</span>
                    {slot.state && (
                      <span style={{ fontSize: '12px', color: '#00f0ff', marginTop: '4px', fontWeight: '500' }}>✓ {slot.state.name}</span>
                    )}
                  </div>
                  
                  {slot.state ? (
                    <button
                      type="button"
                      onClick={() => clearSlot(slot.setState)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Clear
                    </button>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <button type="button" className="primary-btn" style={{ padding: '8px 16px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: '#f1f3f9', border: '1px solid rgba(255,255,255,0.1)' }}>
                        Upload
                      </button>
                      <input
                        type="file"
                        onChange={(e) => handleFileSlotChange(e, slot.setState)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Upload Status Dashboard checklist */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>Upload Status Checklist</h4>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {fileSlots.filter(s => s.required).map(slot => (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  {slot.state ? (
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <XCircle size={16} style={{ color: '#ef4444' }} />
                  )}
                  <span style={{ color: slot.state ? '#f1f3f9' : '#64748b' }}>{slot.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="primary-btn"
            disabled={uploading}
            style={{
              padding: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: uploading ? 0.7 : 1
            }}
          >
            <span>{uploading ? 'Processing Case Files...' : 'Run AI Orchestration'}</span>
            <ArrowRight size={18} />
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateDecision;
