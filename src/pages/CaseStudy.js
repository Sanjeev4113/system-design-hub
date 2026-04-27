// CaseStudy.js - Detailed case study breakdowns
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CASE_STUDIES = {
  netflix: {
    title: 'Netflix',
    icon: '🎬',
    description: 'Global video streaming platform with adaptive bitrate streaming',
    color: '#e50914',
    sections: [
      {
        title: 'Overview',
        content: `Netflix serves video content to 250+ million subscribers across 190+ countries. It handles 200+ million hours watched per day globally.

Key Statistics:
- 250M+ members globally
- 200M hours watched daily
- Available in 190+ countries
- Streams across 700+ device types
- 150TB+ of video content`,
      },
      {
        title: 'Core Architecture',
        content: `Netflix architecture consists of several key layers:

1. **Client Layer** - Web, iOS, Android, Smart TVs
   - Connected to CDN for video delivery
   - Local storage for offline viewing

2. **API Gateway Layer**
   - Routes requests to appropriate microservice
   - Handles authentication and authorization
   
3. **Microservices**
   - User Service: Profile and preference management
   - Recommendation Service: ML-based personalization
   - Streaming Service: Playback session management
   - Search Service: Content discovery
   - Billing Service: Payment processing

4. **Data Layer**
   - Primary Database: Metadata, user profiles
   - NoSQL: Session data, analytics
   - Cache: Redis for hot data`,
      },
      {
        title: 'Video Delivery',
        content: `Netflix uses a sophisticated video delivery system:

1. **Video Encoding**
   - Multiple codec formats (H.264, VP9, H.265)
   - Multiple resolutions (480p to 4K)
   - Different bitrates for different connection speeds
   - Progressive encoding with priority queue

2. **CDN Strategy**
   - Netflix CDN called "Open Connect"
   - Edge caches strategically placed in ISPs
   - Local caching reduces upstream traffic
   - Over 17,000+ servers in ISP networks

3. **Adaptive Bitrate (ABR)**
   - Monitors network bandwidth in real-time
   - Adjusts video quality on-the-fly
   - Algorithm: network speed, device capability, content
   - DASH/HLS protocols for streaming

4. **Storage**
   - S3-like object storage for video files
   - Distributed across multiple regions
   - Replication for high availability`,
      },
      {
        title: 'Scalability Challenges',
        content: `Netflix faces massive scalability challenges:

1. **Concurrent Streaming**
   - Handling 10M+ concurrent streams
   - Peak traffic during evening hours
   - Load balancing across regions

2. **Playback Quality**
   - Sub-second startup latency
   - Zero buffering experience
   - Seamless quality transitions

3. **Regional Issues**
   - Network congestion varies by region
   - ISP partnership for caching
   - Local content delivery optimization

4. **Device Diversity**
   - Support 700+ device types
   - Different screen sizes and capabilities
   - Bandwidth optimization per device

Solutions:
- Microservices architecture for independent scaling
- Regional distribution of content
- Open Connect CDN for efficient caching
- Intelligent load balancing`,
      },
      {
        title: 'Recommendation Engine',
        content: `Netflix recommendation system is core to user engagement:

1. **Data Collection**
   - Viewing history per user
   - Watch time, pause points, rewinding
   - Search queries, ratings
   - Device and time of day
   - Network conditions

2. **ML Models**
   - Collaborative filtering
   - Content-based filtering
   - Matrix factorization
   - Neural networks
   - Ensemble models

3. **Processing**
   - Offline batch training: daily/weekly
   - Online real-time serving
   - A/B testing for deployment
   - Feature stores for model data

4. **Impact**
   - 80% of watches from recommendations
   - Drives engagement and retention
   - Reduces content discovery friction`,
      },
      {
        title: 'Monitoring & Analytics',
        content: `Netflix has extensive monitoring:

1. **Metrics Tracked**
   - Streaming quality (bitrate, resolution)
   - Startup latency
   - Buffering events
   - Device health
   - Network conditions

2. **Data Pipeline**
   - Kafka for event streaming
   - Spark for processing
   - Analytics databases
   - Real-time dashboards

3. **Alerting**
   - Automated anomaly detection
   - Performance degradation alerts
   - Regional issue detection
   - Proactive notifications`,
      },
    ],
  },
  youtube: {
    title: 'YouTube',
    icon: '📹',
    description: 'User-generated content video platform with search and recommendations',
    color: '#ff0000',
    sections: [
      {
        title: 'Overview',
        content: `YouTube is the world's largest video platform with 2+ billion logged-in users monthly.

Key Statistics:
- 2.7B+ logged-in users monthly
- 500+ hours uploaded per minute
- 1B+ hours watched daily
- Available in 80+ languages
- Video search in 30+ languages`,
      },
      {
        title: 'Core Architecture',
        content: `YouTube handles massive content diversity:

1. **Content Ingestion**
   - Upload APIs for content creators
   - Immediate processing pipeline
   - Multiple codec transcoding
   - Distributed processing jobs

2. **Search & Discovery**
   - Full-text video search
   - Recommendation personalization
   - Trending discovery
   - Search as you type

3. **Metadata Storage**
   - Video information (title, description, duration)
   - User-generated data (comments, likes)
   - Analytics (view count, engagement)
   - Relationships (creator, subscribers)

4. **Playback**
   - Adaptive streaming
   - Quality selection
   - Resume from last position
   - Offline downloads for mobile`,
      },
      {
        title: 'Video Processing',
        content: `Processing user-generated videos at scale:

1. **Transcoding**
   - Input: Any codec/format from users
   - Output: Multiple formats for devices
   - Processing: Distributed encoding farm
   - Optimization: Priority for popular content

2. **Quality Control**
   - Copyright detection (Content ID)
   - Adult content detection
   - Policy violation screening
   - Automated and manual review

3. **Storage**
   - Distributed replica storage
   - Hot/cold storage tiering
   - Geographically distributed
   - Erasure coding for redundancy

4. **Delivery**
   - YouTube's own infrastructure
   - CDN partnership with ISPs
   - Progressive download + streaming
   - Adaptive quality selection`,
      },
      {
        title: 'Search & Ranking',
        content: `Complex search and ranking system:

1. **Indexing**
   - Full-text index of video metadata
   - User comments and descriptions
   - Real-time indexing for new content
   - Language-specific indexes

2. **Ranking Signals**
   - View count and growth
   - Engagement (likes, comments, shares)
   - Click-through rate in search results
   - Watch time and retention
   - Recency

3. **Personalization**
   - Watch history
   - Search history
   - Subscriptions and playlists
   - Device context
   - Geographic location

4. **Real-time Updates**
   - Trending videos updated hourly
   - Popular searches by region
   - Emerging topics detection
   - Seasonal content optimization`,
      },
      {
        title: 'Scalability Architecture',
        content: `Scaling to handle creator and viewer growth:

1. **Microservices**
   - Upload service
   - Transcoding service
   - Search service
   - Recommendation service
   - Analytics service

2. **Databases**
   - Spanner for distributed ACID
   - Bigtable for time-series
   - Memcache for session data
   - Elasticsearch for search

3. **Message Queues**
   - Kafka/Pub-Sub for events
   - Asynchronous processing
   - Decoupling services
   - Reliable delivery

4. **Load Balancing**
   - Geographic load distribution
   - Consistent hashing
   - Graceful degradation
   - Canary deployments`,
      },
      {
        title: 'Creator Tools',
        content: `Supporting content creators at scale:

1. **Analytics Dashboard**
   - Real-time view count
   - Engagement metrics
   - Audience demographics
   - Revenue tracking
   - Traffic sources

2. **Monetization**
   - Ad placement
   - Channel memberships
   - Super Chat/Super Thanks
   - YouTube Premium revenue share

3. **Community Features**
   - Comments and replies
   - Community posts
   - Live streaming
   - Premieres
   - Shorts (short-form video)

4. **Creator Support**
   - Copyright matching
   - Earnings optimization
   - Growth tools
   - Educational resources`,
      },
    ],
  },
  uber: {
    title: 'Uber',
    icon: '🚕',
    description: 'Real-time ride-matching platform with geolocation',
    color: '#000000',
    sections: [
      {
        title: 'Overview',
        content: `Uber operates in 70+ countries, handling millions of rides daily with real-time matching.

Key Statistics:
- 100M+ monthly active users
- 3.9M+ active drivers
- Available in 70+ countries
- 19M+ rides on peak days
- Sub-minute response times`,
      },
      {
        title: 'Core System',
        content: `Uber's core is real-time ride matching:

1. **Location Tracking**
   - Real-time GPS updates from drivers
   - Update frequency: 4-5 seconds
   - Massive scale: millions of concurrent locations
   - Low latency requirements

2. **Matching Engine**
   - Receives ride request from passenger
   - Filters nearby available drivers (typically 1-2km radius)
   - Ranks by: acceptance rate, rating, proximity
   - Offers ride to top-ranked drivers
   - Timeout: 30 seconds if no acceptance

3. **Core Entities**
   - Users/Passengers
   - Drivers
   - Ride requests
   - Trip history
   - Ratings and reviews

4. **Real-time Communication**
   - Push notifications for ride offers
   - WebSocket for live tracking
   - Updates during ride
   - Post-ride ratings`,
      },
      {
        title: 'Geo-Spatial Solutions',
        content: `Handling geolocation at massive scale:

1. **Geo-Partitioning**
   - Divide map into cells/grids
   - HexBin or QuadTree cell structures
   - Each cell has database partition
   - Driver updates routed to correct partition

2. **Indexing**
   - R-tree or similar spatial indexes
   - Find nearest drivers efficiently
   - Range queries for nearby region
   - Caching common queries

3. **Scale Considerations**
   - USA: ~6 million cells
   - Each cell can have 1000s of drivers
   - Low latency constraint: <100ms
   - High throughput: millions updates/sec

4. **Data Structure**
   - In-memory spatial indexes
   - Redis for caching hot cells
   - Database for persistence
   - Cross-region replication`,
      },
      {
        title: 'Matching Algorithm',
        content: `Sophisticated real-time matching:

1. **Supply Optimization**
   - Surge pricing: increase prices when demand > supply
   - Driver incentives: bonuses for high-demand areas
   - Destination zones: encourage drivers to profitable areas

2. **Matching Strategy**
   - Immediate match: if available drivers nearby
   - Batching: collect requests, match together
   - Predictive positioning: move drivers to predict demand

3. **Fairness**
   - Driver acceptance rate: rewards reliable drivers
   - Rating: high-rated drivers get priority
   - Wait time: avoid long waits for same driver

4. **Rejection Handling**
   - If top 3 drivers reject: re-search
   - Expand search radius if no matches
   - Fallback to different pool
   - Eventually wait-list or request failed`,
      },
      {
        title: 'Scalability Architecture',
        content: `Handling millions of concurrent rides:

1. **Distributed Services**
   - Location Service: tracks driver positions
   - Matching Service: assigns rides to drivers
   - Payment Service: billing and transactions
   - Rating Service: post-ride feedback
   - Notification Service: push notifications

2. **Databases**
   - Geospatial DB: current driver locations
   - User DB: users, drivers, profiles
   - Trip DB: completed rides, history
   - Cache: Redis for hot data

3. **Message Queues**
   - Kafka for location updates
   - Pub-Sub for ride notifications
   - Async processing pipelines
   - Analytics data pipeline

4. **Load Balancing**
   - Geographic distribution
   - Cell-based partitioning
   - Consistent hashing
   - Auto-scaling by region`,
      },
      {
        title: 'Challenges & Solutions',
        content: `Key challenges Uber solved:

1. **Real-time Updates**
   - Problem: 100K+ location updates/second
   - Solution: Efficient geospatial index, batching

2. **Matching Quality**
   - Problem: Global optimization vs local matching
   - Solution: Heuristics, machine learning, A/B testing

3. **Availability**
   - Problem: Service must be always up
   - Solution: Redundancy, fallbacks, graceful degradation

4. **Cost Optimization**
   - Problem: Infrastructure costs for real-time system
   - Solution: Efficient algorithms, caching, CDN

5. **Latency**
   - Problem: Users expect instant matching
   - Solution: In-memory indexes, local cache, optimization`,
      },
    ],
  },
  twitter: {
    title: 'Twitter',
    icon: '🐦',
    description: 'Real-time tweet distribution and timeline generation',
    color: '#1DA1F2',
    sections: [
      {
        title: 'Overview',
        content: `Twitter handles massive real-time data distribution at scale.

Key Statistics:
- 540M+ monthly active users
- 500M+ tweets posted daily
- 600K+ tweets per second (peak)
- 200M+ API calls per second
- 250M+ DAU (Daily Active Users)`,
      },
      {
        title: 'Core Challenge',
        content: `The fundamental problem Twitter solves:

1. **Timeline Generation**
   - Each user follows up to 10,000+ accounts
   - Need to show tweets from followings in real-time
   - Deliver within 500ms
   - Personalized ordering (relevance + recency)

2. **Write Volume**
   - 600K tweets/second at peak
   - Each tweet must reach all followers
   - Fan-out multiplier: average 200+ followers per user
   - 100M+ write operations per second internally

3. **Read Latency**
   - Users expect instant timeline refresh
   - Sub-500ms response time requirement
   - Mobile networks with latency variability

4. **Consistency**
   - Eventually consistent acceptable
   - But user's own tweets must appear instantly`,
      },
      {
        title: 'Fan-out Strategies',
        content: `Twitter uses two complementary strategies:

1. **Fan-out on Write (for regular users)**
   - When user posts tweet: immediately write to all followers' timeline caches
   - Advantages: Fast read, fresh data
   - Disadvantages: High write load, storage
   - Used for users with <10K followers

2. **Fan-out on Read (for celebrities)**
   - When celebrity tweets: only store once
   - When follower opens timeline: fetch + merge
   - Advantages: Low write load, saves storage
   - Disadvantages: Slower read, more complex
   - Used for users with >100K followers

3. **Hybrid Approach**
   - Most users use fan-out-on-write
   - High-follower accounts use fan-out-on-read
   - Thresholds tuned based on load testing

4. **Implementation**
   - Redis sorted sets for timeline cache
   - Score = tweet timestamp
   - Range queries for pagination`,
      },
      {
        title: 'Data Storage',
        content: `Complex multi-tier storage architecture:

1. **Tweet Store**
   - MySQL sharded by user ID
   - Gizzard framework for sharding logic
   - Replication for high availability
   - Stores: tweet ID, user ID, content, timestamp

2. **Timeline Cache**
   - Redis sorted sets
   - Key: user_id, Value: {tweet_id, timestamp}
   - TTL-based eviction
   - Distributed across multiple Redis clusters

3. **Secondary Indexes**
   - Lucene for full-text search
   - Hashtag indexes
   - Trending topics computation

4. **Media Storage**
   - S3-like blob storage
   - Images and videos
   - CDN for distribution`,
      },
      {
        title: 'Real-time Feed',
        content: `Generating personalized feeds at scale:

1. **Timeline Ranking**
   - Recency: Recent tweets prioritized
   - Engagement: Popular tweets boosted
   - Follow relationships: Close follows first
   - Machine learning: Personalization model

2. **Caching Strategy**
   - Hot timelines: in-memory cache
   - Warm timelines: persistent cache layer
   - Cold timelines: on-demand generation

3. **Pagination**
   - Cursor-based pagination (not offset)
   - Maintains consistency
   - Efficient for large datasets

4. **Filtering**
   - Muted words and accounts
   - Blocked users
   - Content warnings
   - Quality filters`,
      },
      {
        title: 'Scaling Architecture',
        content: `Infrastructure for 600K tweets/second:

1. **Microservices**
   - Tweet Service: Create/read tweets
   - Timeline Service: Generate timelines
   - Engagement Service: Likes, retweets, replies
   - Graph Service: Follower relationships

2. **Databases**
   - MySQL: Transactional data
   - HBase: Time-series data
   - Redis: Real-time cache
   - Elasticsearch: Search

3. **Message Queue**
   - Kafka for tweet events
   - Decouples write from processing
   - Enables fan-out pipeline

4. **Load Balancing**
   - Consistent hashing
   - Geographic distribution
   - Graceful degradation`,
      },
    ],
  },
};

export default function CaseStudy() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const caseStudy = CASE_STUDIES[caseId];

  if (!caseStudy) {
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
              {caseStudy.icon} {caseStudy.title}
            </span>
          </div>
          <button
            onClick={() => navigate('/playground')}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Build in Playground →
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '250px 1fr', gap: 32, padding: '40px' }}>
        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 20,
            fontWeight: 800,
            color: '#f0f6ff',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 24 }}>{caseStudy.icon}</span>
            {caseStudy.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {caseStudy.sections.map((section, i) => (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  background: activeSection === i ? `${caseStudy.color}15` : 'transparent',
                  border: `1px solid ${activeSection === i ? caseStudy.color + '40' : '#1e3a5f'}`,
                  borderRadius: 8,
                  color: activeSection === i ? caseStudy.color : '#7aa2c8',
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: activeSection === i ? 600 : 400,
                }}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
          <div style={{
            background: '#0f1e35',
            border: `1px solid ${caseStudy.color}30`,
            borderRadius: 12,
            padding: 32,
          }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: caseStudy.color,
              marginBottom: 20,
              letterSpacing: '-0.01em',
            }}>
              {caseStudy.sections[activeSection].title}
            </h2>
            <div style={{
              color: '#5d8aaa',
              fontSize: 14,
              lineHeight: 1.8,
              fontFamily: "'JetBrains Mono', monospace",
              whiteSpace: 'pre-wrap',
            }}>
              {caseStudy.sections[activeSection].content}
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'space-between',
            marginTop: 32,
          }}>
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              style={{
                padding: '12px 24px',
                background: activeSection === 0 ? '#0a1628' : '#3b82f6',
                border: `1px solid ${activeSection === 0 ? '#1e3a5f' : '#3b82f6'}`,
                borderRadius: 8,
                color: activeSection === 0 ? '#3d6088' : '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: activeSection === 0 ? 'not-allowed' : 'pointer',
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
              {activeSection + 1} / {caseStudy.sections.length}
            </div>
            <button
              onClick={() => setActiveSection(Math.min(caseStudy.sections.length - 1, activeSection + 1))}
              disabled={activeSection === caseStudy.sections.length - 1}
              style={{
                padding: '12px 24px',
                background: activeSection === caseStudy.sections.length - 1 ? '#0a1628' : '#3b82f6',
                border: `1px solid ${activeSection === caseStudy.sections.length - 1 ? '#1e3a5f' : '#3b82f6'}`,
                borderRadius: 8,
                color: activeSection === caseStudy.sections.length - 1 ? '#3d6088' : '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: activeSection === caseStudy.sections.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
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