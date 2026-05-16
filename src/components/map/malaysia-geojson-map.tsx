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

// ─── Zoom Level Type ────────────────────────────────────────────────
type ZoomLevel = 'states' | 'districts' | 'parlimen';

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
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [stateFeatures, setStateFeatures] = useState<PreProcessedFeature[]>([]);
  const [districtFeatures, setDistrictFeatures] = useState<PreProcessedDistrict[]>([]);
  const [parlimenFeatures, setParlimenFeatures] = useState<PreProcessedParlimen[]>([]);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('states');
  const [focusedState, setFocusedState] = useState<string | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);

  // ─── Load pre-processed GeoJSON data ──────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        // Load state boundaries (essential)
        const stateRes = await fetch('/geodata/states-preprocessed.json');
        if (!stateRes.ok) throw new Error('Failed to load states');
        const stateData: PreProcessedFeature[] = await stateRes.json();
        if (cancelled) return;
        setStateFeatures(stateData);
        setLoading(false);

        // Load district boundaries (secondary - lazy)
        fetch('/geodata/districts-preprocessed.json')
          .then(res => res.json())
          .then((data: PreProcessedDistrict[]) => {
            if (!cancelled) setDistrictFeatures(data);
          })
          .catch(e => console.warn('Failed to load district data:', e));

        // Load parlimen boundaries (tertiary - lazy)
        fetch('/geodata/parlimen-preprocessed.json')
          .then(res => res.json())
          .then((data: PreProcessedParlimen[]) => {
            if (!cancelled) setParlimenFeatures(data);
          })
          .catch(e => console.warn('Failed to load parlimen data:', e));
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

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  // ─── Zoom/Pan handlers ────────────────────────────────────────────
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(8, transform.scale * delta));
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const svgX = (mouseX / rect.width) * VB_WIDTH;
    const svgY = (mouseY / rect.height) * VB_HEIGHT;
    const scaleChange = newScale / transform.scale;
    setTransform({
      x: svgX - scaleChange * (svgX - transform.x),
      y: svgY - scaleChange * (svgY - transform.y),
      scale: newScale,
    });
  }, [transform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x * 50, y: e.clientY - transform.y * 50 });
    }
  }, [transform]);

  const handleMouseDrag = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: (e.clientX - panStart.x) / 50,
        y: (e.clientY - panStart.y) / 50,
      }));
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => { setIsPanning(false); }, []);

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
    }
  }, [zoomLevel, onSelectState, stateFeatures]);

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
        onMouseMove={(e) => { handleMouseMove(e); handleMouseDrag(e); }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseLeave(); setIsPanning(false); }}
        onWheel={handleWheel}
        role="img"
        aria-label="Interactive map of Malaysia with real geographic boundaries from DOSM geodata"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <defs>
          <filter id="geo-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.6" result="color1" />
            <feComposite in="color1" in2="blur1" operator="in" result="shadow1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
            <feMerge><feMergeNode in="shadow1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-glow-selected" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.8" result="color1" />
            <feComposite in="color1" in2="blur1" operator="in" result="shadow1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
            <feMerge><feMergeNode in="shadow1" /><feMergeNode in="blur2" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-state-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="geo-district-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#f59e0b" floodOpacity="0.3" result="color" />
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

          {/* ── State Paths ── */}
          {stateFeatures.map(feature => {
            const stateData = stateMap[feature.id];
            if (!stateData) return null;
            const value = stateData[activeLayer as keyof typeof stateData] as number;
            const isHovered = hoveredState === feature.id;
            const isSelected = selectedState === feature.id;
            const fillColor = getChoroplethColor(value, minVal, maxVal, isHovered, isSelected);
            const strokeColor = isSelected ? 'rgba(6, 182, 212, 0.9)' : isHovered ? 'rgba(6, 182, 212, 0.7)' : 'rgba(6, 182, 212, 0.25)';
            const strokeWidth = (isSelected ? 2 : isHovered ? 1.5 : 0.8) / transform.scale;
            const filterId = isSelected ? 'geo-glow-selected' : isHovered ? 'geo-glow-cyan' : 'geo-state-inner-glow';
            const showLabel = !isHovered && !isSelected && transform.scale < 3;

            return (
              <g key={feature.id}>
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-p-${idx}`}
                    d={pathD}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={`url(#${filterId})`}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => handleMouseEnter(feature.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleStateClick(feature.id)}
                    role="button"
                    aria-label={`${stateData.name} - ${formatValue(value, activeLayer)}`}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleStateClick(feature.id); } }}
                  />
                ))}

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
              </g>
            );
          })}

          {/* ── District Paths (when zoomed) ── */}
          {visibleDistricts.map(feature => {
            const isHoveredDist = hoveredState === feature.stateId;
            const isSelectedDist = selectedState === feature.stateId;
            return (
              <g key={feature.id}>
                {feature.paths.map((pathD, idx) => (
                  <path
                    key={`${feature.id}-d-${idx}`}
                    d={pathD}
                    fill="transparent"
                    stroke={isHoveredDist ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.2)'}
                    strokeWidth={0.8 / transform.scale}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-all duration-200"
                    filter={isHoveredDist ? 'url(#geo-district-glow)' : undefined}
                    onMouseEnter={() => handleMouseEnter(feature.stateId)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => onSelectState(feature.stateId)}
                  />
                ))}
                {transform.scale >= 2.5 && (
                  <text x={feature.centroid.x} y={feature.centroid.y} fill="rgba(245, 158, 11, 0.45)" fontSize={Math.max(4, 7 / transform.scale)} fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {feature.districtName}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Parlimen Paths (when zoomed) ── */}
          {visibleParlimen.map(feature => (
            <g key={feature.id}>
              {feature.paths.map((pathD, idx) => (
                <path
                  key={`${feature.id}-pr-${idx}`}
                  d={pathD}
                  fill="transparent"
                  stroke="rgba(139, 92, 246, 0.2)"
                  strokeWidth={0.6 / transform.scale}
                  strokeDasharray={`${3 / transform.scale} ${2 / transform.scale}`}
                  strokeLinejoin="round"
                  style={{ pointerEvents: 'none' }}
                />
              ))}
            </g>
          ))}
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
      </svg>

      {/* ── Zoom Controls ── */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        <button onClick={zoomIn} className="w-7 h-7 rounded border flex items-center justify-center text-xs font-mono transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Zoom in">+</button>
        <button onClick={zoomOut} className="w-7 h-7 rounded border flex items-center justify-center text-xs font-mono transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Zoom out">−</button>
        {transform.scale !== 1 && (
          <button onClick={resetZoom} className="w-7 h-7 rounded border flex items-center justify-center transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.25)', color: '#06b6d4' }} aria-label="Reset zoom">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        )}
      </div>

      {/* ── Boundary Layer Switcher ── */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {(['states', 'districts', 'parlimen'] as ZoomLevel[]).map(level => {
          const colors: Record<string, string> = { states: '#06b6d4', districts: '#f59e0b', parlimen: '#8b5cf6' };
          const labels: Record<string, { en: string; ms: string }> = { states: { en: 'STATE', ms: 'NEGERI' }, districts: { en: 'DISTRICT', ms: 'DAERAH' }, parlimen: { en: 'PARLIMEN', ms: 'PARLIMEN' } };
          const isActive = zoomLevel === level;
          return (
            <button
              key={level}
              onClick={() => {
                setZoomLevel(level);
                if (level === 'states') { setFocusedState(null); setTransform({ x: 0, y: 0, scale: 1 }); }
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded border text-[8px] font-mono tracking-wider transition-all"
              style={{
                background: isActive ? `${colors[level]}15` : 'rgba(10,14,26,0.85)',
                borderColor: isActive ? `${colors[level]}40` : 'rgba(6,182,212,0.12)',
                color: isActive ? colors[level] : 'rgba(6,182,212,0.4)',
                boxShadow: isActive ? `0 0 10px ${colors[level]}20` : 'none',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors[level], opacity: isActive ? 1 : 0.4 }} />
              {lang === 'ms' ? labels[level].ms : labels[level].en}
            </button>
          );
        })}
      </div>

      {/* ── Tooltip ── */}
      {hoveredData && (
        <div className="absolute z-20 pointer-events-none" style={{ left: `${Math.min(mousePos.x + 16, 380)}px`, top: `${Math.min(mousePos.y - 10, 280)}px` }}>
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
            </div>
          </div>
        </div>
      )}

      {/* ── Selected State Info Panel ── */}
      {selectedData && (
        <div className="absolute bottom-3 right-3 z-15 px-3 py-2.5 rounded-md backdrop-blur-md border max-w-[180px]" style={{ background: 'rgba(10, 14, 26, 0.88)', borderColor: 'rgba(6, 182, 212, 0.3)', boxShadow: '0 0 30px rgba(6, 182, 212, 0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: '#06b6d4', boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' }} />
            <span className="text-[10px] font-semibold tracking-wider" style={{ color: '#06b6d4' }}>{selectedData.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {(['population', 'gdp', 'births', 'deaths', 'unemployment', 'datasets'] as const).map(layer => {
              const val = selectedData[layer];
              const isActive = layer === activeLayer;
              return (
                <div key={layer} className="flex items-center gap-1">
                  <span className="text-[8px] font-mono uppercase" style={{ color: isActive ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.3)' }}>{layer.slice(0, 3)}</span>
                  <span className="text-[9px] font-mono font-bold" style={{ color: isActive ? '#e0f7fa' : 'rgba(224, 247, 250, 0.4)' }}>{formatValue(val, layer)}</span>
                </div>
              );
            })}
          </div>
          {zoomLevel !== 'states' && (
            <div className="mt-1.5 pt-1.5 border-t" style={{ borderColor: 'rgba(6,182,212,0.1)' }}>
              <div className="text-[8px] font-mono" style={{ color: 'rgba(245,158,11,0.6)' }}>
                {districtFeatures.filter(d => d.stateId === selectedState).length} {lang === 'ms' ? 'Daerah' : 'Districts'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Zoom Back Button ── */}
      <AnimatePresence>
        {focusedState && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={resetZoom}
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[9px] font-mono tracking-wider transition-all hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            style={{ background: 'rgba(10,14,26,0.85)', borderColor: 'rgba(6,182,212,0.3)', color: '#06b6d4' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            {lang === 'ms' ? 'KEMBALI KE PETA' : 'BACK TO MAP'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
