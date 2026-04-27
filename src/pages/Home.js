// Home.js — Premium landing page matching screenshot design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

const PROBLEMS = [
  { id: 'twitter', icon: '🐦', title: 'Design Twitter', difficulty: 'Medium', category: 'HANDS-ON', description: 'Timelines, fanout-on-write, trending topics.', bg: '#0d1a2e', accent: '#3b82f6' },
  { id: 'instagram', icon: '📸', title: 'Design Instagram', difficulty: 'Medium', category: 'HANDS-ON', description: 'Photo feed, stories, explore page, DMs.', bg: '#1a0d1e', accent: '#e94b7c' },
  { id: 'whatsapp', icon: '💬', title: 'Design WhatsApp', difficulty: 'Hard', category: 'HANDS-ON', description: 'Realtime E2EE messaging, group fanout.', bg: '#0a1e10', accent: '#25d366' },
  { id: 'uber', icon: '🚗', title: 'Design Uber', difficulty: 'Hard', category: 'HANDS-ON', description: 'Realtime ride matching, geo-partitioned cells.', bg: '#0d0d0d', accent: '#f59e0b' },
  { id: 'url-shortener', icon: '🔗', title: 'URL Shortener', difficulty: 'Easy', category: 'PRACTICE', description: 'Hashing, redirects, analytics like bit.ly.', bg: '#0a1e18', accent: '#10b981' },
  { id: 'rate-limiter', icon: '🛡', title: 'Rate Limiter', difficulty: 'Medium', category: 'PRACTICE', description: 'Token bucket, sliding window algorithms.', bg: '#1e1a0a', accent: '#f59e0b' },
];

const CASE_STUDIES = [
  { id: 'netflix', icon: '🎬', title: 'Netflix', subtitle: 'CDN + Adaptive Streaming', tags: ['Video', 'CDN', 'Scale'], color: '#e50914' },
  { id: 'uber', icon: '🚕', title: 'Uber', subtitle: 'Realtime Geo-matching', tags: ['Geo', 'Realtime', 'Dispatch'], color: '#f59e0b' },
  { id: 'twitter', icon: '🐦', title: 'Twitter', subtitle: 'Fan-out at 500M tweets/day', tags: ['Timeline', 'Fanout', 'Redis'], color: '#1d9bf0' },
];

const TRACKS = [
  { icon: '📐', title: 'HLD', sub: 'High-Level Design', level: 'Foundations', desc: 'Architecture, scaling, distributed systems. Load balancing & service decomposition.', topics: ['Sharding', 'CAP Theorem', 'Replication'], color: '#3b82f6' },
  { icon: '⚙', title: 'LLD', sub: 'Low-Level Design', level: 'Advanced', desc: 'APIs, DB schema, caching, OOP design. Clean OOP & SOLID principles.', topics: ['REST/RPC APIs', 'Schema Design', 'Indexing'], color: '#10b981' },
  { icon: '🎯', title: 'Cases', sub: 'Case Studies', level: 'Deep Dive', desc: 'Netflix, YouTube, Uber — real architectures & trade-offs analysed end-to-end.', topics: ['Real Systems', 'Trade-offs', 'Step-by-step'], color: '#8b5cf6' },
];

const STATS = [
  { val: '20+', label: 'Design Patterns' },
  { val: '6', label: 'Live Challenges' },
  { val: '∞', label: 'Simulations' },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToPractice = (id) => navigate(`/practice/${id}`);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f0f6ff' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        borderBottom: '1px solid #0f2040',
        background: scrolled ? 'rgba(2,6,23,0.97)' : 'rgba(2,6,23,0.85)',
        backdropFilter: 'blur(16px)',
        transition: 'background 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#f0f6ff' }}>System Design Hub</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Learn', 'Practice', 'Playground'].map(item => (
              <button key={item} onClick={() => {
                if (item === 'Playground') navigate('/playground');
                else document.getElementById(item.toLowerCase() + '-section')?.scrollIntoView({ behavior: 'smooth' });
              }} style={{
                background: item === 'Playground' ? 'rgba(59,130,246,0.12)' : 'none',
                border: item === 'Playground' ? '1px solid rgba(59,130,246,0.3)' : 'none',
                color: item === 'Playground' ? '#93c5fd' : '#7aa2c8',
                fontSize: 13, padding: '7px 14px', borderRadius: 7,
                cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace",
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f0f6ff'; e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = item === 'Playground' ? '#93c5fd' : '#7aa2c8'; e.currentTarget.style.background = item === 'Playground' ? 'rgba(59,130,246,0.12)' : 'none'; }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 58 }}>
        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '90px 28px 70px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.09)', border: '1px solid rgba(59,130,246,0.22)', borderRadius: 24, padding: '5px 16px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, color: '#60a5fa', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em' }}>Interactive Learning Platform</span>
          </div>

          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(38px,5.5vw,70px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: 22, color: '#f0f6ff' }}>
            Master System Design.<br />
            <span style={{ background: 'linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Build. Simulate. Ship.
            </span>
          </h1>

          <p style={{ fontSize: 16, color: '#5d8aaa', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px', fontFamily: "'JetBrains Mono',monospace" }}>
            Design distributed systems interactively. Run traffic simulations, get AI-powered analysis, and ace any system design interview.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/playground')} style={{
              padding: '13px 30px', background: '#3b82f6', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 14, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 24px rgba(59,130,246,0.4)',
              transition: 'all 0.2s', letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(59,130,246,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(59,130,246,0.4)'; }}>
              Open Playground →
            </button>
            <button onClick={() => document.getElementById('practice-section')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '13px 30px', background: 'none', border: '1px solid #1e3a5f', borderRadius: 8,
              color: '#7aa2c8', fontSize: 14, fontFamily: "'JetBrains Mono',monospace", cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#f0f6ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.color = '#7aa2c8'; }}>
              View Challenges
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 56, justifyContent: 'center', marginTop: 64, paddingTop: 40, borderTop: '1px solid #0f2040' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#3d6088', fontFamily: "'JetBrains Mono',monospace", marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- SOLVE REAL DESIGN PROBLEMS (matches screenshot) ---- */}
        <section id="practice-section" style={{ background: '#030812', borderTop: '1px solid #0a1628', borderBottom: '1px solid #0a1628', padding: '72px 28px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel label="Practice Arena" />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>
              Solve Real Design Problems
            </h2>
            <p style={{ fontSize: 14, color: '#5d8aaa', fontFamily: "'JetBrains Mono',monospace", marginBottom: 44, maxWidth: 560, lineHeight: 1.65 }}>
              Tackle problems inspired by actual system design interviews at top companies. Get instant feedback as you build.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 }}>
              {PROBLEMS.map(p => (
                <ProblemCard key={p.id} problem={p} onOpen={() => goToPractice(p.id)} />
              ))}
            </div>
          </div>
        </section>

        {/* ---- LEARNING TRACKS ---- */}
        <section id="learn-section" style={{ padding: '72px 28px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel label="Learning Tracks" />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>
              Structured Paths to Mastery
            </h2>
            <p style={{ fontSize: 14, color: '#5d8aaa', fontFamily: "'JetBrains Mono',monospace", marginBottom: 44, maxWidth: 540, lineHeight: 1.65 }}>
              Go from zero to expert with carefully sequenced content designed for interviews and real-world understanding.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {TRACKS.map(t => <TrackCard key={t.title} track={t} onClick={() => navigate(`/learn/${t.title.toLowerCase()}`)} />)}
            </div>
          </div>
        </section>

        {/* ---- CASE STUDIES ---- */}
        <section style={{ background: '#030812', borderTop: '1px solid #0a1628', padding: '72px 28px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <SectionLabel label="Case Studies" />
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em', marginBottom: 44, lineHeight: 1.15 }}>
              Real Architectures Dissected
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {CASE_STUDIES.map(c => <CaseCard key={c.id} study={c} onClick={() => navigate(`/case-study/${c.id}`)} />)}
            </div>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section style={{ padding: '72px 28px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.07))', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 20, padding: '52px 40px' }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, color: '#f0f6ff', letterSpacing: '-0.03em', marginBottom: 12 }}>
                Ready to build something?
              </h2>
              <p style={{ fontSize: 13, color: '#5d8aaa', fontFamily: "'JetBrains Mono',monospace", marginBottom: 28, lineHeight: 1.6 }}>
                Open the interactive playground and design your first scalable system in minutes.
              </p>
              <button onClick={() => navigate('/playground')} style={{
                padding: '13px 32px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                border: 'none', borderRadius: 8, color: '#fff', fontSize: 14,
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(59,130,246,0.4)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
                Launch Playground ⚡
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #0a1628', padding: '24px 28px', textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: '#1e3a5f', fontFamily: "'JetBrains Mono',monospace" }}>
          ⚡ System Design Hub — Learn distributed systems interactively
        </span>
      </footer>
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div style={{ fontSize: 10, color: '#3b82f6', fontFamily: "'JetBrains Mono',monospace", textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10, fontWeight: 600 }}>
      {label}
    </div>
  );
}

function ProblemCard({ problem, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const diffColor = DIFF_COLORS[problem.difficulty] || '#7aa2c8';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#0f1f38' : '#0b1525',
        border: `1px solid ${hovered ? '#1e3a5f' : '#0f2040'}`,
        borderRadius: 14,
        padding: 22,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.35)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
      onClick={onOpen}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${problem.accent}15`,
          border: `1px solid ${problem.accent}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {problem.icon}
        </div>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#4d7aaa', background: 'rgba(77,122,170,0.1)', border: '1px solid rgba(77,122,170,0.2)', borderRadius: 4, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            {problem.category}
          </span>
          <span style={{ fontSize: 9, color: diffColor, background: `${diffColor}15`, border: `1px solid ${diffColor}30`, borderRadius: 4, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: '#f0f6ff', marginBottom: 6 }}>
          {problem.title}
        </h3>
        <p style={{ fontSize: 12, color: '#5d8aaa', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.55 }}>
          {problem.description}
        </p>
      </div>

      <div style={{ fontSize: 12, color: hovered ? problem.accent : '#3d6088', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 4 }}>
        Open Challenge <span style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'none', display: 'inline-block' }}>→</span>
      </div>
    </div>
  );
}

function TrackCard({ track, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#0f1f38' : '#0b1525',
        border: `1px solid ${hovered ? track.color + '40' : '#0f2040'}`,
        borderRadius: 14, padding: 22, transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 8px 24px ${track.color}10` : 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: `${track.color}12`, border: `1px solid ${track.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {track.icon}
        </div>
        <span style={{ fontSize: 10, color: track.color, background: `${track.color}12`, border: `1px solid ${track.color}25`, borderRadius: 20, padding: '3px 10px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>
          {track.level}
        </span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>{track.title}</div>
      <div style={{ fontSize: 11, color: track.color, fontFamily: "'JetBrains Mono',monospace", marginBottom: 10, opacity: 0.8 }}>{track.sub}</div>
      <p style={{ fontSize: 12, color: '#4d7aaa', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6, marginBottom: 14 }}>{track.desc}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {track.topics.map(t => (
          <span key={t} style={{ fontSize: 10, color: '#5d8aaa', background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 4, padding: '3px 8px', fontFamily: "'JetBrains Mono',monospace" }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: hovered ? track.color : '#2d4a6b', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, transition: 'color 0.2s' }}>
        Start Learning →
      </div>
    </div>
  );
}

function CaseCard({ study, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? '#0f1f38' : '#0b1525',
        border: `1px solid ${hovered ? study.color + '30' : '#0f2040'}`,
        borderRadius: 14, padding: 22, cursor: 'pointer', transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${study.color}15`, border: `1px solid ${study.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
          {study.icon}
        </div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 16, fontWeight: 700, color: '#f0f6ff' }}>{study.title}</div>
          <div style={{ fontSize: 11, color: '#4d7aaa', fontFamily: "'JetBrains Mono',monospace", marginTop: 1 }}>{study.subtitle}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {study.tags.map(t => (
          <span key={t} style={{ fontSize: 10, color: study.color, background: `${study.color}12`, border: `1px solid ${study.color}25`, borderRadius: 4, padding: '2px 8px', fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>
        ))}
      </div>
      <div style={{ fontSize: 11, color: hovered ? study.color : '#2d4a6b', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, transition: 'color 0.2s' }}>
        Read Case Study →
      </div>
    </div>
  );
}