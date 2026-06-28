import React, { useState, useEffect } from 'react';
import { Play, Check, Loader2, ArrowRight } from 'lucide-react';

const LiveAnalysis = ({ params, setActivePage, setSelectedCaseId }) => {
  const [nodes, setNodes] = useState([
    { id: 'planner', label: 'Planner Agent', status: 'waiting', icon: '🧠', desc: 'Analyzing files & retrieving memory' },
    { id: 'pitchdeck', label: 'Pitch Deck Agent', status: 'waiting', icon: '💡', desc: 'Evaluating problem, solution & SaaS model' },
    { id: 'founder', label: 'Founder Agent', status: 'waiting', icon: '🕵️‍♂️', desc: 'Assessing prior exits & domain expertise' },
    { id: 'financial', label: 'Financial Agent', status: 'waiting', icon: '📊', desc: 'Analyzing cash burn & runway capacity' },
    { id: 'market', label: 'Market Agent', status: 'waiting', icon: '🌍', desc: 'Estimating TAM & competitor positioning' },
    { id: 'risk', label: 'Risk Agent', status: 'waiting', icon: '🚩', desc: 'Auditing red flags & operational risks' },
    { id: 'recommendation', label: 'Recommendation Agent', status: 'waiting', icon: '🎯', desc: 'Synthesizing final investment decision' }
  ]);

  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [finished, setFinished] = useState(false);

  const addLog = (text) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${text}`]);
  };

  useEffect(() => {
    const runWorkflow = async () => {
      addLog("Initializing CatalystAI pipeline...");
      addLog(`Target Case Name: "${params.startup_name}"`);
      addLog("Triggering backend graph execution...");

      try {
        const response = await fetch('http://127.0.0.1:8000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: params.case_id,
            startup_name: params.startup_name,
            industry: params.industry,
            startup_stage: params.startup_stage
          })
        });

        const data = await response.json();
        setResult(data);

        // Simulation script to visual steps matching the executed list
        const runOrder = ['planner', 'pitchdeck', 'founder', 'financial', 'market', 'risk', 'recommendation'];
        const activeAgents = data.agents_executed || [];
        
        // Match nodes list with executed/skipped ones
        const updatedNodes = nodes.map(n => {
          const mapping = {
            planner: 'planner_agent',
            pitchdeck: 'pitchdeck_agent',
            founder: 'founder_agent',
            financial: 'financial_agent',
            market: 'market_agent',
            risk: 'risk_agent',
            recommendation: 'recommendation_agent'
          };
          const wasExecuted = activeAgents.includes(mapping[n.id]);
          return { ...n, isSkipped: !wasExecuted && n.id !== 'planner' && n.id !== 'recommendation' };
        });

        setNodes(updatedNodes);

        for (let i = 0; i < runOrder.length; i++) {
          const nodeId = runOrder[i];
          const nodeIdx = updatedNodes.findIndex(n => n.id === nodeId);
          const isSkipped = updatedNodes[nodeIdx].isSkipped;

          if (isSkipped) {
            setNodes(prev => prev.map((n, idx) => idx === nodeIdx ? { ...n, status: 'skipped' } : n));
            addLog(`Planner skipped ${updatedNodes[nodeIdx].label} (missing context/documents).`);
            continue;
          }

          // Mark node running
          setNodes(prev => prev.map((n, idx) => idx === nodeIdx ? { ...n, status: 'running' } : n));
          addLog(`Executing ${updatedNodes[nodeIdx].label}...`);

          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800));

          // Mark node completed
          setNodes(prev => prev.map((n, idx) => idx === nodeIdx ? { ...n, status: 'completed' } : n));
          addLog(`${updatedNodes[nodeIdx].label} completed analysis successfully.`);
        }

        addLog("Recommendation synthesized successfully.");
        addLog(`Outcome: ${data.recommendation} (Confidence: ${data.confidence_score}%)`);
        setFinished(true);
      } catch (err) {
        addLog(`System Error: Graph execution failed. Details: ${err.message}`);
      }
    };

    runWorkflow();
  }, [params]);

  const openReport = () => {
    if (result && result.decision_id) {
      setSelectedCaseId(result.decision_id);
      setActivePage('decision-case');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
      
      {/* Left Column: Live Agent Stepper */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3>Live Agent Orchestration Pipeline</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '8px 0 24px' }}>
          LangGraph state-machine branching visualizer:
        </p>

        <div className="stepper-container">
          {nodes.map(node => (
            <div key={node.id} className="glass-panel stepper-node" style={{
              background: node.status === 'running' ? 'rgba(0, 240, 255, 0.03)' : 'rgba(255,255,255,0.01)',
              borderColor: node.status === 'running' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.05)',
              opacity: node.status === 'skipped' ? 0.4 : 1
            }}>
              <div className={`node-icon ${node.status}`}>
                {node.status === 'completed' ? <Check size={16} /> : 
                 node.status === 'running' ? <Loader2 size={16} className="animate-spin" /> : 
                 node.status === 'skipped' ? '✖' : node.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: node.status === 'running' ? '#00f0ff' : '#f1f3f9' }}>{node.label}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: node.status === 'completed' ? '#10b981' : node.status === 'running' ? '#00f0ff' : node.status === 'skipped' ? '#64748b' : '#64748b'
                  }}>
                    {node.status}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>{node.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Console Log Viewer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '400px'
        }}>
          <h3>Graph Live Logs</h3>
          
          <div style={{
            flex: 1,
            background: '#050608',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '6px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#a5f3fc',
            overflowY: 'auto',
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ lineHeight: '1.4' }}>{log}</div>
            ))}
          </div>
          
          {finished && (
            <button
              onClick={openReport}
              className="primary-btn"
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>View Due Diligence Report</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default LiveAnalysis;
