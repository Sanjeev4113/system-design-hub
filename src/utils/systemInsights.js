// systemInsights.js - Generate architectural insights

export function getSystemInsights(nodes, edges, simulationResults) {
  const insights = [];

  if (nodes.length === 0) {
    return [{
      type: 'info',
      title: 'Empty Canvas',
      message: 'Add components from the sidebar to start designing your system.',
    }];
  }

  // Architecture pattern detection
  const types = nodes.map(n => n.type);
  const hasLB = types.includes('LB');
  const hasAPI = types.includes('API');
  const hasCache = types.includes('CACHE');
  const hasDB = types.includes('DB');

  if (hasLB && hasAPI && hasCache && hasDB) {
    insights.push({
      type: 'success',
      title: 'Well-Balanced Architecture',
      message: 'Your system has all key layers: load balancing, API processing, caching, and persistence.',
    });
  }

  if (hasDB && !hasCache && simulationResults) {
    const dbNodes = nodes.filter(n => n.type === 'DB');
    const dbLoaded = dbNodes.some(n => simulationResults[n.id]?.load > 100);
    if (dbLoaded) {
      insights.push({
        type: 'warning',
        title: 'No Cache Layer',
        message: 'Database is receiving high load with no cache. Add a CACHE node between API and DB.',
      });
    }
  }

  if (hasAPI && !hasLB) {
    const apiNodes = nodes.filter(n => n.type === 'API');
    if (apiNodes.length === 1) {
      insights.push({
        type: 'warning',
        title: 'Single Point of Failure',
        message: 'Single API server with no load balancer. If it fails, your system goes down.',
      });
    }
  }

  // Connection analysis
  const connectedNodes = new Set();
  edges.forEach(e => { connectedNodes.add(e.source); connectedNodes.add(e.target); });
  const isolated = nodes.filter(n => !connectedNodes.has(n.id));
  if (isolated.length > 0) {
    insights.push({
      type: 'info',
      title: `${isolated.length} Isolated Component${isolated.length > 1 ? 's' : ''}`,
      message: `${isolated.map(n => n.type).join(', ')} not connected to the system. Connect them to route traffic.`,
    });
  }

  // Simulation-based insights
  if (simulationResults && Object.keys(simulationResults).length > 0) {
    const results = Object.values(simulationResults);
    const overloaded = results.filter(r => r.status === 'overloaded');
    const healthy = results.filter(r => r.status === 'healthy');

    if (overloaded.length === 0 && healthy.length > 0) {
      insights.push({
        type: 'success',
        title: 'System Stable',
        message: 'All active components operating within safe thresholds.',
      });
    }

    overloaded.forEach(r => {
      insights.push({
        type: 'error',
        title: `${r.type} Overloaded`,
        message: r.explanation,
      });
    });
  }

  // Topology insights
  if (edges.length > 0) {
    const lbNodes = nodes.filter(n => n.type === 'LB');
    lbNodes.forEach(lb => {
      const downstream = edges.filter(e => e.source === lb.id);
      if (downstream.length === 1) {
        insights.push({
          type: 'info',
          title: 'LB Not Distributing',
          message: 'Load balancer connected to only one node — connect to multiple API servers for true load distribution.',
        });
      }
    });
  }

  return insights;
}

export function getHLDDescription(nodes, edges) {
  const types = [...new Set(nodes.map(n => n.type))];
  if (types.length === 0) return 'No components added yet.';

  let desc = '**High-Level Design:**\n\n';

  if (types.includes('LB')) desc += '→ Traffic enters via a **Load Balancer** that distributes requests evenly.\n';
  if (types.includes('API')) {
    const count = nodes.filter(n => n.type === 'API').length;
    desc += `→ ${count} **API Server${count > 1 ? 's' : ''}** handle${count === 1 ? 's' : ''} business logic and request processing.\n`;
  }
  if (types.includes('CACHE')) desc += '→ A **Cache Layer** (e.g., Redis) intercepts repeat reads, reducing DB load by ~70%.\n';
  if (types.includes('DB')) {
    const count = nodes.filter(n => n.type === 'DB').length;
    desc += `→ ${count} **Database${count > 1 ? 's' : ''}** provide${count === 1 ? 's' : ''} persistent storage.\n`;
  }

  return desc;
}

export function getLLDDescription(nodes, edges) {
  if (nodes.length === 0) return 'No components to describe.';

  let desc = '**Low-Level Design:**\n\n';

  nodes.forEach(node => {
    const outgoing = edges.filter(e => e.source === node.id);
    const incoming = edges.filter(e => e.target === node.id);

    desc += `**${node.type} (${node.id.slice(0,6)})**\n`;
    desc += `  • Accepts from: ${incoming.length > 0 ? incoming.map(e => e.source.slice(0,6)).join(', ') : 'external traffic'}\n`;
    desc += `  • Routes to: ${outgoing.length > 0 ? outgoing.map(e => e.target.slice(0,6)).join(', ') : 'none (terminus)'}\n`;
    if (node.type === 'LB') desc += `  • Algorithm: Round Robin (default)\n`;
    if (node.type === 'CACHE') desc += `  • Strategy: Write-through, TTL: 300s\n`;
    if (node.type === 'DB') desc += `  • Type: Relational (PostgreSQL)\n`;
    desc += '\n';
  });

  return desc;
}