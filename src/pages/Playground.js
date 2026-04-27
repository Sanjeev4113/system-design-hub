// Playground.js — Full system design playground with FIXED drag + connect
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Node from '../components/Node';
import Edge from '../components/Edge';
import Chatbot from '../components/Chatbot';
import VoiceAssistant from '../components/VoiceAssistant';
import LearningMode from '../components/LearningMode';
import HLDLLDPanel from '../components/HLDLLDPanel';
import ProactiveAI from '../components/ProactiveAI';
import SuggestionsPanel from '../components/SuggestionsPanel';
import SystemDesignPanel from '../components/SystemDesignPanel';
import { NODE_TYPES, runSimulation, generateSuggestions } from '../utils/simulationEngine';

const TRAFFIC_PRESETS = [
  { label: '1K/s', value: 1000 },
  { label: '5K/s', value: 5000 },
  { label: '10K/s', value: 10000 },
  { label: '50K/s', value: 50000 },
];

export default function Playground() {
  const navigate = useNavigate();
  const { challengeId } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);  // highlighted node
  const [connectingFrom, setConnectingFrom] = useState(null);   // source for edge creation
  const [trafficLoad, setTrafficLoad] = useState(1000);
  const [customTraffic, setCustomTraffic] = useState('1000');
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showLearning, setShowLearning] = useState(false);
  const [showHLD, setShowHLD] = useState(false);
  const [rightTab, setRightTab] = useState('suggestions');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [toast, setToast] = useState(null);
  const simTimerRef = useRef(null);

  // ─── NODE OPERATIONS ────────────────────────────────────────────────────────

  const addNode = useCallback((type, x, y) => {
    const id = `${type.toLowerCase()}-${Date.now()}`;
    const offset = nodes.filter(n => n.type === type).length;
    const defaultPos = {
      LB:    { x: 200, y: 250 },
      API:   { x: 420, y: 180 + offset * 120 },
      CACHE: { x: 600, y: 150 },
      DB:    { x: 750, y: 280 + offset * 100 },
    };
    const pos = (x !== undefined && y !== undefined)
      ? { x, y }
      : defaultPos[type] || { x: 350 + offset * 50, y: 220 + offset * 50 };

    setNodes(prev => [...prev, { id, type, x: pos.x, y: pos.y }]);
    showToast(`Added ${NODE_TYPES[type]?.label || type}`);
  }, [nodes]);

  // THE FIX: onDragEnd receives (nodeId, x, y)
  const handleNodeDragEnd = useCallback((nodeId, x, y) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, x, y } : n));
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    if (connectingFrom === nodeId) setConnectingFrom(null);
  }, [selectedNodeId, connectingFrom]);

  // ─── EDGE OPERATIONS ────────────────────────────────────────────────────────

  const handleNodeClick = useCallback((nodeId) => {
    if (connectingFrom) {
      // We're in connect mode
      if (connectingFrom === nodeId) {
        // Clicked same node — cancel connect
        setConnectingFrom(null);
        setSelectedNodeId(null);
      } else {
        // Different node — create edge
        const exists = edges.some(e => e.source === connectingFrom && e.target === nodeId);
        if (!exists) {
          const edgeId = `e-${connectingFrom}-${nodeId}-${Date.now()}`;
          setEdges(prev => [...prev, { id: edgeId, source: connectingFrom, target: nodeId }]);
          showToast('Connection created');
        }
        setConnectingFrom(null);
        setSelectedNodeId(nodeId);
      }
    } else if (selectedNodeId === nodeId) {
      // Clicking selected node → enter connect mode
      setConnectingFrom(nodeId);
    } else {
      // Select the node
      setSelectedNodeId(nodeId);
      setConnectingFrom(null);
    }
  }, [connectingFrom, selectedNodeId, edges]);

  const deleteEdge = useCallback((edgeId) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
  }, []);

  // ─── CANVAS CLICK ────────────────────────────────────────────────────────────

  const handleCanvasClick = useCallback((e) => {
    // Only deselect if clicking the canvas itself (not a node)
    if (e.target.tagName === 'DIV' && e.target === e.currentTarget) {
      setSelectedNodeId(null);
      setConnectingFrom(null);
    }
  }, []);

  // ─── SIMULATION ──────────────────────────────────────────────────────────────

  const runSim = useCallback(() => {
    if (nodes.length === 0) return;
    clearTimeout(simTimerRef.current);
    const results = runSimulation(nodes, edges, trafficLoad);
    setSimulationResults(results);
    setSuggestions(generateSuggestions(results, nodes, edges));
    setIsSimulating(true);
    setRightTab('suggestions');
    showToast('Simulation running');
    simTimerRef.current = setTimeout(() => setIsSimulating(false), 9000);
  }, [nodes, edges, trafficLoad]);

  const stopSim = useCallback(() => {
    clearTimeout(simTimerRef.current);
    setIsSimulating(false);
  }, []);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSimulationResults(null);
    setSuggestions([]);
    setIsSimulating(false);
    setSelectedNodeId(null);
    setConnectingFrom(null);
  }, []);

  // ─── VOICE COMMANDS ───────────────────────────────────────────────────────────

  const handleVoiceCommand = useCallback((action) => {
    const typeMap = { add_lb: 'LB', add_api: 'API', add_cache: 'CACHE', add_db: 'DB' };
    if (typeMap[action]) {
      const x = 250 + Math.random() * 450;
      const y = 150 + Math.random() * 250;
      addNode(typeMap[action], x, y);
    } else if (action === 'run_simulation') runSim();
    else if (action === 'clear') clearCanvas();
  }, [addNode, runSim, clearCanvas]);

  // ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setConnectingFrom(null); setSelectedNodeId(null); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && e.target.tagName !== 'INPUT') deleteNode(selectedNodeId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId, deleteNode]);

  // ─── TOAST ────────────────────────────────────────────────────────────────────

  const toastTimer = useRef(null);
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  // ─── LAYOUT ───────────────────────────────────────────────────────────────────

  const criticalCount = suggestions.filter(s => s.priority === 'critical').length;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#020617', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace" }}>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        height: 54, flexShrink: 0, borderBottom: '1px solid #0f2040',
        background: '#020617', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 14, zIndex: 50,
      }}>
        {/* Left */}
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#3d6088', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'JetBrains Mono',monospace", flexShrink: 0 }}>
          ← Home
        </button>
        <div style={{ width: 1, height: 16, background: '#1e3a5f' }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.02em', flexShrink: 0 }}>
          ⚡ Playground
        </span>

        {/* Center actions */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginLeft: 4 }}>
          <HeaderBtn onClick={() => setShowLearning(true)}>📖 Learn</HeaderBtn>
          <HeaderBtn onClick={() => setShowHLD(true)}>HLD / LLD</HeaderBtn>
          {nodes.length > 0 && <HeaderBtn onClick={clearCanvas} danger>Clear</HeaderBtn>}
        </div>

        {/* Right: traffic + voice + run */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#3d6088', whiteSpace: 'nowrap' }}>Traffic:</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {TRAFFIC_PRESETS.map(p => (
              <button key={p.value} onClick={() => { setTrafficLoad(p.value); setCustomTraffic(String(p.value)); }} style={{
                background: trafficLoad === p.value ? 'rgba(59,130,246,0.18)' : 'none',
                border: `1px solid ${trafficLoad === p.value ? 'rgba(59,130,246,0.5)' : '#1e3a5f'}`,
                borderRadius: 5, color: trafficLoad === p.value ? '#60a5fa' : '#3d6088',
                fontSize: 10, padding: '4px 8px', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: "'JetBrains Mono',monospace",
              }}>{p.label}</button>
            ))}
          </div>
          <input
            value={customTraffic}
            onChange={e => { setCustomTraffic(e.target.value); const v = parseInt(e.target.value); if (!isNaN(v) && v > 0) setTrafficLoad(v); }}
            placeholder="custom"
            style={{ width: 72, background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 5, color: '#7aa2c8', fontSize: 10, padding: '4px 8px', outline: 'none', fontFamily: "'JetBrains Mono',monospace" }}
          />
          <VoiceAssistant onCommand={handleVoiceCommand} />
          <button onClick={isSimulating ? stopSim : runSim} disabled={nodes.length === 0} style={{
            padding: '8px 18px',
            background: nodes.length === 0 ? '#0a1628' : isSimulating ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            border: `1px solid ${nodes.length === 0 ? '#1e3a5f' : isSimulating ? '#ef4444' : '#3b82f6'}`,
            borderRadius: 7, color: nodes.length === 0 ? '#3d6088' : '#fff',
            fontSize: 12, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
            cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: nodes.length > 0 && !isSimulating ? '0 2px 14px rgba(59,130,246,0.35)' : 'none',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          }}>
            {isSimulating ? (
              <><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} /> Stop</>
            ) : (
              <><span style={{ fontSize: 10 }}>▶</span> Run</>
            )}
          </button>
        </div>
      </header>

      {/* ══════════ BODY ══════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

      {/* ─── LEFT TOOLBAR (COLLAPSIBLE) ─── */}
      {showLeftPanel && (
        <div style={{
          width: 140, flexShrink: 0, background: '#020617',
          borderRight: '1px solid #0f2040', display: 'flex', flexDirection: 'column',
          overflow: 'auto', boxShadow: '4px 0 16px rgba(0,0,0,0.3)',
        }}>
          <div style={{ padding: '12px 10px', borderBottom: '1px solid #0f2040', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: '#3d6088', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Components</div>
            <button onClick={() => setShowLeftPanel(false)} style={{
              background: 'none', border: 'none', color: '#3d6088', fontSize: 12, cursor: 'pointer', padding: '2px 4px', transition: 'color 0.2s'
            }} onMouseEnter={(e) => e.target.style.color = '#60a5fa'} onMouseLeave={(e) => e.target.style.color = '#3d6088'}>
              ✕
            </button>
          </div>
          
          <div style={{ padding: '12px 10px', overflow: 'auto', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(NODE_TYPES).map(([type, def]) => (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 6, padding: '12px 8px', background: '#0a1628', border: '1px solid #1e3a5f',
                    borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', color: '#7aa2c8',
                    fontSize: 11, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#0f1e35'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#0a1628'; e.currentTarget.style.borderColor = '#1e3a5f'; }}
                >
                  <span style={{ fontSize: 18 }}>{def.icon}</span>
                  {def.label}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #0f2040', padding: '10px', flexShrink: 0, display: 'flex', gap: 8, fontSize: 10, color: '#3d6088', fontFamily: "'JetBrains Mono',monospace" }}>
            <div style={{ flex: 1 }}>📦 {nodes.length} nodes</div>
            <div style={{ flex: 1 }}>🔗 {edges.length} edges</div>
          </div>
        </div>
      )}

      {/* Toggle button for left panel */}
      {!showLeftPanel && (
        <button onClick={() => setShowLeftPanel(true)} style={{
          position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: 44, height: 44, background: '#3b82f6', border: 'none',
          borderRadius: 8, color: '#fff', cursor: 'pointer', zIndex: 50,
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(59,130,246,0.3)', transition: 'all 0.2s',
          margin: 8,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        title="Show Components">
          ▶
        </button>
      )}

        {/* ─── CANVAS ─── */}
        <div
          onClick={handleCanvasClick}
          style={{
            flex: 1, position: 'relative', background: '#020617',
            overflow: 'hidden', cursor: connectingFrom ? 'crosshair' : 'default',
          }}
        >
          {/* Dot grid */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <pattern id="dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                <circle cx="18" cy="18" r="1" fill="#1e3a5f" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Edges SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
            <defs>
              <style>{`
                @keyframes edgeFlow { 0% { stroke-dashoffset: 28; } 100% { stroke-dashoffset: 0; } }
              `}</style>
            </defs>
            {edges.map(edge => (
              <Edge
                key={edge.id}
                edge={edge}
                nodes={nodes}
                simulationResults={simulationResults}
                isSimulating={isSimulating}
                onDelete={deleteEdge}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <Node
              key={node.id}
              node={node}
              simulationResult={simulationResults?.[node.id]}
              isSelected={selectedNodeId === node.id}
              isConnectionSource={connectingFrom === node.id}
              isConnecting={!!connectingFrom}
              onClick={handleNodeClick}
              onDragEnd={handleNodeDragEnd}
              onDelete={deleteNode}
            />
          ))}

          {/* Empty state */}
          {nodes.length === 0 && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 16 }}>
              <div style={{ fontSize: 48, opacity: 0.08 }}>⚡</div>
              <div style={{ textAlign: 'center', color: '#1e3a5f', fontSize: 13, lineHeight: 1.8, fontFamily: "'JetBrains Mono',monospace" }}>
                Add components from the left sidebar<br />
                <span style={{ fontSize: 11, color: '#142233' }}>Click a node to select · Click again to connect · Drag to move</span>
              </div>
            </div>
          )}

          {/* Connect mode banner */}
          {connectingFrom && (
            <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 24, padding: '7px 18px', fontSize: 11, color: '#fbbf24', pointerEvents: 'none', animation: 'fadeIn 0.2s ease', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace" }}>
              🔗 Click another node to connect — Esc to cancel
            </div>
          )}

          {/* Selection hint */}
          {selectedNodeId && !connectingFrom && (
            <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 24, padding: '10px 18px', fontSize: 11, color: '#60a5fa', pointerEvents: 'none', animation: 'fadeIn 0.2s ease', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace", boxShadow: '0 4px 12px rgba(59,130,246,0.2)' }}>
              🔵 Click again to connect · Press Delete to remove
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#0d1b2e', border: '1px solid #1e3a5f', borderRadius: 8, padding: '8px 16px', fontSize: 11, color: '#7aa2c8', pointerEvents: 'none', animation: 'slideUp 0.2s ease', whiteSpace: 'nowrap', fontFamily: "'JetBrains Mono',monospace" }}>
              {toast}
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL ─── */}
        {showRightPanel && (
        <div style={{ width: 280, flexShrink: 0, background: '#020617', borderLeft: '1px solid #0f2040', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 16px rgba(0,0,0,0.3)' }}>
          {/* Header with close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #0f2040', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[{ key: 'suggestions', label: 'Suggestions' }, { key: 'insights', label: 'Insights' }].map(tab => (
                <button key={tab.key} onClick={() => setRightTab(tab.key)} style={{
                  padding: '6px 10px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${rightTab === tab.key ? '#3b82f6' : 'transparent'}`,
                  color: rightTab === tab.key ? '#f0f6ff' : '#3d6088',
                  fontSize: 10, fontFamily: "'JetBrains Mono',monospace", cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: -10,
                  transition: 'all 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowRightPanel(false)} style={{
              background: 'none', border: 'none', color: '#3d6088', fontSize: 14, cursor: 'pointer', padding: '4px 6px', transition: 'color 0.2s'
            }} onMouseEnter={(e) => e.target.style.color = '#60a5fa'} onMouseLeave={(e) => e.target.style.color = '#3d6088'}>
              ✕
            </button>
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px 10px' }}>
            {rightTab === 'suggestions' ? (
              <SuggestionsPanel suggestions={suggestions} />
            ) : (
              <SystemDesignPanel
                nodes={nodes}
                edges={edges}
                simulationResults={simulationResults}
                selectedNodeId={selectedNodeId}
              />
            )}
          </div>

          {/* Sim status */}
          {isSimulating && (
            <div style={{ padding: '10px 12px', borderTop: '1px solid #0f2040', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: 10, color: '#10b981', fontFamily: "'JetBrains Mono',monospace" }}>Simulation live</span>
            </div>
          )}
        </div>
        )}

        {/* ─── PANEL TOGGLE BUTTON ─── */}
        {!showRightPanel && (
          <button onClick={() => setShowRightPanel(true)} style={{
            position: 'absolute', right: 12, bottom: 20, width: 44, height: 44,
            borderRadius: '50%', background: '#3b82f6', border: 'none',
            color: '#fff', fontSize: 18, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)', zIndex: 40,
            transition: 'all 0.2s', fontWeight: 700
          }} title="Open suggestions panel">
            ◀
          </button>
        )}
      </div>

      {/* ══════════ OVERLAYS ══════════ */}
      <LearningMode isOpen={showLearning} onClose={() => setShowLearning(false)} />
      <HLDLLDPanel isOpen={showHLD} onClose={() => setShowHLD(false)} nodes={nodes} edges={edges} />
      <Chatbot nodes={nodes} edges={edges} simulationResults={simulationResults} />
      <ProactiveAI simulationResults={simulationResults} nodes={nodes} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeaderBtn({ children, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? (danger ? 'rgba(239,68,68,0.1)' : '#0d1b2e') : 'none',
        border: `1px solid ${hov ? (danger ? 'rgba(239,68,68,0.3)' : '#1e3a5f') : 'transparent'}`,
        borderRadius: 6,
        color: danger ? (hov ? '#ef4444' : '#4d7aaa') : (hov ? '#f0f6ff' : '#5d8aaa'),
        fontSize: 11, padding: '6px 11px', cursor: 'pointer',
        fontFamily: "'JetBrains Mono',monospace", transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function ToolbarButton({ type, def, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Add ${def.label}`}
      style={{
        width: 44, height: 44, borderRadius: 9,
        background: hov ? `${def.color}14` : '#0d1b2e',
        border: `1px solid ${hov ? def.color + '50' : '#1e3a5f'}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2, cursor: 'pointer', transition: 'all 0.15s',
        transform: hov ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: 14 }}>{def.icon}</span>
      <span style={{ fontSize: 7, color: hov ? def.color : '#3d6088', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, letterSpacing: '0.04em' }}>{def.short}</span>
    </button>
  );
}

function CountBadge({ label, count }) {
  return (
    <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
      <div style={{ fontSize: 15, color: count > 0 ? '#4d7aaa' : '#1e3a5f', fontWeight: 700, fontFamily: "'Syne',sans-serif", transition: 'color 0.2s' }}>{count}</div>
      <div style={{ fontSize: 8, color: '#1e3a5f', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}