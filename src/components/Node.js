// Node.js — Fixed draggable canvas node. KEY FIX: onDragEnd now passes node.id
import React, { useRef, useCallback, useState } from 'react';
import { NODE_TYPES } from '../utils/simulationEngine';

const STATUS_COLORS = {
  idle: '#2d4a6b',
  healthy: '#10b981',
  warning: '#f59e0b',
  overloaded: '#ef4444',
};

const STATUS_BG = {
  idle: 'transparent',
  healthy: 'rgba(16,185,129,0.06)',
  warning: 'rgba(245,158,11,0.06)',
  overloaded: 'rgba(239,68,68,0.08)',
};

export default function Node({
  node,
  simulationResult,
  isSelected,
  isConnectionSource,
  isConnecting,
  onClick,
  onDragEnd,
  onDelete,
}) {
  const nodeRef = useRef(null);
  const dragState = useRef(null);
  const [localPos, setLocalPos] = useState(null);
  const [hovering, setHovering] = useState(false);

  const def = NODE_TYPES[node.type] || NODE_TYPES.API;
  const status = simulationResult?.status || 'idle';
  const statusColor = STATUS_COLORS[status];
  const utilization = Math.round(simulationResult?.utilization || 0);
  const load = Math.round(simulationResult?.load || 0);

  const displayX = localPos?.x ?? node.x;
  const displayY = localPos?.y ?? node.y;

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX: node.x,
      startNodeY: node.y,
      moved: false,
    };

    const onMouseMove = (e) => {
      const ds = dragState.current;
      if (!ds) return;
      const dx = e.clientX - ds.startMouseX;
      const dy = e.clientY - ds.startMouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        ds.moved = true;
        const newX = ds.startNodeX + dx;
        const newY = ds.startNodeY + dy;
        setLocalPos({ x: newX, y: newY });
      }
    };

    const onMouseUp = (e) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      const ds = dragState.current;
      if (!ds) return;

      if (ds.moved) {
        const dx = e.clientX - ds.startMouseX;
        const dy = e.clientY - ds.startMouseY;
        const finalX = ds.startNodeX + dx;
        const finalY = ds.startNodeY + dy;
        setLocalPos(null);
        // ✅ THE FIX: pass node.id as first arg
        onDragEnd(node.id, finalX, finalY);
      } else {
        setLocalPos(null);
        onClick(node.id);
      }
      dragState.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [node.id, node.x, node.y, onClick, onDragEnd]);

  const isHighlighted = isSelected || isConnectionSource;
  const borderColor = isConnectionSource
    ? '#f59e0b'
    : isSelected
      ? def.color
      : hovering
        ? `${def.color}80`
        : '#1e3a5f';

  const glowColor = isConnectionSource
    ? 'rgba(245,158,11,0.25)'
    : isSelected
      ? `${def.color}25`
      : status === 'overloaded'
        ? 'rgba(239,68,68,0.15)'
        : 'transparent';

  return (
    <div
      ref={nodeRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: 'absolute',
        left: displayX,
        top: displayY,
        transform: 'translate(-50%, -50%)',
        zIndex: isHighlighted ? 20 : hovering ? 15 : 5,
        cursor: isConnecting ? 'crosshair' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Outer glow ring */}
      {(isHighlighted || status === 'overloaded') && (
        <div style={{
          position: 'absolute',
          inset: -6,
          borderRadius: 18,
          background: glowColor,
          border: `1px solid ${borderColor}50`,
          animation: status === 'overloaded' ? 'pulse 1.2s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        }} />
      )}

      {/* Main node card */}
      <div style={{
        width: 100,
        height: 100,
        borderRadius: 14,
        background: STATUS_BG[status] || '#0d1b2e',
        backgroundImage: `linear-gradient(135deg, #0d1b2e 0%, #111f36 100%)`,
        border: `1.5px solid ${borderColor}`,
        boxShadow: isHighlighted
          ? `0 0 0 2px ${borderColor}40, 0 8px 24px rgba(0,0,0,0.5)`
          : status === 'overloaded'
            ? `0 0 20px rgba(239,68,68,0.3), 0 4px 16px rgba(0,0,0,0.4)`
            : '0 4px 16px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        {/* Status bar at bottom */}
        {simulationResult && simulationResult.load > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 3,
            background: '#0a1628',
          }}>
            <div style={{
              width: `${Math.min(utilization, 100)}%`,
              height: '100%',
              background: `linear-gradient(to right, ${statusColor}80, ${statusColor})`,
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        )}

        {/* Shimmer overlay for overloaded */}
        {status === 'overloaded' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(239,68,68,0.05) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 2s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Icon circle */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${def.color}18`,
          border: `1px solid ${def.color}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          transition: 'transform 0.15s',
          transform: hovering ? 'scale(1.08)' : 'scale(1)',
        }}>
          {def.icon}
        </div>

        {/* Type label */}
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: def.color,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em',
        }}>
          {def.short}
        </div>

        {/* Load label when simulating */}
        {load > 0 && (
          <div style={{
            fontSize: 9,
            color: statusColor,
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1,
            marginTop: -2,
          }}>
            {load}/s
          </div>
        )}

        {/* Delete button on hover/select */}
        {(isSelected || hovering) && onDelete && (
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(node.id); }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#ef4444',
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Label below */}
      <div style={{
        textAlign: 'center',
        marginTop: 7,
        fontSize: 10,
        color: isHighlighted ? def.color : '#3d6088',
        fontFamily: "'JetBrains Mono', monospace",
        transition: 'color 0.2s',
        whiteSpace: 'nowrap',
      }}>
        {def.label}
      </div>

      {/* Connect hint */}
      {isConnectionSource && (
        <div style={{
          position: 'absolute',
          top: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#f59e0b',
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: 9,
          color: '#000',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          whiteSpace: 'nowrap',
          animation: 'fadeIn 0.2s ease',
        }}>
          Click target →
        </div>
      )}
    </div>
  );
}