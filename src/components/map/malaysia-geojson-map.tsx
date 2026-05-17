'use client';

import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { STATES } from '@/lib/data/malaysia-data';

// ─── Types ───────────────────────────────────────────────────────────
interface MalaysiaMapProps {
  activeLayer: 'population' | 'gdp' | 'births' | 'deaths' | 'unemployment' | 'datasets';
  selectedState: string | null;
  onSelectState: (stateId: string) => void;
  onHoverState: (stateId: string | null) => void;
  lang?: 'en' | 'ms';
}

// ─── State ID ↔ GeoJSON code_state mapping ──────────────────────────
const STATE_CODE_TO_ID: Record<number, string> = {
  1: 'johor', 2: 'kedah', 3: 'kelantan', 4: 'melaka',
  5: 'negeri-sembilan', 6: 'pahang', 7: 'pulau-pinang', 8: 'perak',
  9: 'perlis', 10: 'selangor', 11: 'terengganu', 12: 'sabah',
  13: 'sarawak', 14: 'wp-kuala-lumpur', 15: 'wp-labuan', 16: 'wp-putrajaya',
};

const STATE_ID_TO_CODE: Record<string, number> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_ID).map(([code, id]) => [id, Number(code)])
);

// ─── Zoom Level Type ────────────────────────────────────────────────
type ZoomLevel = 'states' | 'districts' | 'parlimen' | 'dun';

// ─── Fallback center coordinates for small/federal territory states ────
const STATE_CENTER_FALLBACKS: Record<string, [number, number]> = {
  'wp-kuala-lumpur': [101.6873, 3.1390],
  'wp-putrajaya': [101.6935, 2.9211],
  'wp-labuan': [115.2436, 5.2833],
  'pulau-pinang': [100.3364, 5.4164],
  'melaka': [102.2511, 2.3294],
  'perlis': [100.2077, 6.4434],
};

const MIN_ZOOM_FOR_STATE = 8;

// ─── Format helpers ─────────────────────────────────────────────────
function formatValue(value: number, layer: string): string {
  switch (layer) {
    case 'population': return `${value.toLocaleString()}k`;
    case 'gdp': return `RM ${(value / 1000).toFixed(1)}B`;
    case 'births': case 'deaths': return `${value}k`;
    case 'unemployment': return `${value}%`;
    case 'datasets': return `${value}`;
    default: return value.toLocaleString();
  }
}

function getLayerUnit(layer: string): string {
  switch (layer) {
    case 'population': return "'000"; case 'gdp': return 'RM M';
    case 'births': return "'000"; case 'deaths': return "'000";
    case 'unemployment': return '%'; case 'datasets': return '';
    default: return '';
  }
}

// ─── Build data-driven fill-color expression for choropleth ─────────
function buildChoroplethColorExpression(
  activeLayer: string,
  minVal: number,
  maxVal: number
): unknown[] {
  // Map each code_state → data value → interpolated color
  // Using step-like case expression per state for precise per-state coloring
  const stops: unknown[] = ['case'];
  STATES.forEach(state => {
    const code = STATE_ID_TO_CODE[state.id];
    if (code === undefined) return;
    const value = state[activeLayer as keyof typeof state] as number;
    if (minVal === maxVal) {
      stops.push(['==', ['get', 'code_state'], code], 'rgba(6, 182, 212, 0.35)');
      return;
    }
    const t = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal)));
    const r = Math.round(10 + t * (6 - 10));
    const g = Math.round(22 + t * (182 - 22));
    const b = Math.round(40 + t * (212 - 40));
    const alpha = 0.4 + t * 0.5;
    stops.push(['==', ['get', 'code_state'], code], `rgba(${r}, ${g}, ${b}, ${alpha})`);
  });
  stops.push('rgba(6, 182, 212, 0.15)');
  return stops;
}

// ─── Component ───────────────────────────────────────────────────────
export default function MalaysiaGeoJSONMap({
  activeLayer,
  selectedState,
  onSelectState,
  onHoverState,
  lang = 'en',
}: MalaysiaMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoveredCodeRef = useRef<number | null>(null);
  const selectedCodeRef = useRef<number | null>(null);
  const activeLayerRef = useRef(activeLayer);
  const onHoverStateRef = useRef(onHoverState);
  const onSelectStateRef = useRef(onSelectState);

  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('states');
  const [focusedState, setFocusedState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltipData, setTooltipData] = useState<{
    name: string; abbr: string; value: number; region: string;
  } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(4.5);
  const [geoData, setGeoData] = useState<{
    states: GeoJSON.FeatureCollection | null;
    districts: GeoJSON.FeatureCollection | null;
    parlimen: GeoJSON.FeatureCollection | null;
    dun: GeoJSON.FeatureCollection | null;
  }>({ states: null, districts: null, parlimen: null, dun: null });

  // Keep refs in sync with props (avoid stale closures in map event handlers)
  useEffect(() => { activeLayerRef.current = activeLayer; }, [activeLayer]);
  useEffect(() => { onHoverStateRef.current = onHoverState; }, [onHoverState]);
  useEffect(() => { onSelectStateRef.current = onSelectState; }, [onSelectState]);

  // Lookup map
  const stateMap = useMemo(() => {
    const m: Record<string, typeof STATES[0]> = {};
    STATES.forEach(s => (m[s.id] = s));
    return m;
  }, []);

  // Compute min/max for active layer
  const { minVal, maxVal } = useMemo(() => {
    const values = STATES.map(s => s[activeLayer as keyof typeof s] as number);
    return { minVal: Math.min(...values), maxVal: Math.max(...values) };
  }, [activeLayer]);

  const selectedCode = selectedState ? STATE_ID_TO_CODE[selectedState] ?? null : null;
  useEffect(() => { selectedCodeRef.current = selectedCode; }, [selectedCode]);

  // ─── Load GeoJSON data (lazy: states first, then districts, parlimen, dun) ──
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // Load essential states data first
        const statesRes = await fetch('/geodata/states.geojson');
        if (cancelled) return;
        const states = await statesRes.json();
        if (cancelled) return;
        setGeoData(prev => ({ ...prev, states: states as GeoJSON.FeatureCollection }));
        setLoading(false);

        // Lazy-load other layers
        fetch('/geodata/districts.geojson').then(r => r.json()).then(data => {
          if (!cancelled) setGeoData(prev => ({ ...prev, districts: data as GeoJSON.FeatureCollection }));
        }).catch(() => {});

        fetch('/geodata/parlimen.geojson').then(r => r.json()).then(data => {
          if (!cancelled) setGeoData(prev => ({ ...prev, parlimen: data as GeoJSON.FeatureCollection }));
        }).catch(() => {});

        fetch('/geodata/dun.geojson').then(r => r.json()).then(data => {
          if (!cancelled) setGeoData(prev => ({ ...prev, dun: data as GeoJSON.FeatureCollection }));
        }).catch(() => {});
      } catch (err) {
        console.error('Failed to load geodata:', err);
        setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  // ─── Initialize MapLibre GL map ──────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || !geoData.states) return;

    const choroplethExpr = buildChoroplethColorExpression(activeLayer, minVal, maxVal);

    const mapStyle: maplibregl.StyleSpecification = {
      version: 8,
      name: 'Malaysia Command Center',
      sources: {
        states: { type: 'geojson', data: geoData.states, generateId: true },
        districts: { type: 'geojson', data: geoData.districts || { type: 'FeatureCollection', features: [] } },
        parlimen: { type: 'geojson', data: geoData.parlimen || { type: 'FeatureCollection', features: [] } },
        dun: { type: 'geojson', data: geoData.dun || { type: 'FeatureCollection', features: [] } },
      },
      layers: [
        { id: 'background', type: 'background', paint: { 'background-color': '#0a0e1a' } },
        // State fills — choropleth
        {
          id: 'state-fills', type: 'fill', source: 'states',
          paint: {
            'fill-color': choroplethExpr as any,
            'fill-opacity': 0.9,
          },
        },
        // Hover highlight (GPU feature-state driven — ZERO React re-renders)
        {
          id: 'state-hover', type: 'fill', source: 'states',
          paint: {
            'fill-color': 'rgba(6, 182, 212, 0.25)',
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
          },
        },
        // Selected highlight (GPU feature-state driven)
        {
          id: 'state-selected', type: 'fill', source: 'states',
          paint: {
            'fill-color': 'rgba(6, 182, 212, 0.35)',
            'fill-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0],
          },
        },
        // State border — dark halo for contrast
        {
          id: 'state-border-halo', type: 'line', source: 'states',
          paint: { 'line-color': 'rgba(0, 0, 0, 0.5)', 'line-width': 3, 'line-blur': 1 },
        },
        // State border — bright gold
        {
          id: 'state-border', type: 'line', source: 'states',
          paint: { 'line-color': 'rgba(251, 191, 36, 0.8)', 'line-width': 1.5 },
        },
        // District borders
        {
          id: 'district-borders', type: 'line', source: 'districts',
          paint: { 'line-color': 'rgba(245, 158, 11, 0.5)', 'line-width': 1 },
          minzoom: 5, layout: { visibility: 'none' },
        },
        // Parlimen borders
        {
          id: 'parlimen-borders', type: 'line', source: 'parlimen',
          paint: { 'line-color': 'rgba(167, 139, 250, 0.5)', 'line-width': 0.8, 'line-dasharray': [5, 3] },
          minzoom: 6, layout: { visibility: 'none' },
        },
        // DUN borders
        {
          id: 'dun-borders', type: 'line', source: 'dun',
          paint: { 'line-color': 'rgba(16, 185, 129, 0.45)', 'line-width': 0.6, 'line-dasharray': [2, 2, 5, 2] },
          minzoom: 7, layout: { visibility: 'none' },
        },
        // State labels
        {
          id: 'state-labels', type: 'symbol', source: 'states',
          layout: {
            'text-field': ['get', 'state'],
            'text-font': ['Open Sans Regular'],
            'text-size': 11,
            'text-max-width': 6,
            'text-anchor': 'center',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': 'rgba(6, 182, 212, 0.7)',
            'text-halo-color': 'rgba(0, 0, 0, 0.8)',
            'text-halo-width': 1.5,
          },
        },
        // District labels
        {
          id: 'district-labels', type: 'symbol', source: 'districts',
          layout: {
            'text-field': ['get', 'district'],
            'text-font': ['Open Sans Regular'],
            'text-size': 9,
            'text-max-width': 5,
            'text-anchor': 'center',
            'text-allow-overlap': false,
            visibility: 'none',
          },
          paint: {
            'text-color': 'rgba(245, 158, 11, 0.65)',
            'text-halo-color': 'rgba(0, 0, 0, 0.6)',
            'text-halo-width': 1,
          },
          minzoom: 6,
        },
      ],
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    };

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [110.5, 4.0],
      zoom: 4.5,
      minZoom: 3,
      maxZoom: 12,
      maxBounds: [[95, -2], [122, 10]],
      attributionControl: false,
      dragRotate: false,
      touchZoomRotate: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    mapRef.current = map;

    // ─── Hover interaction (entirely GPU-driven — no React re-renders for highlight) ───
    let hoveredFeatureId: number | null = null;
    let lastTooltipStateId: string | null = null;

    map.on('mousemove', 'state-fills', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const codeState = feature.properties?.code_state as number;

      // GPU feature-state update — no React re-render needed for visual highlight!
      if (hoveredFeatureId !== null && hoveredFeatureId !== feature.id) {
        map.setFeatureState({ source: 'states', id: hoveredFeatureId }, { hover: false });
      }
      if (feature.id !== undefined) {
        map.setFeatureState({ source: 'states', id: feature.id }, { hover: true });
        hoveredFeatureId = feature.id as number;
      }

      hoveredCodeRef.current = codeState;
      const stateId = STATE_CODE_TO_ID[codeState];
      if (stateId) {
        onHoverStateRef.current(stateId);

        // Only update tooltip React state when the hovered state changes (not every mousemove pixel!)
        if (stateId !== lastTooltipStateId) {
          lastTooltipStateId = stateId;
          const stateData = stateMap[stateId];
          if (stateData) {
            const value = stateData[activeLayerRef.current as keyof typeof stateData] as number;
            setTooltipData({ name: stateData.name, abbr: stateData.abbr, value, region: stateData.region });
          }
        }
      }

      // Tooltip positioning via direct DOM (no React re-render)
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${Math.min(e.point.x + 16, e.point.x + 200)}px`;
        tooltipRef.current.style.top = `${Math.min(e.point.y - 10, e.point.y + 100)}px`;
      }

      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'state-fills', () => {
      if (hoveredFeatureId !== null) {
        map.setFeatureState({ source: 'states', id: hoveredFeatureId }, { hover: false });
        hoveredFeatureId = null;
      }
      hoveredCodeRef.current = null;
      lastTooltipStateId = null;
      onHoverStateRef.current(null);
      setTooltipData(null);
      if (tooltipRef.current) tooltipRef.current.style.display = 'none';
      map.getCanvas().style.cursor = 'grab';
    });

    // ─── Click to select state ──────────────────────────────────────
    map.on('click', 'state-fills', (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const codeState = feature.properties?.code_state as number;
      const stateId = STATE_CODE_TO_ID[codeState];
      if (!stateId) return;

      onSelectStateRef.current(stateId);

      // Clear previous selection via feature-state
      if (selectedCodeRef.current !== null) {
        const prev = map.querySourceFeatures('states');
        prev.forEach(f => {
          if (f.properties?.code_state === selectedCodeRef.current && f.id !== undefined) {
            map.setFeatureState({ source: 'states', id: f.id }, { selected: false });
          }
        });
      }

      if (feature.id !== undefined) {
        map.setFeatureState({ source: 'states', id: feature.id }, { selected: true });
      }
      selectedCodeRef.current = codeState;

      // Fly to the clicked state
      // For small states/territories, use flyTo with known center + forced zoom
      const fallbackCenter = STATE_CENTER_FALLBACKS[stateId];
      if (fallbackCenter) {
        map.flyTo({
          center: fallbackCenter,
          zoom: MIN_ZOOM_FOR_STATE,
          duration: 800,
        });
      } else {
        // For larger states, compute bounds from geometry and fit
        const bounds = { minLng: 180, minLat: 90, maxLng: -180, maxLat: -90 };
        const geom = feature.geometry as GeoJSON.MultiPolygon;
        if (geom.coordinates) {
          geom.coordinates.forEach(polygon => {
            polygon.forEach(ring => {
              ring.forEach(([lng, lat]: [number, number]) => {
                bounds.minLng = Math.min(bounds.minLng, lng);
                bounds.maxLng = Math.max(bounds.maxLng, lng);
                bounds.minLat = Math.min(bounds.minLat, lat);
                bounds.maxLat = Math.max(bounds.maxLat, lat);
              });
            });
          });
        }
        map.fitBounds(
          [[bounds.minLng, bounds.minLat], [bounds.maxLng, bounds.maxLat]],
          { padding: 60, duration: 800, maxZoom: 10, minZoom: 5 }
        );
      }
    });

    // Track zoom level
    map.on('zoom', () => setCurrentZoom(map.getZoom()));

    return () => { map.remove(); mapRef.current = null; };
  }, [geoData.states, stateMap]); // Only re-create map when source data changes

  // ─── Update district/parlimen/dun sources when they finish loading ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('districts')) return;
    const src = map.getSource('districts') as maplibregl.GeoJSONSource;
    if (geoData.districts) src.setData(geoData.districts);
  }, [geoData.districts]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('parlimen')) return;
    const src = map.getSource('parlimen') as maplibregl.GeoJSONSource;
    if (geoData.parlimen) src.setData(geoData.parlimen);
  }, [geoData.parlimen]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('dun')) return;
    const src = map.getSource('dun') as maplibregl.GeoJSONSource;
    if (geoData.dun) src.setData(geoData.dun);
  }, [geoData.dun]);

  // ─── Update choropleth colors when activeLayer changes ─────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getLayer('state-fills')) return;
    const expr = buildChoroplethColorExpression(activeLayer, minVal, maxVal);
    map.setPaintProperty('state-fills', 'fill-color', expr as any);
  }, [activeLayer, minVal, maxVal]);

  // ─── Update selected state highlighting ───────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource('states')) return;
    const features = map.querySourceFeatures('states');
    features.forEach(f => {
      if (f.id !== undefined) {
        map.setFeatureState({ source: 'states', id: f.id }, { selected: false });
      }
    });
    if (selectedCode !== null) {
      features.filter(f => f.properties?.code_state === selectedCode).forEach(f => {
        if (f.id !== undefined) {
          map.setFeatureState({ source: 'states', id: f.id }, { selected: true });
        }
      });
    }
  }, [selectedCode]);

  // ─── Layer visibility based on zoom level ─────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const setVis = (layerId: string, vis: 'visible' | 'none') => {
      if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', vis);
    };
    setVis('district-borders', zoomLevel !== 'states' ? 'visible' : 'none');
    setVis('district-labels', zoomLevel !== 'states' ? 'visible' : 'none');
    setVis('parlimen-borders', zoomLevel === 'parlimen' ? 'visible' : 'none');
    setVis('dun-borders', zoomLevel === 'dun' ? 'visible' : 'none');
  }, [zoomLevel]);

  // ─── Reset zoom ───────────────────────────────────────────────────
  const resetZoom = useCallback(() => {
    setZoomLevel('states');
    setFocusedState(null);
    const map = mapRef.current;
    if (map) {
      map.flyTo({ center: [110.5, 4.0], zoom: 4.5, duration: 800 });
      if (map.getSource('states')) {
        map.querySourceFeatures('states').forEach(f => {
          if (f.id !== undefined) map.setFeatureState({ source: 'states', id: f.id }, { selected: false });
        });
      }
    }
  }, []);

  const handleLayerSwitch = useCallback((level: ZoomLevel) => {
    setZoomLevel(level);
    if (level === 'states') { setFocusedState(null); resetZoom(); }
  }, [resetZoom]);

  const layerColors: Record<string, string> = { states: '#fbbf24', districts: '#f59e0b', parlimen: '#a78bfa', dun: '#10b981' };
  const layerLabels: Record<string, { en: string; ms: string }> = {
    states: { en: 'STATE', ms: 'NEGERI' }, districts: { en: 'DISTRICT', ms: 'DAERAH' },
    parlimen: { en: 'PARLIMEN', ms: 'PARLIMEN' }, dun: { en: 'DUN', ms: 'DUN' },
  };
  const dashPatterns: Record<string, string | undefined> = { states: undefined, districts: undefined, parlimen: '3 2', dun: '2 2 5 2' };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg" style={{ background: '#0a0e1a' }}>
      {/* Scan Line Overlay */}
      <div className="scan-line-overlay pointer-events-none absolute inset-0 z-10" />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: 'rgba(10,14,26,0.9)' }}>
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-3 animate-spin" />
            <div className="text-xs font-mono tracking-widest" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'MEMUAT DATA GEOSPATIAL...' : 'LOADING GEOSPATIAL DATA...'}
            </div>
          </div>
        </div>
      )}

      {/* MapLibre GL Map Container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

      {/* ── Boundary Layer Switcher ── */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {(['states', 'districts', 'parlimen', 'dun'] as ZoomLevel[]).map(level => {
          const isActive = zoomLevel === level;
          return (
            <button key={level} onClick={() => handleLayerSwitch(level)}
              className="flex items-center gap-1.5 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-colors"
              style={{
                background: isActive ? `${layerColors[level]}15` : 'rgba(10,14,26,0.85)',
                borderColor: isActive ? `${layerColors[level]}40` : 'rgba(6,182,212,0.12)',
                color: isActive ? layerColors[level] : 'rgba(6,182,212,0.4)',
                boxShadow: isActive ? `0 0 10px ${layerColors[level]}20` : 'none',
              }}>
              <svg width="12" height="4" viewBox="0 0 12 4">
                <line x1="0" y1="2" x2="12" y2="2" stroke={layerColors[level]} strokeWidth={isActive ? 2 : 1.5} strokeDasharray={dashPatterns[level]} opacity={isActive ? 1 : 0.5} />
              </svg>
              {lang === 'ms' ? layerLabels[level].ms : layerLabels[level].en}
            </button>
          );
        })}
      </div>

      {/* ── Coordinate Readout ── */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <div className="text-[7px] font-mono tracking-wider" style={{ color: 'rgba(6, 182, 212, 0.3)' }}>
          LAT 0.85°-7.36°N LON 99.64°-119.27°E | CRS: OGC:CRS84
        </div>
        <div className="text-[6px] font-mono tracking-wider" style={{ color: 'rgba(6, 182, 212, 0.2)' }}>
          SOURCE: DOSM GEODATA | ENGINE: MAPLIBRE GL
        </div>
      </div>

      {/* ── Layer Indicator ── */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
        <div className="text-[7px] font-mono tracking-wider" style={{ color: 'rgba(6, 182, 212, 0.3)' }}>
          LAYER: {activeLayer.toUpperCase()} | {zoomLevel.toUpperCase()}{focusedState && stateMap[focusedState] ? ` → ${stateMap[focusedState].name.toUpperCase()}` : ''} | {currentZoom.toFixed(1)}x
        </div>
      </div>

      {/* ── Boundary Legend ── */}
      <div className="absolute bottom-8 right-3 z-20 pointer-events-none">
        <div className="px-2 py-1.5 rounded" style={{ background: 'rgba(10,14,26,0.85)', border: '1px solid rgba(6,182,212,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: 'rgba(251, 191, 36, 0.8)', boxShadow: '0 0 3px rgba(251,191,36,0.4)' }} />
              <span className="text-[6px] font-mono" style={{ color: 'rgba(251, 191, 36, 0.7)' }}>{lang === 'ms' ? 'NEGERI' : 'STATE'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: 'rgba(245, 158, 11, 0.5)' }} />
              <span className="text-[6px] font-mono" style={{ color: 'rgba(245, 158, 11, 0.7)' }}>{lang === 'ms' ? 'DAERAH' : 'DIST'}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: 'rgba(167, 139, 250, 0.5)' }} />
              <span className="text-[6px] font-mono" style={{ color: 'rgba(167, 139, 250, 0.7)' }}>PARL</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5" style={{ background: 'rgba(16, 185, 129, 0.5)' }} />
              <span className="text-[6px] font-mono" style={{ color: 'rgba(16, 185, 129, 0.7)' }}>DUN</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Reset Zoom Button (shown when zoomed) ── */}
      {currentZoom > 5 && (
        <button onClick={resetZoom}
          className="absolute top-3 right-16 z-20 flex items-center gap-1 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-colors"
          style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          {lang === 'ms' ? 'SET SEMULA' : 'RESET'}
        </button>
      )}

      {/* ── Tooltip ── */}
      <div ref={tooltipRef} className="absolute z-30 pointer-events-none" style={{ display: 'none' }}>
        {tooltipData && (
          <div className="px-3 py-2.5 rounded-md backdrop-blur-md border" style={{ background: 'rgba(10, 14, 26, 0.92)', borderColor: 'rgba(6, 182, 212, 0.35)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#06b6d4', boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: '#06b6d4' }}>{tooltipData.name}</span>
              <span className="text-[10px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.4)' }}>{tooltipData.abbr}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: '#e0f7fa' }}>{formatValue(tooltipData.value, activeLayer)}</span>
              <span className="text-[9px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.5)' }}>{getLayerUnit(activeLayer)}</span>
            </div>
            <div className="mt-1.5 w-full h-0.5 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(5, ((tooltipData.value - minVal) / (maxVal - minVal)) * 100)}%`, background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.8))' }} />
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider" style={{
                background: tooltipData.region === 'east_malaysia' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                color: tooltipData.region === 'east_malaysia' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(6, 182, 212, 0.5)',
                border: `1px solid ${tooltipData.region === 'east_malaysia' ? 'rgba(245,158,11,0.2)' : 'rgba(6,182,212,0.15)'}`,
              }}>
                {tooltipData.region === 'east_malaysia' ? (lang === 'ms' ? 'MALAYSIA TIMUR' : 'EAST MALAYSIA') : (lang === 'ms' ? 'SEMARANJUNG' : 'PENINSULAR')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
