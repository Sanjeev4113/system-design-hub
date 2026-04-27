// VoiceAssistant.js - Voice command interface
import React, { useState, useRef, useEffect } from 'react';

const COMMANDS = [
  { pattern: /add\s*(load\s*)?balancer|add\s*lb/i, action: 'add_lb', label: 'Adding Load Balancer...' },
  { pattern: /add\s*api(\s*server)?/i, action: 'add_api', label: 'Adding API Server...' },
  { pattern: /add\s*cach(e|ing)/i, action: 'add_cache', label: 'Adding Cache Layer...' },
  { pattern: /add\s*(data)?base|add\s*db/i, action: 'add_db', label: 'Adding Database...' },
  { pattern: /run\s*sim(ulation)?|start\s*sim/i, action: 'run_simulation', label: 'Running simulation...' },
  { pattern: /clear|reset|remove\s*all/i, action: 'clear', label: 'Clearing canvas...' },
];

export default function VoiceAssistant({ onCommand, isEnabled }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const feedbackTimer = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const result = event.results[0];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        processCommand(text);
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedback('Could not understand. Try again.');
      clearFeedback();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const clearFeedback = () => {
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      setFeedback('');
      setTranscript('');
    }, 2500);
  };

  const processCommand = (text) => {
    for (const cmd of COMMANDS) {
      if (cmd.pattern.test(text)) {
        setFeedback(cmd.label);
        onCommand(cmd.action);
        clearFeedback();
        return;
      }
    }
    setFeedback(`Unrecognized: "${text}"`);
    clearFeedback();
  };

  const toggle = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setFeedback('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!supported) return null;

  return (
    <div style={{ position: 'relative' }}>
      {/* Transcript/feedback bubble */}
      {(transcript || feedback) && (
        <div style={{
          position: 'absolute',
          bottom: 60,
          right: 0,
          background: '#0d1b2e',
          border: '1px solid #1e3a5f',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 11,
          color: '#7aa2c8',
          fontFamily: "'JetBrains Mono', monospace",
          whiteSpace: 'nowrap',
          maxWidth: 240,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.2s ease',
        }}>
          {feedback || (
            <span>
              <span style={{ color: '#10b981' }}>◉ </span>
              {transcript || 'Listening...'}
            </span>
          )}
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={toggle}
        title={isListening ? 'Stop listening' : 'Voice command (add LB, add API, run simulation...)'}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isListening ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.1)',
          border: `1px solid ${isListening ? '#ef4444' : '#1e3a5f'}`,
          color: isListening ? '#ef4444' : '#7aa2c8',
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          animation: isListening ? 'breathe 1s ease-in-out infinite' : 'none',
          flexShrink: 0,
        }}
      >
        🎤
      </button>
    </div>
  );
}