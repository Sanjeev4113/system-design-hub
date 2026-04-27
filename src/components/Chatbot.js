// Chatbot.js - Real AI powered by Anthropic API with live canvas context
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getHLDDescription, getLLDDescription } from '../utils/systemInsights';
import { generateSuggestions, NODE_TYPES } from '../utils/simulationEngine';

const SYSTEM_PROMPT = `You are an expert system design AI embedded in "System Design Hub" — an interactive system design playground.

Your job:
- Help users design scalable distributed systems
- Analyze the real-time state of their canvas (components added, connections made, simulation results)
- Give specific, actionable architectural advice
- Explain Load Balancers, API Servers, Cache (Redis), Databases, and their interactions
- Reference the actual canvas state in your responses — be specific

Style rules:
- Direct and technical but clear
- 2-3 short paragraphs max
- Use → for bullet points when needed
- NO markdown bold or headers
- Reference actual component states/loads when simulated
- If user asks to "add" something, explain HOW to do it in the playground UI`;

function buildContext(nodes, edges, simulationResults) {
  if (nodes.length === 0) return 'Canvas is empty — no components added yet.';
  const nList = nodes.map(n => {
    const r = simulationResults?.[n.id];
    const def = NODE_TYPES[n.type];
    return `${def?.label || n.type}${r ? ` (${r.status}, ${Math.round(r.load || 0)} req/s, ${Math.round(r.utilization || 0)}% capacity)` : ''}`;
  }).join(', ');
  const eList = edges.length
    ? edges.map(e => {
        const s = nodes.find(n => n.id === e.source);
        const t = nodes.find(n => n.id === e.target);
        return `${s?.type}→${t?.type}`;
      }).join(', ')
    : 'no connections';
  return `Canvas: ${nList}. Connections: ${eList}. ${simulationResults ? 'Simulation ran.' : 'Not simulated.'}`;
}

export default function Chatbot({ nodes, edges, simulationResults }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{
    role: 'assistant',
    text: 'Hey! I can see your canvas in real time.\n\nAsk me anything — how to fix overloads, explain HLD/LLD, add components, or design patterns.',
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const ctx = buildContext(nodes, edges, simulationResults);
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const history = msgs.slice(-8).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

      const userContent = `[Context: ${ctx}]\n\n${text}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: [...history, { role: 'user', content: userContent }],
        }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || fallback(text, nodes, edges, simulationResults);
      setMsgs(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', text: fallback(text, nodes, edges, simulationResults) }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, msgs, nodes, edges, simulationResults]);

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const QUICK = ['What is wrong?', 'Show HLD', 'How to reduce DB load?', 'Explain caching'];

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 24, right: 24, width: 52, height: 52,
        borderRadius: '50%', background: open ? '#162340' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
        border: `1.5px solid ${open ? '#3b82f6' : 'transparent'}`, color: '#fff',
        fontSize: open ? 20 : 18, cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(59,130,246,0.5)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1500, transition: 'all 0.2s',
      }}>
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, width: 368, height: 540,
          background: '#06101e', border: '1px solid #1a3254', borderRadius: 18,
          display: 'flex', flexDirection: 'column', zIndex: 1400,
          boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)',
          animation: 'slideIn 0.22s cubic-bezier(.4,0,.2,1)', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '13px 16px', borderBottom: '1px solid #0f2040',
            background: 'linear-gradient(to right, #0a1628, #06101e)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              boxShadow: '0 0 16px rgba(59,130,246,0.35)',
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>
                System Design AI
              </div>
              <div style={{ fontSize: 9, color: '#10b981', fontFamily: "'JetBrains Mono',monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                {nodes.length} components · live context
              </div>
            </div>
            <button onClick={() => setMsgs([{ role: 'assistant', text: 'Chat cleared. What would you like to know?' }])}
              style={{ background: 'none', border: '1px solid #1e3a5f', borderRadius: 5, color: '#3d6088', fontSize: 9, padding: '3px 7px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace" }}>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '87%', padding: '9px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
                    : 'linear-gradient(135deg,#0d1b2e,#0f2040)',
                  border: m.role !== 'user' ? '1px solid #1a3254' : 'none',
                  fontSize: 12, color: m.role === 'user' ? '#fff' : '#90b4cf',
                  fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.65,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: '#0d1b2e', border: '1px solid #1a3254', borderRadius: '12px 12px 12px 3px', width: 'fit-content' }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: `pulse 1.2s ${d}s ease-in-out infinite` }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {msgs.length <= 2 && (
            <div style={{ padding: '6px 12px 0', display: 'flex', gap: 5, flexWrap: 'wrap', borderTop: '1px solid #0a1628' }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); inputRef.current?.focus(); }} style={{
                  background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)',
                  borderRadius: 20, color: '#6a9abf', fontSize: 10, padding: '4px 10px',
                  cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace",
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #0f2040', display: 'flex', gap: 8, background: '#06101e' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              disabled={loading}
              placeholder="Ask about your design..."
              style={{
                flex: 1, background: '#0a1628', border: '1px solid #1a3254',
                borderRadius: 8, padding: '9px 12px', color: '#f0f6ff', fontSize: 12,
                outline: 'none', fontFamily: "'JetBrains Mono',monospace",
              }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#1a3254'}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              width: 36, height: 36, borderRadius: 8,
              background: input.trim() && !loading ? '#3b82f6' : '#0d1b2e',
              border: `1px solid ${input.trim() && !loading ? '#3b82f6' : '#1a3254'}`,
              color: '#fff', fontSize: 15, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all 0.2s',
            }}>
              {loading ? '…' : '↑'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function fallback(msg, nodes, edges, simulationResults) {
  const l = msg.toLowerCase();
  if (l.includes('hld') || l.includes('high level')) return getHLDDescription(nodes, edges);
  if (l.includes('lld') || l.includes('low level')) return getLLDDescription(nodes, edges);
  if (l.includes('suggest') || l.includes('wrong') || l.includes('fix') || l.includes('improve')) {
    const s = generateSuggestions(simulationResults, nodes, edges);
    return s.length ? s.map(x => `${x.icon} ${x.title}: ${x.description}`).join('\n\n') : 'Run the simulation first, then I can give specific suggestions.';
  }
  if (l.includes('cache')) return 'Cache (Redis): stores hot data in memory.\n\n→ Reduces DB reads by 60-80%\n→ Use write-through for consistency\n→ Set TTL to avoid stale data\n→ Add between API and DB layers';
  if (l.includes('load balancer') || l.includes(' lb')) return 'Load Balancer: spreads traffic across servers.\n\n→ Prevents single-server bottlenecks\n→ Round Robin: equal distribution\n→ Least Connections: smartest routing\n→ Add in front of your API servers';
  if (l.includes('database') || l.includes(' db')) return 'Database: persistent storage layer.\n\n→ SQL (Postgres): transactions, complex queries\n→ NoSQL (Cassandra): horizontal scale, writes\n→ Add read replicas to scale read throughput\n→ Cache hot reads to reduce DB pressure';
  return 'I\'m your system design AI with live canvas access. Try:\n\n→ "What is wrong?" — analyze current design\n→ "Show HLD" — architecture overview\n→ "How to scale?" — scaling strategies\n→ "Explain cache" — component explanations';
}