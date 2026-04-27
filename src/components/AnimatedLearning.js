// AnimatedLearning.js - Interactive animated lessons showing system design in action
import React, { useState, useEffect } from 'react';

const ANIMATED_LESSONS = {
  netflix_streaming: {
    title: 'Netflix: Streaming at Scale',
    description: 'Watch how Netflix delivers video content to millions of users',
    steps: [
      {
        stage: 1,
        title: 'User Requests Video',
        description: 'User clicks play on their device',
        animation: 'user-click',
        highlight: ['user'],
      },
      {
        stage: 2,
        title: 'Request Reaches CDN',
        description: 'DNS lookup finds nearest CDN edge server',
        animation: 'request-cdn',
        highlight: ['user', 'cdn'],
      },
      {
        stage: 3,
        title: 'Cache Check',
        description: 'Edge server checks if video chunk is cached',
        animation: 'cache-check',
        highlight: ['cdn', 'cache'],
      },
      {
        stage: 4,
        title: 'Stream Starts',
        description: 'Video streams from nearest location < 50ms latency',
        animation: 'streaming',
        highlight: ['cdn', 'user'],
      },
      {
        stage: 5,
        title: 'Adaptive Bitrate',
        description: 'Quality auto-adjusts based on network speed',
        animation: 'quality-adjust',
        highlight: ['user', 'network'],
      },
    ],
  },
  twitter_fanout: {
    title: 'Twitter: Fan-out Timeline',
    description: 'How Twitter delivers timelines to 500M users daily',
    steps: [
      {
        stage: 1,
        title: 'User Tweets',
        description: 'Influencer posts new tweet',
        animation: 'tweet-post',
        highlight: ['user', 'database'],
      },
      {
        stage: 2,
        title: 'Fanout Process Starts',
        description: 'Message queue processes the tweet',
        animation: 'fanout-queue',
        highlight: ['queue', 'workers'],
      },
      {
        stage: 3,
        title: 'Distribute to Followers',
        description: 'Worker threads send tweet to follower feed caches',
        animation: 'fanout-fans',
        highlight: ['workers', 'cache'],
      },
      {
        stage: 4,
        title: 'Feed Updated in Cache',
        description: 'Redis stores tweet IDs in follower timelines',
        animation: 'cache-update',
        highlight: ['cache', 'followers'],
      },
      {
        stage: 5,
        title: 'Instant Load for Followers',
        description: 'Users see tweet immediately when opening app',
        animation: 'feed-load',
        highlight: ['followers', 'cache'],
      },
    ],
  },
  uber_matching: {
    title: 'Uber: Real-Time Ride Matching',
    description: 'How Uber matches drivers with riders in < 30 seconds',
    steps: [
      {
        stage: 1,
        title: 'Rider Requests Ride',
        description: 'User opens app and requests ride',
        animation: 'rider-request',
        highlight: ['rider'],
      },
      {
        stage: 2,
        title: 'Geohashing Search',
        description: 'System identifies nearby drivers using geohashing',
        animation: 'geohash-search',
        highlight: ['rider', 'nearby-drivers'],
      },
      {
        stage: 3,
        title: 'Ranking Drivers',
        description: 'Rank by: rating, acceptance rate, vehicle type',
        animation: 'driver-ranking',
        highlight: ['nearby-drivers', 'database'],
      },
      {
        stage: 4,
        title: 'Offer to Top 3',
        description: 'Send offers to 3 highest-ranked drivers in parallel',
        animation: 'parallel-offers',
        highlight: ['nearby-drivers', 'drivers'],
      },
      {
        stage: 5,
        title: 'Match Confirmed',
        description: 'First driver to accept gets the ride',
        animation: 'match-confirmed',
        highlight: ['rider', 'driver', 'match'],
      },
    ],
  },
  youtube_recomm: {
    title: 'YouTube: Recommendation Engine',
    description: 'How YouTube recommends the "perfect" next video',
    steps: [
      {
        stage: 1,
        title: 'User Watches Video',
        description: 'User watching video, engagement tracked',
        animation: 'watch-video',
        highlight: ['user', 'video'],
      },
      {
        stage: 2,
        title: 'Collect Signals',
        description: 'Watch time, clicks, skips, likes sent to analytics',
        animation: 'collect-signals',
        highlight: ['user', 'analytics'],
      },
      {
        stage: 3,
        title: 'ML Model Inference',
        description: 'ML models predict what user wants next',
        animation: 'ml-inference',
        highlight: ['analytics', 'ml'],
      },
      {
        stage: 4,
        title: 'Rank Candidates',
        description: 'Rank videos: relevance, diversity, freshness',
        animation: 'ranking',
        highlight: ['ml', 'database'],
      },
      {
        stage: 5,
        title: 'Personalized Feed',
        description: 'User sees recommendations tailored to their taste',
        animation: 'fed-updated',
        highlight: ['user', 'feed'],
      },
    ],
  },
};

export default function AnimatedLearning({ lessonId, isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const lesson = ANIMATED_LESSONS[lessonId];

  if (!isOpen || !lesson) return null;

  const step = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#020617', borderRadius: 16, border: '1px solid #0f2040',
        maxWidth: 900, width: '90%', maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '24px 32px', borderBottom: '1px solid #0f2040',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800,
              color: '#f0f6ff', margin: '0 0 4px 0'
            }}>
              {lesson.title}
            </h2>
            <p style={{
              fontSize: 13, color: '#5d8aaa', margin: 0,
              fontFamily: "'JetBrains Mono',monospace"
            }}>
              {lesson.description}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 24,
            color: '#3d6088', cursor: 'pointer', padding: 0,
          }}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Visualization */}
          <div style={{
            background: '#0a1628', borderRadius: 12,
            padding: '40px', marginBottom: 32, position: 'relative',
            minHeight: 300, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <AnimationRenderer step={step} lessonId={lessonId} />
          </div>

          {/* Step Info */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: 28, fontWeight: 800, color: '#3b82f6',
                fontFamily: "'Syne',sans-serif"
              }}>
                Step {step.stage}
              </span>
              <h3 style={{
                fontSize: 20, fontWeight: 700, color: '#f0f6ff',
                margin: 0, fontFamily: "'Syne',sans-serif"
              }}>
                {step.title}
              </h3>
            </div>
            <p style={{
              fontSize: 14, color: '#5d8aaa', margin: 0,
              fontFamily: "'JetBrains Mono',monospace", lineHeight: 1.6,
              maxWidth: 600,
            }}>
              {step.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: '#0f1e35', borderRadius: 8, height: 8,
            overflow: 'hidden', marginBottom: 24,
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              height: '100%', width: `${progress}%`,
              transition: 'width 0.3s ease',
            }} />
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex', gap: 12, justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              style={{
                padding: '12px 24px', background: currentStep === 0 ? '#0a1628' : '#1e3a5f',
                border: `1px solid ${currentStep === 0 ? '#0f2040' : '#3b82f6'}`,
                borderRadius: 8, color: currentStep === 0 ? '#1e3a5f' : '#f0f6ff',
                fontSize: 13, cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              ← Previous
            </button>

            <div style={{
              fontSize: 12, color: '#3d6088', fontFamily: "'JetBrains Mono',monospace",
            }}>
              Step {currentStep + 1} of {lesson.steps.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === lesson.steps.length - 1}
              style={{
                padding: '12px 24px',
                background: currentStep === lesson.steps.length - 1 ? '#0a1628' : '#3b82f6',
                border: `1px solid ${currentStep === lesson.steps.length - 1 ? '#0f2040' : '#3b82f6'}`,
                borderRadius: 8, color: currentStep === lesson.steps.length - 1 ? '#1e3a5f' : '#fff',
                fontSize: 13, cursor: currentStep === lesson.steps.length - 1 ? 'not-allowed' : 'pointer',
                fontFamily: "'JetBrains Mono',monospace", fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation Renderer
function AnimationRenderer({ step, lessonId }) {
  return (
    <svg width="100%" height="280" viewBox="0 0 800 280" style={{ display: 'block' }}>
      <defs>
        <style>{`
          @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }
          @keyframes flow { 0% { dashoffset: 40; } 100% { dashoffset: 0; } }
          @keyframes float { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-10px) } }
          .pulse-node { animation: pulse 2s infinite; }
          .flow-arrow { animation: flow 1.5s linear infinite; stroke-dasharray: 40; }
          .float-text { animation: float 2s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Netflix Streaming */}
      {lessonId === 'netflix_streaming' && (
        <>
          <circle cx="100" cy="140" r="30" fill={step.highlight.includes('user') ? '#60a5fa' : '#3d6088'} />
          <text x="100" y="180" textAnchor="middle" fill="#f0f6ff" fontSize="12">👤 User</text>

          <circle cx="400" cy="80" r="30" fill={step.highlight.includes('cdn') ? '#60a5fa' : '#3d6088'} />
          <text x="400" y="120" textAnchor="middle" fill="#f0f6ff" fontSize="12">🌐 CDN</text>

          <circle cx="400" cy="200" r="30" fill={step.highlight.includes('cache') ? '#60a5fa' : '#3d6088'} />
          <text x="400" y="240" textAnchor="middle" fill="#f0f6ff" fontSize="12">💾 Cache</text>

          <circle cx="700" cy="140" r="30" fill={step.highlight.includes('network') ? '#60a5fa' : '#3d6088'} />
          <text x="700" y="180" textAnchor="middle" fill="#f0f6ff" fontSize="12">📡 Network</text>

          {/* Arrows */}
          <line x1="130" y1="140" x2="370" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="0,0" className="flow-arrow" />
          <line x1="370" y1="180" x2="130" y2="140" stroke="#10b981" strokeWidth="2" strokeDasharray="0,0" className="flow-arrow" />
        </>
      )}

      {/* Twitter Fanout */}
      {lessonId === 'twitter_fanout' && (
        <>
          <circle cx="150" cy="140" r="28" fill={step.highlight.includes('user') ? '#60a5fa' : '#3d6088'} />
          <text x="150" y="175" textAnchor="middle" fill="#f0f6ff" fontSize="11">🐦 User</text>

          <circle cx="400" cy="60" r="28" fill={step.highlight.includes('queue') ? '#60a5fa' : '#3d6088'} />
          <text x="400" y="95" textAnchor="middle" fill="#f0f6ff" fontSize="11">📋 Queue</text>

          <rect x="350" y="140" width="100" height="80" rx="8" fill={step.highlight.includes('workers') ? 'rgba(96,165,250,0.2)' : 'rgba(61,96,136,0.2)'} stroke={step.highlight.includes('workers') ? '#60a5fa' : '#3d6088'} strokeWidth="2" />
          <text x="400" y="180" textAnchor="middle" fill="#f0f6ff" fontSize="11">⚙ Workers</text>

          <circle cx="650" cy="140" r="28" fill={step.highlight.includes('cache') ? '#60a5fa' : '#3d6088'} />
          <text x="650" y="175" textAnchor="middle" fill="#f0f6ff" fontSize="11">💾 Cache</text>

          {/* Flow */}
          <line x1="180" y1="140" x2="370" y2="80" stroke="#3b82f6" strokeWidth="2" className="flow-arrow" />
          <line x1="400" y1="130" x2="630" y2="140" stroke="#10b981" strokeWidth="2" className="flow-arrow" />
        </>
      )}

      {/* Uber Matching */}
      {lessonId === 'uber_matching' && (
        <>
          <circle cx="100" cy="100" r="28" fill={step.highlight.includes('rider') ? '#ec4899' : '#3d6088'} />
          <text x="100" y="140" textAnchor="middle" fill="#f0f6ff" fontSize="11">👤 Rider</text>

          <circle cx="400" cy="60" r="28" fill={step.highlight.includes('nearby-drivers') ? '#60a5fa' : '#3d6088'} />
          <text x="400" y="100" textAnchor="middle" fill="#f0f6ff" fontSize="10">📍 Geo</text>

          <g>
            <circle cx="300" cy="180" r="20" fill={step.highlight.includes('drivers') ? '#10b981' : '#3d6088'} />
            <circle cx="400" cy="190" r="20" fill={step.highlight.includes('drivers') ? '#10b981' : '#3d6088'} />
            <circle cx="500" cy="175" r="20" fill={step.highlight.includes('drivers') ? '#10b981' : '#3d6088'} />
          </g>
          <text x="400" y="225" textAnchor="middle" fill="#f0f6ff" fontSize="11">🚗 Nearby Drivers</text>

          <circle cx="650" cy="100" r="28" fill={step.highlight.includes('match') ? '#10b981' : '#3d6088'} />
          <text x="650" y="140" textAnchor="middle" fill="#f0f6ff" fontSize="11">✓ Match</text>

          {/* Flow */}
          <line x1="130" y1="110" x2="380" y2="70" stroke="#3b82f6" strokeWidth="2" className="flow-arrow" />
          <line x1="400" y1="95" x2="400" y2="160" stroke="#f59e0b" strokeWidth="2" className="flow-arrow" />
          <line x1="500" y1="160" x2="630" y2="110" stroke="#10b981" strokeWidth="2" className="flow-arrow" />
        </>
      )}

      {/* YouTube Recommendations */}
      {lessonId === 'youtube_recomm' && (
        <>
          <circle cx="100" cy="140" r="28" fill={step.highlight.includes('user') ? '#ff0000' : '#3d6088'} />
          <text x="100" y="180" textAnchor="middle" fill="#f0f6ff" fontSize="11">👤 User</text>

          <circle cx="300" cy="60" r="28" fill={step.highlight.includes('video') ? '#ff0000' : '#3d6088'} />
          <text x="300" y="100" textAnchor="middle" fill="#f0f6ff" fontSize="11">▶ Video</text>

          <circle cx="500" cy="140" r="28" fill={step.highlight.includes('analytics') ? '#60a5fa' : '#3d6088'} />
          <text x="500" y="180" textAnchor="middle" fill="#f0f6ff" fontSize="10">📊 Analytics</text>

          <circle cx="700" cy="80" r="28" fill={step.highlight.includes('ml') ? '#3b82f6' : '#3d6088'} />
          <text x="700" y="120" textAnchor="middle" fill="#f0f6ff" fontSize="11">🤖 ML</text>

          <circle cx="700" cy="200" r="28" fill={step.highlight.includes('feed') ? '#10b981' : '#3d6088'} />
          <text x="700" y="240" textAnchor="middle" fill="#f0f6ff" fontSize="11">🎥 Feed</text>

          {/* Flow */}
          <line x1="130" y1="135" x2="300" y2="80" stroke="#ff0000" strokeWidth="2" className="flow-arrow" />
          <line x1="330" y1="70" x2="480" y2="140" stroke="#3b82f6" strokeWidth="2" className="flow-arrow" />
          <line x1="530" y1="140" x2="680" y2="110" stroke="#3b82f6" strokeWidth="2" className="flow-arrow" />
          <line x1="700" y1="155" x2="700" y2="175" stroke="#10b981" strokeWidth="2" className="flow-arrow" />
        </>
      )}
    </svg>
  );
}
