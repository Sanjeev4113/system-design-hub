// SuggestionsPanel.js
import React from 'react';

const PRIORITY_STYLES = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  high: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  medium: { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  info: { color: '#7aa2c8', bg: 'rgba(122,162,200,0.08)', border: 'rgba(122,162,200,0.2)' },
};

export default function SuggestionsPanel({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{
          textAlign: 'center',
          color: '#3d6088',
          fontSize: 12,
          padding: '24px 16px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{ fontSize: 20, marginBottom: 8 }}>✓</div>
          No suggestions — system looks good.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
      {suggestions.map(s => {
        const style = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.info;
        return (
          <div
            key={s.id}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 8,
              padding: '10px 12px',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: style.color,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.03em',
              }}>
                {s.title}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 9,
                color: style.color,
                background: `${style.color}15`,
                padding: '1px 6px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {s.priority}
              </span>
            </div>
            <p style={{
              fontSize: 11,
              color: '#7aa2c8',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {s.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}