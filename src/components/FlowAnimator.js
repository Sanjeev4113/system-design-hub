// FlowAnimator.js - Overlay animation layer for simulation flows
import React from 'react';

export default function FlowAnimator({ edges, nodes, simulationResults, isSimulating }) {
  if (!isSimulating) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    >
      {edges.map(edge => {
        const src = nodes.find(n => n.id === edge.source);
        const tgt = nodes.find(n => n.id === edge.target);
        if (!src || !tgt) return null;

        const result = simulationResults?.[edge.source];
        if (!result || result.load === 0) return null;

        const x1 = src.x, y1 = src.y, x2 = tgt.x, y2 = tgt.y;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1, dy = y2 - y1;
        const cx = mx + (dy * 0.15);
        const cy = my - (dx * 0.15);
        const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

        const intensity = Math.min(result.load / 500, 1);
        const numParticles = Math.max(1, Math.floor(intensity * 3));
        const color = result.status === 'overloaded' ? '#ef4444' : '#3b82f6';
        const duration = 1.2 - intensity * 0.4;

        return Array.from({ length: numParticles }).map((_, i) => (
          <circle key={`${edge.id}-p-${i}`} r={2.5} fill={color} opacity={0.85}>
            <animateMotion
              dur={`${duration}s`}
              begin={`${(i / numParticles) * duration}s`}
              repeatCount="indefinite"
              path={path}
            />
          </circle>
        ));
      })}
    </svg>
  );
}