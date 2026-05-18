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
  const abortControllerRef = useRef<AbortController | null>(null);

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

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Build conversation history from current messages (before adding the new user msg)
    // We'll use a ref to avoid stale closure issues
    const fetchAIResponse = async () => {
      try {
        // Get current messages for history
        const historyEntries = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }));

        const response = await fetch('/api/copilot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            lang,
            history: historyEntries,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.response) {
          const assistantMessage: CopilotMessage = {
            id: genId(),
            role: 'assistant',
            content: data.response,
            timestamp: Date.now(),
            type: 'text',
          };
          setMessages(prev => [...prev, assistantMessage]);
        } else {
          // Fallback to rule-based
          throw new Error(data.error || 'AI service unavailable');
        }
      } catch (err: unknown) {
        // Don't show error if request was aborted
        if (err instanceof DOMException && err.name === 'AbortError') return;

        console.warn('[Copilot] LLM API failed, falling back to rule-based:', err);

        // Fallback: Use rule-based engine
        try {
          const ruleResponse: CopilotResponse = processQuery(text, lang);
          const fallbackMessage: CopilotMessage = {
            id: genId(),
            role: 'assistant',
            content: ruleResponse.text,
            timestamp: Date.now(),
            type: ruleResponse.type,
            action: ruleResponse.action,
          };
          setMessages(prev => [...prev, fallbackMessage]);

          // Dispatch navigation events from rule-based response
          if (ruleResponse.action) {
            switch (ruleResponse.action.type) {
              case 'navigate':
                window.dispatchEvent(new CustomEvent('copilot:navigate', {
                  detail: { tab: ruleResponse.action.target },
                }));
                break;
              case 'show-metric':
                window.dispatchEvent(new CustomEvent('copilot:show-metric', {
                  detail: { metric: ruleResponse.action.target },
                }));
                break;
              case 'highlight':
                window.dispatchEvent(new CustomEvent('copilot:highlight', {
                  detail: { target: ruleResponse.action.target },
                }));
                break;
            }
          }
        } catch (fallbackErr) {
          console.error('[Copilot] Rule-based fallback also failed:', fallbackErr);
          const errorMessage: CopilotMessage = {
            id: genId(),
            role: 'assistant',
            content: lang === 'ms'
              ? 'Maaf, saya mengalami ralat. Sila cuba lagi.'
              : 'Sorry, I encountered an error. Please try again.',
            timestamp: Date.now(),
            type: 'text',
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } finally {
        setIsTyping(false);
      }
    };

    // Small delay for natural feel, then call API
    setTimeout(fetchAIResponse, 300 + Math.random() * 400);
  }, [messages]);

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
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
