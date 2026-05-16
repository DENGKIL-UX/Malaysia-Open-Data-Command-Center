'use client';

import { useState, useCallback, useMemo } from 'react';
import { STATES } from '@/lib/data/malaysia-data';

// ─── Types ───────────────────────────────────────────────────────────
interface MalaysiaMapProps {
  activeLayer: 'population' | 'gdp' | 'births' | 'deaths' | 'unemployment' | 'datasets';
  selectedState: string | null;
  onSelectState: (stateId: string) => void;
  onHoverState: (stateId: string | null) => void;
}

// ─── SVG Path Data ───────────────────────────────────────────────────
// Simplified but recognizable shapes for each state
// ViewBox: 700x600
// Peninsular Malaysia on left, East Malaysia (Sabah/Sarawak) on right

const STATE_PATHS: Record<string, string> = {
  perlis:
    'M 112,72 L 138,70 L 148,80 L 146,98 L 140,108 L 125,112 L 108,108 L 102,95 L 104,80 Z',

  kedah:
    'M 102,108 L 125,112 L 140,108 L 146,98 L 158,105 L 170,120 L 178,140 L 175,165 L 168,188 L 155,205 L 138,218 L 118,222 L 98,215 L 80,200 L 70,180 L 68,158 L 72,138 L 82,120 Z',

  'pulau-pinang':
    'M 48,148 L 62,142 L 72,148 L 74,162 L 68,175 L 56,180 L 44,172 L 42,158 Z',

  perak:
    'M 68,215 L 98,215 L 118,222 L 138,218 L 155,205 L 168,215 L 182,238 L 188,268 L 185,300 L 178,332 L 168,358 L 152,378 L 132,390 L 112,388 L 92,375 L 78,352 L 66,322 L 60,292 L 58,258 L 62,232 Z',

  kelantan:
    'M 155,78 L 195,74 L 240,72 L 282,78 L 318,92 L 338,112 L 342,138 L 335,168 L 318,198 L 295,220 L 270,232 L 242,228 L 218,215 L 198,198 L 180,175 L 168,150 L 160,125 L 155,100 Z',

  terengganu:
    'M 270,232 L 295,220 L 318,198 L 335,168 L 348,178 L 362,205 L 370,240 L 372,278 L 365,312 L 352,340 L 332,358 L 308,362 L 285,355 L 268,338 L 258,312 L 255,282 L 258,255 Z',

  pahang:
    'M 168,215 L 198,198 L 218,215 L 242,228 L 258,255 L 255,282 L 258,312 L 268,338 L 285,355 L 308,362 L 332,358 L 352,370 L 358,398 L 348,425 L 328,445 L 300,455 L 270,452 L 242,438 L 218,418 L 198,392 L 185,365 L 178,332 L 185,300 L 188,268 L 182,238 Z',

  selangor:
    'M 112,288 L 132,282 L 152,288 L 168,300 L 178,318 L 180,338 L 175,358 L 168,372 L 152,385 L 132,390 L 112,385 L 98,370 L 90,350 L 88,328 L 92,308 Z',

  'wp-kuala-lumpur':
    'M 128,325 L 140,322 L 146,332 L 142,342 L 130,344 L 124,336 Z',

  'wp-putrajaya':
    'M 128,358 L 138,355 L 142,362 L 138,370 L 128,372 L 124,365 Z',

  'negeri-sembilan':
    'M 132,390 L 152,385 L 168,372 L 178,378 L 192,395 L 198,418 L 195,440 L 185,458 L 168,468 L 148,472 L 130,465 L 118,450 L 112,432 L 115,412 Z',

  melaka:
    'M 118,472 L 138,468 L 155,475 L 162,490 L 158,508 L 148,518 L 132,522 L 118,515 L 112,498 L 112,482 Z',

  johor:
    'M 148,472 L 168,468 L 185,458 L 198,440 L 215,445 L 238,455 L 262,462 L 282,470 L 298,485 L 302,508 L 295,528 L 278,542 L 255,550 L 228,552 L 202,548 L 178,538 L 160,522 L 148,508 L 142,490 Z',

  sarawak:
    'M 455,248 L 488,235 L 528,228 L 568,232 L 602,248 L 625,272 L 638,305 L 642,342 L 638,378 L 628,412 L 610,442 L 585,465 L 555,478 L 522,482 L 492,475 L 468,458 L 450,432 L 440,400 L 435,365 L 438,328 L 445,292 Z',

  sabah:
    'M 568,72 L 598,68 L 628,78 L 648,98 L 658,128 L 655,162 L 645,195 L 628,222 L 605,242 L 578,252 L 552,248 L 532,235 L 518,215 L 510,188 L 512,158 L 520,128 L 535,102 L 552,85 Z',

  'wp-labuan':
    'M 658,295 L 668,290 L 676,298 L 674,310 L 665,315 L 655,308 L 654,300 Z',
};

// ─── State Label Positions (offset for readability) ──────────────────
const STATE_LABELS: Record<string, { x: number; y: number; fontSize: number }> = {
  perlis: { x: 125, y: 92, fontSize: 7 },
  kedah: { x: 120, y: 168, fontSize: 8 },
  'pulau-pinang': { x: 58, y: 165, fontSize: 6.5 },
  perak: { x: 122, y: 305, fontSize: 9 },
  kelantan: { x: 250, y: 155, fontSize: 8 },
  terengganu: { x: 315, y: 275, fontSize: 7.5 },
  pahang: { x: 265, y: 365, fontSize: 10 },
  selangor: { x: 132, y: 340, fontSize: 7.5 },
  'wp-kuala-lumpur': { x: 135, y: 336, fontSize: 5 },
  'wp-putrajaya': { x: 133, y: 367, fontSize: 5 },
  'negeri-sembilan': { x: 152, y: 432, fontSize: 6.5 },
  melaka: { x: 137, y: 498, fontSize: 6.5 },
  johor: { x: 225, y: 502, fontSize: 9 },
  sarawak: { x: 540, y: 365, fontSize: 10 },
  sabah: { x: 585, y: 168, fontSize: 9 },
  'wp-labuan': { x: 665, y: 308, fontSize: 5.5 },
};

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

  // From deep dark (#0a1628) to bright cyan (#06b6d4)
  const r = Math.round(10 + t * (6 - 10));
  const g = Math.round(22 + t * (182 - 22));
  const b = Math.round(40 + t * (212 - 40));
  const baseAlpha = 0.4 + t * 0.5;

  if (isSelected) {
    return `rgba(6, 182, 212, ${Math.min(1, baseAlpha + 0.3)})`;
  }
  if (isHovered) {
    return `rgba(6, 182, 212, ${Math.min(1, baseAlpha + 0.2)})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${baseAlpha})`;
}

// ─── Format Value ────────────────────────────────────────────────────
function formatValue(value: number, layer: string): string {
  switch (layer) {
    case 'population':
      return `${value.toLocaleString()}k`;
    case 'gdp':
      return `RM ${(value / 1000).toFixed(1)}B`;
    case 'births':
    case 'deaths':
      return `${value}k`;
    case 'unemployment':
      return `${value}%`;
    case 'datasets':
      return `${value}`;
    default:
      return value.toLocaleString();
  }
}

// ─── Layer Unit ──────────────────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────────────
export default function MalaysiaMap({
  activeLayer,
  selectedState,
  onSelectState,
  onHoverState,
}: MalaysiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute min/max for the active layer
  const { minVal, maxVal } = useMemo(() => {
    const values = STATES.map((s) => s[activeLayer as keyof typeof s] as number);
    return {
      minVal: Math.min(...values),
      maxVal: Math.max(...values),
    };
  }, [activeLayer]);

  // Lookup map
  const stateMap = useMemo(() => {
    const m: Record<string, (typeof STATES)[0]> = {};
    STATES.forEach((s) => (m[s.id] = s));
    return m;
  }, []);

  const handleMouseEnter = useCallback(
    (stateId: string) => {
      setHoveredState(stateId);
      onHoverState(stateId);
    },
    [onHoverState]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    onHoverState(null);
  }, [onHoverState]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const hoveredData = hoveredState ? stateMap[hoveredState] : null;
  const selectedData = selectedState ? stateMap[selectedState] : null;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg" style={{ background: '#0a0e1a' }}>
      {/* Scan Line Overlay */}
      <div className="scan-line-overlay pointer-events-none absolute inset-0 z-10" />

      {/* Grid Pattern Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(6, 182, 212, 0.04)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Main SVG Map */}
      <svg
        viewBox="0 0 700 600"
        className="relative z-5 w-full h-full"
        onMouseMove={handleMouseMove}
        role="img"
        aria-label="Interactive map of Malaysia showing state-level data"
      >
        <defs>
          {/* Glow filter for hovered/selected states */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.6" result="color1" />
            <feComposite in="color1" in2="blur1" operator="in" result="shadow1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="shadow1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stronger glow for selected */}
          <filter id="glow-selected" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.8" result="color1" />
            <feComposite in="color1" in2="blur1" operator="in" result="shadow1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="shadow1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle inner glow for all states */}
          <filter id="state-inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pulse ring filter */}
          <filter id="pulse-ring" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#06b6d4" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="ring" />
            <feMerge>
              <feMergeNode in="ring" />
            </feMerge>
          </filter>

          {/* Radial gradient for ambient light */}
          <radialGradient id="ambient-light" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.03)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </radialGradient>

          {/* Gradient for border lines */}
          <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.15)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
          </linearGradient>
        </defs>

        {/* Ambient background glow */}
        <rect width="700" height="600" fill="url(#ambient-light)" />

        {/* Connection line between Peninsular and East Malaysia */}
        <line
          x1="370"
          y1="280"
          x2="440"
          y2="340"
          stroke="rgba(6, 182, 212, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="370"
          y1="300"
          x2="440"
          y2="360"
          stroke="rgba(6, 182, 212, 0.08)"
          strokeWidth="0.5"
          strokeDasharray="2 6"
        />

        {/* South China Sea Label */}
        <text
          x="405"
          y="265"
          fill="rgba(6, 182, 212, 0.15)"
          fontSize="8"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="3"
        >
          SOUTH CHINA SEA
        </text>

        {/* ── State Paths ── */}
        {Object.entries(STATE_PATHS).map(([stateId, pathD]) => {
          const stateData = stateMap[stateId];
          if (!stateData) return null;

          const value = stateData[activeLayer as keyof typeof stateData] as number;
          const isHovered = hoveredState === stateId;
          const isSelected = selectedState === stateId;

          const fillColor = getChoroplethColor(value, minVal, maxVal, isHovered, isSelected);
          const strokeColor = isSelected
            ? 'rgba(6, 182, 212, 0.9)'
            : isHovered
            ? 'rgba(6, 182, 212, 0.7)'
            : 'rgba(6, 182, 212, 0.2)';
          const strokeWidth = isSelected ? 2 : isHovered ? 1.5 : 0.8;
          const filterId = isSelected ? 'glow-selected' : isHovered ? 'glow-cyan' : 'state-inner-glow';

          const labelInfo = STATE_LABELS[stateId];
          const showLabel = !isHovered && !isSelected;

          return (
            <g key={stateId}>
              {/* State path */}
              <path
                d={pathD}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                filter={`url(#${filterId})`}
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => handleMouseEnter(stateId)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelectState(stateId)}
                role="button"
                aria-label={`${stateData.name} - ${formatValue(value, activeLayer)}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectState(stateId);
                  }
                }}
              />

              {/* Pulse ring animation on hover */}
              {isHovered && (
                <>
                  <circle
                    cx={labelInfo?.x ?? stateData.coordinates.x}
                    cy={labelInfo?.y ?? stateData.coordinates.y}
                    r="8"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.4)"
                    strokeWidth="1"
                    filter="url(#pulse-ring)"
                  >
                    <animate
                      attributeName="r"
                      from="6"
                      to="20"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={labelInfo?.x ?? stateData.coordinates.x}
                    cy={labelInfo?.y ?? stateData.coordinates.y}
                    r="8"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.3)"
                    strokeWidth="0.8"
                  >
                    <animate
                      attributeName="r"
                      from="6"
                      to="28"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Central dot */}
                  <circle
                    cx={labelInfo?.x ?? stateData.coordinates.x}
                    cy={labelInfo?.y ?? stateData.coordinates.y}
                    r="3"
                    fill="#06b6d4"
                    opacity="0.9"
                  >
                    <animate
                      attributeName="r"
                      values="2.5;3.5;2.5"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* Selected state indicator */}
              {isSelected && !isHovered && (
                <>
                  <circle
                    cx={labelInfo?.x ?? stateData.coordinates.x}
                    cy={labelInfo?.y ?? stateData.coordinates.y}
                    r="4"
                    fill="#06b6d4"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.5;1;0.5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* State abbreviation labels (visible when not hovered) */}
              {showLabel && labelInfo && (
                <text
                  x={labelInfo.x}
                  y={labelInfo.y}
                  fill="rgba(6, 182, 212, 0.45)"
                  fontSize={labelInfo.fontSize}
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {stateData.abbr}
                </text>
              )}

              {/* Subtle pulsing data node on every state centroid */}
              {(!isHovered && !isSelected) && (
                <circle
                  cx={labelInfo?.x ?? stateData.coordinates.x}
                  cy={labelInfo?.y ?? stateData.coordinates.y}
                  r="2"
                  fill="#06b6d4"
                  opacity="0.3"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;0.6;0.3"
                    dur="3s"
                    begin={`${Object.keys(STATE_PATHS).indexOf(stateId) * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* ── Decorative Corner Markers ── */}
        <g opacity="0.2" stroke="#06b6d4" strokeWidth="1" fill="none">
          {/* Top-left */}
          <path d="M 20,30 L 20,15 L 35,15" />
          {/* Top-right */}
          <path d="M 680,30 L 680,15 L 665,15" />
          {/* Bottom-left */}
          <path d="M 20,570 L 20,585 L 35,585" />
          {/* Bottom-right */}
          <path d="M 680,570 L 680,585 L 665,585" />
        </g>

        {/* ── Coordinate Readout (top-left) ── */}
        <text
          x="28"
          y="42"
          fill="rgba(6, 182, 212, 0.25)"
          fontSize="7"
          fontFamily="monospace"
        >
          LAT 1.0°-7.5°N LON 99.5°-119.5°E
        </text>

        {/* ── Layer Indicator (bottom-left) ── */}
        <text
          x="28"
          y="578"
          fill="rgba(6, 182, 212, 0.3)"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="2"
        >
          LAYER: {activeLayer.toUpperCase()}
        </text>

        {/* ── Legend Bar (bottom-center) ── */}
        <g transform="translate(210, 570)">
          <rect x="0" y="0" width="280" height="6" rx="3" fill="rgba(10, 22, 40, 0.8)" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="0.5" />
          <rect x="0" y="0" width="280" height="6" rx="3" fill="url(#legend-gradient)" />
          <text x="0" y="18" fill="rgba(6, 182, 212, 0.4)" fontSize="6" fontFamily="monospace">
            {formatValue(minVal, activeLayer)}
          </text>
          <text x="280" y="18" fill="rgba(6, 182, 212, 0.4)" fontSize="6" fontFamily="monospace" textAnchor="end">
            {formatValue(maxVal, activeLayer)}
          </text>
        </g>

        {/* Legend gradient definition */}
        <defs>
          <linearGradient id="legend-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(10, 22, 40, 0.9)" />
            <stop offset="50%" stopColor="rgba(6, 100, 140, 0.7)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.9)" />
          </linearGradient>
        </defs>

        {/* ── System Status (top-right) ── */}
        <g transform="translate(620, 28)">
          <circle cx="0" cy="0" r="2.5" fill="#06b6d4" opacity="0.8">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="8" y="3" fill="rgba(6, 182, 212, 0.3)" fontSize="7" fontFamily="monospace">
            LIVE
          </text>
        </g>
      </svg>

      {/* ── Tooltip ── */}
      {hoveredData && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${Math.min(mousePos.x + 16, 380)}px`,
            top: `${Math.min(mousePos.y - 10, 280)}px`,
          }}
        >
          <div
            className="px-3 py-2.5 rounded-md backdrop-blur-md border"
            style={{
              background: 'rgba(10, 14, 26, 0.92)',
              borderColor: 'rgba(6, 182, 212, 0.35)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.15), inset 0 0 20px rgba(6, 182, 212, 0.05)',
            }}
          >
            {/* State name */}
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#06b6d4', boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }}
              />
              <span className="text-xs font-semibold tracking-wider" style={{ color: '#06b6d4' }}>
                {hoveredData.name}
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.4)' }}>
                {hoveredData.abbr}
              </span>
            </div>

            {/* Metric value */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-mono" style={{ color: '#e0f7fa' }}>
                {formatValue(
                  hoveredData[activeLayer as keyof typeof hoveredData] as number,
                  activeLayer
                )}
              </span>
              <span className="text-[9px] font-mono" style={{ color: 'rgba(6, 182, 212, 0.5)' }}>
                {getLayerUnit(activeLayer)}
              </span>
            </div>

            {/* Mini bar showing relative position */}
            <div className="mt-1.5 w-full h-0.5 rounded-full" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(5, ((hoveredData[activeLayer as keyof typeof hoveredData] as number - minVal) / (maxVal - minVal)) * 100)}%`,
                  background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(6, 182, 212, 0.8))',
                  boxShadow: '0 0 4px rgba(6, 182, 212, 0.3)',
                }}
              />
            </div>

            {/* Region tag */}
            <div className="mt-1.5 flex items-center gap-1">
              <span
                className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider"
                style={{
                  background: hoveredData.region === 'east_malaysia'
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(6, 182, 212, 0.08)',
                  color: hoveredData.region === 'east_malaysia'
                    ? 'rgba(245, 158, 11, 0.6)'
                    : 'rgba(6, 182, 212, 0.5)',
                  border: `1px solid ${hoveredData.region === 'east_malaysia'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(6, 182, 212, 0.12)'}`,
                }}
              >
                {hoveredData.region === 'east_malaysia' ? 'East MY' : 'Peninsular'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Selected State Info Panel (bottom-right) ── */}
      {selectedData && (
        <div
          className="absolute bottom-3 right-3 z-15 px-3 py-2.5 rounded-md backdrop-blur-md border max-w-[180px]"
          style={{
            background: 'rgba(10, 14, 26, 0.88)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.1)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#06b6d4', boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)' }}
            />
            <span className="text-[10px] font-semibold tracking-wider" style={{ color: '#06b6d4' }}>
              {selectedData.name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {(['population', 'gdp', 'births', 'deaths', 'unemployment', 'datasets'] as const).map((layer) => {
              const val = selectedData[layer];
              const isActive = layer === activeLayer;
              return (
                <div key={layer} className="flex items-center gap-1">
                  <span
                    className="text-[8px] font-mono uppercase"
                    style={{ color: isActive ? 'rgba(6, 182, 212, 0.8)' : 'rgba(6, 182, 212, 0.3)' }}
                  >
                    {layer.slice(0, 3)}
                  </span>
                  <span
                    className="text-[9px] font-mono font-bold"
                    style={{ color: isActive ? '#e0f7fa' : 'rgba(224, 247, 250, 0.4)' }}
                  >
                    {formatValue(val, layer)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
