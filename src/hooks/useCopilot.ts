'use client';

import { useState, useCallback, useRef } from 'react';
import { processQuery } from '@/lib/copilot/prompts';
import type { CopilotResponse } from '@/lib/copilot/prompts';
import type { Lang } from '@/lib/dashboard-types';

// ─── Types ──────────────────────────────────────────────────────────────
export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'stat' | 'navigation' | 'comparison' | 'ontology';
  action?: { type: string; target: string };
}

export interface CopilotView {
  id: string;
  label_en: string;
  label_ms: string;
}

// ─── Hook ───────────────────────────────────────────────────────────────
export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Generate unique ID
  const genId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  // Send a message and get a response
  const sendMessage = useCallback((text: string, lang: Lang) => {
    if (!text.trim()) return;

    const userMessage: CopilotMessage = {
      id: genId(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate a slight delay for natural feel
    setTimeout(() => {
      const response: CopilotResponse = processQuery(text, lang);

      const assistantMessage: CopilotMessage = {
        id: genId(),
        role: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        type: response.type,
        action: response.action,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Dispatch CustomEvents for dashboard navigation
      if (response.action) {
        switch (response.action.type) {
          case 'navigate':
            window.dispatchEvent(new CustomEvent('copilot:navigate', {
              detail: { tab: response.action.target },
            }));
            break;
          case 'show-metric':
            window.dispatchEvent(new CustomEvent('copilot:show-metric', {
              detail: { metric: response.action.target },
            }));
            break;
          case 'highlight':
            window.dispatchEvent(new CustomEvent('copilot:highlight', {
              detail: { target: response.action.target },
            }));
            break;
        }
      }
    }, 300 + Math.random() * 400); // 300-700ms delay
  }, []);

  // Toggle chat panel
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Open chat panel
  const openPanel = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close chat panel
  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isOpen,
    isTyping,
    messagesEndRef,
    sendMessage,
    toggleOpen,
    openPanel,
    closePanel,
    clearMessages,
  };
}
