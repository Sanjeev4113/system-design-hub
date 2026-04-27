// simulationEngine.js - Core simulation logic for system design

export const NODE_TYPES = {
  LB: {
    label: 'Load Balancer',
    short: 'LB',
    color: '#3b82f6',
    maxLoad: 1000,
    description: 'Distributes traffic across multiple servers',
    icon: '⚖',
  },
  API: {
    label: 'API Server',
    short: 'API',
    color: '#10b981',
    maxLoad: 500,
    description: 'Handles API requests and business logic',
    icon: '⚙',
  },
  CACHE: {
    label: 'Cache Layer',
    short: 'CACHE',
    color: '#f59e0b',
    maxLoad: 800,
    description: 'Reduces DB load with fast in-memory storage',
    icon: '⚡',
  },
  DB: {
    label: 'Database',
    short: 'DB',
    color: '#8b5cf6',
    maxLoad: 300,
    description: 'Persistent data storage layer',
    icon: '🗄',
  },
};

export function runSimulation(nodes, edges, trafficLoad) {
  const traffic = parseInt(trafficLoad) || 1000;
  const results = {};

  // Initialize all nodes
  nodes.forEach(node => {
    results[node.id] = {
      id: node.id,
      type: node.type,
      load: 0,
      status: 'idle',
      requestsHandled: 0,
      explanation: '',
    };
  });

  // Find entry points (LB or API nodes with no incoming edges)
  const incomingEdges = {};
  edges.forEach(e => {
    if (!incomingEdges[e.target]) incomingEdges[e.target] = [];
    incomingEdges[e.target].push(e.source);
  });

  const entryNodes = nodes.filter(n => !incomingEdges[n.id] || incomingEdges[n.id].length === 0);

  if (entryNodes.length === 0 && nodes.length > 0) {
    // All nodes have incoming — use LB or first node as entry
    const lb = nodes.find(n => n.type === 'LB') || nodes[0];
    if (lb) simulateFlow(lb.id, traffic, nodes, edges, results, incomingEdges, new Set());
  } else {
    entryNodes.forEach(n => {
      simulateFlow(n.id, traffic / entryNodes.length, nodes, edges, results, incomingEdges, new Set());
    });
  }

  // Compute statuses and explanations
  Object.values(results).forEach(r => {
    const nodeDef = NODE_TYPES[r.type] || NODE_TYPES.API;
    const utilization = (r.load / nodeDef.maxLoad) * 100;
    r.utilization = Math.min(utilization, 100);

    if (r.load === 0) {
      r.status = 'idle';
      r.explanation = `${nodeDef.label} is idle — no traffic routed here.`;
    } else if (utilization < 60) {
      r.status = 'healthy';
      r.explanation = `${nodeDef.label} handling ${Math.round(r.load)} req/s at ${Math.round(utilization)}% capacity. Operating normally.`;
    } else if (utilization < 90) {
      r.status = 'warning';
      r.explanation = `${nodeDef.label} at ${Math.round(utilization)}% capacity — approaching limit. Consider scaling.`;
    } else {
      r.status = 'overloaded';
      r.explanation = `⚠ ${nodeDef.label} OVERLOADED at ${Math.round(utilization)}% capacity! ${r.load > nodeDef.maxLoad ? `Dropping ${Math.round(r.load - nodeDef.maxLoad)} req/s.` : 'Near critical threshold.'}`;
    }
  });

  return results;
}

function simulateFlow(nodeId, incomingLoad, nodes, edges, results, incomingEdges, visited) {
  if (visited.has(nodeId)) return;
  visited.add(nodeId);

  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;

  const nodeDef = NODE_TYPES[node.type] || NODE_TYPES.API;
  results[nodeId].load += incomingLoad;
  results[nodeId].requestsHandled += incomingLoad;

  // Get outgoing edges
  const outgoing = edges.filter(e => e.source === nodeId);
  if (outgoing.length === 0) return;

  let passThrough = incomingLoad;

  // Type-specific behavior
  if (node.type === 'LB') {
    // Load balancer splits evenly
    passThrough = incomingLoad; // passes all but distributes
  } else if (node.type === 'CACHE') {
    // Cache absorbs 70% of reads
    passThrough = incomingLoad * 0.3;
  } else if (node.type === 'API') {
    // API passes most load through
    passThrough = incomingLoad * 0.9;
  }

  // Distribute to downstream nodes
  const loadPerChild = passThrough / outgoing.length;
  outgoing.forEach(edge => {
    simulateFlow(edge.target, loadPerChild, nodes, edges, results, incomingEdges, new Set(visited));
  });
}

export function generateSuggestions(simulationResults, nodes, edges) {
  const suggestions = [];

  if (!simulationResults || Object.keys(simulationResults).length === 0) return suggestions;

  const overloaded = Object.values(simulationResults).filter(r => r.status === 'overloaded');
  const warning = Object.values(simulationResults).filter(r => r.status === 'warning');

  overloaded.forEach(r => {
    if (r.type === 'DB') {
      const hasCache = nodes.some(n => n.type === 'CACHE');
      if (!hasCache) {
        suggestions.push({
          id: `cache-${r.id}`,
          priority: 'critical',
          title: 'Add Cache Layer',
          description: `Database at ${Math.round(r.utilization)}% capacity. Adding a cache can absorb up to 70% of read traffic.`,
          action: 'add_cache',
          icon: '⚡',
        });
      } else {
        suggestions.push({
          id: `db-scale-${r.id}`,
          priority: 'critical',
          title: 'Scale Database',
          description: 'Database overloaded even with cache. Consider read replicas or sharding.',
          action: 'scale_db',
          icon: '🗄',
        });
      }
    }
    if (r.type === 'API') {
      const hasLB = nodes.some(n => n.type === 'LB');
      if (!hasLB) {
        suggestions.push({
          id: `lb-${r.id}`,
          priority: 'critical',
          title: 'Add Load Balancer',
          description: `API server overloaded at ${Math.round(r.utilization)}%. A load balancer will distribute traffic across multiple instances.`,
          action: 'add_lb',
          icon: '⚖',
        });
      } else {
        suggestions.push({
          id: `api-scale-${r.id}`,
          priority: 'critical',
          title: 'Scale API Servers',
          description: 'Add more API server instances behind the load balancer.',
          action: 'scale_api',
          icon: '⚙',
        });
      }
    }
    if (r.type === 'LB') {
      suggestions.push({
        id: `lb-upgrade-${r.id}`,
        priority: 'high',
        title: 'Upgrade Load Balancer',
        description: 'Load balancer at capacity. Consider distributing with DNS-based load balancing.',
        action: 'upgrade_lb',
        icon: '⚖',
      });
    }
  });

  warning.forEach(r => {
    suggestions.push({
      id: `warn-${r.id}`,
      priority: 'medium',
      title: `Monitor ${r.type} Usage`,
      description: `${NODE_TYPES[r.type]?.label || r.type} at ${Math.round(r.utilization)}% — set up alerts and plan scaling.`,
      action: 'monitor',
      icon: '📊',
    });
  });

  if (nodes.length > 0 && edges.length === 0) {
    suggestions.push({
      id: 'no-edges',
      priority: 'info',
      title: 'Connect Your Components',
      description: 'Click any node to start connecting. Build the data flow between your components.',
      action: 'connect',
      icon: '🔗',
    });
  }

  if (nodes.length === 0) {
    suggestions.push({
      id: 'empty',
      priority: 'info',
      title: 'Start Building',
      description: 'Add components from the left sidebar. Start with a Load Balancer or API Server.',
      action: 'start',
      icon: '🚀',
    });
  }

  return suggestions;
}