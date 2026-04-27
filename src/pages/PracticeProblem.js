// PracticeProblem.js - Solve real system design problems
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Canvas from '../playground/Canvas';
import SuggestionsPanel from '../components/SuggestionsPanel';
import SystemDesignPanel from '../components/SystemDesignPanel';
import Chatbot from '../components/Chatbot';
import VoiceAssistant from '../components/VoiceAssistant';
import { NODE_TYPES, runSimulation, generateSuggestions } from '../utils/simulationEngine';

const PRACTICE_DATA = {
  twitter: {
    title: 'Design Twitter',
    difficulty: 'Medium',
    icon: '🐦',
    description: 'Design a real-time social media platform like Twitter.',
    problem: `
## Problem Statement

Design a system like Twitter that can handle:
- Users posting tweets in real-time
- Fetching timelines for followers
- Trending topics
- Real-time notifications
- Millions of concurrent users

## Functional Requirements
- Users can post, like, retweet, and comment on tweets
- Users can search for tweets
- Users can follow/unfollow other users
- Real-time feed updates
- Trending topics calculation

## Non-Functional Requirements
- Highly available and scalable
- Eventual consistency acceptable for feed
- Low latency for timeline delivery
- Handle 100K+ requests per second
- Support 500M+ users

## Key Challenges
1. Timeline fanout - how to efficiently deliver to followers
2. Real-time updates with high throughput
3. Trending topics calculation
4. Search scalability
`,
    hints: [
      'Use fanout-on-write or fanout-on-read for timelines',
      'Consider using message queues for real-time updates',
      'Use caching aggressively for hot tweets and timelines',
      'Database sharding by user ID',
      'Search using Elasticsearch or similar',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Load Balancer: Distribute incoming requests across API servers',
        'API Servers: Stateless with business logic',
        'Cache Layer: Redis for frequently accessed tweets and feeds',
        'Database: Sharded based on user ID for scalability',
      ],
    },
  },
  instagram: {
    title: 'Design Instagram',
    difficulty: 'Medium',
    icon: '📸',
    description: 'Design a photo sharing platform with stories and recommendations.',
    problem: `
## Problem Statement

Design a system like Instagram that handles:
- Photo uploads and storage
- Photo feeds
- Stories (24-hour ephemeral content)
- Direct messaging
- Recommendations and discovery

## Functional Requirements
- Users can upload photos
- Users can view timeline of photos from followed accounts
- Users can post stories
- Users can like and comment on photos
- Real-time notifications

## Non-Functional Requirements
- Support 2B+ users
- Handle 10M+ concurrent users
- Serve media with low latency
- High availability and consistency for photos

## Key Challenges
1. Storing and serving massive amounts of images
2. Real-time feed generation
3. Handling distributed storage
4. Photo transcoding and optimization
`,
    hints: [
      'Use CDN for image distribution and caching',
      'Object storage (S3-like) for photo storage',
      'Microservices for different features (feed, stories, DMs)',
      'Message queue for async image processing',
      'In-memory cache for timeline feeds',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Content Delivery Network for image serving',
        'S3/Object Storage for persistent image storage',
        'Message Queue for async image processing',
        'Distributed cache for feed materialization',
      ],
    },
  },
  netflix: {
    title: 'Design Netflix',
    difficulty: 'Hard',
    icon: '🎬',
    description: 'Design a global video streaming platform with adaptive bitrate.',
    problem: `
## Problem Statement

Design Netflix - a global video streaming platform handling:
- Video uploads and transcoding
- Streaming with adaptive bitrate (ABR)
- Global content delivery with low latency
- Personalized recommendations
- User analytics and monitoring

## Functional Requirements
- Users can play videos in multiple qualities
- Videos are served from CDN closest to user
- Recommendations based on watch history
- Search and browse catalog
- Profile management

## Non-Functional Requirements
- Serve billions of hours of content
- Handle millions of concurrent streams
- Support streaming to 200+ countries
- Sub-second startup latency
- Handle bandwidth variations gracefully

## Key Challenges
1. Video encoding at massive scale (multiple codecs, qualities)
2. Global CDN optimization
3. Adaptive bitrate streaming
4. Recommendation engine at scale
5. Handling simultaneous millions of streams
`,
    hints: [
      'Use multiple encoding profiles for different devices',
      'Global CDN with edge caching',
      'Implement DASH or HLS for streaming',
      'Machine learning models for recommendations',
      'Analytics pipeline for viewing behavior',
      'Database for metadata, separate from video storage',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Video encoding farm for transcoding content',
        'Global CDN for content distribution',
        'Metadata database separate from storage',
        'Message queues for async encoding jobs',
      ],
    },
  },
  whatsapp: {
    title: 'Design WhatsApp',
    difficulty: 'Hard',
    icon: '💬',
    description: 'End-to-end encrypted messaging with realtime delivery.',
    problem: `
## Problem Statement

Design WhatsApp - a global messaging platform with:
- 1:1 and group messaging
- End-to-end encryption (E2EE)
- Real-time message delivery
- Offline message queuing
- Message read receipts
- Typing indicators

## Functional Requirements
- Users can send/receive text messages
- Group chat support (100+ members)
- Push notifications for offline users
- Message encryption and decryption
- Last seen status
- Online/offline status

## Non-Functional Requirements
- Handle 100M+ concurrent users
- Sub-second message delivery
- 99.99% availability
- High throughput (1M+ messages/sec)
- End-to-end security

## Key Challenges
1. Real-time message delivery at massive scale
2. End-to-end encryption key management
3. Group message fanout efficiency
4. Offline message persistence
5. Handling network failures gracefully
`,
    hints: [
      'Use WebSocket for real-time bidirectional communication',
      'Message queue for reliable delivery',
      'End-to-end encryption using Signal Protocol',
      'Group message fanout strategy',
      'Persistent message store for offline users',
      'Message deduplication by ID',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'WebSocket gateway for real-time connections',
        'Message brokers (Kafka) for reliable delivery',
        'Database for message persistence',
        'Cache for recent messages in memory',
      ],
    },
  },
  uber: {
    title: 'Design Uber',
    difficulty: 'Hard',
    icon: '🚗',
    description: 'Real-time ride matching with geolocation and pricing.',
    problem: `
## Problem Statement

Design Uber - a ride-hailing platform with:
- Real-time driver location tracking
- Ride request matching
- Surge pricing
- Payment processing
- Driver and passenger ratings
- Real-time ride tracking

## Functional Requirements
- Users can request rides
- Nearby drivers can accept requests
- Real-time location updates
- Dynamic pricing based on supply/demand
- Rating system for both parties
- Payment and billing

## Non-Functional Requirements
- Handle millions of concurrent users/drivers
- Sub-millisecond matching latency
- Real-time location updates every 2-4 seconds
- Geographic scalability (multi-region)
- High availability

## Key Challenges
1. Geo-spatial indexing for nearby driver search
2. Real-time matching algorithm at scale
3. Surge pricing calculation
4. Handling concurrent ride requests
5. Cross-region consistency
`,
    hints: [
      'Use geohashing or quadtree for spatial partitioning',
      'Redis for real-time driver location layer',
      'Consistent hashing for driver-to-server mapping',
      'WebSocket for live tracking updates',
      'Machine learning for surge pricing',
      'Message queue for asynchronous ride operations',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Location Service with geospatial index',
        'Matching Service with real-time algorithm',
        'In-memory cache for active driver positions',
        'Message queue for ride events',
      ],
    },
  },
  'url-shortener': {
    title: 'URL Shortener',
    difficulty: 'Easy',
    icon: '🔗',
    description: 'Service like bit.ly to shorten and redirect URLs.',
    problem: `
## Problem Statement

Design a URL shortening service (like bit.ly) that:
- Accepts long URLs and generates short codes
- Redirects short codes to original URLs
- Tracks click analytics
- Supports custom short codes
- Handles massive redirect traffic

## Functional Requirements
- Generate short unique code from long URL
- Redirect from short code to original URL
- Track statistics (clicks, geographic data)
- Support custom alias creation
- Expiration of shortened URLs

## Non-Functional Requirements
- High availability for redirects
- Very fast lookup (<10ms)
- Support billions of shortened URLs
- Extremely high read traffic
- Scalable storage

## Key Challenges
1. Generating unique short codes at scale
2. Handling massive read traffic for redirects
3. Link collision detection
4. Traffic analytics collection
`,
    hints: [
      'Use base62 encoding for short code generation',
      'Hash long URL to detect collisions',
      'Cache frequently accessed URLs in Redis',
      'Separate read and write paths',
      'Use CDN for serving redirects',
      'Analytics in separate processing pipeline',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Load Balancer for request distribution',
        'Redis cache for frequently accessed URLs',
        'Main database for URL storage',
        'Separate analytics data pipeline',
      ],
    },
  },
  'rate-limiter': {
    title: 'Rate Limiter',
    difficulty: 'Medium',
    icon: '🛡',
    description: 'Service to limit request rate per user/IP.',
    problem: `
## Problem Statement

Design a distributed rate limiting service that:
- Limits requests per user/IP
- Supports different limit policies
- Works across distributed system
- Handles high concurrency
- Fair and consistent rate limiting

## Functional Requirements
- Check if request should be allowed
- Track request count per user/IP
- Support different time windows
- Return remaining quota
- Reset limits periodically

## Non-Functional Requirements
- Sub-millisecond response time
- Handle millions of concurrent users
- Distributed across multiple servers
- No central bottleneck
- Survive server failures

## Key Challenges
1. Distributed state consistency
2. Time window accuracy
3. Low latency at high concurrency
4. Memory efficiency with millions of users
`,
    hints: [
      'Token bucket algorithm for per-user limits',
      'Sliding window for accurate rate limiting',
      'Redis for distributed state',
      'Lua scripts for atomic operations',
      'Clock synchronization between servers',
      'Graceful degradation under overload',
    ],
    architecture: {
      components: ['LB', 'API', 'CACHE', 'DB'],
      recommendations: [
        'Rate limiter middleware on all API servers',
        'Redis cluster for distributed state',
        'Token bucket algorithm implementation',
        'Monitoring for limiting effectiveness',
      ],
    },
  },
};

export default function PracticeProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const problem = PRACTICE_DATA[problemId];

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [trafficLoad, setTrafficLoad] = useState(1000);
  const [customTraffic, setCustomTraffic] = useState('1000');
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showProblem, setShowProblem] = useState(true);
  const [rightTab, setRightTab] = useState('suggestions');

  if (!problem) {
    return (
      <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#7aa2c8' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>404</div>
          <button onClick={() => navigate('/')} style={{
            padding: '10px 20px',
            background: '#3b82f6',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const TOOLBAR_NODES = ['LB', 'API', 'CACHE', 'DB'];

  const addNode = (type) => {
    const id = `${type}-${Date.now()}`;
    const defaultPositions = {
      LB: { x: 180, y: 220 },
      API: { x: 380, y: 180 + nodes.filter(n => n.type === 'API').length * 110 },
      CACHE: { x: 560, y: 160 },
      DB: { x: 700, y: 260 + nodes.filter(n => n.type === 'DB').length * 100 },
    };
    const pos = defaultPositions[type] || { x: 300, y: 200 };
    setNodes(prev => [...prev, { id, type, x: pos.x, y: pos.y }]);
  };

  const updateNode = (nodeId, updates) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, ...updates } : n));
  };

  const addEdge = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    const exists = edges.some(e => e.source === sourceId && e.target === targetId);
    if (exists) return;
    const id = `e-${sourceId}-${targetId}`;
    setEdges(prev => [...prev, { id, source: sourceId, target: targetId }]);
  };

  const handleSelectNode = (nodeId) => {
    if (!nodeId) {
      setSelectedNodeId(null);
      return;
    }

    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        addEdge(connectingFrom, nodeId);
      }
      setConnectingFrom(null);
      setSelectedNodeId(nodeId);
    } else if (selectedNodeId === nodeId) {
      setConnectingFrom(nodeId);
    } else {
      setSelectedNodeId(nodeId);
    }
  };

  const handleRunSimulation = () => {
    if (nodes.length === 0) return;
    setIsSimulating(true);
    const results = runSimulation(nodes, edges, trafficLoad);
    setSimulationResults(results);
    setSuggestions(generateSuggestions(results, nodes, edges));
    setTimeout(() => setIsSimulating(false), 8000);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setSimulationResults(null);
    setSuggestions([]);
    setIsSimulating(false);
    setSelectedNodeId(null);
    setConnectingFrom(null);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#020617', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        height: 56,
        borderBottom: '1px solid #0f2040',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 16,
        background: '#020617',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none',
            color: '#3d6088', fontSize: 11, cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          ← Home
        </button>
        <div style={{ width: 1, height: 16, background: '#1e3a5f' }} />
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: '#f0f6ff',
        }}>
          {problem.icon} {problem.title}
        </span>
        <span style={{
          fontSize: 10,
          color: '#f59e0b',
          background: '#f59e0b20',
          padding: '3px 10px',
          borderRadius: 12,
          fontFamily: "'JetBrains Mono', monospace",
          marginLeft: 'auto',
        }}>
          {problem.difficulty.toUpperCase()}
        </span>
      </header>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Problem Panel */}
        {showProblem && (
          <div style={{
            width: 350,
            background: '#0d1b2e',
            borderRight: '1px solid #0f2040',
            overflow: 'auto',
            padding: 20,
            fontSize: 12,
            color: '#5d8aaa',
            fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.6,
          }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: '#f0f6ff', marginBottom: 8 }}>Problem</h3>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 11 }}>
                {problem.problem}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ color: '#f0f6ff', marginBottom: 8 }}>Hints</h3>
              <ul style={{ paddingLeft: 16 }}>
                {problem.hints.map((hint, i) => (
                  <li key={i} style={{ marginBottom: 6, color: '#7aa2c8' }}>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Left Toolbar */}
        <div style={{
          width: 64,
          background: '#020617',
          borderRight: showProblem ? 'none' : '1px solid #0f2040',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: 6,
          flexShrink: 0,
        }}>
          <button
            onClick={() => setShowProblem(!showProblem)}
            title="Toggle problem details"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: '#0d1b2e',
              border: '1px solid #1e3a5f',
              color: '#7aa2c8',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.color = '#3b82f6'; }}
            onMouseLeave={e => { e.target.style.borderColor = '#1e3a5f'; e.target.style.color = '#7aa2c8'; }}
          >
            📋
          </button>
          <div style={{ width: 28, height: 1, background: '#0f2040', margin: '4px 0' }} />

          <div style={{ fontSize: 9, color: '#1e3a5f', textAlign: 'center', marginBottom: 4 }}>Add</div>
          {TOOLBAR_NODES.map(type => {
            const def = NODE_TYPES[type];
            return (
              <button
                key={type}
                onClick={() => addNode(type)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: '#0d1b2e',
                  border: '1px solid #1e3a5f',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = def.color; e.currentTarget.style.background = `${def.color}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3a5f'; e.currentTarget.style.background = '#0d1b2e'; }}
              >
                <span style={{ fontSize: 13 }}>{def.icon}</span>
                <span style={{ fontSize: 8, color: def.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                  {def.short}
                </span>
              </button>
            );
          })}

          <div style={{ width: 28, height: 1, background: '#0f2040', margin: '4px 0' }} />
          <div style={{ fontSize: 9, color: '#1e3a5f', textAlign: 'center', lineHeight: 1.4 }}>
            <span style={{ display: 'block', fontSize: 14, color: '#3d6088', fontWeight: 700 }}>
              {nodes.length}
            </span>
            nodes
          </div>
          <div style={{ fontSize: 9, color: '#1e3a5f', textAlign: 'center', lineHeight: 1.4 }}>
            <span style={{ display: 'block', fontSize: 14, color: '#3d6088', fontWeight: 700 }}>
              {edges.length}
            </span>
            edges
          </div>
        </div>

        {/* Canvas */}
        <Canvas
          nodes={nodes}
          edges={edges}
          simulationResults={simulationResults}
          isSimulating={isSimulating}
          onAddNode={addNode}
          onUpdateNode={updateNode}
          onAddEdge={addEdge}
          onSelectNode={handleSelectNode}
          selectedNodeId={selectedNodeId}
          connectingFrom={connectingFrom}
          onStartConnect={setConnectingFrom}
        />

        {/* Right Panel */}
        <div style={{
          width: 280,
          background: '#020617',
          borderLeft: '1px solid #0f2040',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #0f2040',
            flexShrink: 0,
          }}>
            {['suggestions', 'insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${rightTab === tab ? '#3b82f6' : 'transparent'}`,
                  color: rightTab === tab ? '#f0f6ff' : '#3d6088',
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: -1,
                }}
              >
                {tab === 'suggestions' ? 'Suggestions' : 'Insights'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {rightTab === 'suggestions' ? (
              <SuggestionsPanel suggestions={suggestions} />
            ) : (
              <SystemDesignPanel
                nodes={nodes}
                edges={edges}
                simulationResults={simulationResults}
                selectedNodeId={selectedNodeId}
              />
            )}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid #0f2040', flexShrink: 0, display: 'flex', gap: 8 }}>
            <button
              onClick={handleRunSimulation}
              disabled={nodes.length === 0}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: nodes.length > 0 ? '#3b82f6' : '#0a1628',
                border: 'none',
                borderRadius: 6,
                color: nodes.length > 0 ? '#fff' : '#3d6088',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              {isSimulating ? '◉ Running' : '▶ Run'}
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: '8px 12px',
                background: 'none',
                border: '1px solid #1e3a5f',
                borderRadius: 6,
                color: '#3d6088',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
