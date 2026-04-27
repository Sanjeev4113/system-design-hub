// ProactiveAI.js - Toast-style proactive suggestions
import React, { useState, useEffect } from 'react';

const TIPS = [
  { id: 1, icon: '⚡', message: 'Add a Cache between API and DB to reduce read load by 70%' },
  { id: 2, icon: '⚖', message: 'A Load Balancer distributes traffic across multiple API servers' },
  { id: 3, icon: '🔗', message: 'Click a node to select it, then click another to connect them' },
  { id: 4, icon: '🏃', message: 'Run the simulation to see how traffic flows through your system' },
  { id: 5, icon: '🎤', message: 'Use voice commands: "add API", "add database", "run simulation"' },
];

export default function ProactiveAI({ simulationResults, nodes }) {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length === 0) {
        setTip(TIPS[0]);
        setVisible(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!simulationResults) return;
    const overloaded = Object.values(simulationResults).filter(r => r.status === 'overloaded');
    if (overloaded.length > 0) {
      const r = overloaded[0];
      let msg = '';
      if (r.type === 'DB') msg = 'DB is overloaded! Add a Cache node to reduce pressure.';
      else if (r.type === 'API') msg = 'API overloaded! Add a Load Balancer to distribute requests.';
      else msg = `${r.type} is overloaded! Consider scaling horizontally.`;

      setTip({ id: 'sim', icon: '⚠', message: msg });
      setVisible(true);

      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    }
  }, [simulationResults]);

  if (!visible || !tip) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        animation: 'slideUp 0.3s ease',
        maxWidth: 420,
        width: '90%',
      }}
    >
      <div style={{
        background: '#0d1b2e',
        border: '1px solid #1e3a5f',
        borderRadius: 10,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{tip.icon}</span>
        <span style={{
          flex: 1,
          fontSize: 12,
          color: '#7aa2c8',
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.5,
        }}>
          <span style={{ color: '#3b82f6', fontWeight: 600 }}>AI tip: </span>
          {tip.message}
        </span>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#3d6088',
            fontSize: 16,
            cursor: 'pointer',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}