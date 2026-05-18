/**
 * Copilot Chat Widget
 * Floating chat interface with Framer Motion animations.
 * Styled to match the Malaysia Open Data Command Center dark theme:
 *   - bg-[#0a0e1a] base, cyan (#06b6d4) accents, amber (#f59e0b) secondary
 *   - Monospace font (font-mono) for data values
 *   - Dark glass effect with backdrop blur
 *
 * Adapted from reference implementation but fully re-themed.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MapPin,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Search,
  Building2,
  Loader2,
  Shield,
} from "lucide-react";
import { parseIntent, type ParsedIntent } from "@/components/copilot/intent-engine";
import {
  assembleResponse,
  type DashboardContext,
  type CopilotAction,
} from "@/lib/copilot/prompts";
import { useCopilot } from "@/hooks/use-copilot";

// ─── Types ───────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: CopilotAction[];
  suggestions?: string[];
  timestamp: Date;
  intentType?: string;
}

// ─── Welcome Suggestions ─────────────────────────────────────────────

const WELCOME_SUGGESTIONS = [
  "Show me the map",
  "What is GDP per capita?",
  "Compare Selangor and Johor",
  "Find population datasets",
  "Which state has the lowest unemployment?",
];

// ─── Quick Action Buttons ────────────────────────────────────────────

const QUICK_ACTIONS = [
  { icon: MapPin, label: "Map" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Search, label: "Datasets" },
  { icon: TrendingUp, label: "Trends" },
  { icon: Building2, label: "States" },
] as const;

// ─── Component ───────────────────────────────────────────────────────

export function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `**Selamat datang!** I'm your Malaysia Open Data Assistant.\n\nI can help you **navigate** this dashboard, **explain** complex metrics in plain English/Bahasa Melayu, **find** datasets from the 287+ data.gov.my registry, or **compare** states side-by-side.\n\n• All responses are generated locally\n• No data leaves your device\n• Works offline after initial load`,
      suggestions: WELCOME_SUGGESTIONS,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { context, executeAction } = useCopilot();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (overrideInput?: string) => {
      const text = overrideInput || input;
      if (!text.trim()) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!overrideInput) setInput("");
      setIsTyping(true);

      // Simulate processing delay for realism (300-900ms)
      const delay = 300 + Math.random() * 600;
      await new Promise((r) => setTimeout(r, delay));

      const intent: ParsedIntent = parseIntent(text);
      const response = assembleResponse(intent, context as DashboardContext);

      const assistantMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response.text,
        actions: response.actions,
        suggestions: response.suggestions,
        timestamp: new Date(),
        intentType: intent.type,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);

      // Auto-execute non-destructive actions
      response.actions?.forEach((action) => {
        if (
          ["NAVIGATE", "HIGHLIGHT", "SCROLL_TO", "SHOW_METRIC"].includes(
            action.type
          )
        ) {
          executeAction(action);
        }
      });

      if (!isOpen) setHasUnread(true);
    },
    [input, context, executeAction, isOpen]
  );

  const handleSuggestion = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setHasUnread(false);
  };

  // ─── Render message content with markdown-like formatting ────────

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      // Bold
      const withBold = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      );
      // Italic
      const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>');

      // Numbered list items
      const numberedMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <div
            key={i}
            className="ml-3 font-mono text-sm"
            style={{ color: "rgba(148,163,184,0.9)" }}
            dangerouslySetInnerHTML={{ __html: withItalic }}
          />
        );
      }

      // Bullet points
      if (line.trim().startsWith("•")) {
        return (
          <div
            key={i}
            className="ml-3 font-mono text-sm"
            style={{ color: "rgba(148,163,184,0.9)" }}
            dangerouslySetInnerHTML={{ __html: withItalic }}
          />
        );
      }

      // Headers within text (short bold-only lines)
      if (
        line.trim().startsWith("**") &&
        line.trim().endsWith("**") &&
        line.length < 60
      ) {
        return (
          <div
            key={i}
            className="mt-2 font-semibold font-mono text-sm"
            style={{ color: "#06b6d4" }}
            dangerouslySetInnerHTML={{ __html: withItalic }}
          />
        );
      }

      // Regular line
      return (
        <div
          key={i}
          className="font-mono text-sm"
          style={{ color: "rgba(148,163,184,0.9)" }}
          dangerouslySetInnerHTML={{ __html: withItalic }}
        />
      );
    });
  };

  return (
    <>
      {/* ── Floating Trigger Button ──────────────────────────────── */}
      <motion.button
        layout
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-white shadow-lg transition-all"
        style={{
          background: "linear-gradient(135deg, #0891b2, #06b6d4)",
          boxShadow:
            "0 4px 20px rgba(6,182,212,0.35), 0 0 40px rgba(6,182,212,0.15)",
        }}
        aria-label={isOpen ? "Close data assistant" : "Open data assistant"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </motion.div>
        <span className="font-mono font-bold text-sm tracking-wider">
          {isOpen ? "Close" : "Data Copilot"}
        </span>
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "#f59e0b" }} />
            <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: "#f59e0b" }} />
          </span>
        )}
      </motion.button>

      {/* ── Chat Panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 flex h-[560px] w-[420px] flex-col overflow-hidden rounded-2xl border backdrop-blur-xl"
            style={{
              background: "rgba(10,14,26,0.97)",
              borderColor: "rgba(6,182,212,0.15)",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(6,182,212,0.08)",
            }}
          >
            {/* ── Header ──────────────────────────────────────────── */}
            <div
              className="relative flex items-center justify-between px-5 py-4"
              style={{
                borderBottom: "1px solid rgba(6,182,212,0.1)",
              }}
            >
              {/* Cyan top accent line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 5%, #06b6d4 30%, rgba(6,182,212,0.6) 50%, #06b6d4 70%, transparent 95%)",
                  boxShadow: "0 0 12px rgba(6,182,212,0.4)",
                }}
              />
              <div className="flex items-center gap-3">
                {/* Bot avatar */}
                <div
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}
                >
                  <Bot className="h-5 w-5" style={{ color: "#06b6d4" }} />
                  {/* Online indicator */}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
                    style={{
                      background: "#10b981",
                      boxShadow:
                        "0 0 4px rgba(16,185,129,0.6)",
                    }}
                  />
                </div>
                <div>
                  <h3
                    className="text-sm font-mono font-bold tracking-wider"
                    style={{ color: "#06b6d4", textShadow: "0 0 8px rgba(6,182,212,0.3)" }}
                  >
                    Open Data Copilot
                  </h3>
                  <p
                    className="flex items-center gap-1 text-[11px] font-mono"
                    style={{ color: "rgba(6,182,212,0.5)" }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "#10b981", boxShadow: "0 0 4px rgba(16,185,129,0.5)" }}
                    />
                    Powered by data.gov.my registry
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages((prev) => prev.slice(0, 1))
                  }
                  className="rounded-lg px-2 py-1 text-[11px] font-mono tracking-wider transition-colors"
                  style={{ color: "rgba(6,182,212,0.4)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(6,182,212,0.08)";
                    e.currentTarget.style.color = "#06b6d4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(6,182,212,0.4)";
                  }}
                  title="Clear conversation"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: "rgba(6,182,212,0.4)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(6,182,212,0.08)";
                    e.currentTarget.style.color = "#06b6d4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(6,182,212,0.4)";
                  }}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Messages Area ────────────────────────────────────── */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-5">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: idx === messages.length - 1 ? 0.1 : 0,
                    }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] ${msg.role === "user" ? "order-2" : "order-1"}`}
                    >
                      {/* Avatar for assistant messages */}
                      {msg.role === "assistant" && (
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <div
                            className="flex h-5 w-5 items-center justify-center rounded-md"
                            style={{
                              background: "rgba(6,182,212,0.1)",
                              border: "1px solid rgba(6,182,212,0.15)",
                            }}
                          >
                            <Bot
                              className="h-3 w-3"
                              style={{ color: "#06b6d4" }}
                            />
                          </div>
                          <span
                            className="text-[10px] font-mono font-medium"
                            style={{ color: "rgba(6,182,212,0.4)" }}
                          >
                            Copilot
                          </span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "rounded-br-md"
                            : "rounded-bl-md"
                        }`}
                        style={
                          msg.role === "user"
                            ? {
                                background:
                                  "linear-gradient(135deg, #0891b2, #06b6d4)",
                                color: "white",
                              }
                            : {
                                background: "rgba(6,182,212,0.06)",
                                border: "1px solid rgba(6,182,212,0.1)",
                                color: "rgba(148,163,184,0.9)",
                              }
                        }
                      >
                        <div className="space-y-1">
                          {renderContent(msg.content)}
                        </div>

                        {/* Suggestion Chips */}
                        {msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {msg.suggestions.map((sug, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestion(sug)}
                                className="group inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-mono font-medium transition-all"
                                style={
                                  msg.role === "user"
                                    ? {
                                        background: "rgba(255,255,255,0.15)",
                                        color: "white",
                                      }
                                    : {
                                        background: "rgba(6,182,212,0.08)",
                                        border: "1px solid rgba(6,182,212,0.15)",
                                        color: "#06b6d4",
                                      }
                                }
                                onMouseEnter={(e) => {
                                  if (msg.role === "user") {
                                    e.currentTarget.style.background =
                                      "rgba(255,255,255,0.25)";
                                  } else {
                                    e.currentTarget.style.background =
                                      "rgba(6,182,212,0.15)";
                                    e.currentTarget.style.borderColor =
                                      "rgba(6,182,212,0.3)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (msg.role === "user") {
                                    e.currentTarget.style.background =
                                      "rgba(255,255,255,0.15)";
                                  } else {
                                    e.currentTarget.style.background =
                                      "rgba(6,182,212,0.08)";
                                    e.currentTarget.style.borderColor =
                                      "rgba(6,182,212,0.15)";
                                  }
                                }}
                              >
                                {sug}
                                <ChevronRight className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`mt-1 text-[10px] font-mono ${msg.role === "user" ? "text-right" : "text-left"}`}
                        style={{ color: "rgba(6,182,212,0.25)" }}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* ── Typing Indicator ──────────────────────────────── */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-md"
                      style={{
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.15)",
                      }}
                    >
                      <Bot
                        className="h-3 w-3"
                        style={{ color: "#06b6d4" }}
                      />
                    </div>
                    <div
                      className="rounded-2xl rounded-bl-md px-4 py-3"
                      style={{
                        background: "rgba(6,182,212,0.06)",
                        border: "1px solid rgba(6,182,212,0.1)",
                      }}
                    >
                      <div
                        className="flex items-center gap-3 text-xs font-mono"
                        style={{ color: "rgba(6,182,212,0.5)" }}
                      >
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                            }}
                            className="h-2 w-2 rounded-full"
                            style={{ background: "#06b6d4", boxShadow: "0 0 6px rgba(6,182,212,0.4)" }}
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.15,
                            }}
                            className="h-2 w-2 rounded-full"
                            style={{ background: "#0891b2" }}
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.6,
                              delay: 0.3,
                            }}
                            className="h-2 w-2 rounded-full"
                            style={{ background: "#f59e0b", boxShadow: "0 0 6px rgba(245,158,11,0.3)" }}
                          />
                        </div>
                        <span>Analyzing data.gov.my registry...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* ── Quick Actions Bar ─────────────────────────────────── */}
            <div
              className="px-4 py-2"
              style={{
                borderTop: "1px solid rgba(6,182,212,0.08)",
                background: "rgba(6,182,212,0.02)",
              }}
            >
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() =>
                      handleSuggestion(
                        `Show me ${action.label.toLowerCase()}`
                      )
                    }
                    className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-mono font-medium transition-all"
                    style={{
                      background: "rgba(6,182,212,0.06)",
                      border: "1px solid rgba(6,182,212,0.12)",
                      color: "rgba(6,182,212,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(6,182,212,0.12)";
                      e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)";
                      e.currentTarget.style.color = "#06b6d4";
                      e.currentTarget.style.boxShadow = "0 0 10px rgba(6,182,212,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                      e.currentTarget.style.borderColor = "rgba(6,182,212,0.12)";
                      e.currentTarget.style.color = "rgba(6,182,212,0.7)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Input Area ────────────────────────────────────────── */}
            <div
              className="p-3"
              style={{
                borderTop: "1px solid rgba(6,182,212,0.1)",
                background: "rgba(10,14,26,0.98)",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about any metric, state, or dataset..."
                    className="h-10 pr-10 text-sm font-mono"
                    style={{
                      background: "rgba(6,182,212,0.04)",
                      borderColor: "rgba(6,182,212,0.15)",
                      color: "rgba(148,163,184,0.9)",
                    }}
                  />
                  {input.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: "rgba(6,182,212,0.4)" }}
                      aria-label="Clear input"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #0891b2, #06b6d4)",
                    boxShadow: "0 2px 12px rgba(6,182,212,0.3)",
                  }}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>

              {/* Privacy Notice */}
              <div
                className="mt-2 flex items-center justify-between text-[10px] font-mono"
                style={{ color: "rgba(6,182,212,0.3)" }}
              >
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" style={{ color: "rgba(6,182,212,0.4)" }} />
                  Runs entirely in your browser &bull; No data sent to external APIs
                </span>
                <span>287+ datasets indexed</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
