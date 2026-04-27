// LearnTrack.js - Comprehensive system design learning path
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AnimatedLearning from '../components/AnimatedLearning';

const LEARNING_CONTENT = {
  hld: {
    title: 'High-Level Design (HLD)',
    icon: '📐',
    color: '#3b82f6',
    description: 'Master scalable system architecture and distributed systems basics',
    modules: [
      {
        id: 'scalability-intro',
        title: '1. Scalability Fundamentals',
        lessons: [
          {
            title: 'What is Scalability?',
            content: `Scalability is the ability of a system to handle growing amounts of work, users, or data without degrading performance.

Types of Scaling:
• Vertical Scaling: Adding more power to existing machines (CPU, RAM, disk)
• Horizontal Scaling: Adding more machines to the system

When to Scale:
- Response time increases above acceptable threshold
- Database becomes a bottleneck
- Cache hit rate drops below target
- Throughput cannot meet demand`,
            example: 'Twitter handles 500M tweets/day by horizontal scaling across API servers',
          },
          {
            title: 'Load Balancing',
            content: `Load Balancers distribute incoming requests across multiple servers to prevent any single server from becoming a bottleneck.

Load Balancing Algorithms:
• Round Robin: Distribute requests sequentially
• Least Connections: Send to server with fewest active connections
• Weighted Round Robin: Based on server capacity
• IP Hash: Same client always goes to same server
• Random: Randomly select server

Implementation Tips:
- Use health checks to remove failed servers
- Multiple load balancers for redundancy
- Session persistence when needed
- Monitor load balancer itself`,
            example: 'Nginx can handle 10,000+ concurrent connections per load balancer',
          },
        ],
      },
      {
        id: 'databases-at-scale',
        title: '2. Databases at Scale',
        lessons: [
          {
            title: 'Replication',
            content: `Replication creates copies of data across multiple servers for redundancy and availability.

Replication Types:
• Master-Slave: One master handles writes, slaves handle reads
• Multi-Master: Multiple masters can accept writes (complex)
• Read Replicas: Slaves only handle reads, no writes

Data Consistency:
• Strong Consistency: All reads see latest write (Master-Slave)
• Eventual Consistency: Replicas eventually consistent (faster but risky)

Replication Lag:
- Can range from milliseconds to seconds
- Plan application logic for potential stale data
- Cache layer can mitigate issues`,
            example: 'Netflix uses read replicas across regions to serve customers globally',
          },
          {
            title: 'Sharding (Partitioning)',
            content: `Sharding distributes data across multiple databases based on a shard key to handle massive datasets.

Sharding Strategies:
• Range-Based: By ID ranges (user_id 1-1000 on shard 1)
• Hash-Based: Hash function determines shard (consistent hashing)
• Directory-Based: Lookup table maps data to shard
• Geographic: Shard by region

Challenges:
- Hot spots: Some shards get more traffic than others
- Resharding: Adding new shards requires data migration
- Cross-shard queries: Complex joins across shards
- Transactions: ACID across shards is difficult`,
            example: 'Uber shards by city_id to isolate ride data geographically',
          },
        ],
      },
      {
        id: 'caching',
        title: '3. Caching Strategies',
        lessons: [
          {
            title: 'Cache Fundamentals',
            content: `Caches store frequently accessed data in memory for fast retrieval.

Cache Layers:
• Browser Cache: Client-side caching
• CDN Cache: Edge cache for static content
• Application Cache: In-process or distributed cache (Redis, Memcached)
• Database Cache: Query result caching

When to Cache:
- Data accessed frequently but updated infrequently
- Expensive computations (recommendations, analytics)
- Database queries that take > 10ms
- API responses that are large

Eviction Strategies:
• LRU (Least Recently Used): Remove least recently accessed
• FIFO (First In First Out): Remove oldest items
• LFU (Least Frequently Used): Remove least frequently accessed
• TTL (Time To Live): Expire after fixed time`,
            example: 'Instagram caches feed timelines in Redis for instant reload',
          },
          {
            title: 'Cache Invalidation',
            content: `cache invalidation is determining which cached data is no longer valid.

Invalidation Patterns:
• Time-Based (Expiry): Cache expires after TTL
• Event-Based: Cache cleared when data changes
• Dependency-Based: Clear related caches

Cache Invalidation Patterns:
1. Write-Through: Write to cache and DB simultaneously
2. Write-Behind: Write to cache first, later to DB (faster, risky)
3. Refresh-Ahead: Proactively refresh cache before expiry

Most Expensive Operation:
"There are two hard things in Computer Science:
 cache invalidation and naming things." - Phil Karlton`,
            example: 'YouTube invalidates video cache immediately when creator uploads new version',
          },
        ],
      },
    ],
  },
  lld: {
    title: 'Low-Level Design (LLD)',
    icon: '⚙',
    color: '#10b981',
    description: 'Learn API design, database schemas, and SOLID principles',
    modules: [
      {
        id: 'api-design',
        title: '1. API Design & Patterns',
        lessons: [
          {
            title: 'RESTful APIs',
            content: `REST (Representational State Transfer) uses HTTP methods to perform CRUD operations.

HTTP Methods:
• GET: Retrieve a resource (safe, idempotent)
• POST: Create a new resource (not idempotent by default)
• PUT: Replace entire resource (idempotent)
• PATCH: Partial update (may not be idempotent)
• DELETE: Remove resource (idempotent)

Best Practices:
• Use proper HTTP status codes
• Versioning: /api/v1/users
• Pagination: limit, offset parameters
• Filtering: /users?department=engineering
• Rate limiting: Prevent abuse
• CORS: Handle cross-origin requests`,
            example: '/api/v1/users/123 GET returns user #123 with 200 OK',
          },
          {
            title: 'GraphQL vs REST',
            content: `GraphQL is a query language that allows clients to request exactly the data they need.

REST Limitations:
• Over-fetching: Get more data than needed
• Under-fetching: Need multiple requests for related data
• Versioning: Create v1, v2, v3 as API evolves

GraphQL Advantages:
• Single endpoint
• Client specifies exact fields needed
• No versioning needed
• Great for mobile apps (reduce bandwidth)

GraphQL Challenges:
• Complexity: More complex to implement
• Caching: HTTP caching doesn't work directly
• Query depth attacks: Deeply nested queries can DoS server
• Learning curve: Different paradigm`,
            example: 'GitHub uses GraphQL to let clients query exactly what they need',
          },
        ],
      },
      {
        id: 'database-design',
        title: '2. Database Schema Design',
        lessons: [
          {
            title: 'Normalization',
            content: `Normalization organizes data to reduce redundancy and improve data integrity.

Normal Forms:
• 1NF: Atomic values, no repeating groups
• 2NF: 1NF + no partial dependencies
• 3NF: 2NF + no transitive dependencies
• BCNF: Stricter than 3NF

When to Denormalize:
- Aggregate data (total_sales in orders table)
- Frequently joined tables
- Read-heavy workloads
- Cache-like column with computed values

Indexing:
• Single-column: Index(user_id)
• Composite: Index(user_id, created_at)
• Full-text: For text search
• B-Tree: Default, good for range queries`,
            example: 'Separate users and orders tables to avoid data duplication',
          },
          {
            title: 'SQL vs NoSQL',
            content: `SQL databases are ACID compliant relational databases. NoSQL databases prioritize scalability and flexibility.

SQL (PostgreSQL, MySQL):
✓ ACID guarantees
✓ Complex joins
✓ Flexible queries
✗ Scales vertically (expensive)
✗ Schema changes risky

NoSQL (MongoDB, DynamoDB):
✓ Scales horizontally
✓ Flexible schema
✓ Fast writes
✗ Limited query flexibility
✗ No complex joins
✗ Eventual consistency

Choice:
- Relational data? SQL
- Unstructured/Semi-structured? NoSQL
- Need transactions? SQL
- Need to scale to PetaBytes? NoSQL`,
            example: 'Use PostgreSQL for user data, MongoDB for user events',
          },
        ],
      },
    ],
  },
  cases: {
    title: 'Case Studies',
    icon: '🎯',
    color: '#8b5cf6',
    description: 'Analyze real-world architectures from Netflix, YouTube, and Uber',
    modules: [
      {
        id: 'netflix-deep-dive',
        title: '1. Netflix: Video at Scale',
        lessons: [
          {
            title: 'Streaming Architecture',
            content: `Netflix delivers 15% of global internet traffic. Key components:

Content Delivery:
• CDN: Open Connect (Netflix's own CDN in ISP networks)
• Encoding: Each title in 1,200+ variants
• Adaptive Bitrate: Adjusts quality based on bandwidth
• Playback: Multiple codec support

Recommendation Engine:
• Personalization: 80% of content watched from recommendations
• ML Models: Collaborative filtering + deep learning
• A/B Testing: Constantly optimizing recommendations
• Real-time: Recommendations update as user watches

Challenges Solved:
- Sub-second startup time
- Zero buffering experience
- Support 700+ device types
- Multi-region deployment`,
            example: 'Netflix adapted to ISP networks by installing servers directly in ISPs',
          },
          {
            title: 'Microservices & Chaos Engineering',
            content: `Netflix pioneered microservices and chaos engineering.

Microservices Benefits:
• Independent scaling
• Technology diversity
• Team autonomy
• Fault isolation

Chaos Engineering:
• Chaos Monkey: Randomly kills servers
• Gremlin: Simulate network failures
• Latency Monkey: Inject random delays
• Purpose: Test system resilience

Lessons:
- Assume failures will happen
- Auto-recovery is essential
- Monitor everything
- Failed deployments must be quick to rollback`,
            example: 'Netflix kills random servers daily in production to ensure resilience',
          },
        ],
      },
      {
        id: 'uber-geospatial',
        title: '2. Uber: Geospatial & Real-Time',
        lessons: [
          {
            title: 'Geospatial Indexing',
            content: `Uber needs to find nearby drivers within seconds.

Geohashing:
• Divide earth into grid cells
• Each cell is a hash (ez764)
• Nearby points have similar hashes
• Range queries become cell lookups

QuadTree:
• Hierarchical grid structure
• Divide space into 4 quadrants repeatedly
• Balance tree for uniform distribution
• Efficient nearest neighbor search

Challenges:
- Millions of concurrent locations
- Location updates every 2-4 seconds
- < 100ms query latency needed
- Cross-region consistency`,
            example: 'Uber uses geohashing + Redis for real-time driver location index',
          },
          {
            title: 'Real-Time Matching & Pricing',
            content: `Matching drivers to riders and dynamic pricing.

Matching Algorithm:
1. Get nearest available drivers (geospatial query)
2. Rank by: driver rating, acceptance rate, vehicle type
3. Send offer to top 3 drivers in parallel
4. First to accept gets the ride
5. If declined, expand search radius

Surge Pricing:
• Supply vs Demand ratio
• Price multiplier: 1x to 10x+
• Updates every 100 milliseconds
• Encourages drivers to high-demand areas

Challenges:
- All matching needs to happen in 30 seconds
- Thousands of matching requests/second
- Driver availability changes constantly
- Fair assignment algorithm`,
            example: 'During peak hours, Uber might charge 4x normal price to incentivize drivers',
          },
        ],
      },
    ],
  },
};

export default function LearnTrack() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [animatedLessonId, setAnimatedLessonId] = useState(null);

  const track = LEARNING_CONTENT[trackId];

  if (!track) {
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

  const currentModule = track.modules[selectedModule];
  const currentLesson = currentModule.lessons[selectedLesson];

  return (
    <div style={{ background: '#020617', minHeight: '100vh' }}>
      {/* Header */}
      <nav style={{
        borderBottom: '1px solid #0f2040',
        position: 'sticky',
        top: 0,
        background: 'rgba(2,6,23,0.95)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 40px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3d6088',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              ← Home
            </button>
            <div style={{ width: 1, height: 16, background: '#1e3a5f' }} />
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: '#f0f6ff',
            }}>
              {track.icon} {track.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, padding: '40px' }}>
        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: '#f0f6ff',
            marginBottom: 20,
          }}>
            Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {track.modules.map((module, i) => (
              <button
                key={i}
                onClick={() => { setSelectedModule(i); setSelectedLesson(0); }}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  background: selectedModule === i ? `${track.color}15` : 'transparent',
                  border: `1px solid ${selectedModule === i ? track.color + '40' : '#1e3a5f'}`,
                  borderRadius: 8,
                  color: selectedModule === i ? track.color : '#7aa2c8',
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: selectedModule === i ? 600 : 400,
                }}
              >
                {module.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Module & Lesson Selection */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 16,
              overflowX: 'auto',
              paddingBottom: 6,
            }}>
              {currentModule.lessons.map((lesson, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedLesson(i)}
                  style={{
                    padding: '8px 16px',
                    background: selectedLesson === i ? track.color : '#0f1e35',
                    border: `1px solid ${selectedLesson === i ? track.color : '#1e3a5f'}`,
                    borderRadius: 6,
                    color: selectedLesson === i ? '#fff' : '#7aa2c8',
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lesson.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Lesson Content */}
          <div style={{
            background: '#0f1e35',
            border: `1px solid ${track.color}30`,
            borderRadius: 12,
            padding: 32,
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: track.color,
              marginBottom: 20,
              letterSpacing: '-0.01em',
            }}>
              {currentLesson.title}
            </h2>

            <div style={{
              color: '#5d8aaa',
              fontSize: 14,
              lineHeight: 1.8,
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'pre-wrap',
              marginBottom: 32,
            }}>
              {currentLesson.content}
            </div>

            {/* Animated Lesson Button - Available for case studies */}
            {trackId === 'cases' && (
              <button
                onClick={() => {
                  const lessonMap = {
                    'Streaming Architecture': 'netflix_streaming',
                    'Microservices & Chaos Engineering': null, // No animation for this
                    'Geospatial Indexing': 'uber_matching',
                    'Real-Time Matching & Pricing': 'uber_matching',
                  };
                  const animId = lessonMap[currentLesson.title];
                  if (animId) setAnimatedLessonId(animId);
                }}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(59,130,246,0.4)',
                  borderRadius: 8,
                  color: '#60a5fa',
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: 24,
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; }}
              >
                ▶ Watch Animated Lesson
              </button>
            )}

            {/* Example Box */}
            {currentLesson.example && (
              <div style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: 8,
                padding: 16,
                marginTop: 24,
              }}>
                <div style={{
                  fontSize: 11,
                  color: '#60a5fa',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 8,
                  fontWeight: 700,
                }}>
                  💡 Real-World Example
                </div>
                <div style={{
                  fontSize: 13,
                  color: '#5d8aaa',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {currentLesson.example}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'space-between',
            marginTop: 32,
          }}>
            <button
              onClick={() => {
                if (selectedLesson > 0) setSelectedLesson(selectedLesson - 1);
                else if (selectedModule > 0) setSelectedModule(selectedModule - 1);
              }}
              disabled={selectedModule === 0 && selectedLesson === 0}
              style={{
                padding: '12px 24px',
                background: (selectedModule === 0 && selectedLesson === 0) ? '#0a1628' : track.color,
                border: `1px solid ${(selectedModule === 0 && selectedLesson === 0) ? '#1e3a5f' : track.color}`,
                borderRadius: 8,
                color: (selectedModule === 0 && selectedLesson === 0) ? '#3d6088' : '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: (selectedModule === 0 && selectedLesson === 0) ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              ← Previous
            </button>
            <div style={{
              color: '#3d6088',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Module {selectedModule + 1} / {track.modules.length}
            </div>
            <button
              onClick={() => {
                if (selectedLesson < currentModule.lessons.length - 1) {
                  setSelectedLesson(selectedLesson + 1);
                } else if (selectedModule < track.modules.length - 1) {
                  setSelectedModule(selectedModule + 1);
                  setSelectedLesson(0);
                }
              }}
              disabled={selectedModule === track.modules.length - 1 && selectedLesson === currentModule.lessons.length - 1}
              style={{
                padding: '12px 24px',
                background: (selectedModule === track.modules.length - 1 && selectedLesson === currentModule.lessons.length - 1) ? '#0a1628' : track.color,
                border: `1px solid ${(selectedModule === track.modules.length - 1 && selectedLesson === currentModule.lessons.length - 1) ? '#1e3a5f' : track.color}`,
                borderRadius: 8,
                color: (selectedModule === track.modules.length - 1 && selectedLesson === currentModule.lessons.length - 1) ? '#3d6088' : '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: (selectedModule === track.modules.length - 1 && selectedLesson === currentModule.lessons.length - 1) ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Animated Learning Modal */}
      <AnimatedLearning
        lessonId={animatedLessonId}
        isOpen={!!animatedLessonId}
        onClose={() => setAnimatedLessonId(null)}
      />
    </div>
  );
}
