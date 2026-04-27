// Canvas.js - Interactive system design canvas
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Node from '../components/Node';
import Edge from '../components/Edge';
import FlowAnimator from '../components/FlowAnimator';
import { NODE_TYPES } from '../utils/simulationEngine';

export default function Canvas({
  nodes = [],
  edges = [],
  selectedNodeId = null,
  connectingFrom = null,
  simulationResults = null,
  isSimulating = false,
  onAddNode = () => {},
  onUpdateNode = () => {},
  onAddEdge = () => {},
  onSelectNode = () => {},
  onStartConnect = () => {},
}) {
  const canvasRef = useRef(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      onSelectNode(null);
      onStartConnect(null);
    }
  }, [onSelectNode, onStartConnect]);

  const handleNodeClick = useCallback((nodeId) => {
    if (connectingFrom) {
      // If we're connecting, add the edge
      if (connectingFrom !== nodeId) {
        onAddEdge(connectingFrom, nodeId);
      }
      onStartConnect(null);
    } else {
      // Otherwise select the node
      onSelectNode(nodeId);
    }
  }, [connectingFrom, onSelectNode, onStartConnect, onAddEdge]);

  const handleMouseMove = useCallback((e) => {
    // This can be used for connection preview
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{
        flex: 1,
        position: 'relative',
        background: 'linear-gradient(135deg, #0d1b2e 0%, #0f2340 100%)',
        overflow: 'hidden',
        cursor: connectingFrom ? 'crosshair' : 'default',
      }}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* Grid background */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Edges */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {edges.map((edge) => (
          <Edge
            key={`${edge.source}-${edge.target}`}
            edge={edge}
            nodes={nodes}
            simulationResults={simulationResults}
            isSimulating={isSimulating}
          />
        ))}
      </svg>

      {/* Nodes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            simulationResult={simulationResults?.[node.id]}
            isSelected={selectedNodeId === node.id}
            isConnecting={connectingFrom !== null}
            isConnectionSource={connectingFrom === node.id}
            onClick={() => handleNodeClick(node.id)}
            onDragEnd={(x, y) => onUpdateNode(node.id, { x, y })}
            canvasOffset={canvasOffset}
            scale={scale}
          />
        ))}
      </div>

      {/* Flow animation overlay */}
      <FlowAnimator
        edges={edges}
        nodes={nodes}
        simulationResults={simulationResults}
        isSimulating={isSimulating}
      />

      {/* Empty state message */}
      {nodes.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#3d6088',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎨</div>
            <div>Start by adding nodes from the sidebar</div>
          </div>
        </div>
      )}
    </div>
  );
}