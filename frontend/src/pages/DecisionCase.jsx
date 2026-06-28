import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, FileText, CheckCircle2, AlertOctagon, HelpCircle, FileCheck, Check, CornerDownRight } from 'lucide-react';
import ConfidenceGauge from '../components/ConfidenceGauge';

const DecisionCase = ({ decisionId, setActivePage }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Approval form state
  const [reviewer, setReviewer] = useState('Jane Doe');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('APPROVED');
  const [submitting, setSubmitting] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/decision/${decisionId}`);
      const detail = await res.json();
      setData(detail);
      
      // If review already logged, pre-populate comments
      if (detail.human_review && detail.human_review.status !== 'PENDING_REVIEW') {
        setComments(detail.human_review.comments || '');
        setReviewer(detail.human_review.reviewer || 'Jane Doe');
        setStatus(detail.human_review.status || 'APPROVED');
      }
    } catch (err) {
      console.error("Error loading case details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (decisionId) {
      fetchDetails();
    }
  }, [decisionId]);

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decisionId,
          status: status,
          comments: comments,
          reviewer: reviewer
        })
      });
      const updated = await res.json();
      setData(updated);
      alert(`Decision updated: ${status}`);
    } catch (err) {
      console.error("Error submitting approval:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p style={{ color: '#00f0ff', fontSize: '16px' }}>Loading due diligence case details...</p>
      </div>
    );
  }

  if (!data) {
    return <p>Case details not found.</p>;
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'pipeline', label: 'Agent Pipeline' },
    { id: 'findings', label: 'Findings' },
    { id: 'dissent', label: 'Dissent Engine' },
    { id: 'evidence', label: 'Evidence Explorer' },
    { id: 'approval', label: 'Approval Form' }
  ];

  // Helper mappings
  const mapping = {
    planner_agent: 'Planner Agent',
    pitchdeck_agent: 'Pitch Deck Agent',
    founder_agent: 'Founder Agent',
    financial_agent: 'Financial Agent',
    market_agent: 'Market Agent',
    risk_agent: 'Risk Agent',
    recommendation_agent: 'Recommendation Agent'
  };

  return (
    <div>
      {/* Top Banner Summary */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, rgba(20, 24, 33, 0.8) 0%, rgba(20, 24, 33, 0.4) 100%)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '22px' }}>{data.startup_name}</h2>
            <span className={`status-badge ${data.recommendation.toLowerCase()}`}>{data.recommendation}</span>
            <span className={`status-badge ${data.human_review?.status === 'APPROVED' ? 'invest' : data.human_review?.status === 'REJECTED' ? 'pass' : 'pending'}`}>
              {(data.human_review?.status || 'PENDING REVIEW').replace('_', ' ')}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>Industry: {data.industry} | Stage: {data.startup_stage || 'Seed'}</p>
        </div>
        
        <ConfidenceGauge score={data.confidence_score} size={90} strokeWidth={8} />
      </div>

      {/* Tab Navigation */}
      <div className="tab-list">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>Executive Summary</h3>
              <p style={{ color: '#f1f3f9', lineHeight: '1.6', fontSize: '14px', whiteSpace: 'pre-line' }}>
                {data.summary || "No summary available."}
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <div>
                <h3 style={{ marginBottom: '12px', color: '#10b981', fontSize: '15px' }}>Next Best Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.next_best_actions?.map((act, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#f1f3f9' }}>
                      <ChevronRight size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '12px', color: '#ef4444', fontSize: '15px' }}>Missing Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.missing_information?.map((info, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#f1f3f9' }}>
                      <AlertOctagon size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                      <span>{info}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE TAB */}
        {activeTab === 'pipeline' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Dynamic Agent Orchestration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.keys(mapping).map(agentId => {
                const wasExecuted = data.agents_executed?.includes(agentId) || agentId === 'planner_agent' || agentId === 'recommendation_agent';
                return (
                  <div key={agentId} className="glass-panel" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderColor: 'rgba(255,255,255,0.05)',
                    opacity: wasExecuted ? 1 : 0.4
                  }}>
                    <div>
                      <span style={{ fontWeight: '600', fontSize: '14px', color: '#f1f3f9' }}>{mapping[agentId]}</span>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        {agentId === 'planner_agent' ? 'Analyzed inputs and routed workflow' : 
                         agentId === 'recommendation_agent' ? 'Synthesized outputs and mapped averages' : 
                         `Evaluated aspects of the uploaded case files`}
                      </p>
                    </div>
                    
                    <span className={`status-badge ${wasExecuted ? 'invest' : 'hold'}`}>
                      {wasExecuted ? 'Executed' : 'Skipped'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FINDINGS TAB */}
        {activeTab === 'findings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Founder Card */}
            {data.founder_analysis && (
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>Founder Analysis Score</h3>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00f0ff' }}>{data.founder_analysis.score}/100</span>
                </div>
                <p style={{ color: '#f1f3f9', fontSize: '13px', marginBottom: '12px' }}>{data.founder_analysis.summary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Strengths</span>
                    {data.founder_analysis.strengths?.map((st, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {st}</p>)}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Weaknesses</span>
                    {data.founder_analysis.weaknesses?.map((wk, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {wk}</p>)}
                  </div>
                </div>
              </div>
            )}

            {/* Financial Card */}
            {data.financial_analysis && (
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>Financial Analysis Score</h3>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#bd00ff' }}>{data.financial_analysis.score}/100</span>
                </div>
                <p style={{ color: '#f1f3f9', fontSize: '13px', marginBottom: '12px' }}>{data.financial_analysis.summary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Strengths</span>
                    {data.financial_analysis.strengths?.map((st, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {st}</p>)}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Weaknesses</span>
                    {data.financial_analysis.weaknesses?.map((wk, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {wk}</p>)}
                  </div>
                </div>
              </div>
            )}

            {/* Market Card */}
            {data.market_analysis && (
              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3>Market Analysis Score</h3>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#00f0ff' }}>{data.market_analysis.score}/100</span>
                </div>
                <p style={{ color: '#f1f3f9', fontSize: '13px', marginBottom: '12px' }}>{data.market_analysis.summary}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>Strengths</span>
                    {data.market_analysis.strengths?.map((st, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {st}</p>)}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Weaknesses</span>
                    {data.market_analysis.weaknesses?.map((wk, i) => <p key={i} style={{ fontSize: '12px', marginTop: '4px' }}>• {wk}</p>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DISSENT TAB */}
        {activeTab === 'dissent' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderColor: 'rgba(16, 185, 129, 0.15)', background: 'rgba(16, 185, 129, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                <h3>Why Invest</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.opportunities?.map((opp, idx) => (
                  <p key={idx} style={{ fontSize: '13px', color: '#f1f3f9', lineHeight: '1.4' }}>• {opp}</p>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderColor: 'rgba(239, 68, 68, 0.15)', background: 'rgba(239, 68, 68, 0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertOctagon size={18} style={{ color: '#ef4444' }} />
                <h3>Why NOT Invest (Dissent Engine)</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.risks?.map((risk, idx) => (
                  <p key={idx} style={{ fontSize: '13px', color: '#f1f3f9', lineHeight: '1.4' }}>• {risk}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Fact Citations Explorer</h3>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Claim Statement</th>
                    <th>Source Document</th>
                    <th>Extracted By</th>
                  </tr>
                </thead>
                <tbody>
                  {data.evidence?.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontSize: '13px', color: '#f1f3f9' }}>"{item.claim}"</td>
                      <td style={{ fontSize: '13px', fontWeight: '500', color: '#00f0ff' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FileText size={14} />
                          {item.source_document}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge pending" style={{ fontSize: '10px' }}>{item.agent}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPROVAL TAB */}
        {activeTab === 'approval' && (
          <div style={{ maxWidth: '640px' }}>
            <h3 style={{ marginBottom: '16px' }}>Submit Investment Decision Review</h3>
            
            <form onSubmit={handleApprovalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Reviewer Name</label>
                  <input
                    type="text"
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Your Decision</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="APPROVED">APPROVE INVESTMENT</option>
                    <option value="REJECTED">PASS / REJECT INVESTMENT</option>
                    <option value="NEEDS_REVIEW">REQUEST REVISION</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Comments & Feedback</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Record why this investment is being approved/rejected. (These comments populate the Memory Center for future evaluations)."
                  className="input-field"
                  rows={4}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  alignSelf: 'flex-start',
                  padding: '10px 20px',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Submitting...' : (
                  <>
                    <FileCheck size={16} />
                    <span>Save Decision Review</span>
                  </>
                )}
              </button>

            </form>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default DecisionCase;
