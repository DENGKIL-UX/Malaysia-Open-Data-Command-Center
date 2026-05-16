'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATES } from '@/lib/data/malaysia-data';

// ─── Types ───────────────────────────────────────────────────────────
interface MalaysiaMapProps {
  activeLayer: 'population' | 'gdp' | 'births' | 'deaths' | 'unemployment' | 'datasets';
  selectedState: string | null;
  onSelectState: (stateId: string) => void;
  onHoverState: (stateId: string | null) => void;
  lang?: 'en' | 'ms';
}

interface PreProcessedFeature {
  id: string;
  name: string;
  paths: string[];
  centroid: { x: number; y: number };
}

interface PreProcessedDistrict {
  id: string;
  stateId: string;
  stateName: string;
  districtName: string;
  paths: string[];
  centroid: { x: number; y: number };
}

interface PreProcessedParlimen {
  id: string;
  stateId: string;
  stateName: string;
  parlimenName: string;
  paths: string[];
  centroid: { x: number; y: number };
}

interface PreProcessedDun {
  id: string;
  stateId: string;
  stateName: string;
  dunName: string;
  paths: string[];
  centroid: { x: number; y: number };
}

// ─── Zoom Level Type ────────────────────────────────────────────────
type ZoomLevel = 'states' | 'districts' | 'parlimen' | 'dun';

// ─── Choropleth Color Interpolation ─────────────────────────────────
function getChoroplethColor(
  value: number,
  min: number,
  max: number,
  isHovered: boolean,
  isSelected: boolean
): string {
  if (min === max) return 'rgba(6, 182, 212, 0.35)';
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const r = Math.round(10 + t * (6 - 10));
  const g = Math.round(22 + t * (182 - 22));
  const b = Math.round(40 + t * (212 - 40));
  const baseAlpha = 0.4 + t * 0.5;
  if (isSelected) return `rgba(6, 182, 212, ${Math.min(1, baseAlpha + 0.3)})`;
  if (isHovered) return `rgba(6, 182, 212, ${Math.min(1, baseAlpha + 0.2)})`;
  return `rgba(${r}, ${g}, ${b}, ${baseAlpha})`;
}

// ─── Format Value ────────────────────────────────────────────────────
function formatValue(value: number, layer: string): string {
  switch (layer) {
    case 'population': return `${value.toLocaleString()}k`;
    case 'gdp': return `RM ${(value / 1000).toFixed(1)}B`;
    case 'births':
    case 'deaths': return `${value}k`;
    case 'unemployment': return `${value}%`;
    case 'datasets': return `${value}`;
    default: return value.toLocaleString();
  }
}

function getLayerUnit(layer: string): string {
  switch (layer) {
    case 'population': return "'000";
    case 'gdp': return 'RM M';
    case 'births': return "'000";
    case 'deaths': return "'000";
    case 'unemployment': return '%';
    case 'datasets': return '';
    default: return '';
  }
}

// ViewBox dimensions
const VB_WIDTH = 900;
const VB_HEIGHT = 500;

// ─── Component ───────────────────────────────────────────────────────
export default function MalaysiaGeoJSONMap({
  activeLayer,
  selectedState,
  onSelectState,
  onHoverState,
  lang = 'en',
}: MalaysiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  // ── PERF FIX: Use ref for mouse position to avoid re-renders on every mouse move ──
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [stateFeatures, setStateFeatures] = useState<PreProcessedFeature[]>([]);
  const [districtFeatures, setDistrictFeatures] = useState<PreProcessedDistrict[]>([]);
  const [parlimenFeatures, setParlimenFeatures] = useState<PreProcessedParlimen[]>([]);
  const [dunFeatures, setDunFeatures] = useState<PreProcessedDun[]>([]);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('states');
  const [focusedState, setFocusedState] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const transformRef = useRef(transform);
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);

  // Keep transformRef in sync
  useEffect(() => { transformRef.current = transform; }, [transform]);

  // ─── Load pre-processed GeoJSON data ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const stateRes = await fetch('/geodata/states-preprocessed.json');
        if (!stateRes.ok) throw new Error('Failed to load states');
        const stateData: PreProcessedFeature[] = await stateRes.json();
        if (cancelled) return;
        setStateFeatures(stateData);
        setLoading(false);

        fetch('/geodata/districts-preprocessed.json')
          .then(res => res.json())
          .then((data: PreProcessedDistrict[]) => {
            if (!cancelled) setDistrictFeatures(data);
          })
          .catch(e => console.warn('Failed to load district data:', e));

        fetch('/geodata/parlimen-preprocessed.json')
          .then(res => res.json())
          .then((data: PreProcessedParlimen[]) => {
            if (!cancelled) setParlimenFeatures(data);
          })
          .catch(e => console.warn('Failed to load parlimen data:', e));

        fetch('/geodata/dun-preprocessed.json')
          .then(res => res.json())
          .then((data: PreProcessedDun[]) => {
            if (!cancelled) setDunFeatures(data);
          })
          .catch(e => console.warn('Failed to load DUN data:', e));
      } catch (err) {
        console.error('Failed to load geodata:', err);
        setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  // ─── Compute min/max for the active layer ─────────────────────────
  const { minVal, maxVal } = useMemo(() => {
    const values = STATES.map(s => s[activeLayer as keyof typeof s] as number);
    return { minVal: Math.min(...values), maxVal: Math.max(...values) };
  }, [activeLayer]);

  // Lookup map
  const stateMap = useMemo(() => {
    const m: Record<string, typeof STATES[0]> = {};
    STATES.forEach(s => (m[s.id] = s));
    return m;
  }, []);

  // ─── Event handlers ───────────────────────────────────────────────
  const handleMouseEnter = useCallback((stateId: string) => {
    setHoveredState(stateId);
    onHoverState(stateId);
  }, [onHoverState]);

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    onHoverState(null);
  }, [onHoverState]);

  // ── PERF FIX: Use ref + direct DOM for tooltip positioning (no re-render) ──
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    // Directly update tooltip DOM position (no React re-render)
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${Math.min(x + 16, 380)}px`;
      tooltipRef.current.style.top = `${Math.min(y - 10, 280)}px`;
    }

    // Handle panning via ref (no state read needed)
    if (isPanningRef.current) {
      const ps = panStartRef.current;
      setTransform(prev => ({
        ...prev,
        x: (e.clientX - ps.x) / 50,
        y: (e.clientY - ps.y) / 50,
      }));
    }
  }, []);

  // ─── Zoom/Pan handlers ────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const current = transformRef.current;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(8, current.scale * delta));
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = (mouseX / rect.width) * VB_WIDTH;
    const svgY = (mouseY / rect.height) * VB_HEIGHT;
    const scaleChange = newScale / current.scale;
    setTransform({
      x: svgX - scaleChange * (svgX - current.x),
      y: svgY - scaleChange * (svgY - current.y),
      scale: newScale,
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      isPanningRef.current = true;
      const current = transformRef.current;
      panStartRef.current = { x: e.clientX - current.x * 50, y: e.clientY - current.y * 50 };
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  // ─── Zoom to state ────────────────────────────────────────────────
  const handleStateClick = useCallback((stateId: string) => {
    if (zoomLevel === 'states') {
      onSelectState(stateId);
      setFocusedState(stateId);
      setZoomLevel('districts');
      const feature = stateFeatures.find(f => f.id === stateId);
      if (feature) {
        setTransform({
          x: VB_WIDTH / 2 - feature.centroid.x * 2.5,
          y: VB_HEIGHT / 2 - feature.centroid.y * 2.5,
          scale: 2.5,
        });
      }
    } else {
      onSelectState(stateId);
      if (!focusedState) {
        setFocusedState(stateId);
        const feature = stateFeatures.find(f => f.id === stateId);
        if (feature) {
          setTransform({
            x: VB_WIDTH / 2 - feature.centroid.x * 2.5,
            y: VB_HEIGHT / 2 - feature.centroid.y * 2.5,
            scale: 2.5,
          });
        }
      }
    }
  }, [zoomLevel, onSelectState, stateFeatures, focusedState]);

  // ─── Reset zoom ───────────────────────────────────────────────────
  const resetZoom = useCallback(() => {
    setZoomLevel('states');
    setFocusedState(null);
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      x: prev.x - VB_WIDTH * 0.1,
      y: prev.y - VB_HEIGHT * 0.1,
      scale: Math.min(8, prev.scale * 1.3),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      x: prev.x + VB_WIDTH * 0.08,
      y: prev.y + VB_HEIGHT * 0.08,
      scale: Math.max(0.5, prev.scale / 1.3),
    }));
  }, []);

  const hoveredData = hoveredState ? stateMap[hoveredState] : null;
  const selectedData = selectedState ? stateMap[selectedState] : null;

  // ─── Get filtered features based on zoom level ────────────────────
  const visibleDistricts = useMemo(() => {
    if (zoomLevel === 'states') return [];
    if (focusedState) return districtFeatures.filter(d => d.stateId === focusedState);
    return districtFeatures;
  }, [zoomLevel, focusedState, districtFeatures]);

  const visibleParlimen = useMemo(() => {
    if (zoomLevel !== 'parlimen') return [];
    if (focusedState) return parlimenFeatures.filter(p => p.stateId === focusedState);
    return parlimenFeatures;
  }, [zoomLevel, focusedState, parlimenFeatures]);

  const visibleDun = useMemo(() => {
    if (zoomLevel !== 'dun') return [];
    if (focusedState) return dunFeatures.filter(d => d.stateId === focusedState);
    return dunFeatures;
  }, [zoomLevel, focusedState, dunFeatures]);

  // ── Stable cursor style (no re-render needed) ──
  const [cursorStyle, setCursorStyle] = useState('grab');

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg" style={{ background: '#0a0e1a' }}>
      {/* Scan Line Overlay */}
      <div className="scan-line-overlay pointer-events-none absolute inset-0 z-10" />

      {/* Grid Pattern Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <defs>
          <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-grid)" />
      </svg>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ background: 'rgba(10,14,26,0.9)' }}>
          <div className="text-center">
            <motion.div
              className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="text-xs font-mono tracking-widest" style={{ color: '#06b6d4' }}>
              {lang === 'ms' ? 'MEMUAT DATA GEOSPATIAL...' : 'LOADING GEOSPATIAL DATA...'}
            </div>
          </div>
        </div>
      )}

      {/* Main SVG Map */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="relative z-5 w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseLeave(); isPanningRef.current = false; setCursorStyle('grab'); }}
        onWheel={handleWheel}
        role="img"
        aria-label="Interactive map of Malaysia with real geographic boundaries from DOSM geodata"
        style={{ cursor: cursorStyle, willChange: 'transform' }}
      >
        <defs>
          {/* ── PERF FIX: Single unified glow filter for state fills — no switching on hover ── */}
          <filter id="geo-glow-state" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Border glow filters — used on stroke-only overlays, not interactive fill paths */}
          <filter id="geo-border-glow-gold" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#fbbf24" floodOpacity="0.15" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-border-glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feFlood floodColor="#f59e0b" floodOpacity="0.12" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-border-glow-violet" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#a78bfa" floodOpacity="0.12" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-border-glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="#10b981" floodOpacity="0.12" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="geo-ambient-light" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.03)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </radialGradient>
          <linearGradient id="geo-legend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(10, 22, 40, 0.9)" />
            <stop offset="50%" stopColor="rgba(6, 100, 140, 0.7)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.9)" />
          </linearGradient>
        </defs>

        {/* Ambient background glow */}
        <rect width={VB_WIDTH} height={VB_HEIGHT} fill="url(#geo-ambient-light)" />

        {/* Apply zoom/pan transform */}
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* South China Sea Label */}
          <text x={530} y={240} fill="rgba(6, 182, 212, 0.12)" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="4">SOUTH CHINA SEA</text>
          <line x1={440} y1={270} x2={490} y2={310} stroke="rgba(6, 182, 212, 0.1)" strokeWidth="1" strokeDasharray="6 4" />
          <line x1={440} y1={290} x2={490} y2={330} stroke="rgba(6, 182, 212, 0.06)" strokeWidth="0.5" strokeDasharray="3 6" />

          {/* ═══════════════════════════════════════════════════════════
              ARCHITECTURE: Layer separation for stable rendering
              
              Layer 1 (bottom): State FILLS — interactive, receives events
              Layer 2 (middle): Border STROKES — non-interactive overlays
              Layer 3 (top):    Decorations (labels, indicators) — non-interactive
              
              This separation prevents SVG filter/style changes on hover
              from causing layout thrashing on the fill layer.
          ═══════════════════════════════════════════════════════════ */}

          {/* ── LAYER 1: State Fill Paths (interactive) ── */}
          {/* These paths ONLY change fill opacity on hover — no filter changes, no transition-all */}
          {stateFeatures.map(feature => {
            const stateData = stateMap[feature.id];
            if (!stateData) return null;
            const value = stateData[activeLayer as keyof typeof stateData] as number;
            const isHovered = hoveredState === feature.id;
            const isSelected = selectedState === feature.id;
            const fillColor = getChoroplethColor(value, minVal, maxVal, isHovered, isSelected);

            return (
              <g key={feature.id}>
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-fill-${idx}`}
                    d={pathD}
                    fill={fillColor}
                    stroke="none"
                    filter="url(#geo-glow-state)"
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    onMouseEnter={() => { handleMouseEnter(feature.id); setCursorStyle('pointer'); }}
                    onMouseLeave={() => { handleMouseLeave(); setCursorStyle('grab'); }}
                    onClick={() => handleStateClick(feature.id)}
                    role="button"
                    aria-label={`${stateData.name} - ${formatValue(value, activeLayer)}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStateClick(feature.id); } }}
                    style={{
                      /* ── PERF: Only transition fill opacity — NOT filter/stroke which cause layout thrash ── */
                      transition: 'fill 0.15s ease-out',
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* ── LAYER 2: State Border Strokes (non-interactive overlay) ── */}
          {/* Double-stroke technique: dark under-stroke + bright over-stroke */}
          {/* These NEVER receive pointer events, so they never trigger re-renders */}
          {stateFeatures.map(feature => {
            const isHovered = hoveredState === feature.id;
            const isSelected = selectedState === feature.id;

            const underStroke = isSelected ? 'rgba(0,0,0,0.8)' : isHovered ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.5)';
            const underWidth = (isSelected ? 4 : isHovered ? 3.5 : 2.5) / transform.scale;
            const overStroke = isSelected ? '#fbbf24' : isHovered ? '#fcd34d' : 'rgba(251, 191, 36, 0.8)';
            const overWidth = (isSelected ? 2.5 : isHovered ? 2 : 1.2) / transform.scale;

            return (
              <g key={`${feature.id}-borders`} style={{ pointerEvents: 'none' }}>
                {/* Under-stroke: dark outline for contrast */}
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-u-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={underStroke}
                    strokeWidth={underWidth}
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
                {/* Over-stroke: bright state border with glow */}
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-o-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={overStroke}
                    strokeWidth={overWidth}
                    filter="url(#geo-border-glow-gold)"
                    strokeLinejoin="round"
                    style={{
                      pointerEvents: 'none',
                      transition: 'stroke 0.15s ease-out, stroke-width 0.15s ease-out',
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* ── LAYER 2b: District Border Strokes (when zoomed) ── */}
          {visibleDistricts.map(feature => {
            const isHoveredDist = hoveredState === feature.stateId;
            const isSelectedDist = selectedState === feature.stateId;
            return (
              <g key={feature.id} style={{ pointerEvents: 'none' }}>
                {/* District under-stroke for contrast */}
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-du-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth={2 / transform.scale}
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />
                ))}
                {/* District over-stroke */}
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-d-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={isHoveredDist ? 'rgba(245, 158, 11, 0.9)' : 'rgba(245, 158, 11, 0.55)'}
                    strokeWidth={1 / transform.scale}
                    strokeLinejoin="round"
                    filter="url(#geo-border-glow-amber)"
                    style={{
                      pointerEvents: 'none',
                      transition: 'stroke 0.15s ease-out',
                    }}
                  />
                ))}
              </g>
            );
          })}

          {/* ── LAYER 2c: Parlimen Border Strokes (when zoomed) ── */}
          {visibleParlimen.map(feature => (
            <g key={feature.id} style={{ pointerEvents: 'none' }}>
              {/* Parlimen under-stroke for contrast */}
              {feature.paths.map((pathD, idx) => (
                <path
                  key={`${feature.id}-pru-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1.6 / transform.scale}
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
              {/* Parlimen over-stroke */}
              {feature.paths.map((pathD, idx) => (
                <path
                  key={`${feature.id}-pr-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke="rgba(167, 139, 250, 0.6)"
                  strokeWidth={0.9 / transform.scale}
                  strokeDasharray={`${5 / transform.scale} ${3 / transform.scale}`}
                  strokeLinejoin="round"
                  filter="url(#geo-border-glow-violet)"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
            </g>
          ))}

          {/* ── LAYER 2d: DUN Border Strokes (when zoomed) ── */}
          {visibleDun.map(feature => (
            <g key={feature.id} style={{ pointerEvents: 'none' }}>
              {/* DUN under-stroke for contrast */}
              {feature.paths.map((pathD, idx) => (
                <path
                  key={`${feature.id}-dunu-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={1.4 / transform.scale}
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
              {/* DUN over-stroke: emerald dot-dash pattern */}
              {feature.paths.map((pathD, idx) => (
                <path
                  key={`${feature.id}-dun-${idx}`}
                  d={pathD}
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.55)"
                  strokeWidth={0.8 / transform.scale}
                  strokeDasharray={`${2 / transform.scale} ${2 / transform.scale} ${6 / transform.scale} ${2 / transform.scale}`}
                  strokeLinejoin="round"
                  filter="url(#geo-border-glow-emerald)"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
              {/* DUN name labels at high zoom */}
              {transform.scale >= 3 && (
                <text x={feature.centroid.x} y={feature.centroid.y} fill="rgba(16, 185, 129, 0.6)" fontSize={Math.max(3.5, 6 / transform.scale)} fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {feature.dunName}
                </text>
              )}
            </g>
          ))}

          {/* ── LAYER 3: Decorations (labels, indicators) ── */}
          {stateFeatures.map(feature => {
            const stateData = stateMap[feature.id];
            if (!stateData) return null;
            const isHovered = hoveredState === feature.id;
            const isSelected = selectedState === feature.id;
            const showLabel = !isHovered && !isSelected && transform.scale < 3;

            return (
              <g key={`${feature.id}-decor`} style={{ pointerEvents: 'none' }}>
                {/* Pulse ring on hover */}
                {isHovered && (
                  <>
                    <circle cx={feature.centroid.x} cy={feature.centroid.y} r={6 / transform.scale} fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth={1 / transform.scale}>
                      <animate attributeName="r" from={`${4 / transform.scale}`} to={`${18 / transform.scale}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={feature.centroid.x} cy={feature.centroid.y} r={2.5 / transform.scale} fill="#06b6d4" opacity="0.9">
                      <animate attributeName="r" values={`${2 / transform.scale};${3.5 / transform.scale};${2 / transform.scale}`} dur="1s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* Selected state indicator */}
                {isSelected && !isHovered && (
                  <circle cx={feature.centroid.x} cy={feature.centroid.y} r={3.5 / transform.scale} fill="#06b6d4" opacity="0.8">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* State abbreviation labels */}
                {showLabel && (
                  <text x={feature.centroid.x} y={feature.centroid.y} fill="rgba(6, 182, 212, 0.5)" fontSize={Math.max(6, 9 / transform.scale)} fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {stateData.abbr}
                  </text>
                )}

                {/* Pulsing data node */}
                {!isHovered && !isSelected && (
                  <circle cx={feature.centroid.x} cy={feature.centroid.y} r={1.5 / transform.scale} fill="#06b6d4" opacity="0.3">
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" begin={`${stateFeatures.indexOf(feature) * 0.15}s`} repeatCount="indefinite" />
                  </circle>
                )}

                {/* District name labels at zoom */}
                {zoomLevel !== 'states' && transform.scale >= 2.5 && visibleDistricts.filter(d => d.stateId === feature.id).map(d => (
                  <text key={`dl-${d.id}`} x={d.centroid.x} y={d.centroid.y} fill="rgba(245, 158, 11, 0.65)" fontSize={Math.max(4, 7 / transform.scale)} fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {d.districtName}
                  </text>
                ))}
              </g>
            );
          })}
        </g>

        {/* ── Decorative Corner Markers ── */}
        <g opacity="0.2" stroke="#06b6d4" strokeWidth="1" fill="none">
          <path d="M 20,30 L 20,15 L 35,15" />
          <path d={`M ${VB_WIDTH - 20},30 L ${VB_WIDTH - 20},15 L ${VB_WIDTH - 35},15`} />
          <path d={`M 20,${VB_HEIGHT - 30} L 20,${VB_HEIGHT - 15} L 35,${VB_HEIGHT - 15}`} />
          <path d={`M ${VB_WIDTH - 20},${VB_HEIGHT - 30} L ${VB_WIDTH - 20},${VB_HEIGHT - 15} L ${VB_WIDTH - 35},${VB_HEIGHT - 15}`} />
        </g>

        {/* Coordinate Readout */}
        <text x="28" y="42" fill="rgba(6, 182, 212, 0.25)" fontSize="7" fontFamily="monospace">LAT 0.85°-7.36°N LON 99.64°-119.27°E | CRS: OGC:CRS84</text>
        <text x="28" y="54" fill="rgba(6, 182, 212, 0.15)" fontSize="5.5" fontFamily="monospace">SOURCE: DOSM GEODATA (github.com/dosm-malaysia/data-open)</text>

        {/* Layer Indicator */}
        <text x="28" y={VB_HEIGHT - 12} fill="rgba(6, 182, 212, 0.3)" fontSize="8" fontFamily="monospace" letterSpacing="2">
          LAYER: {activeLayer.toUpperCase()} | {zoomLevel.toUpperCase()}{focusedState && stateMap[focusedState] ? ` → ${stateMap[focusedState].name.toUpperCase()}` : ''}
        </text>

        {/* Legend Bar */}
        <g transform={`translate(${VB_WIDTH / 2 - 140}, ${VB_HEIGHT - 20})`}>
          <rect x="0" y="0" width="280" height="6" rx="3" fill="rgba(10, 22, 40, 0.8)" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.5" />
          <rect x="0" y="0" width="280" height="6" rx="3" fill="url(#geo-legend-gradient)" />
          <text x="0" y="18" fill="rgba(6, 182, 212, 0.4)" fontSize="6" fontFamily="monospace">{formatValue(minVal, activeLayer)}</text>
          <text x="280" y="18" fill="rgba(6, 182, 212, 0.4)" fontSize="6" fontFamily="monospace" textAnchor="end">{formatValue(maxVal, activeLayer)}</text>
        </g>

        {/* Live Status */}
        <g transform={`translate(${VB_WIDTH - 80}, 28)`}>
          <circle cx="0" cy="0" r="2.5" fill="#06b6d4" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" /></circle>
          <text x="8" y="3" fill="rgba(6, 182, 212, 0.3)" fontSize="7" fontFamily="monospace">LIVE</text>
        </g>

        {/* Zoom Level */}
        <text x={VB_WIDTH - 28} y={VB_HEIGHT - 12} fill="rgba(6, 182, 212, 0.25)" fontSize="6" fontFamily="monospace" textAnchor="end">{transform.scale.toFixed(1)}x</text>

        {/* ── Boundary Legend ── */}
        <g transform={`translate(${VB_WIDTH - 200}, ${VB_HEIGHT - 48})`}>
          <rect x="-4" y="-6" width="205" height="44" rx="3" fill="rgba(10,14,26,0.85)" stroke="rgba(6,182,212,0.12)" strokeWidth="0.5" />
          {/* State border */}
          <line x1="0" y1="0" x2="16" y2="0" stroke="rgba(0,0,0,0.5)" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="0" x2="16" y2="0" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="1.5" strokeLinecap="round" />
          <text x="20" y="3" fill="rgba(251, 191, 36, 0.7)" fontSize="5.5" fontFamily="monospace">{lang === 'ms' ? 'NEGERI' : 'STATE'}</text>
          {/* District border */}
          <line x1="62" y1="0" x2="78" y2="0" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="62" y1="0" x2="78" y2="0" stroke="rgba(245, 158, 11, 0.55)" strokeWidth="1" strokeLinecap="round" />
          <text x="82" y="3" fill="rgba(245, 158, 11, 0.7)" fontSize="5.5" fontFamily="monospace">{lang === 'ms' ? 'DAERAH' : 'DIST'}</text>
          {/* Parlimen border */}
          <line x1="0" y1="14" x2="16" y2="14" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round" />
          <line x1="0" y1="14" x2="16" y2="14" stroke="rgba(167, 139, 250, 0.6)" strokeWidth="0.9" strokeDasharray="4 2.5" strokeLinecap="round" />
          <text x="20" y="17" fill="rgba(167, 139, 250, 0.7)" fontSize="5.5" fontFamily="monospace">{lang === 'ms' ? 'PARLIMEN' : 'PARLIMEN'}</text>
          {/* DUN border */}
          <line x1="62" y1="14" x2="78" y2="14" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="14" x2="78" y2="14" stroke="rgba(16, 185, 129, 0.55)" strokeWidth="0.8" strokeDasharray="2 2 5 2" strokeLinecap="round" />
          <text x="82" y="17" fill="rgba(16, 185, 129, 0.7)" fontSize="5.5" fontFamily="monospace">{lang === 'ms' ? 'DUN' : 'DUN'}</text>
          {/* Source hint */}
          <text x="0" y="30" fill="rgba(6, 182, 212, 0.3)" fontSize="5" fontFamily="monospace">SRC: DOSM GEODATA</text>
        </g>
      </svg>

      {/* ── Zoom Controls ── */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button onClick={zoomIn} className="w-7 h-7 rounded border flex items-center justify-center text-xs font-mono transition-colors hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Zoom in">+</button>
        <button onClick={zoomOut} className="w-7 h-7 rounded border flex items-center justify-center text-xs font-mono transition-colors hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Zoom out">−</button>
        {transform.scale !== 1 && (
          <button onClick={resetZoom} className="w-7 h-7 rounded border flex items-center justify-center transition-colors hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Reset zoom">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        )}
      </div>

      {/* ── Boundary Layer Switcher ── */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {(['states', 'districts', 'parlimen', 'dun'] as ZoomLevel[]).map(level => {
          const colors: Record<string, string> = { states: '#fbbf24', districts: '#f59e0b', parlimen: '#a78bfa', dun: '#10b981' };
          const labels: Record<string, { en: string; ms: string }> = {
            states: { en: 'STATE', ms: 'NEGERI' },
            districts: { en: 'DISTRICT', ms: 'DAERAH' },
            parlimen: { en: 'PARLIMEN', ms: 'PARLIMEN' },
            dun: { en: 'DUN', ms: 'DUN' },
          };
          const dashPatterns: Record<string, string | undefined> = {
            states: undefined,
            districts: undefined,
            parlimen: '3 2',
            dun: '2 2 5 2',
          };
          const isActive = zoomLevel === level;
          const dunCount = level === 'dun' && focusedState ? dunFeatures.filter(d => d.stateId === focusedState).length : 0;
          return (
            <button
              key={level}
              onClick={() => {
                setZoomLevel(level);
                if (level === 'states') { setFocusedState(null); setTransform({ x: 0, y: 0, scale: 1 }); }
                else if (focusedState) {
                  // Keep the current zoomed-in state view
                } else if (level !== 'states') {
                  // Need to select a state first for sub-state layers
                }
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-colors"
              style={{
                background: isActive ? `${colors[level]}15` : 'rgba(10,14,26,0.85)',
                borderColor: isActive ? `${colors[level]}40` : 'rgba(6,182,212,0.12)',
                color: isActive ? colors[level] : 'rgba(6,182,212,0.4)',
                boxShadow: isActive ? `0 0 10px ${colors[level]}20` : 'none',
              }}
            >
              {/* Line preview matching the actual boundary style */}
              <svg width="12" height="4" viewBox="0 0 12 4">
                <line x1="0" y1="2" x2="12" y2="2" stroke={colors[level]} strokeWidth={isActive ? 2 : 1.5} strokeDasharray={dashPatterns[level]} opacity={isActive ? 1 : 0.5} />
              </svg>
              {lang === 'ms' ? labels[level].ms : labels[level].en}
              {level === 'dun' && isActive && dunCount > 0 && (
                <span className="text-[7px]" style={{ color: `${colors[level]}80` }}>{dunCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tooltip ── */}
      {/* ── PERF FIX: Tooltip uses ref-based positioning (no mousePos state) ── */}
      {hoveredData && (
        <div
          ref={tooltipRef}
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${Math.min(mousePosRef.current.x + 16, 380)}px`,
            top: `${Math.min(mousePosRef.current.y - 10, 280)}px`,
          }}
        >
          <div className="px-3 py-2.5 rounded-md backdrop-blur-md border" style={{ background: 'rgba(10, 14, 26, 0.92)', borderColor: 'rgba(6, 182, 212, 0.35)', boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#06b6d4', boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: '#06b6d4' }}>{hoveredData.name}</span>
              <span className="text-[10px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.4)' }}>{hoveredData.abbr}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: '#e0f7fa' }}>{formatValue(hoveredData[activeLayer as keyof typeof hoveredData] as number, activeLayer)}</span>
              <span className="text-[9px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.5)' }}>{getLayerUnit(activeLayer)}</span>
            </div>
            <div className="mt-1.5 w-full h-0.5 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(5, ((hoveredData[activeLayer as keyof typeof hoveredData] as number - minVal) / (maxVal - minVal)) * 100)}%`, background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.8))' }} />
            </div>
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider" style={{ background: hoveredData.region === 'east_malaysia' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(6, 182, 212, 0.08)', color: hoveredData.region === 'east_malaysia' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(6, 182, 212, 0.5)', border: `1px solid ${hoveredData.region === 'east_malaysia' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.12)'}` }}>
                {hoveredData.region === 'east_malaysia' ? 'East MY' : 'Peninsular'}
              </span>
              {zoomLevel !== 'states' && (
                <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider" style={{ background: 'rgba(245, 158, 11, 0.08)', color: 'rgba(245, 158, 11, 0.5)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                  {districtFeatures.filter(d => d.stateId === hoveredState).length} {lang === 'ms' ? 'Daerah' : 'Districts'}
                </span>
              )}
              {zoomLevel === 'dun' && (
                <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider" style={{ background: 'rgba(16, 185, 129, 0.08)', color: 'rgba(16, 185, 129, 0.5)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  {dunFeatures.filter(d => d.stateId === hoveredState).length} DUN
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Selected State Info Panel ── */}
      {selectedData && (
        <div className="absolute bottom-3 right-3 z-15 px-3 py-2.5 rounded-md backdrop-blur-md border max-w-[200px]" style={{
          background: 'rgba(10, 14, 26, 0.92)',
          borderColor: selectedState === hoveredState ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.3)',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
        }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4', boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }} />
            <span className="text-[10px] font-semibold tracking-wider" style={{ color: '#06b6d4' }}>{selectedData.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {(['population', 'gdp', 'births', 'deaths', 'unemployment', 'datasets'] as const).map((layer) => {
              const val = selectedData[layer];
              const isActive = layer === activeLayer;
              return (
                <div key={layer} className="flex items-center gap-1">
                  <span className="text-[8px] font-mono uppercase" style={{ color: isActive ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.3)' }}>
                    {layer.slice(0, 3)}
                  </span>
                  <span className="text-[9px] font-mono font-bold" style={{ color: isActive ? '#e0f7fa' : 'rgba(224, 247, 250, 0.4)' }}>
                    {formatValue(val, layer)}
                  </span>
                </div>
              );
            })}
          </div>
          {zoomLevel !== 'states' && (
            <div className="mt-1.5 pt-1.5 border-t" style={{ borderColor: 'rgba(6, 182, 212, 0.1)' }}>
              <div className="text-[8px] font-mono tracking-wider" style={{ color: 'rgba(245, 158, 11, 0.5)' }}>
                {districtFeatures.filter(d => d.stateId === selectedState).length} {lang === 'ms' ? 'Daerah' : 'Districts'}
                {zoomLevel === 'dun' && ` • ${dunFeatures.filter(d => d.stateId === selectedState).length} DUN`}
              </div>
            </div>
          )}
          <div className="mt-1.5 flex gap-1.5">
            <button
              onClick={() => {
                setZoomLevel('states');
                setFocusedState(null);
                setTransform({ x: 0, y: 0, scale: 1 });
                onSelectState(selectedData.id);
              }}
              className="flex-1 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-colors hover:bg-cyan-950/30"
              style={{ borderColor: 'rgba(6, 182, 212, 0.2)', color: 'rgba(6, 182, 212, 0.5)' }}
            >
              {lang === 'ms' ? 'Reset' : 'RESET'}
            </button>
            <button
              onClick={() => {
                setFocusedState(null);
                onHoverState(null);
                setZoomLevel('states');
                setTransform({ x: 0, y: 0, scale: 1 });
              }}
              className="flex-1 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-colors hover:bg-cyan-950/30"
              style={{ borderColor: 'rgba(6, 182, 212, 0.2)', color: 'rgba(6, 182, 212, 0.5)' }}
            >
              {lang === 'ms' ? 'Tutup' : 'CLOSE'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
