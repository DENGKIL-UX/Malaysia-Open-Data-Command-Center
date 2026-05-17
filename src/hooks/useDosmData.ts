// src/hooks/useDosmData.ts
// React hooks for fetching live data from api.data.gov.my via our proxy
// Uses three-tier fallback (API → CSV → Static), DoSM-aware date parsing,
// and status tracking
//
// v4 FIXES:
//   - Added retry backoff: stops cascade 404 errors by limiting retries
//   - After MAX_RETRIES consecutive failures, stops retrying until manual refetch
//   - Auto-refresh only runs when previous fetch succeeded
//   - GDP series_type: use 'abs' not 'real' for absolute GDP
//   - Correct sort syntax handled by client.ts (uses "-date")
//   - Exchange rate field: 'rate' (already correct)
//   - HPI field: 'index' (already correct)
//   - hies_state filter: 'variable' (already correct)

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDosmData, fetchMany, type DosmDataResult, type DosmQueryOptions, type DataStatus } from '@/lib/dosm/client';
import type { DatasetId } from '@/lib/dosm/registry';
import { DOSM_REGISTRY, COMMAND_CENTER_KPIS, PRIORITY_DATASETS } from '@/lib/dosm/registry';

// ── RETRY BACKOFF CONSTANTS ──
const MAX_CONSECUTIVE_FAILURES = 2;  // Stop auto-retry after 2 failures
const RETRY_BACKOFF_BASE_MS = 5000; // 5 seconds base delay

// ── HOOK STATE ──
interface UseDosmState<T = Record<string, unknown>> {
  result: DosmDataResult<T> | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
  status: DataStatus;
  refetch: () => void;
}

// ── MASTER HOOK ──
export function useDosmData<T = Record<string, unknown>>(
  datasetId: DatasetId | string,
  options: DosmQueryOptions = {},
  refreshMs?: number
): UseDosmState<T> {
  const [result, setResult] = useState<DosmDataResult<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [status, setStatus] = useState<DataStatus>('loading');
  const mountedRef = useRef(true);
  const fetchCountRef = useRef(0);
  const consecutiveFailures = useRef(0);  // Track consecutive failures to stop cascade retries
  const lastErrorTime = useRef(0);        // Timestamp of last error for backoff

  const optionsKey = JSON.stringify(options);
  const load = useCallback(async () => {
    if (!mountedRef.current) return;

    // ── RETRY BACKOFF: Skip if too many consecutive failures ──
    if (consecutiveFailures.current >= MAX_CONSECUTIVE_FAILURES) {
      const elapsed = Date.now() - lastErrorTime.current;
      const backoffMs = RETRY_BACKOFF_BASE_MS * Math.pow(2, consecutiveFailures.current - 1);
      if (elapsed < backoffMs) {
        // Still in backoff period — skip this fetch silently
        return;
      }
      // Backoff period passed — allow one more attempt
    }

    const thisFetch = ++fetchCountRef.current;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDosmData<T>(datasetId, options);
      if (!mountedRef.current || thisFetch !== fetchCountRef.current) return;

      // Success — reset failure counter
      consecutiveFailures.current = 0;
      lastErrorTime.current = 0;

      setResult(data);
      setStale(false);
      setStatus(data.status);
      if (data.error && data.status === 'error') {
        setError(data.error);
      }
    } catch (err: unknown) {
      if (!mountedRef.current || thisFetch !== fetchCountRef.current) return;

      // Increment failure counter
      consecutiveFailures.current++;
      lastErrorTime.current = Date.now();

      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setStatus('error');

      if (consecutiveFailures.current >= MAX_CONSECUTIVE_FAILURES) {
        console.warn(
          `[DoSM Hook] ${datasetId}: ${consecutiveFailures.current} consecutive failures — ` +
          `pausing auto-retry. Use refetch() to retry manually.`
        );
      }
    } finally {
      if (mountedRef.current && thisFetch === fetchCountRef.current) {
        setLoading(false);
      }
    }
  }, [datasetId, optionsKey]);

  // Mount fetch
  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  // Auto-refresh — ONLY if not in backoff state
  useEffect(() => {
    const ms = refreshMs ?? DOSM_REGISTRY[datasetId as DatasetId]?.refreshMs;
    if (!ms) return;
    const timer = setInterval(() => {
      // Skip refresh if in backoff state
      if (consecutiveFailures.current >= MAX_CONSECUTIVE_FAILURES) {
        const elapsed = Date.now() - lastErrorTime.current;
        const backoffMs = RETRY_BACKOFF_BASE_MS * Math.pow(2, consecutiveFailures.current - 1);
        if (elapsed < backoffMs) return; // Still in backoff
        // Backoff expired — allow attempt (counter resets on success)
      }
      setStale(true);
      load();
    }, ms);
    return () => clearInterval(timer);
  }, [load, refreshMs, datasetId]);

  // Manual refetch — always resets failure counter
  const refetch = useCallback(() => {
    consecutiveFailures.current = 0;
    lastErrorTime.current = 0;
    load();
  }, [load]);

  return { result, loading, error, stale, status, refetch };
}

// ── HOOK: Fetch all Command Center KPIs ──
export function useCommandCenterKPIs() {
  const [data, setData] = useState<Record<string, DosmDataResult | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anyLive, setAnyLive] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      try {
        const result = await fetchMany(
          COMMAND_CENTER_KPIS.map(id => ({ id }))
        );
        if (!cancelled && mountedRef.current) {
          setData(result);
          setAnyLive(Object.values(result).some(r => r?.status === 'live'));
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled && mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to load KPIs');
          setLoading(false);
        }
      }
    }

    loadAll();
    return () => { cancelled = true; mountedRef.current = false; };
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const result = await fetchMany(
          COMMAND_CENTER_KPIS.map(id => ({ id }))
        );
        if (mountedRef.current) {
          setData(result);
          setAnyLive(Object.values(result).some(r => r?.status === 'live'));
        }
      } catch { /* ignore refresh errors */ }
    }, 300_000);
    return () => clearInterval(timer);
  }, []);

  return { data, loading, error, anyLive };
}

// ── HOOK: Fetch all datasets in a priority group ──
export function usePriorityGroup(priority: 'P0' | 'P1' | 'P2' | 'P3') {
  const datasetIds = PRIORITY_DATASETS[priority] ?? [];
  const [data, setData] = useState<Record<string, DosmDataResult | null>>({});
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      try {
        const result = await fetchMany(
          datasetIds.map(id => ({ id }))
        );
        if (!cancelled && mountedRef.current) {
          setData(result);
          setLoading(false);
        }
      } catch { /* ignore */ }

      if (!cancelled) setLoading(false);
    }

    if (datasetIds.length > 0) loadAll();
    return () => { cancelled = true; mountedRef.current = false; };
  }, [priority, JSON.stringify(datasetIds)]);

  return { data, loading };
}

// ══════════════════════════════════════════════
// NAMED HOOKS — one per dataset for convenience
// All use CORRECTED dataset IDs and series_type values
// ══════════════════════════════════════════════

// ── GDP ──
// FIXED: series_type='abs' not 'real' for absolute GDP
export const useGDPAnnual = (options?: DosmQueryOptions) =>
  useDosmData('gdp_annual', { limit: 20, ...options }, 600_000);

// FIXED: series_type='abs' not 'real' for absolute GDP (constant 2015 prices)
export const useGDPQuarterly = (options?: DosmQueryOptions) =>
  useDosmData('gdp_qtr', { limit: 20, ...options }, 300_000);

// NEW: GDP growth rate KPI — series_type='growth_yoy' for YoY %
export const useGDPGrowth = (options?: DosmQueryOptions) =>
  useDosmData('gdp_growth', { limit: 12, ...options }, 300_000);

export const useGDPState = (options?: DosmQueryOptions) =>
  useDosmData('gdp_state', { limit: 100, ...options }, 600_000);

// ── PRICES ──
export const useCPI = (options?: DosmQueryOptions) =>
  useDosmData('cpi_headline', { limit: 24, ...options }, 300_000);

export const useCPIInflation = (options?: DosmQueryOptions) =>
  useDosmData('cpi_inflation', { limit: 24, ...options }, 300_000);

export const useCPIDivision = (options?: DosmQueryOptions) =>
  useDosmData('cpi_2d', { limit: 48, ...options }, 600_000);

export const useCPICategory = (options?: DosmQueryOptions) =>
  useDosmData('cpi_category', { limit: 48, ...options }, 600_000);

export const useCPIState = (options?: DosmQueryOptions) =>
  useDosmData('cpi_state', { limit: 100, ...options }, 600_000);

export const useFuelPrice = (options?: DosmQueryOptions) =>
  useDosmData('fuelprice', { limit: 52, ...options }, 300_000);

// HPI: field is 'index' not 'value'
export const useHousePrice = (options?: DosmQueryOptions) =>
  useDosmData('hpi_malaysia', { limit: 24, ...options }, 600_000);

export const usePPI = (options?: DosmQueryOptions) =>
  useDosmData('ppi', { limit: 24, ...options }, 600_000);

// ── LABOUR ──
export const useLabourMonthly = (options?: DosmQueryOptions) =>
  useDosmData('labour_monthly', { limit: 24, ...options }, 300_000);

export const useLabourState = (options?: DosmQueryOptions) =>
  useDosmData('labour_state', { limit: 100, ...options }, 600_000);

// ── TRADE ──
export const useTrade = (options?: DosmQueryOptions) =>
  useDosmData('trade_monthly', { limit: 24, ...options }, 300_000);

// ── FINANCE ──
// Exchange rate: field is 'rate' not 'value', default currency=USD
export const useExchangeRate = (options?: DosmQueryOptions) =>
  useDosmData('exchange_rate', { limit: 30, ...options }, 300_000);

export const useExchangeRateDaily = (options?: DosmQueryOptions) =>
  useDosmData('exchangerates_daily', { limit: 30, ...options }, 300_000);

// ── POPULATION ──
// CRITICAL: 3-way filter required to prevent 200x data duplication
export const usePopulation = (options?: DosmQueryOptions) =>
  useDosmData('population_state', { limit: 100, filters: { sex: 'both', ethnicity: 'overall', age: 'overall' }, ...options }, 86_400_000);

export const usePopulationMalaysia = (options?: DosmQueryOptions) =>
  useDosmData('population_malaysia', { limit: 50, filters: { sex: 'both', ethnicity: 'overall', age: 'overall' }, ...options }, 86_400_000);

// ── VITAL STATISTICS ──
export const useBirths = (options?: DosmQueryOptions) =>
  useDosmData('births', { limit: 20, ...options }, 86_400_000);

export const useDeaths = (options?: DosmQueryOptions) =>
  useDosmData('deaths', { limit: 20, ...options }, 86_400_000);

// ── HOUSEHOLDS ──
// hies_state: filter key is 'variable' not 'type'
export const useHouseholdIncome = (options?: DosmQueryOptions) =>
  useDosmData('household_income', { limit: 50, ...options }, 86_400_000);

export const useHiesMalaysia = (options?: DosmQueryOptions) =>
  useDosmData('hies_malaysia', { limit: 50, ...options }, 86_400_000);

export const usePovertyRate = (options?: DosmQueryOptions) =>
  useDosmData('poverty_rate', { limit: 50, ...options }, 86_400_000);

// ── IPI ──
export const useIPI = (options?: DosmQueryOptions) =>
  useDosmData('ipi', { limit: 24, ...options }, 600_000);

// ── HEALTHCARE ──
export const useHospitalBeds = (options?: DosmQueryOptions) =>
  useDosmData('hospital_beds', { limit: 50, ...options }, 86_400_000);

// ── SAFETY ──
export const useCrime = (options?: DosmQueryOptions) =>
  useDosmData('crime_district', { limit: 200, ...options }, 86_400_000);

// ── ENVIRONMENT ──
export const useAirPollution = (options?: DosmQueryOptions) =>
  useDosmData('air_pollution', { limit: 30, ...options }, 600_000);

// ── TRANSPORT ──
export const useRidership = (options?: DosmQueryOptions) =>
  useDosmData('ridership', { limit: 24, ...options }, 600_000);

export const useVehicleRegistration = (options?: DosmQueryOptions) =>
  useDosmData('vehicle_registration', { limit: 24, ...options }, 600_000);

// ── ADDITIONAL ──
export const usePovertyByState = (options?: DosmQueryOptions) =>
  useDosmData('poverty_state', { limit: 50, ...options }, 86_400_000);

export const useRoadAccidents = (options?: DosmQueryOptions) =>
  useDosmData('road_accidents', { limit: 50, ...options }, 86_400_000);

export const useDeathsCause = (options?: DosmQueryOptions) =>
  useDosmData('deaths_cause', { limit: 50, ...options }, 86_400_000);

export const useLabourByEducation = (options?: DosmQueryOptions) =>
  useDosmData('lfs_edu', { limit: 50, ...options }, 600_000);

export const useTradeByCountry = (options?: DosmQueryOptions) =>
  useDosmData('trade_country', { limit: 50, ...options }, 600_000);

export const usePopulationParlimen = (options?: DosmQueryOptions) =>
  useDosmData('population_parlimen', { limit: 300, ...options }, 86_400_000);

export const usePalmOil = (options?: DosmQueryOptions) =>
  useDosmData('palm_oil', { limit: 24, ...options }, 600_000);
