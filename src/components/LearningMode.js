// LearningMode.js - Step-by-step learning overlay
import React, { useState } from 'react';

const STEPS = [
  {
    title: 'What is System Design?',
    content: 'System design is the process of defining the architecture, components, and data flow of a system to satisfy specific requirements. It bridges high-level goals with implementation details.',
    icon: '🏗',
  },
  {
    title: 'Load Balancer (LB)',
    content: 'Distributes incoming traffic across multiple servers using algorithms like Round Robin, Least Connections, or IP Hashing. Prevents any single server from becoming a bottleneck.',
    icon: '⚖',
  },
  {
    title: 'API Server',
    content: 'Handles business logic, processes requests, and communicates with data stores. Usually stateless to enable horizontal scaling. Receives traffic from the Load Balancer.',
    icon: '⚙',
  },
  {
    title: 'Cache Layer',
    content: 'Stores frequently-accessed data in fast memory (Redis, Memcached). Can reduce database load by 70%+. Use write-through or write-behind strategies based on consistency needs.',
    icon: '⚡',
  },
  {
    title: 'Database (DB)',
    content: 'Persists application data. Choose SQL (Postgres, MySQL) for structured relational data, or NoSQL (MongoDB, Cassandra) for flexible schemas and high write throughput.',
    icon: '🗄',
  },
  {
    title: 'Putting It Together',
    content: 'Traffic → LB → API Servers → Cache → DB. This pattern handles millions of requests. Add CDN for static assets, message queues for async work, and monitoring for observability.',
    icon: '✨',
  },
];

export default function LearningMode({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const current = STEPS[step];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2,6,23,0.85)',
      backdropFilter: 'blur(4px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#0d1b2e',
        border: '1px solid #1e3a5f',
        borderRadius: 16,
        padding: 32,
        maxWidth: 480,
        width: '90%',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === step ? '#3b82f6' : '#1e3a5f',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* Icon */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          margin: '0 auto 20px',
        }}>
          {current.icon}
        </div>

        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          fontFamily: "'Syne', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: '#f0f6ff',
          marginBottom: 12,
        }}>
          {current.title}
        </h2>

        {/* Content */}
        <p style={{
          textAlign: 'center',
          fontSize: 13,
          color: '#7aa2c8',
          lineHeight: 1.7,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 28,
        }}>
          {current.content}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'none',
                border: '1px solid #1e3a5f',
                borderRadius: 8,
                color: '#7aa2c8',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              style={{
                flex: 1,
                padding: '10px 0',
                background: '#3b82f6',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 0',
                background: '#3b82f6',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Start Building ✓
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'block',
            margin: '12px auto 0',
            background: 'none',
            border: 'none',
            color: '#3d6088',
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}