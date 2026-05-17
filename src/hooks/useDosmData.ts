// src/hooks/useDosmData.ts
// React hooks for fetching live data from api.data.gov.my via our proxy
// Uses SWR pattern with stale-while-revalidate, static fallbacks, and status tracking

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDosmData, fetchMany, type DosmDataResult, type DosmQueryOptions, type DataStatus } from '@/lib/dosm/client';
import type { DatasetId } from '@/lib/dosm/registry';
import { DOSM_REGISTRY, COMMAND_CENTER_KPIS, PRIORITY_DATASETS } from '@/lib/dosm/registry';

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

  const optionsKey = JSON.stringify(options);
  const load = useCallback(async () => {
    if (!mountedRef.current) return;
    const thisFetch = ++fetchCountRef.current;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDosmData<T>(datasetId, options);
      if (!mountedRef.current || thisFetch !== fetchCountRef.current) return;
      setResult(data);
      setStale(false);
      setStatus(data.status);
      if (data.error && data.status === 'error') {
        setError(data.error);
      }
    } catch (err: unknown) {
      if (!mountedRef.current || thisFetch !== fetchCountRef.current) return;
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setStatus('error');
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

  // Auto-refresh
  useEffect(() => {
    const ms = refreshMs ?? DOSM_REGISTRY[datasetId as DatasetId]?.refreshMs;
    if (!ms) return;
    const timer = setInterval(() => {
      setStale(true);
      load();
    }, ms);
    return () => clearInterval(timer);
  }, [load, refreshMs, datasetId]);

  return { result, loading, error, stale, status, refetch: load };
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
// All use CORRECTED dataset IDs from the ground truth registry
// ══════════════════════════════════════════════

export const useGDPAnnual = (options?: DosmQueryOptions) =>
  useDosmData('gdp_annual', { limit: 20, ...options }, 600_000);

export const useGDPQuarterly = (options?: DosmQueryOptions) =>
  useDosmData('gdp_qtr', { limit: 20, ...options }, 300_000);

export const useGDPState = (options?: DosmQueryOptions) =>
  useDosmData('gdp_state', { limit: 100, ...options }, 600_000);

export const useCPI = (options?: DosmQueryOptions) =>
  useDosmData('cpi_headline', { limit: 24, ...options }, 300_000);

export const useCPIInflation = (options?: DosmQueryOptions) =>
  useDosmData('cpi_inflation', { limit: 24, ...options }, 300_000);

export const useCPICategory = (options?: DosmQueryOptions) =>
  useDosmData('cpi_category', { limit: 48, ...options }, 600_000);

export const useCPIState = (options?: DosmQueryOptions) =>
  useDosmData('cpi_state', { limit: 100, ...options }, 600_000);

export const useLabourMonthly = (options?: DosmQueryOptions) =>
  useDosmData('labour_monthly', { limit: 24, ...options }, 300_000);

export const useLabourState = (options?: DosmQueryOptions) =>
  useDosmData('labour_state', { limit: 100, ...options }, 600_000);

export const useTrade = (options?: DosmQueryOptions) =>
  useDosmData('trade_monthly', { limit: 24, ...options }, 300_000);

export const usePopulation = (options?: DosmQueryOptions) =>
  useDosmData('population_state', { limit: 100, filters: { sex: 'both', ethnicity: 'overall', age: 'overall' }, ...options }, 86_400_000);

export const usePopulationMalaysia = (options?: DosmQueryOptions) =>
  useDosmData('population_malaysia', { limit: 50, filters: { sex: 'both', ethnicity: 'overall', age: 'overall' }, ...options }, 86_400_000);

export const useBirths = (options?: DosmQueryOptions) =>
  useDosmData('births', { limit: 20, ...options }, 86_400_000);

export const useDeaths = (options?: DosmQueryOptions) =>
  useDosmData('deaths', { limit: 20, ...options }, 86_400_000);

export const useFuelPrice = (options?: DosmQueryOptions) =>
  useDosmData('fuelprice', { limit: 52, ...options }, 300_000);

export const useExchangeRate = (options?: DosmQueryOptions) =>
  useDosmData('exchange_rate', { limit: 30, ...options }, 300_000);

export const useHouseholdIncome = (options?: DosmQueryOptions) =>
  useDosmData('household_income', { limit: 50, ...options }, 86_400_000);

export const usePovertyRate = (options?: DosmQueryOptions) =>
  useDosmData('poverty_rate', { limit: 50, ...options }, 86_400_000);

export const usePPI = (options?: DosmQueryOptions) =>
  useDosmData('ppi', { limit: 24, ...options }, 600_000);

export const useIPI = (options?: DosmQueryOptions) =>
  useDosmData('ipi', { limit: 24, ...options }, 600_000);

export const useHospitalBeds = (options?: DosmQueryOptions) =>
  useDosmData('hospital_beds', { limit: 50, ...options }, 86_400_000);

export const useCrime = (options?: DosmQueryOptions) =>
  useDosmData('crime_district', { limit: 200, ...options }, 86_400_000);

export const useAirPollution = (options?: DosmQueryOptions) =>
  useDosmData('air_pollution', { limit: 30, ...options }, 600_000);

export const useRidership = (options?: DosmQueryOptions) =>
  useDosmData('ridership', { limit: 24, ...options }, 600_000);

export const useVehicleRegistration = (options?: DosmQueryOptions) =>
  useDosmData('vehicle_registration', { limit: 24, ...options }, 600_000);

export const useHousePrice = (options?: DosmQueryOptions) =>
  useDosmData('hpi_malaysia', { limit: 24, ...options }, 600_000);

export const useHiesMalaysia = (options?: DosmQueryOptions) =>
  useDosmData('hies_malaysia', { limit: 50, ...options }, 86_400_000);

export const useExchangeRateDaily = (options?: DosmQueryOptions) =>
  useDosmData('exchangerates_daily', { limit: 30, ...options }, 300_000);

export const useDeathsCause = (options?: DosmQueryOptions) =>
  useDosmData('deaths_cause', { limit: 50, ...options }, 86_400_000);

export const useLabourByEducation = (options?: DosmQueryOptions) =>
  useDosmData('lfs_edu', { limit: 50, ...options }, 600_000);

export const useTradeByCountry = (options?: DosmQueryOptions) =>
  useDosmData('trade_country', { limit: 50, ...options }, 600_000);

export const usePovertyByState = (options?: DosmQueryOptions) =>
  useDosmData('poverty_state', { limit: 50, ...options }, 86_400_000);

export const useRoadAccidents = (options?: DosmQueryOptions) =>
  useDosmData('road_accidents', { limit: 50, ...options }, 86_400_000);

export const usePopulationParlimen = (options?: DosmQueryOptions) =>
  useDosmData('population_parlimen', { limit: 300, ...options }, 86_400_000);

export const usePalmOil = (options?: DosmQueryOptions) =>
  useDosmData('palm_oil', { limit: 24, ...options }, 600_000);
