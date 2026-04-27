// Edge.js - Animated SVG edge between nodes
import React, { memo } from 'react';
import { NODE_TYPES } from '../utils/simulationEngine';

const STATUS_COLORS = {
  healthy: '#10b981',
  warning: '#f59e0b',
  overloaded: '#ef4444',
};

const Edge = memo(function Edge({ edge, nodes, simulationResults, isSimulating, onDelete }) {
  const src = nodes.find(n => n.id === edge.source);
  const tgt = nodes.find(n => n.id === edge.target);
  if (!src || !tgt) return null;

  const x1 = src.x, y1 = src.y;
  const x2 = tgt.x, y2 = tgt.y;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const cx = mx + dy * 0.18;
  const cy = my - dx * 0.18;
  const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  const srcResult = simulationResults?.[edge.source];
  const isActive = isSimulating && srcResult && srcResult.load > 0;
  const srcDef = NODE_TYPES[src.type] || NODE_TYPES.API;

  const edgeColor = isActive
    ? (STATUS_COLORS[srcResult?.status] || srcDef.color)
    : '#1e3a5f';

  const intensity = isActive ? Math.min(srcResult.load / 500, 1) : 0;
  const strokeWidth = isActive ? 1.5 + intensity : 1;
  const particleCount = isActive ? Math.max(1, Math.floor(intensity * 4)) : 0;
  const dur = Math.max(0.6, 1.5 - intensity * 0.8);

  const edgeId = edge.id || `${edge.source}-${edge.target}`;

  return (
    <g>
      <defs>
        <marker id={`arr-${edgeId}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon
            points="0 0, 7 3.5, 0 7"
            fill={edgeColor}
            opacity={isActive ? 0.9 : 0.35}
          />
        </marker>
        {isActive && (
          <filter id={`glow-${edgeId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        )}
      </defs>

      {/* Glow layer */}
      {isActive && (
        <path
          d={path}
          fill="none"
          stroke={edgeColor}
          strokeWidth={strokeWidth + 4}
          strokeOpacity={0.1}
          strokeLinecap="round"
        />
      )}

      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={edgeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={isActive ? 0.85 : 0.3}
        strokeLinecap="round"
        strokeDasharray={isActive ? "8 5" : "none"}
        style={{
          animation: isActive ? `edgeFlow ${dur}s linear infinite` : 'none',
        }}
        markerEnd={`url(#arr-${edgeId})`}
      />

      {/* Invisible wide path for hover/click */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        style={{ cursor: 'pointer' }}
        onClick={() => onDelete && onDelete(edgeId)}
        title="Click to delete edge"
      />

      {/* Flow particles */}
      {isActive && Array.from({ length: particleCount }).map((_, i) => (
        <circle
          key={`p-${edgeId}-${i}`}
          r={2.5}
          fill={edgeColor}
          opacity={0.9}
          filter={`url(#glow-${edgeId})`}
        >
          <animateMotion
            dur={`${dur}s`}
            begin={`${(i / particleCount) * dur}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ))}

      {/* Connection dots */}
      <circle cx={x1} cy={y1} r={3.5} fill={edgeColor} opacity={isActive ? 0.7 : 0.2} />
      <circle cx={x2} cy={y2} r={3.5} fill={edgeColor} opacity={isActive ? 0.7 : 0.2} />
    </g>
  );
});

export default Edge;