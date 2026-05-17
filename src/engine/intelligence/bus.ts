// ============================================================================
// Malaysia Open Data Command Center — Cross-Tab Intelligence Bus
// Zustand-powered state bus for cross-component communication
// Connects alerts, anomalies, insights, context across all tabs
// ============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface IntelAlert {
  id: string;
  level: AlertLevel;
  message: string;
  messageBM: string;
  dataset: string;
  value?: number;
  expected?: number;
  timestamp: number;
  dismissed: boolean;
}

export interface IntelInsight {
  id: string;
  dataset: string;
  headline: string;
  headlineBM: string;
  body: string;
  confidence: number;
  timestamp: number;
}

export interface IntelAnomaly {
  id: string;
  dataset: string;
  description: string;
  descriptionBM: string;
  severity: AlertLevel;
  value: number;
  expected: number;
  zScore: number;
  timestamp: number;
}

interface IntelBusState {
  // Active context
  activeDataset: string | null;
  activeTab: string;
  selectedObjectId: string | null;

  // Intelligence collections
  alerts: IntelAlert[];
  insights: IntelInsight[];
  anomalies: IntelAnomaly[];

  // Highlighted objects (for graph)
  highlightedIds: string[];

  // Actions
  setContext: (dataset: string, tab?: string) => void;
  selectObject: (id: string | null) => void;
  highlightObjects: (ids: string[]) => void;
  pushAlert: (alert: Omit<IntelAlert, 'id' | 'timestamp' | 'dismissed'>) => void;
  pushInsight: (insight: Omit<IntelInsight, 'id' | 'timestamp'>) => void;
  pushAnomaly: (anomaly: Omit<IntelAnomaly, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
}

export const useIntelBus = create<IntelBusState>()(
  persist(
    (set, get) => ({
      activeDataset: null,
      activeTab: 'overview',
      selectedObjectId: null,
      alerts: [],
      insights: [],
      anomalies: [],
      highlightedIds: [],

      setContext: (dataset, tab) => {
        set({
          activeDataset: dataset,
          ...(tab ? { activeTab: tab } : {}),
        });
      },

      selectObject: (id) => set({ selectedObjectId: id }),

      highlightObjects: (ids) => set({ highlightedIds: ids }),

      pushAlert: (alert) => {
        const existing = get().alerts;
        // Deduplicate: skip if same dataset + same message already exists
        const duplicate = existing.some(
          (a) => a.dataset === alert.dataset && a.message === alert.message
        );
        if (duplicate) return;

        set((s) => ({
          alerts: [
            {
              ...alert,
              id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
              dismissed: false,
            },
            ...s.alerts,
          ].slice(0, 30), // Cap at 30 alerts
        }));
      },

      pushInsight: (insight) => {
        set((s) => ({
          insights: [
            {
              ...insight,
              id: `insight-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
            ...s.insights,
          ].slice(0, 50), // Cap at 50 insights
        }));
      },

      pushAnomaly: (anomaly) => {
        const existing = get().anomalies;
        // Deduplicate: skip if same dataset + very similar value
        const duplicate = existing.some(
          (a) => a.dataset === anomaly.dataset && Math.abs(a.value - anomaly.value) < 0.01
        );
        if (duplicate) return;

        const newAnomaly: IntelAnomaly = {
          ...anomaly,
          id: `anomaly-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: Date.now(),
        };

        set((s) => ({
          anomalies: [newAnomaly, ...s.anomalies].slice(0, 100), // Cap at 100
        }));

        // Auto-push critical anomalies as alerts
        if (anomaly.severity === 'CRITICAL') {
          get().pushAlert({
            level: 'CRITICAL',
            message: anomaly.description,
            messageBM: anomaly.descriptionBM,
            dataset: anomaly.dataset,
            value: anomaly.value,
            expected: anomaly.expected,
          });
        }
      },

      dismissAlert: (id) => {
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id ? { ...a, dismissed: true } : a
          ),
        }));
      },

      clearAll: () =>
        set({
          alerts: [],
          insights: [],
          anomalies: [],
          highlightedIds: [],
        }),
    }),
    {
      name: 'intel-bus-state',
      version: 1,
      // Only persist context, not volatile collections
      partialize: (state) => ({
        activeDataset: state.activeDataset,
        activeTab: state.activeTab,
      }),
    }
  )
);
