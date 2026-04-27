// SystemDesignPanel.js - Right panel showing insights and node details
import React, { useState } from 'react';
import { NODE_TYPES } from '../utils/simulationEngine';
import { getSystemInsights } from '../utils/systemInsights';

const STATUS_COLORS = {
  idle: '#3d6088',
  healthy: '#10b981',
  warning: '#f59e0b',
  overloaded: '#ef4444',
};

export default function SystemDesignPanel({ nodes, edges, simulationResults, selectedNodeId }) {
  const [tab, setTab] = useState('insights');

  const insights = getSystemInsights(nodes, edges, simulationResults);
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedResult = simulationResults?.[selectedNodeId];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #1e3a5f',
        marginBottom: 12,
      }}>
        {['insights', 'node'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '8px 0',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? '#3b82f6' : 'transparent'}`,
              color: tab === t ? '#f0f6ff' : '#3d6088',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: -1,
            }}
          >
            {t === 'node' ? 'Node Detail' : 'Insights'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.map((insight, i) => {
              const colors = {
                success: { c: '#10b981', bg: 'rgba(16,185,129,0.08)', b: 'rgba(16,185,129,0.2)' },
                warning: { c: '#f59e0b', bg: 'rgba(245,158,11,0.08)', b: 'rgba(245,158,11,0.2)' },
                error: { c: '#ef4444', bg: 'rgba(239,68,68,0.08)', b: 'rgba(239,68,68,0.2)' },
                info: { c: '#3b82f6', bg: 'rgba(59,130,246,0.08)', b: 'rgba(59,130,246,0.2)' },
              }[insight.type] || { c: '#7aa2c8', bg: 'transparent', b: '#1e3a5f' };

              const icons = { success: '✓', warning: '⚠', error: '✕', info: 'ℹ' };

              return (
                <div key={i} style={{
                  background: colors.bg,
                  border: `1px solid ${colors.b}`,
                  borderRadius: 8,
                  padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: colors.c, fontSize: 12, marginTop: 1, flexShrink: 0 }}>
                      {icons[insight.type]}
                    </span>
                    <div>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.c,
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: 3,
                      }}>
                        {insight.title}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: '#7aa2c8',
                        fontFamily: "'JetBrains Mono', monospace",
                        lineHeight: 1.5,
                      }}>
                        {insight.message}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load overview table */}
            {simulationResults && Object.keys(simulationResults).length > 0 && (
              <div style={{
                marginTop: 8,
                border: '1px solid #1e3a5f',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #1e3a5f',
                  fontSize: 10,
                  color: '#3d6088',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  Load Overview
                </div>
                {Object.values(simulationResults).map(r => {
                  const def = NODE_TYPES[r.type] || NODE_TYPES.API;
                  const statusColor = STATUS_COLORS[r.status] || '#3d6088';
                  return (
                    <div key={r.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #0f2040',
                      gap: 10,
                    }}>
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: def.color,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 11, color: '#7aa2c8', fontFamily: "'JetBrains Mono', monospace", flex: 1 }}>
                        {def.short}
                      </span>
                      <div style={{ flex: 2, height: 4, background: '#0a1628', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(r.utilization || 0, 100)}%`,
                          height: '100%',
                          background: statusColor,
                          borderRadius: 2,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: statusColor, fontFamily: "'JetBrains Mono', monospace", width: 36, textAlign: 'right' }}>
                        {Math.round(r.utilization || 0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'node' && (
          <div>
            {selectedNode ? (
              <NodeDetail node={selectedNode} result={selectedResult} />
            ) : (
              <div style={{
                textAlign: 'center',
                color: '#3d6088',
                fontSize: 11,
                padding: '32px 16px',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Click a node on the canvas<br />to see its details
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NodeDetail({ node, result }) {
  const def = NODE_TYPES[node.type] || NODE_TYPES.API;
  const statusColor = STATUS_COLORS[result?.status] || '#3d6088';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Node header */}
      <div style={{
        background: `${def.color}10`,
        border: `1px solid ${def.color}30`,
        borderRadius: 10,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${def.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}>
          {def.icon}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: def.color, fontFamily: "'Syne', sans-serif" }}>
            {def.label}
          </div>
          <div style={{ fontSize: 10, color: '#3d6088', fontFamily: "'JetBrains Mono', monospace" }}>
            {node.id.slice(0, 8)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 11, color: '#7aa2c8', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
        {def.description}
      </div>

      {/* Stats */}
      {result && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Stat label="Status" value={result.status?.toUpperCase()} color={statusColor} />
            <Stat label="Current Load" value={`${Math.round(result.load || 0)} req/s`} />
            <Stat label="Utilization" value={`${Math.round(result.utilization || 0)}%`} color={statusColor} />
            <Stat label="Max Capacity" value={`${def.maxLoad} req/s`} />
          </div>

          <div style={{ fontSize: 11, color: '#7aa2c8', lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", fontStyle: 'italic' }}>
            {result.explanation}
          </div>
        </>
      )}

      {!result && (
        <div style={{
          fontSize: 11,
          color: '#3d6088',
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: 'center',
          padding: '12px 0',
        }}>
          Run simulation to see live stats
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 10px',
      background: '#0a1628',
      borderRadius: 6,
    }}>
      <span style={{ fontSize: 10, color: '#3d6088', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color: color || '#f0f6ff', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}