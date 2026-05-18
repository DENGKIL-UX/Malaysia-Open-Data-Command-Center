/**
 * Copilot Context Provider
 * Bridges the chat widget with the rest of the dashboard.
 * Uses CustomEvent for loose coupling with existing components.
 *
 * Event naming convention: "copilot-{action}" (hyphen-separated)
 * Components listen for these events to react to copilot actions.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { CopilotChat } from "./copilot-chat";
import type { CopilotAction } from "@/lib/copilot/prompts";

// ─── Types ───────────────────────────────────────────────────────────

export interface DashboardContext {
  currentView: string;
  selectedState?: string;
  selectedDataset?: string;
  visibleMetrics?: string[];
  activeComparison?: string[];
  chartType?: string;
  filterCategory?: string;
}

interface CopilotContextType {
  context: DashboardContext;
  executeAction: (action: CopilotAction) => void;
  registerView: (view: string, metadata?: Record<string, unknown>) => void;
  registerSelection: (
    type: "state" | "dataset" | "metric",
    value: string
  ) => void;
}

// ─── Context ─────────────────────────────────────────────────────────

export const CopilotContext = createContext<CopilotContextType | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<DashboardContext>({
    currentView: "overview",
    selectedState: undefined,
    selectedDataset: undefined,
    visibleMetrics: [],
    activeComparison: [],
    chartType: undefined,
    filterCategory: undefined,
  });

  // Ref to track latest context for event handlers
  const contextRef = useRef(context);
  useEffect(() => {
    contextRef.current = context;
  });

  const registerView = useCallback(
    (view: string, metadata?: Record<string, unknown>) => {
      setContext((prev) => {
        const next = {
          ...prev,
          currentView: view,
          // Reset view-specific selections when switching views
          selectedState: view === "geomap" ? prev.selectedState : undefined,
          selectedDataset:
            view === "datasets" ? prev.selectedDataset : undefined,
          ...metadata,
        };
        return next;
      });
    },
    []
  );

  const registerSelection = useCallback(
    (type: "state" | "dataset" | "metric", value: string) => {
      setContext((prev) => {
        if (type === "state") {
          const currentComparison = prev.activeComparison || [];
          const newComparison = currentComparison.includes(value)
            ? currentComparison
            : [...currentComparison, value].slice(-4); // Keep last 4 for comparison
          return {
            ...prev,
            selectedState: value,
            activeComparison: newComparison,
          };
        }
        if (type === "dataset") return { ...prev, selectedDataset: value };
        if (type === "metric") {
          const metrics = prev.visibleMetrics || [];
          return {
            ...prev,
            visibleMetrics: metrics.includes(value)
              ? metrics
              : [...metrics, value],
          };
        }
        return prev;
      });
    },
    []
  );

  const executeAction = useCallback((action: CopilotAction) => {
    // Dispatch typed custom events that existing components can listen to
    const dispatch = (eventName: string, detail: unknown) => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
      }
    };

    switch (action.type) {
      case "NAVIGATE":
        dispatch("copilot-navigate", {
          target: action.target,
          states: action.highlightStates,
          fromView: contextRef.current.currentView,
        });
        break;

      case "HIGHLIGHT":
        dispatch("copilot-highlight", {
          states: action.highlightStates || action.states,
          metric: action.metric,
        });
        break;

      case "OPEN_DATASET":
        dispatch("copilot-open-dataset", {
          id: action.target,
          currentView: contextRef.current.currentView,
        });
        break;

      case "COMPARE":
        dispatch("copilot-compare", {
          states: action.states,
          currentComparison: contextRef.current.activeComparison,
        });
        break;

      case "SCROLL_TO":
        dispatch("copilot-scroll-to", {
          target: action.target,
        });
        // Also try direct DOM scroll as fallback
        if (typeof document !== "undefined") {
          const el = document.getElementById(action.target || "");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        break;

      case "FILTER":
        dispatch("copilot-filter", {
          category: action.category,
          metric: action.metric,
        });
        break;

      case "EXPORT":
        dispatch("copilot-export", {
          target: action.target,
          format: "csv", // default
        });
        break;

      case "SHOW_METRIC":
        dispatch("copilot-show-metric", {
          metric: action.metric,
        });
        break;
    }
  }, []);

  return (
    <CopilotContext.Provider
      value={{ context, executeAction, registerView, registerSelection }}
    >
      {children}
      <CopilotChat />
    </CopilotContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useCopilot() {
  const ctx = useContext(CopilotContext);
  if (!ctx) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }
  return ctx;
}
