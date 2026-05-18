'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network, Database, AlertTriangle, ChevronRight,
  Activity, Shield, Zap, ExternalLink, Info,
} from 'lucide-react';
import { DATASET_CATEGORIES } from '@/lib/data/malaysia-data';
import { DATASETS } from '@/lib/data/datasets';
import { HUDBracket, SectionHeaderLine } from '@/components/dashboard/particle-background';
import type { Lang } from '@/lib/dashboard-types';

// ─── Types ────────────────────────────────────────────────────────
type RelationshipType =
  | 'DRIVES'
  | 'LEADS'
  | 'CORRELATES_POSITIVE'
  | 'CORRELATES_NEGATIVE'
  | 'CONTAINS'
  | 'SHARES_GEOGRAPHY'
  | 'SHARES_FREQUENCY'
  | 'POLICY_TRANSMITS';

interface OntologyNode {
  id: string;
  label_en: string;
  label_ms: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  datasetCount: number;
  anomalyScore: number;
  description_en: string;
  description_ms: string;
}

interface OntologyEdge {
  source: string;
  target: string;
  type: RelationshipType;
  strength: number;
  description_en: string;
  description_ms: string;
}

// ─── Relationship Colors & Labels ─────────────────────────────────
const REL_COLORS: Record<RelationshipType, string> = {
  DRIVES: '#10b981',
  LEADS: '#06b6d4',
  CORRELATES_POSITIVE: '#f59e0b',
  CORRELATES_NEGATIVE: '#ef4444',
  CONTAINS: '#8b5cf6',
  SHARES_GEOGRAPHY: '#0ea5e9',
  SHARES_FREQUENCY: '#64748b',
  POLICY_TRANSMITS: '#ec4899',
};

const REL_LABELS: Record<RelationshipType, { en: string; ms: string }> = {
  DRIVES: { en: 'Drives', ms: 'Memacu' },
  LEADS: { en: 'Leads', ms: 'Menerajui' },
  CORRELATES_POSITIVE: { en: 'Correlates (+)', ms: 'Berkorelasi (+)' },
  CORRELATES_NEGATIVE: { en: 'Correlates (−)', ms: 'Berkorelasi (−)' },
  CONTAINS: { en: 'Contains', ms: 'Mengandungi' },
  SHARES_GEOGRAPHY: { en: 'Shares Geography', ms: 'Kongsi Geografi' },
  SHARES_FREQUENCY: { en: 'Shares Frequency', ms: 'Kongsi Kekerapan' },
  POLICY_TRANSMITS: { en: 'Policy Transmits', ms: 'Polisi Memancar' },
};

// ─── Premium Card Style ───────────────────────────────────────────
function premiumCardStyle(overrides?: Record<string, string>) {
  return {
    background: 'linear-gradient(180deg, rgba(6,182,212,0.03) 0%, rgba(10,14,26,0.85) 30%)',
    borderColor: 'rgba(6,182,212,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'inset 0 1px 0 0 rgba(6,182,212,0.06)',
    ...overrides,
  };
}

// ─── Dataset count per category ───────────────────────────────────
function getDatasetCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  DATASETS.forEach(d => {
    counts[d.category_en] = (counts[d.category_en] || 0) + 1;
  });
  return counts;
}

// ─── Edge Data ────────────────────────────────────────────────────
const ONTOLOGY_EDGES: OntologyEdge[] = [
  { source: 'Demography', target: 'National Accounts', type: 'DRIVES', strength: 0.9,
    description_en: 'Population changes drive GDP growth through labour force and consumption',
    description_ms: 'Perubahan penduduk memacu pertumbuhan KDNK melalui tenaga kerja dan penggunaan' },
  { source: 'National Accounts', target: 'Labour Markets', type: 'LEADS', strength: 0.85,
    description_en: 'GDP performance leads employment trends and wage growth',
    description_ms: 'Prestasi KDNK menerajui trend pekerjaan dan pertumbuhan gaji' },
  { source: 'Prices', target: 'Financial Markets', type: 'CORRELATES_POSITIVE', strength: 0.8,
    description_en: 'CPI movements positively correlate with interest rate adjustments',
    description_ms: 'Pergerakan CPI berkorelasi positif dengan pelarasan kadar faedah' },
  { source: 'Healthcare', target: 'Demography', type: 'CORRELATES_NEGATIVE', strength: 0.7,
    description_en: 'Improved healthcare inversely correlates with mortality rates',
    description_ms: 'Penjagaan kesihatan yang baik berkorelasi songsang dengan kadar kematian' },
  { source: 'Education', target: 'Economic Sectors', type: 'DRIVES', strength: 0.75,
    description_en: 'Education quality drives sector productivity and innovation',
    description_ms: 'Kualiti pendidikan memacu produktiviti sektor dan inovasi' },
  { source: 'Economic Sectors', target: 'National Accounts', type: 'DRIVES', strength: 0.95,
    description_en: 'Sector output directly drives national GDP composition',
    description_ms: 'Keluaran sektor secara langsung memacu komposisi KDNK negara' },
  { source: 'Environment', target: 'Healthcare', type: 'CORRELATES_POSITIVE', strength: 0.6,
    description_en: 'Environmental quality positively correlates with public health outcomes',
    description_ms: 'Kualiti alam sekitar berkorelasi positif dengan hasil kesihatan awam' },
  { source: 'Transportation', target: 'Economic Sectors', type: 'DRIVES', strength: 0.7,
    description_en: 'Transport infrastructure drives sector connectivity and trade',
    description_ms: 'Infrastruktur pengangkutan memacu konektiviti sektor dan perdagangan' },
  { source: 'Households', target: 'Prices', type: 'CORRELATES_POSITIVE', strength: 0.8,
    description_en: 'Household spending patterns positively correlate with price levels',
    description_ms: 'Corak perbelanjaan isi rumah berkorelasi positif dengan tahap harga' },
  { source: 'Labour Markets', target: 'Households', type: 'LEADS', strength: 0.85,
    description_en: 'Employment conditions lead household income and welfare levels',
    description_ms: 'Keadaan pekerjaan menerajui pendapatan dan tahap kebajikan isi rumah' },
  { source: 'Communications', target: 'Economic Sectors', type: 'CORRELATES_POSITIVE', strength: 0.65,
    description_en: 'Digital connectivity positively correlates with sector digitalisation',
    description_ms: 'Konektiviti digital berkorelasi positif dengan pendigitalan sektor' },
  { source: 'Public Safety', target: 'Demography', type: 'CORRELATES_NEGATIVE', strength: 0.5,
    description_en: 'Crime rates negatively correlate with population wellbeing indicators',
    description_ms: 'Kadar jenayah berkorelasi songsang dengan penunjuk kesejahteraan penduduk' },
  { source: 'Public Administration', target: 'National Accounts', type: 'POLICY_TRANSMITS', strength: 0.6,
    description_en: 'Fiscal policy transmits through government spending to GDP',
    description_ms: 'Dasar fiskal memancar melalui perbelanjaan kerajaan ke KDNK' },
];

// ─── Force Simulation ─────────────────────────────────────────────
function simulateForces(
  nodes: OntologyNode[],
  edges: OntologyEdge[],
  width: number,
  height: number,
  iterations: number = 120
): void {
  const nodeMap = new Map<string, OntologyNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const centerX = width / 2;
  const centerY = height / 2;

  // Initialize positions in a circle if not already positioned
  nodes.forEach((n, i) => {
    if (n.x === 0 && n.y === 0) {
      const angle = (2 * Math.PI * i) / nodes.length;
      const r = Math.min(width, height) * 0.3;
      n.x = centerX + r * Math.cos(angle);
      n.y = centerY + r * Math.sin(angle);
    }
    n.vx = 0;
    n.vy = 0;
  });

  const alpha = 0.3;
  const chargeStrength = -600;
  const linkDistance = 140;
  const centerStrength = 0.02;

  for (let iter = 0; iter < iterations; iter++) {
    const iterAlpha = alpha * (1 - iter / iterations);

    // Charge repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (chargeStrength * iterAlpha) / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        nodes[i].vx -= fx;
        nodes[i].vy -= fy;
        nodes[j].vx += fx;
        nodes[j].vy += fy;
      }
    }

    // Link attraction
    for (const edge of edges) {
      const source = nodeMap.get(edge.source);
      const target = nodeMap.get(edge.target);
      if (!source || !target) continue;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - linkDistance) * iterAlpha * edge.strength * 0.15;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }

    // Center gravity
    for (const node of nodes) {
      node.vx += (centerX - node.x) * centerStrength * iterAlpha;
      node.vy += (centerY - node.y) * centerStrength * iterAlpha;
    }

    // Apply velocities with damping
    for (const node of nodes) {
      node.vx *= 0.6;
      node.vy *= 0.6;
      node.x += node.vx;
      node.y += node.vy;

      // Constrain to bounds with padding
      const pad = node.radius + 20;
      node.x = Math.max(pad, Math.min(width - pad, node.x));
      node.y = Math.max(pad, Math.min(height - pad, node.y));
    }
  }
}

// ─── Anomaly Badge ────────────────────────────────────────────────
function AnomalyBadge({ score, lang }: { score: number; lang: Lang }) {
  const isHigh = score > 70;
  const isMedium = score > 40 && score <= 70;
  const color = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#10b981';
  const label = isHigh
    ? (lang === 'ms' ? 'TINGGI' : 'HIGH')
    : isMedium
      ? (lang === 'ms' ? 'SEDERHANA' : 'MEDIUM')
      : (lang === 'ms' ? 'RENDAH' : 'LOW');

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
      <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color }}>
        {label} ({score})
      </span>
    </div>
  );
}

// ─── Edge Legend ──────────────────────────────────────────────────
function EdgeLegend({ lang }: { lang: Lang }) {
  const types: RelationshipType[] = [
    'DRIVES', 'LEADS', 'CORRELATES_POSITIVE', 'CORRELATES_NEGATIVE',
    'CONTAINS', 'SHARES_GEOGRAPHY', 'SHARES_FREQUENCY', 'POLICY_TRANSMITS',
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
      {types.map(type => (
        <div key={type} className="flex items-center gap-1.5">
          <div
            className="w-5 h-0.5 rounded-full"
            style={{
              background: REL_COLORS[type],
              boxShadow: `0 0 4px ${REL_COLORS[type]}40`,
              borderStyle: type === 'CORRELATES_NEGATIVE' ? 'dashed' : 'solid',
            }}
          />
          <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
            {lang === 'ms' ? REL_LABELS[type].ms : REL_LABELS[type].en}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export function IntelligenceSection({ lang }: { lang: Lang }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  const datasetCounts = useMemo(() => getDatasetCounts(), []);

  // Initialize nodes from categories
  const initialNodes = useMemo<OntologyNode[]>(() => {
    // Seeded random for anomaly scores (deterministic)
    const seedRandom = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const rng = seedRandom(42);

    return DATASET_CATEGORIES.map((cat, i) => {
      const count = datasetCounts[cat.en] || 0;
      const radius = Math.max(14, Math.min(30, 14 + count * 0.4));
      return {
        id: cat.en,
        label_en: cat.en,
        label_ms: cat.ms,
        color: cat.color,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius,
        datasetCount: count,
        anomalyScore: Math.round(rng() * 100),
        description_en: getCategoryDescription(cat.en),
        description_ms: getCategoryDescriptionMS(cat.en),
      };
    });
  }, [datasetCounts]);

  // Run force simulation when dimensions change - compute via useMemo instead of effect
  const simulatedNodes = useMemo(() => {
    const nodes = initialNodes.map(n => ({ ...n }));
    simulateForces(nodes, ONTOLOGY_EDGES, dimensions.width, dimensions.height, 150);
    return nodes;
  }, [initialNodes, dimensions]);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width: Math.floor(width), height: Math.max(400, Math.floor(height)) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Find connected edges for selected node
  const selectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return ONTOLOGY_EDGES
      .map((e, i) => ({ ...e, index: i }))
      .filter(e => e.source === selectedNode || e.target === selectedNode);
  }, [selectedNode]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return simulatedNodes.find(n => n.id === selectedNode) || null;
  }, [selectedNode, simulatedNodes]);

  // Click handler for nodes
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(prev => prev === nodeId ? null : nodeId);
  }, []);

  // SVG edge path generation with curve
  const getEdgePath = useCallback((sourceId: string, targetId: string) => {
    const source = simulatedNodes.find(n => n.id === sourceId);
    const target = simulatedNodes.find(n => n.id === targetId);
    if (!source || !target) return '';

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // Shorten edges to stop at node borders
    const srcR = source.radius + 4;
    const tgtR = target.radius + 8;
    const sx = source.x + (dx / dist) * srcR;
    const sy = source.y + (dy / dist) * srcR;
    const tx = target.x - (dx / dist) * tgtR;
    const ty = target.y - (dy / dist) * tgtR;

    // Curved control point
    const midX = (sx + tx) / 2;
    const midY = (sy + ty) / 2;
    const perpX = -(ty - sy) * 0.15;
    const perpY = (tx - sx) * 0.15;
    const cx = midX + perpX;
    const cy = midY + perpY;

    return `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
  }, [simulatedNodes]);

  return (
    <div className="space-y-6" role="region" aria-label={lang === 'ms' ? 'Intelijen' : 'Intelligence'}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div>
          <span className="text-[13px] font-bold font-mono tracking-[0.2em]" style={{ color: '#ec4899', textShadow: '0 0 8px rgba(236,72,153,0.4)' }}>
            {lang === 'ms' ? 'INTELIJEN' : 'INTELLIGENCE'}
          </span>
          <SectionHeaderLine color="#ec4899" delay={0.2} />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Network size={12} style={{ color: '#ec4899' }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ec489999' }}>
            {lang === 'ms' ? 'GRAF ONTOLOGI DATA' : 'DATA ONTOLOGY GRAPH'}
          </span>
        </div>
      </div>

      {/* Main Layout: Graph + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Graph Area (70%) */}
        <div className="lg:col-span-7 relative group rounded-xl border" style={premiumCardStyle()}>
          <HUDBracket />
          {/* Scan line effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-30">
            <motion.div
              className="absolute top-0 bottom-0 w-px"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(236,72,153,0.3), rgba(236,72,153,0.6), rgba(236,72,153,0.3), transparent)',
                boxShadow: '0 0 8px rgba(236,72,153,0.2)',
              }}
              animate={{ left: ['-2%', '102%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-0">
            <div className="flex items-center gap-2">
              <Activity size={14} style={{ color: '#ec4899' }} />
              <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#ec4899' }}>
                {lang === 'ms' ? 'GRAF ONTOLOGI DATA' : 'DATA ONTOLOGY GRAPH'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981', boxShadow: '0 0 4px rgba(16,185,129,0.6)' }} />
                <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
                  {simulatedNodes.length} {lang === 'ms' ? 'nod' : 'nodes'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 4px rgba(245,158,11,0.6)' }} />
                <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
                  {ONTOLOGY_EDGES.length} {lang === 'ms' ? 'sambungan' : 'edges'}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Graph */}
          <div ref={containerRef} className="w-full" style={{ height: '520px' }}>
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="w-full h-full"
              role="img"
              aria-label={lang === 'ms' ? 'Graf ontologi data menunjukkan hubungan antara kategori data' : 'Data ontology graph showing relationships between data categories'}
            >
              <defs>
                {/* Arrow markers for each relationship type */}
                {Object.entries(REL_COLORS).map(([type, color]) => (
                  <marker
                    key={type}
                    id={`arrow-${type}`}
                    viewBox="0 0 10 6"
                    refX="10"
                    refY="3"
                    markerWidth="8"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 3 L 0 6 Z" fill={color} fillOpacity={0.7} />
                  </marker>
                ))}
                {/* Glow filter */}
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="selectedGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid pattern background */}
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Edges */}
              {ONTOLOGY_EDGES.map((edge, i) => {
                const path = getEdgePath(edge.source, edge.target);
                if (!path) return null;
                const color = REL_COLORS[edge.type];
                const isHovered = hoveredEdge === i;
                const isConnected = selectedNode
                  ? edge.source === selectedNode || edge.target === selectedNode
                  : true;
                const opacity = selectedNode
                  ? isConnected ? 0.8 : 0.1
                  : isHovered ? 1 : 0.35;
                const strokeWidth = edge.strength * 2.5 + 0.5;

                return (
                  <g key={`edge-${i}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke={color}
                      strokeWidth={isHovered ? strokeWidth + 1.5 : strokeWidth}
                      strokeOpacity={opacity}
                      strokeDasharray={edge.type === 'CORRELATES_NEGATIVE' ? '6,3' : undefined}
                      markerEnd={`url(#arrow-${edge.type})`}
                      style={{ cursor: 'pointer', transition: 'stroke-opacity 0.3s, stroke-width 0.3s' }}
                      onMouseEnter={() => setHoveredEdge(i)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                    {/* Edge hover tooltip area */}
                    {isHovered && (
                      <text
                        x={(simulatedNodes.find(n => n.id === edge.source)?.x || 0 + simulatedNodes.find(n => n.id === edge.target)?.x || 0) / 2}
                        y={(simulatedNodes.find(n => n.id === edge.source)?.y || 0 + simulatedNodes.find(n => n.id === edge.target)?.y || 0) / 2 - 12}
                        textAnchor="middle"
                        className="font-mono"
                        fill={color}
                        fontSize="9"
                        fontWeight="bold"
                        style={{ textShadow: '0 0 8px rgba(0,0,0,0.8)' }}
                      >
                        {lang === 'ms' ? REL_LABELS[edge.type].ms : REL_LABELS[edge.type].en} ({(edge.strength * 100).toFixed(0)}%)
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {simulatedNodes.map(node => {
                const isSelected = selectedNode === node.id;
                const isConnected = selectedNode
                  ? ONTOLOGY_EDGES.some(e =>
                      (e.source === selectedNode && e.target === node.id) ||
                      (e.target === selectedNode && e.source === node.id)
                    ) || selectedNode === node.id
                  : true;
                const opacity = selectedNode ? (isConnected ? 1 : 0.2) : 1;

                return (
                  <g
                    key={node.id}
                    style={{
                      cursor: 'pointer',
                      opacity,
                      transition: 'opacity 0.3s',
                    }}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    {/* Outer glow ring for selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 10}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.3"
                        filter="url(#selectedGlow)"
                      >
                        <animate
                          attributeName="r"
                          values={`${node.radius + 8};${node.radius + 14};${node.radius + 8}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.3;0.1;0.3"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Pulse ring for anomaly > 70 */}
                    {node.anomalyScore > 70 && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.radius + 4}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values={`${node.radius + 2};${node.radius + 8};${node.radius + 2}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.4;0.1;0.4"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={`${node.color}30`}
                      stroke={node.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeOpacity={isSelected ? 1 : 0.6}
                      filter={isSelected ? 'url(#selectedGlow)' : 'url(#nodeGlow)'}
                      style={{ transition: 'stroke-width 0.3s, stroke-opacity 0.3s' }}
                    />

                    {/* Inner dot */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={3}
                      fill={node.color}
                      fillOpacity={0.8}
                    />

                    {/* Label below node */}
                    <text
                      x={node.x}
                      y={node.y + node.radius + 14}
                      textAnchor="middle"
                      className="font-mono"
                      fill={node.color}
                      fontSize="8"
                      fontWeight="bold"
                      letterSpacing="0.05em"
                      style={{ textShadow: '0 0 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}
                    >
                      {lang === 'ms' ? node.label_ms : node.label_en}
                    </text>

                    {/* Dataset count badge */}
                    <text
                      x={node.x}
                      y={node.y + 3}
                      textAnchor="middle"
                      className="font-mono"
                      fill="#e0f7fa"
                      fontSize="7"
                      fontWeight="bold"
                    >
                      {node.datasetCount}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Edge Legend */}
          <div className="px-4 pb-4">
            <EdgeLegend lang={lang} />
          </div>
        </div>

        {/* Detail Panel (30%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Selected Node Detail */}
          <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
            <HUDBracket />
            <div className="flex items-center gap-2 mb-4">
              <Shield size={14} style={{ color: '#ec4899' }} />
              <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#ec4899' }}>
                {lang === 'ms' ? 'PANEL PENGETAHUAN' : 'KNOWLEDGE PANEL'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {selectedNodeData ? (
                <motion.div
                  key={selectedNodeData.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Node title */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{
                        background: selectedNodeData.color,
                        boxShadow: `0 0 10px ${selectedNodeData.color}60`,
                      }}
                    />
                    <span className="text-sm font-bold font-mono" style={{ color: selectedNodeData.color, textShadow: `0 0 8px ${selectedNodeData.color}30` }}>
                      {lang === 'ms' ? selectedNodeData.label_ms : selectedNodeData.label_en}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] font-mono leading-relaxed mb-3" style={{ color: '#b8c5d4' }}>
                    {lang === 'ms' ? selectedNodeData.description_ms : selectedNodeData.description_en}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="rounded-md border p-2" style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)' }}>
                      <div className="text-[8px] font-mono tracking-wider mb-0.5" style={{ color: '#06b6d499' }}>
                        {lang === 'ms' ? 'SET DATA' : 'DATASETS'}
                      </div>
                      <div className="text-lg font-bold font-mono" style={{ color: '#06b6d4', textShadow: '0 0 8px rgba(6,182,212,0.3)' }}>
                        {selectedNodeData.datasetCount}
                      </div>
                    </div>
                    <div className="rounded-md border p-2" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.1)' }}>
                      <div className="text-[8px] font-mono tracking-wider mb-0.5" style={{ color: '#ef444499' }}>
                        {lang === 'ms' ? 'ANOMALI' : 'ANOMALY'}
                      </div>
                      <AnomalyBadge score={selectedNodeData.anomalyScore} lang={lang} />
                    </div>
                  </div>

                  {/* Connected edges */}
                  <div className="mt-3">
                    <div className="text-[9px] font-mono tracking-wider mb-2" style={{ color: '#b0bec5' }}>
                      {lang === 'ms' ? 'HUBUNGAN' : 'CONNECTIONS'} ({selectedEdges.length})
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedEdges.map(edge => {
                        const isSource = edge.source === selectedNode;
                        const otherNode = isSource ? edge.target : edge.source;
                        const otherData = simulatedNodes.find(n => n.id === otherNode);
                        const color = REL_COLORS[edge.type];

                        return (
                          <motion.div
                            key={`${edge.source}-${edge.target}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 p-1.5 rounded-md border"
                            style={{
                              background: `${color}08`,
                              borderColor: `${color}20`,
                            }}
                          >
                            <ChevronRight size={10} style={{ color }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                                  style={{
                                    background: `${color}20`,
                                    color,
                                    border: `1px solid ${color}30`,
                                  }}
                                >
                                  {lang === 'ms' ? REL_LABELS[edge.type].ms : REL_LABELS[edge.type].en}
                                </span>
                                <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
                                  {(edge.strength * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="text-[9px] font-mono mt-0.5 truncate" style={{ color: otherData?.color || '#e0f7fa' }}>
                                {isSource ? '→ ' : '← '}
                                {lang === 'ms' ? (otherData?.label_ms || otherNode) : (otherData?.label_en || otherNode)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Edge description */}
                  {selectedEdges.length > 0 && (
                    <div className="mt-3 p-2 rounded-md border" style={{ background: 'rgba(6,182,212,0.03)', borderColor: 'rgba(6,182,212,0.08)' }}>
                      <div className="text-[8px] font-mono tracking-wider mb-1" style={{ color: '#06b6d499' }}>
                        {lang === 'ms' ? 'PENERANGAN HUBUNGAN' : 'RELATIONSHIP DESCRIPTION'}
                      </div>
                      <p className="text-[9px] font-mono leading-relaxed" style={{ color: '#b8c5d4' }}>
                        {lang === 'ms' ? selectedEdges[0].description_ms : selectedEdges[0].description_en}
                      </p>
                    </div>
                  )}

                  {/* Explore button */}
                  <button
                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-md border text-[10px] font-mono tracking-wider transition-all duration-300"
                    style={{
                      background: 'rgba(236,72,153,0.08)',
                      borderColor: 'rgba(236,72,153,0.2)',
                      color: '#ec4899',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(236,72,153,0.15)';
                      e.currentTarget.style.borderColor = 'rgba(236,72,153,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 12px rgba(236,72,153,0.15)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(236,72,153,0.08)';
                      e.currentTarget.style.borderColor = 'rgba(236,72,153,0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Database size={10} />
                    {lang === 'ms' ? 'TEROKAI SET DATA' : 'EXPLORE DATASETS'}
                    <ExternalLink size={8} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <Network size={32} style={{ color: '#ec489930' }} />
                  <p className="text-[10px] font-mono mt-3 text-center" style={{ color: '#b0bec5' }}>
                    {lang === 'ms'
                      ? 'Klik nod pada graf untuk melihat butiran ontologi'
                      : 'Click a node on the graph to view ontology details'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats Summary Card */}
          <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
            <HUDBracket />
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} style={{ color: '#f59e0b' }} />
              <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#f59e0b' }}>
                {lang === 'ms' ? 'RINGKASAN GRAF' : 'GRAPH SUMMARY'}
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  label_en: 'Total Nodes',
                  label_ms: 'Jumlah Nod',
                  value: simulatedNodes.length,
                  color: '#06b6d4',
                  icon: Network,
                },
                {
                  label_en: 'Ontology Edges',
                  label_ms: 'Sambungan Ontologi',
                  value: ONTOLOGY_EDGES.length,
                  color: '#f59e0b',
                  icon: Activity,
                },
                {
                  label_en: 'Drives Relations',
                  label_ms: 'Hubungan Memacu',
                  value: ONTOLOGY_EDGES.filter(e => e.type === 'DRIVES').length,
                  color: '#10b981',
                  icon: Zap,
                },
                {
                  label_en: 'Anomalies Detected',
                  label_ms: 'Anomali Dikesan',
                  value: simulatedNodes.filter(n => n.anomalyScore > 70).length,
                  color: '#ef4444',
                  icon: AlertTriangle,
                },
                {
                  label_en: 'Avg. Edge Strength',
                  label_ms: 'Purata Kekuatan Sambungan',
                  value: (ONTOLOGY_EDGES.reduce((a, e) => a + e.strength, 0) / ONTOLOGY_EDGES.length * 100).toFixed(1) + '%',
                  color: '#8b5cf6',
                  icon: Shield,
                },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="flex items-center justify-between p-2 rounded-md border"
                    style={{
                      background: `${stat.color}05`,
                      borderColor: `${stat.color}15`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={11} style={{ color: stat.color }} />
                      <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>
                        {lang === 'ms' ? stat.label_ms : stat.label_en}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold font-mono" style={{ color: stat.color, textShadow: `0 0 6px ${stat.color}30` }}>
                      {stat.value}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Relationship Types Card */}
          <div className="relative group rounded-xl border p-5" style={premiumCardStyle()}>
            <HUDBracket />
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} style={{ color: '#8b5cf6' }} />
              <span className="text-[11px] font-semibold font-mono tracking-wider" style={{ color: '#8b5cf6' }}>
                {lang === 'ms' ? 'JENIS HUBUNGAN' : 'RELATIONSHIP TYPES'}
              </span>
            </div>

            <div className="space-y-1.5">
              {Object.entries(REL_LABELS).map(([type, labels]) => {
                const count = ONTOLOGY_EDGES.filter(e => e.type === type).length;
                const color = REL_COLORS[type as RelationshipType];
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-0.5 rounded-full"
                        style={{
                          background: color,
                          boxShadow: `0 0 4px ${color}40`,
                          borderTopStyle: type === 'CORRELATES_NEGATIVE' ? 'dashed' : 'solid',
                        }}
                      />
                      <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>
                        {lang === 'ms' ? labels.ms : labels.en}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-bold" style={{ color }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={10} style={{ color: '#ef4444' }} />
          <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
            {lang === 'ms'
              ? 'Nod berdenyut merah menunjukkan skor anomali tinggi (>70)'
              : 'Pulsing red nodes indicate high anomaly scores (>70)'}
          </span>
        </div>
        <div className="w-px h-3" style={{ background: 'rgba(6,182,212,0.15)' }} />
        <div className="flex items-center gap-1.5">
          <Network size={10} style={{ color: '#ec4899' }} />
          <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
            {lang === 'ms'
              ? 'Saiz nod berkadar dengan bilangan set data'
              : 'Node size proportional to dataset count'}
          </span>
        </div>
        <div className="w-px h-3" style={{ background: 'rgba(6,182,212,0.15)' }} />
        <div className="flex items-center gap-1.5">
          <Activity size={10} style={{ color: '#f59e0b' }} />
          <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
            {lang === 'ms'
              ? 'Ketebalan sambungan berkadar dengan kekuatan'
              : 'Edge thickness proportional to strength'}
          </span>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}</style>
    </div>
  );
}

// ─── Category Description Helpers ─────────────────────────────────
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'Demography': 'Population dynamics, births, deaths, migration, and fertility data across Malaysia.',
    'National Accounts': 'GDP, GNI, and macroeconomic aggregates at national and state levels.',
    'Prices': 'Consumer Price Index, inflation rates, and price indicators for goods and services.',
    'Labour Markets': 'Employment, unemployment, labour force participation, and wage statistics.',
    'Financial Markets': 'Exchange rates, interest rates, monetary aggregates, and banking data.',
    'Economic Sectors': 'Sectoral output covering services, manufacturing, agriculture, mining, and construction.',
    'Healthcare': 'Health indicators, disease surveillance, hospital data, and public health metrics.',
    'Environment': 'Environmental quality, air/water pollution, climate data, and natural resources.',
    'Education': 'Education enrollment, attainment, institutions, and human capital development.',
    'Transportation': 'Transport infrastructure, traffic, logistics, and connectivity metrics.',
    'Households': 'Household income, expenditure, poverty rates, and living standards.',
    'Communications': 'ICT adoption, internet penetration, telecommunications, and digital economy.',
    'Public Safety': 'Crime statistics, fire incidents, emergency services, and safety indicators.',
    'Public Administration': 'Government finances, public sector employment, and fiscal policy data.',
    'Public Welfare': 'Social protection, welfare programs, and community development metrics.',
    'Statistical Indicators': 'Composite indices, key performance indicators, and statistical benchmarks.',
    'Data Dictionaries': 'Codebooks, variable definitions, and data schema documentation.',
    'Metadata': 'Dataset metadata, update logs, and data quality descriptors.',
  };
  return descriptions[category] || 'Data category in the Malaysia open data ecosystem.';
}

function getCategoryDescriptionMS(category: string): string {
  const descriptions: Record<string, string> = {
    'Demography': 'Dinamik penduduk, kelahiran, kematian, migrasi, dan data kesuburan di Malaysia.',
    'National Accounts': 'KDNK, KNK, dan agregat makroekonomi di peringkat nasional dan negeri.',
    'Prices': 'Indeks Harga Pengguna, kadar inflasi, dan penunjuk harga untuk barang dan perkhidmatan.',
    'Labour Markets': 'Pekerjaan, pengangguran, penyertaan tenaga kerja, dan statistik gaji.',
    'Financial Markets': 'Kadar pertukaran, kadar faedah, agregat kewangan, dan data perbankan.',
    'Economic Sectors': 'Keluaran sektor merangkumi perkhidmatan, pembuatan, pertanian, perlombongan, dan pembinaan.',
    'Healthcare': 'Penunjuk kesihatan, pengawasan penyakit, data hospital, dan metrik kesihatan awam.',
    'Environment': 'Kualiti alam sekitar, pencemaran udara/air, data iklim, dan sumber asli.',
    'Education': 'Pendaftaran pendidikan, pencapaian, institusi, dan pembangunan modal insan.',
    'Transportation': 'Infrastruktur pengangkutan, trafik, logistik, dan metrik konektiviti.',
    'Households': 'Pendapatan isi rumah, perbelanjaan, kadar kemiskinan, dan taraf hidup.',
    'Communications': 'Penggunaan ICT, penetrasi internet, telekomunikasi, dan ekonomi digital.',
    'Public Safety': 'Statistik jenayah, kejadian kebakaran, perkhidmatan kecemasan, dan penunjuk keselamatan.',
    'Public Administration': 'Kewangan kerajaan, pekerjaan sektor awam, dan data dasar fiskal.',
    'Public Welfare': 'Perlindungan sosial, program kebajikan, dan metrik pembangunan komuniti.',
    'Statistical Indicators': 'Indeks komposit, penunjuk prestasi utama, dan penanda aras statistik.',
    'Data Dictionaries': 'Buku kod, definisi pembolehubah, dan dokumentasi skema data.',
    'Metadata': 'Metadata set data, log kemas kini, dan penerang kualiti data.',
  };
  return descriptions[category] || 'Kategori data dalam ekosistem data terbuka Malaysia.';
}

export default IntelligenceSection;
