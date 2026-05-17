// src/components/dashboard/live-data-provider.tsx
// Provider component that fetches P0/P1 live data from api.data.gov.my
// and makes it available to all dashboard components via context

'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useDosmData, useCommandCenterKPIs } from '@/hooks/useDosmData';
import type { DosmDataResult } from '@/lib/dosm/client';
import { COMMAND_CENTER_KPIS, type DatasetId } from '@/lib/dosm/registry';
import { analyze } from '@/engine/intelligence/confidence';
import { detect, detectSummary } from '@/engine/intelligence/anomaly';

// ── Types ──
export interface LiveKPI {
  id: DatasetId;
  label: string;
  labelBM: string;
  value: number | string;
  prevValue: number | string;
  change: number;
  changePct: number;
  trend: 'up' | 'down' | 'flat';
  unit: string;
  color: string;
  sparkline: number[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface LiveAnomaly {
  id: string;
  datasetId: string;
  datasetLabel: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  value: number;
  expected: number;
  zScore: number;
  description: string;
  timestamp: Date;
}

export interface LiveConfidence {
  datasetId: string;
  datasetLabel: string;
  score: number;
  label: 'CONFIRMED' | 'HIGH' | 'MODERATE' | 'UNVERIFIED';
  riskLevel: string;
  recommendation: string;
}

interface LiveDataContextValue {
  kpis: LiveKPI[];
  kpiMap: Record<string, LiveKPI>;
  anomalies: LiveAnomaly[];
  confidences: LiveConfidence[];
  confidenceCounts: { confirmed: number; high: number; moderate: number; unverfied: number };
  anyLoading: boolean;
  isLive: boolean;
  rawData: Record<string, DosmDataResult | null>;
}

const LiveDataContext = createContext<LiveDataContextValue>({
  kpis: [],
  kpiMap: {},
  anomalies: [],
  confidences: [],
  confidenceCounts: { confirmed: 0, high: 0, moderate: 0, unverfied: 0 },
  anyLoading: true,
  isLive: false,
  rawData: {},
});

export function useLiveData() {
  return useContext(LiveDataContext);
}

// ── Provider Component ──
export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  // Fetch all command center KPI datasets
  const { data: kpiData, loading, error } = useCommandCenterKPIs();

  const processed = useMemo(() => {
    const kpis: LiveKPI[] = [];
    const anomalies: LiveAnomaly[] = [];
    const confidences: LiveConfidence[] = [];

    for (const datasetId of COMMAND_CENTER_KPIS) {
      const result = kpiData[datasetId];
      const config = result?.config;

      if (!result || !config || result.error) {
        // Create a placeholder KPI
        kpis.push({
          id: datasetId,
          label: config?.label ?? datasetId,
          labelBM: config?.labelBM ?? datasetId,
          value: '—',
          prevValue: '—',
          change: 0,
          changePct: 0,
          trend: 'flat',
          unit: config?.unit ?? '',
          color: config?.color ?? '#06b6d4',
          sparkline: [],
          loading: true,
          error: result?.error ?? (error ? 'Network error' : null),
          lastUpdated: null,
        });
        continue;
      }

      // Extract values
      const latestValue = result.latestValue;
      const prevValue = result.prevValue;
      const changePct = result.changePct;

      // Build sparkline from history
      const sparkline = result.history
        .map((d: Record<string, unknown>) => {
          const val = parseFloat(String(d[config.valueField] ?? 0));
          return isNaN(val) ? 0 : val;
        })
        .filter((v: number) => v !== 0);

      // Format value for display
      const formattedValue = formatValue(latestValue, config.unit);

      kpis.push({
        id: datasetId,
        label: config.label,
        labelBM: config.labelBM,
        value: formattedValue,
        prevValue: formatValue(prevValue, config.unit),
        change: result.change,
        changePct,
        trend: result.trend,
        unit: config.unit,
        color: config.color,
        sparkline,
        loading: false,
        error: null,
        lastUpdated: result.fetchedAt,
      });

      // Run confidence analysis on the data
      const values = result.raw
        .map((d: Record<string, unknown>) => parseFloat(String(d[config.valueField] ?? 0)))
        .filter((v: number) => !isNaN(v));

      if (values.length >= 3) {
        const latestDate = String((result.latest as Record<string, unknown>)[config.dateField] ?? '');
        const confidence = analyze(config.label, values, {
          dataDate: latestDate,
          sampleSize: values.length,
          sources: [{ name: 'DoSM Malaysia', type: 'government' as const, reliability: 0.99, url: 'https://api.data.gov.my' }],
          category: config.category,
          geographicCoverage: config.groupField === 'state' ? 0.85 : 0.95,
        });

        confidences.push({
          datasetId,
          datasetLabel: config.labelBM,
          score: confidence.confidence,
          label: confidence.confidenceLabel,
          riskLevel: confidence.riskLevel,
          recommendation: confidence.recommendation,
        });

        // Run anomaly detection
        const anomalyResults = detect(values);
        for (const a of anomalyResults.slice(0, 3)) { // Top 3 anomalies per dataset
          anomalies.push({
            id: `${datasetId}-anomaly-${a.index}`,
            datasetId,
            datasetLabel: config.labelBM,
            severity: a.severity === 'critical' ? 'critical'
              : a.severity === 'high' ? 'high'
              : a.severity === 'medium' ? 'medium' : 'low',
            value: a.value,
            expected: result.avg,
            zScore: a.zScore,
            description: a.description,
            timestamp: result.fetchedAt,
          });
        }
      }
    }

    // Confidence counts
    const confidenceCounts = {
      confirmed: confidences.filter(c => c.label === 'CONFIRMED').length,
      high: confidences.filter(c => c.label === 'HIGH').length,
      moderate: confidences.filter(c => c.label === 'MODERATE').length,
      unverfied: confidences.filter(c => c.label === 'UNVERIFIED').length,
    };

    // Sort anomalies by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    anomalies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    // Build kpiMap
    const kpiMap: Record<string, LiveKPI> = {};
    for (const kpi of kpis) {
      kpiMap[kpi.id] = kpi;
    }

    const isLive = kpis.some(k => !k.loading && !k.error);

    return { kpis, kpiMap, anomalies, confidences, confidenceCounts, isLive };
  }, [kpiData, error]);

  const value = useMemo(() => ({
    ...processed,
    anyLoading: loading,
    rawData: kpiData,
  }), [processed, loading, kpiData]);

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
}

// ── Format helper ──
function formatValue(value: number, unit: string): string {
  if (isNaN(value)) return '—';
  if (unit === '%') return value.toFixed(1);
  if (unit === 'RM Bilion') return `RM ${value.toFixed(1)}B`;
  if (unit === 'RM Juta') return `RM ${(value / 1000).toFixed(1)}B`;
  if (unit === 'RM/liter') return `RM ${value.toFixed(2)}`;
  if (unit === 'RM') return `RM ${value.toFixed(2)}`;
  if (unit === 'Indeks') return value.toFixed(1);
  if (unit.includes('ribu orang') || unit.includes("'000")) {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}M`;
    return `${value.toFixed(0)}K`;
  }
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(1);
}
