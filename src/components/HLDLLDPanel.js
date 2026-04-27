// HLDLLDPanel.js - High-Level and Low-Level design view
import React, { useState } from 'react';
import { getHLDDescription, getLLDDescription } from '../utils/systemInsights';

export default function HLDLLDPanel({ nodes, edges, isOpen, onClose }) {
  const [view, setView] = useState('hld');

  if (!isOpen) return null;

  const content = view === 'hld'
    ? getHLDDescription(nodes, edges)
    : getLLDDescription(nodes, edges);

  // Parse simple markdown-ish content
  const lines = content.split('\n').filter(Boolean);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2,6,23,0.85)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#0d1b2e',
        border: '1px solid #1e3a5f',
        borderRadius: 16,
        padding: 28,
        maxWidth: 540,
        width: '90%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f6ff' }}>
            Architecture View
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#3d6088', fontSize: 20, cursor: 'pointer' }}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#0a1628', borderRadius: 8, padding: 4 }}>
          {['hld', 'lld'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                flex: 1,
                padding: '7px 0',
                background: view === v ? '#162340' : 'none',
                border: view === v ? '1px solid #1e3a5f' : '1px solid transparent',
                borderRadius: 6,
                color: view === v ? '#f0f6ff' : '#3d6088',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: view === v ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {v === 'hld' ? 'High-Level Design' : 'Low-Level Design'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {lines.map((line, i) => {
            const isBold = line.startsWith('**') && line.endsWith('**');
            const isArrow = line.startsWith('→');
            const isBullet = line.startsWith('  •');

            return (
              <div key={i} style={{
                padding: isBold ? '12px 0 4px' : '3px 0',
                fontSize: 12,
                color: isBold ? '#f0f6ff' : isArrow ? '#7aa2c8' : '#5d8aaa',
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1.7,
                fontWeight: isBold ? 700 : 400,
                paddingLeft: isBullet ? 16 : 0,
              }}>
                {line.replace(/\*\*/g, '')}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            padding: '10px 0',
            background: '#162340',
            border: '1px solid #1e3a5f',
            borderRadius: 8,
            color: '#7aa2c8',
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}