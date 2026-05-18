'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Navigation, Trash2, Sparkles } from 'lucide-react';
import { useCopilot } from '@/hooks/useCopilot';
import type { CopilotMessage } from '@/hooks/useCopilot';
import type { Lang } from '@/lib/dashboard-types';

// ─── Markdown-Lite Renderer ─────────────────────────────────────────────
function renderMarkdownLite(text: string) {
  // Process the text in segments to handle bold, bullets, and line breaks
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    // Handle separator lines
    if (line.trim() === '---') {
      elements.push(
        <div key={lineIdx} className="my-2 border-t" style={{ borderColor: 'rgba(6,182,212,0.15)' }} />
      );
      return;
    }

    // Handle bullet points
    if (line.trimStart().startsWith('• ')) {
      const content = line.trimStart().slice(2);
      elements.push(
        <div key={lineIdx} className="flex gap-2 ml-1">
          <span style={{ color: '#06b6d4' }}>•</span>
          <span>{renderInlineFormatting(content)}</span>
        </div>
      );
      return;
    }

    // Handle empty lines as spacing
    if (line.trim() === '') {
      elements.push(<div key={lineIdx} className="h-1" />);
      return;
    }

    // Regular line
    elements.push(<div key={lineIdx}>{renderInlineFormatting(line)}</div>);
  });

  return <>{elements}</>;
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Split by bold markers **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ color: '#06b6d4', fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Handle italic *text*
    const italicParts = part.split(/(\*[^*]+\*)/g);
    return italicParts.map((ip, j) => {
      if (ip.startsWith('*') && ip.endsWith('*') && !ip.startsWith('**')) {
        return <em key={`${i}-${j}`}>{ip.slice(1, -1)}</em>;
      }
      return <span key={`${i}-${j}`}>{ip}</span>;
    });
  });
}

// ─── Action Button Component ────────────────────────────────────────────
function ActionButton({ action, lang }: { action: { type: string; target: string }; lang: Lang }) {
  const handleClick = () => {
    switch (action.type) {
      case 'navigate':
        window.dispatchEvent(new CustomEvent('copilot:navigate', {
          detail: { tab: action.target },
        }));
        break;
      case 'show-metric':
        window.dispatchEvent(new CustomEvent('copilot:show-metric', {
          detail: { metric: action.target },
        }));
        break;
      case 'highlight':
        window.dispatchEvent(new CustomEvent('copilot:highlight', {
          detail: { target: action.target },
        }));
        break;
    }
  };

  const labels: Record<string, Record<string, string>> = {
    navigate: {
      overview: lang === 'en' ? 'Go to Overview' : 'Pergi ke Gambaran',
      geomap: lang === 'en' ? 'Go to GeoMap' : 'Pergi ke PetaGeo',
      datasets: lang === 'en' ? 'Go to Datasets' : 'Pergi ke Set Data',
      analytics: lang === 'en' ? 'Go to Analytics' : 'Pergi ke Analitik',
      intelligence: lang === 'en' ? 'Go to Intelligence' : 'Pergi ke Intelijen',
    },
    'show-metric': {},
    highlight: {},
  };

  const label = labels[action.type]?.[action.target] ||
    (action.type === 'navigate'
      ? lang === 'en' ? `Go to ${action.target}` : `Pergi ke ${action.target}`
      : action.type === 'show-metric'
        ? lang === 'en' ? `Show ${action.target}` : `Tunjuk ${action.target}`
        : lang === 'en' ? `Highlight ${action.target}` : `Serlahkan ${action.target}`);

  return (
    <button
      onClick={handleClick}
      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-all duration-200"
      style={{
        background: 'rgba(6,182,212,0.1)',
        border: '1px solid rgba(6,182,212,0.25)',
        color: '#06b6d4',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(6,182,212,0.2)';
        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <Navigation size={10} />
      {label}
    </button>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#06b6d4' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Message Component ──────────────────────────────────────────────────
function MessageBubble({ message, lang }: { message: CopilotMessage; lang: Lang }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1"
        style={{
          background: isUser ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.08)',
          border: `1px solid ${isUser ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.15)'}`,
        }}
      >
        {isUser ? <User size={12} style={{ color: '#06b6d4' }} /> : <Bot size={12} style={{ color: '#06b6d4' }} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[280px] rounded-lg px-3 py-2 text-[12px] leading-relaxed ${isUser ? '' : ''}`}
        style={{
          background: isUser
            ? 'rgba(6,182,212,0.15)'
            : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isUser ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.08)'}`,
          color: isUser ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)',
        }}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          renderMarkdownLite(message.content)
        )}

        {/* Action button for navigation/comparison messages */}
        {!isUser && message.action && (
          <ActionButton action={message.action} lang={lang} />
        )}
      </div>
    </motion.div>
  );
}

// ─── Quick Suggestions ──────────────────────────────────────────────────
const QUICK_SUGGESTIONS_EN = [
  'What is Malaysia\'s population?',
  'GDP of Selangor',
  'Find healthcare datasets',
  'Show me analytics',
  'Explain the ontology',
];

const QUICK_SUGGESTIONS_MS = [
  'Berapa penduduk Malaysia?',
  'KDNK Selangor',
  'Cari set data kesihatan',
  'Tunjuk analitik',
  'Terangkan ontologi',
];

// ─── Main Component ─────────────────────────────────────────────────────
interface CopilotPanelProps {
  lang: Lang;
}

export function CopilotPanel({ lang }: CopilotPanelProps) {
  const {
    messages,
    isOpen,
    isTyping,
    sendMessage,
    toggleOpen,
    closePanel,
    clearMessages,
  } = useCopilot();

  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle send
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    sendMessage(input, lang);
    setInput('');
    setShowSuggestions(false);
  }, [input, lang, sendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle suggestion click
  const handleSuggestion = useCallback((suggestion: string) => {
    sendMessage(suggestion, lang);
    setShowSuggestions(false);
  }, [lang, sendMessage]);

  const suggestions = lang === 'ms' ? QUICK_SUGGESTIONS_MS : QUICK_SUGGESTIONS_EN;

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleOpen}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              boxShadow: '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15), 0 4px 12px rgba(0,0,0,0.3)',
            }}
            aria-label={lang === 'en' ? 'Open Command Copilot' : 'Buka Copilot Perintah'}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.25), 0 4px 16px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15), 0 4px 12px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <MessageSquare size={22} style={{ color: 'white' }} />

            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid rgba(6,182,212,0.4)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 z-50 flex flex-col rounded-xl overflow-hidden"
            style={{
              width: '380px',
              maxHeight: '500px',
              background: 'rgba(10,14,26,0.97)',
              border: '1px solid rgba(6,182,212,0.2)',
              boxShadow: '0 0 30px rgba(6,182,212,0.15), 0 0 60px rgba(6,182,212,0.05), 0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'rgba(6,182,212,0.06)',
                borderBottom: '1px solid rgba(6,182,212,0.15)',
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(6,182,212,0.15)',
                    border: '1px solid rgba(6,182,212,0.3)',
                  }}
                >
                  <Sparkles size={14} style={{ color: '#06b6d4' }} />
                </div>
                <div>
                  <div
                    className="text-[11px] font-mono font-bold tracking-widest"
                    style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.4)' }}
                  >
                    {lang === 'en' ? 'COMMAND COPILOT' : 'COPILOT PERINTAH'}
                  </div>
                  <div className="text-[9px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                    {lang === 'en' ? 'Rule-Based Assistant' : 'Pembantu Berdasarkan Peraturan'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear button */}
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: 'rgba(6,182,212,0.4)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#06b6d4';
                      e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(6,182,212,0.4)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                    aria-label={lang === 'en' ? 'Clear messages' : 'Padam mesej'}
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Close button */}
                <button
                  onClick={closePanel}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: 'rgba(6,182,212,0.4)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#06b6d4';
                    e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(6,182,212,0.4)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  aria-label={lang === 'en' ? 'Close copilot' : 'Tutup copilot'}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{ maxHeight: '340px', minHeight: '200px' }}
            >
              {/* Welcome message if empty */}
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.2)',
                    }}
                  >
                    <Bot size={24} style={{ color: '#06b6d4' }} />
                  </div>
                  <div
                    className="text-[12px] font-mono mb-1"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {lang === 'en' ? 'How can I help you?' : 'Bagaimana saya boleh bantu?'}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: 'rgba(6,182,212,0.4)' }}>
                    {lang === 'en' ? 'Ask about Malaysia data, navigate, or explore datasets' : 'Tanya tentang data Malaysia, navigasi, atau terokai set data'}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} lang={lang} />
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator />}

              {/* Quick suggestions */}
              {showSuggestions && messages.length === 0 && (
                <div className="space-y-1.5 mt-2">
                  <div className="text-[9px] font-mono tracking-wider mb-1.5" style={{ color: 'rgba(6,182,212,0.35)' }}>
                    {lang === 'en' ? 'QUICK SUGGESTIONS' : 'CADANGAN PANTAS'}
                  </div>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(s)}
                      className="w-full text-left px-3 py-1.5 rounded text-[11px] font-mono transition-all duration-200"
                      style={{
                        background: 'rgba(6,182,212,0.04)',
                        border: '1px solid rgba(6,182,212,0.1)',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(6,182,212,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)';
                        e.currentTarget.style.color = '#06b6d4';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(6,182,212,0.04)';
                        e.currentTarget.style.borderColor = 'rgba(6,182,212,0.1)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div
              className="flex-shrink-0 px-3 py-3"
              style={{
                background: 'rgba(6,182,212,0.03)',
                borderTop: '1px solid rgba(6,182,212,0.1)',
              }}
            >
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{
                  background: 'rgba(10,14,26,0.8)',
                  border: '1px solid rgba(6,182,212,0.2)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === 'en' ? 'Ask about Malaysia data...' : 'Tanya tentang data Malaysia...'}
                  className="flex-1 bg-transparent text-[12px] font-mono outline-none placeholder:text-slate-600"
                  style={{ color: 'rgba(255,255,255,0.85)' }}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-1.5 rounded transition-all duration-200"
                  style={{
                    background: input.trim() ? 'rgba(6,182,212,0.2)' : 'transparent',
                    color: input.trim() ? '#06b6d4' : 'rgba(6,182,212,0.3)',
                    border: `1px solid ${input.trim() ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.1)'}`,
                  }}
                  aria-label={lang === 'en' ? 'Send message' : 'Hantar mesej'}
                >
                  <Send size={12} />
                </button>
              </div>

              {/* Bottom hint */}
              <div className="text-center mt-1.5">
                <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.25)' }}>
                  {lang === 'en' ? 'Powered by rule-based intelligence • EN/BM' : 'Dikuasakan oleh kecerdasan berasaskan peraturan • EN/BM'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CopilotPanel;
