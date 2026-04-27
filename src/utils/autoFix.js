// autoFix.js - Auto-fix suggestions for system architecture

export function getAutoFixes(nodes, edges, simulationResults) {
  const fixes = [];

  if (!simulationResults) return fixes;

  Object.values(simulationResults).forEach(result => {
    if (result.status === 'overloaded') {
      if (result.type === 'DB') {
        const hasCache = nodes.some(n => n.type === 'CACHE');
        if (!hasCache) {
          fixes.push({
            id: `fix-cache-${result.id}`,
            label: 'Auto-add Cache',
            description: 'Insert a CACHE node between API and DB',
            type: 'add_node',
            nodeType: 'CACHE',
            targetId: result.id,
          });
        }
      }
      if (result.type === 'API') {
        const hasLB = nodes.some(n => n.type === 'LB');
        if (!hasLB) {
          fixes.push({
            id: `fix-lb-${result.id}`,
            label: 'Auto-add Load Balancer',
            description: 'Place a LB before the API server',
            type: 'add_node',
            nodeType: 'LB',
            targetId: result.id,
          });
        }
      }
    }
  });

  return fixes;
}

export function applyAutoFix(fix, nodes, edges, setNodes, setEdges) {
  if (fix.type === 'add_node') {
    const newId = `${fix.nodeType}-${Date.now()}`;
    const targetNode = nodes.find(n => n.id === fix.targetId);
    const x = targetNode ? targetNode.x - 180 : 200;
    const y = targetNode ? targetNode.y : 200;

    const newNode = {
      id: newId,
      type: fix.nodeType,
      x,
      y,
    };

    setNodes(prev => [...prev, newNode]);

    if (fix.nodeType === 'CACHE' && targetNode) {
      // Connect API → CACHE → DB
      const apiNodes = nodes.filter(n => n.type === 'API');
      const newEdges = [];

      apiNodes.forEach(api => {
        const existingEdge = edges.find(e => e.source === api.id && e.target === fix.targetId);
        if (existingEdge) {
          // Remove old edge, add through cache
          setEdges(prev => prev.filter(e => e.id !== existingEdge.id));
          newEdges.push(
            { id: `e-${api.id}-${newId}`, source: api.id, target: newId },
            { id: `e-${newId}-${fix.targetId}`, source: newId, target: fix.targetId }
          );
        }
      });

      if (newEdges.length > 0) {
        setEdges(prev => [...prev, ...newEdges]);
      }
    } else if (fix.nodeType === 'LB' && targetNode) {
      setEdges(prev => [
        ...prev,
        { id: `e-${newId}-${fix.targetId}`, source: newId, target: fix.targetId }
      ]);
    }
  }
}