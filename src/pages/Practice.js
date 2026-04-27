// Practice.js - Practice page with guided challenges
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CHALLENGES = {
  'url-shortener': {
    title: 'URL Shortener',
    icon: '🔗',
    difficulty: 'Easy',
    duration: '30 min',
    color: '#10b981',
    description: 'Design a URL shortening service like bit.ly or TinyURL.',
    requirements: [
      'Generate unique short URLs for any given long URL',
      'Redirect users from short URL to original URL',
      'Handle 100M URLs and 10B redirects/month',
      'URLs expire after 5 years by default',
      'Track click analytics per URL',
    ],
    hints: [
      'Use Base62 encoding (a-z, A-Z, 0-9) for URL generation',
      'A 7-character Base62 string gives 62^7 = 3.5 trillion combinations',
      'Use a cache (Redis) to store popular redirects — 80% of traffic hits 20% of URLs',
      'Use a NoSQL store (Cassandra) for key-value lookups at scale',
    ],
    components: ['LB', 'API', 'CACHE', 'DB'],
    pattern: 'Read-heavy system: prioritize caching and read scalability',
  },
  'rate-limiter': {
    title: 'Rate Limiter',
    icon: '🛡',
    difficulty: 'Medium',
    duration: '45 min',
    color: '#f59e0b',
    description: 'Design a rate limiter that prevents API abuse.',
    requirements: [
      'Limit each user to 100 requests/minute',
      'Return 429 Too Many Requests when exceeded',
      'Work across distributed API servers',
      'Add minimal latency (<5ms) to requests',
      'Support different limits per API endpoint',
    ],
    hints: [
      'Token Bucket: allow burst traffic up to bucket size',
      'Sliding Window: more accurate but higher memory usage',
      'Use Redis with atomic INCR + EXPIRE for distributed state',
      'Store counters in a centralized cache accessible by all API servers',
    ],
    components: ['LB', 'API', 'CACHE'],
    pattern: 'Stateful middleware: requires shared state across servers',
  },
  'twitter-feed': {
    title: 'Social Feed',
    icon: '📡',
    difficulty: 'Hard',
    duration: '60 min',
    color: '#3b82f6',
    description: 'Design a social media news feed like Twitter or Instagram.',
    requirements: [
      'Users can post tweets and follow other users',
      'Home timeline shows tweets from followed users',
      'Handle 300M DAU, 500M tweets/day',
      'Load timeline in under 500ms',
      'Support notifications for mentions and likes',
    ],
    hints: [
      'Fan-out on write: pre-compute timelines when tweet is posted',
      'Fan-out on read: compute timeline at request time (better for celebrities)',
      'Use a hybrid: fan-out for normal users, fan-in for celebrities',
      'Store timeline in Redis as sorted set with tweet_id as score',
    ],
    components: ['LB', 'API', 'CACHE', 'DB'],
    pattern: 'Write-heavy fanout: pre-computation vs lazy computation tradeoff',
  },
};

export default function Practice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);
  const [checkedReqs, setCheckedReqs] = useState({});

  const challenge = CHALLENGES[id];

  if (!challenge) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>404</div>
          <div style={{ color: '#7aa2c8', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Challenge not found</div>
          <button onClick={() => navigate('/')} style={{
            background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff',
            padding: '10px 20px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
          }}>← Back Home</button>
        </div>
      </div>
    );
  }

  const toggleReq = (i) => setCheckedReqs(prev => ({ ...prev, [i]: !prev[i] }));
  const completed = Object.values(checkedReqs).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: '#020617' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #0f2040',
        background: 'rgba(2,6,23,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: '#7aa2c8',
              fontSize: 13, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            ← Home
          </button>
          <div style={{ fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: '#f0f6ff' }}>
            Practice: {challenge.title}
          </div>
          <button
            onClick={() => navigate('/playground')}
            style={{
              background: '#3b82f6', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 12, padding: '7px 14px',
              cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace',",
            }}
          >
            Open Playground →
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: `${challenge.color}15`,
            border: `1px solid ${challenge.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>
            {challenge.icon}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span style={{
                fontSize: 10, color: challenge.color,
                background: `${challenge.color}15`, padding: '2px 10px',
                borderRadius: 20, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
              }}>
                {challenge.difficulty}
              </span>
              <span style={{
                fontSize: 10, color: '#3d6088',
                background: '#0a1628', border: '1px solid #1e3a5f',
                padding: '2px 10px', borderRadius: 20, fontFamily: "'JetBrains Mono', monospace",
              }}>
                {challenge.duration}
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800,
              color: '#f0f6ff', letterSpacing: '-0.02em', marginBottom: 6,
            }}>
              {challenge.title}
            </h1>
            <p style={{ fontSize: 13, color: '#5d8aaa', fontFamily: "'JetBrains Mono', monospace" }}>
              {challenge.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Requirements */}
          <div style={{
            background: '#0f1e35', border: '1px solid #1e3a5f',
            borderRadius: 12, padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: '#f0f6ff',
                fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                Requirements
              </div>
              <span style={{ fontSize: 11, color: '#3b82f6', fontFamily: "'JetBrains Mono', monospace" }}>
                {completed}/{challenge.requirements.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {challenge.requirements.map((req, i) => (
                <div
                  key={i}
                  onClick={() => toggleReq(i)}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    cursor: 'pointer', padding: '6px 8px', borderRadius: 6,
                    transition: 'background 0.2s',
                    background: checkedReqs[i] ? 'rgba(16,185,129,0.06)' : 'transparent',
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, flexShrink: 0, marginTop: 1,
                    border: `1px solid ${checkedReqs[i] ? '#10b981' : '#1e3a5f'}`,
                    background: checkedReqs[i] ? '#10b981' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: '#fff',
                  }}>
                    {checkedReqs[i] ? '✓' : ''}
                  </div>
                  <span style={{
                    fontSize: 12, color: checkedReqs[i] ? '#3d6088' : '#7aa2c8',
                    fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5,
                    textDecoration: checkedReqs[i] ? 'line-through' : 'none',
                    transition: 'color 0.2s',
                  }}>
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pattern */}
            <div style={{
              background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 12, padding: 16,
            }}>
              <div style={{
                fontSize: 10, color: '#3b82f6', fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600,
              }}>
                Design Pattern
              </div>
              <div style={{ fontSize: 12, color: '#7aa2c8', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                {challenge.pattern}
              </div>
            </div>

            {/* Suggested Components */}
            <div style={{
              background: '#0f1e35', border: '1px solid #1e3a5f',
              borderRadius: 12, padding: 16,
            }}>
              <div style={{
                fontSize: 10, color: '#f0f6ff', fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontWeight: 600,
              }}>
                Suggested Components
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {challenge.components.map(c => {
                  const colors = { LB: '#3b82f6', API: '#10b981', CACHE: '#f59e0b', DB: '#8b5cf6' };
                  return (
                    <span key={c} style={{
                      fontSize: 11, color: colors[c],
                      background: `${colors[c]}15`, border: `1px solid ${colors[c]}30`,
                      padding: '4px 12px', borderRadius: 6,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                    }}>
                      {c}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Hints */}
            <div style={{
              background: '#0f1e35', border: '1px solid #1e3a5f',
              borderRadius: 12, padding: 16,
            }}>
              <button
                onClick={() => setShowHints(s => !s)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  color: '#7aa2c8', fontSize: 11, cursor: 'pointer',
                  fontFamily: "'JetBrains Mono', monospace",
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                  padding: 0,
                }}
              >
                <span>{showHints ? 'Hide' : 'Show'} Hints</span>
                <span style={{ fontSize: 14 }}>{showHints ? '▲' : '▼'}</span>
              </button>
              {showHints && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {challenge.hints.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <span style={{ color: '#3b82f6', flexShrink: 0, fontSize: 11 }}>→</span>
                      <span style={{ fontSize: 11, color: '#5d8aaa', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Open in playground */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => navigate('/playground')}
            style={{
              padding: '13px 32px',
              background: '#3b82f6', border: 'none', borderRadius: 8,
              color: '#fff', fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer', fontWeight: 600,
              boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
            }}
          >
            Design in Playground →
          </button>
        </div>
      </div>
    </div>
  );
}