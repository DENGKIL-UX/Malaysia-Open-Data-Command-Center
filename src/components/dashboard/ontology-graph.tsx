'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';

// ─── Types ───────────────────────────────────────────────────────
interface OntologyGraphProps {
  lang?: 'en' | 'ms';
  width?: number;
  height?: number;
}

type NodeType = 'economic_indicator' | 'demographic_cohort' | 'geographic_region' | 'social_metric' | 'data_quality' | 'time_series';
type LinkType = 'DRIVES' | 'CORRELATES_WITH' | 'INVERSELY_CORRELATES' | 'CONTAINS' | 'IMPACTS';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: NodeType;
  confidence: number;
  alert?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  linkType: LinkType;
  strength: number;
}

// ─── Color Mapping ───────────────────────────────────────────────
const NODE_COLORS: Record<NodeType, string> = {
  economic_indicator: '#00D4FF',
  demographic_cohort: '#8B5CF6',
  geographic_region: '#10B981',
  social_metric: '#EC4899',
  data_quality: '#F59E0B',
  time_series: '#3B82F6',
};

const LINK_COLORS: Record<string, string> = {
  DRIVES: '#00D4FF',
  CORRELATES_WITH: '#6b7280',
  INVERSELY_CORRELATES: '#ef4444',
  CONTAINS: '#10B981',
  IMPACTS: '#F59E0B',
};

function confidenceColor(confidence: number): string {
  if (confidence > 0.9) return '#00D4FF';
  if (confidence > 0.7) return '#F59E0B';
  return '#6b7280';
}

// ─── Hardcoded Graph Data ────────────────────────────────────────
const NODES: GraphNode[] = [
  { id: 'my.gdp', label: 'GDP Growth', type: 'economic_indicator', confidence: 0.98 },
  { id: 'my.population', label: 'Population', type: 'demographic_cohort', confidence: 0.97 },
  { id: 'my.unemployment', label: 'Unemployment', type: 'economic_indicator', confidence: 0.95, alert: 'Sabah >5%' },
  { id: 'my.births', label: 'Birth Rate', type: 'demographic_cohort', confidence: 0.96 },
  { id: 'my.deaths', label: 'Death Rate', type: 'demographic_cohort', confidence: 0.94 },
  { id: 'my.density', label: 'Urban Density', type: 'geographic_region', confidence: 0.92, alert: 'KL 7983/km\u00B2' },
  { id: 'my.trade', label: 'Trade Balance', type: 'economic_indicator', confidence: 0.91 },
  { id: 'my.inflation', label: 'CPI / Inflation', type: 'economic_indicator', confidence: 0.93 },
  { id: 'my.healthcare', label: 'Healthcare', type: 'social_metric', confidence: 0.88 },
  { id: 'my.datasets', label: 'Dataset Coverage', type: 'data_quality', confidence: 0.99 },
  { id: 'state.selangor', label: 'Selangor', type: 'geographic_region', confidence: 0.97 },
  { id: 'state.sabah', label: 'Sabah', type: 'geographic_region', confidence: 0.96, alert: 'High unemployment' },
  { id: 'state.kl', label: 'W.P. Kuala Lumpur', type: 'geographic_region', confidence: 0.97 },
  { id: 'state.sarawak', label: 'Sarawak', type: 'geographic_region', confidence: 0.96 },
];

const LINKS: GraphLink[] = [
  { source: 'my.gdp', target: 'my.unemployment', linkType: 'DRIVES', strength: 0.87 },
  { source: 'my.gdp', target: 'my.inflation', linkType: 'CORRELATES_WITH', strength: 0.72 },
  { source: 'my.gdp', target: 'my.trade', linkType: 'DRIVES', strength: 0.65 },
  { source: 'my.population', target: 'my.gdp', linkType: 'DRIVES', strength: 0.78 },
  { source: 'my.births', target: 'my.population', linkType: 'CORRELATES_WITH', strength: 0.91 },
  { source: 'my.deaths', target: 'my.healthcare', linkType: 'INVERSELY_CORRELATES', strength: 0.68 },
  { source: 'my.unemployment', target: 'my.gdp', linkType: 'INVERSELY_CORRELATES', strength: 0.76 },
  { source: 'state.selangor', target: 'state.kl', linkType: 'CONTAINS', strength: 0.95 },
  { source: 'state.selangor', target: 'my.gdp', linkType: 'DRIVES', strength: 0.85 },
  { source: 'state.sabah', target: 'my.unemployment', linkType: 'IMPACTS', strength: 0.72 },
  { source: 'state.sarawak', target: 'my.trade', linkType: 'CORRELATES_WITH', strength: 0.65 },
  { source: 'my.density', target: 'my.gdp', linkType: 'CORRELATES_WITH', strength: 0.80 },
];

// ─── Tooltip State ────────────────────────────────────────────────
interface TooltipData {
  node: GraphNode;
  x: number;
  y: number;
}

// ─── Component ───────────────────────────────────────────────────
export function OntologyGraph({ lang = 'en', width: propWidth, height: propHeight }: OntologyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dimensions, setDimensions] = useState({ width: propWidth ?? 800, height: propHeight ?? 500 });

  // Responsive sizing
  useEffect(() => {
    if (propWidth && propHeight) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({
            width: propWidth ?? width,
            height: propHeight ?? height,
          });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  // Get connected node/link IDs for highlighting
  const getConnectedIds = useCallback((nodeId: string) => {
    const connectedNodes = new Set<string>();
    const connectedLinks = new Set<number>();
    connectedNodes.add(nodeId);

    LINKS.forEach((link, idx) => {
      const srcId = typeof link.source === 'string' ? link.source : link.source.id;
      const tgtId = typeof link.target === 'string' ? link.target : link.target.id;
      if (srcId === nodeId || tgtId === nodeId) {
        connectedNodes.add(srcId);
        connectedNodes.add(tgtId);
        connectedLinks.add(idx);
      }
    });

    return { connectedNodes, connectedLinks };
  }, []);

  // D3 setup
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const w = dimensions.width;
    const h = dimensions.height;

    // Clear previous
    d3.select(svg).selectAll('*').remove();

    const svgSelection = d3.select(svg)
      .attr('width', w)
      .attr('height', h)
      .attr('viewBox', `0 0 ${w} ${h}`);

    // ─── Defs: filters, markers ─────────────────────────────────
    const defs = svgSelection.append('defs');

    // Glow filter for nodes
    const glowFilter = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Subtle glow for hovered nodes
    const strongGlow = defs.append('filter')
      .attr('id', 'node-glow-strong')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    strongGlow.append('feGaussianBlur')
      .attr('stdDeviation', '8')
      .attr('result', 'coloredBlur');
    const feMerge2 = strongGlow.append('feMerge');
    feMerge2.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge2.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for each link type
    Object.entries(LINK_COLORS).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 40)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)
        .attr('opacity', 0.6);
    });

    // ─── Grid background pattern ────────────────────────────────
    const gridPattern = defs.append('pattern')
      .attr('id', 'grid-pattern')
      .attr('width', 30)
      .attr('height', 30)
      .attr('patternUnits', 'userSpaceOnUse');
    gridPattern.append('path')
      .attr('d', 'M 30 0 L 0 0 0 30')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(6,182,212,0.04)')
      .attr('stroke-width', 0.5);

    svgSelection.append('rect')
      .attr('width', w)
      .attr('height', h)
      .attr('fill', 'url(#grid-pattern)');

    // ─── HUD corner brackets ────────────────────────────────────
    const bracketSize = 20;
    const bracketOffset = 8;
    const bracketColor = 'rgba(6,182,212,0.25)';
    const bracketWidth = 1.5;

    const drawBracket = (x: number, y: number, rotation: number) => {
      const g = svgSelection.append('g')
        .attr('transform', `translate(${x},${y}) rotate(${rotation})`);
      g.append('path')
        .attr('d', `M0,${bracketSize} L0,0 L${bracketSize},0`)
        .attr('fill', 'none')
        .attr('stroke', bracketColor)
        .attr('stroke-width', bracketWidth);
      return g;
    };

    drawBracket(bracketOffset, bracketOffset, 0); // top-left
    drawBracket(w - bracketOffset, bracketOffset, 90); // top-right
    drawBracket(w - bracketOffset, h - bracketOffset, 180); // bottom-right
    drawBracket(bracketOffset, h - bracketOffset, 270); // bottom-left

    // ─── Zoom group ─────────────────────────────────────────────
    const g = svgSelection.append('g');

    // ─── Clone data for simulation ──────────────────────────────
    const simNodes: GraphNode[] = NODES.map(n => ({ ...n }));
    const simLinks: GraphLink[] = LINKS.map(l => ({ ...l }));

    // ─── Force simulation ───────────────────────────────────────
    const simulation = d3.forceSimulation<GraphNode>(simNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(simLinks)
        .id(d => d.id)
        .distance(160)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collide', d3.forceCollide(60))
      .force('x', d3.forceX(w / 2).strength(0.03))
      .force('y', d3.forceY(h / 2).strength(0.03));

    // ─── Draw links ─────────────────────────────────────────────
    const linkGroup = g.append('g').attr('class', 'links');
    const linkElements = linkGroup.selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', d => LINK_COLORS[d.linkType] || '#6b7280')
      .attr('stroke-width', d => 1 + d.strength * 2)
      .attr('stroke-opacity', 0.35)
      .attr('marker-end', d => `url(#arrow-${d.linkType})`)
      .attr('stroke-dasharray', d => d.linkType === 'INVERSELY_CORRELATES' ? '6,4' : 'none');

    // ─── Link labels (strength) ─────────────────────────────────
    const linkLabelGroup = g.append('g').attr('class', 'link-labels');
    const linkLabels = linkLabelGroup.selectAll('text')
      .data(simLinks)
      .join('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -4)
      .attr('fill', '#6b7280')
      .attr('font-size', '8px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('opacity', 0.5)
      .text(d => `${Math.round(d.strength * 100)}%`);

    // ─── Draw nodes ─────────────────────────────────────────────
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const nodeElements = nodeGroup.selectAll<SVGGElement, GraphNode>('g')
      .data(simNodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'grab');

    // Node outer ring (dashed, confidence-colored)
    nodeElements.append('circle')
      .attr('class', 'outer-ring')
      .attr('r', 26)
      .attr('fill', 'none')
      .attr('stroke', d => confidenceColor(d.confidence))
      .attr('stroke-width', 1.2)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.5);

    // Node inner circle
    nodeElements.append('circle')
      .attr('class', 'inner-circle')
      .attr('r', 20)
      .attr('fill', d => {
        const c = NODE_COLORS[d.type];
        return c + '1A'; // 10% opacity
      })
      .attr('stroke', d => NODE_COLORS[d.type])
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#node-glow)');

    // Alert indicator (red dot at top-right)
    nodeElements.filter(d => d.alert)
      .append('circle')
      .attr('class', 'alert-dot')
      .attr('cx', 16)
      .attr('cy', -16)
      .attr('r', 4)
      .attr('fill', '#ef4444')
      .attr('stroke', '#0a0e1a')
      .attr('stroke-width', 1.5);

    // Alert red border for alert nodes
    nodeElements.filter(d => d.alert)
      .select('.inner-circle')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2);

    // Node label
    nodeElements.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('fill', '#e0f7fa')
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-weight', '600')
      .text(d => d.label.length > 14 ? d.label.slice(0, 13) + '…' : d.label);

    // Node confidence badge
    nodeElements.append('text')
      .attr('class', 'confidence-badge')
      .attr('text-anchor', 'middle')
      .attr('dy', 32)
      .attr('fill', '#6b7280')
      .attr('font-size', '8px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(d => `${(d.confidence * 100).toFixed(0)}%`);

    // ─── Drag behavior ──────────────────────────────────────────
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        d3.select(event.sourceEvent.target.closest('.node')).style('cursor', 'grabbing');
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        d3.select(event.sourceEvent.target.closest('.node')).style('cursor', 'grab');
      });

    nodeElements.call(drag);

    // ─── Hover behavior ─────────────────────────────────────────
    nodeElements
      .on('mouseenter', (_event, d) => {
        setHoveredNode(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
      })
      .on('click', (_event, d) => {
        setSelectedNode(prev => prev === d.id ? null : d.id);
        const svgRect = svg.getBoundingClientRect();
        const nodeX = (d.x ?? 0) + svgRect.left;
        const nodeY = (d.y ?? 0) + svgRect.top;
        setTooltip(prev => prev?.node.id === d.id && selectedNode === d.id ? null : {
          node: d,
          x: nodeX,
          y: nodeY,
        });
      });

    // ─── Tick update ────────────────────────────────────────────
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      linkLabels
        .attr('x', d => {
          const sx = (d.source as GraphNode).x ?? 0;
          const tx = (d.target as GraphNode).x ?? 0;
          return (sx + tx) / 2;
        })
        .attr('y', d => {
          const sy = (d.source as GraphNode).y ?? 0;
          const ty = (d.target as GraphNode).y ?? 0;
          return (sy + ty) / 2;
        });

      nodeElements
        .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // ─── Zoom ───────────────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svgSelection.call(zoom);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [dimensions, getConnectedIds]);

  // ─── Highlight effect via React state ──────────────────────────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const activeNodeId = hoveredNode || selectedNode;

    if (!activeNodeId) {
      // Reset all
      d3.select(svg).selectAll('.node').transition().duration(200)
        .attr('opacity', 1);
      d3.select(svg).selectAll('.links line').transition().duration(200)
        .attr('stroke-opacity', 0.35);
      d3.select(svg).selectAll('.link-labels text').transition().duration(200)
        .attr('opacity', 0.5);
      return;
    }

    const { connectedNodes, connectedLinks } = getConnectedIds(activeNodeId);

    // Dim/highlight nodes
    d3.select(svg).selectAll<SVGGElement, GraphNode>('.node')
      .transition().duration(200)
      .attr('opacity', d => connectedNodes.has(d.id) ? 1 : 0.15);

    // Dim/highlight links
    d3.select(svg).selectAll<SVGLineElement, GraphLink>('.links line')
      .transition().duration(200)
      .attr('stroke-opacity', (d, i) => connectedLinks.has(i) ? 0.8 : 0.05);

    // Dim/highlight link labels
    d3.select(svg).selectAll<SVGTextElement, GraphLink>('.link-labels text')
      .transition().duration(200)
      .attr('opacity', (_d, i) => connectedLinks.has(i) ? 0.9 : 0.05);

  }, [hoveredNode, selectedNode, getConnectedIds]);

  // ─── Tooltip click outside to dismiss ─────────────────────────
  useEffect(() => {
    const handler = () => {
      if (selectedNode) {
        setSelectedNode(null);
        setTooltip(null);
      }
    };
    // Close tooltip on background click
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('click', handler);
      return () => svg.removeEventListener('click', handler);
    }
  }, [selectedNode]);

  const w = dimensions.width;
  const h = dimensions.height;

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: propHeight ?? 500 }}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
        aria-label="Ontology network graph showing relationships between Malaysia data objects"
        role="img"
      />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: Math.min(tooltip.x, w - 200),
            top: tooltip.y - 130,
          }}
        >
          <div
            className="rounded-lg border p-3 min-w-[180px] max-w-[260px]"
            style={{
              background: 'rgba(10,14,26,0.97)',
              borderColor: NODE_COLORS[tooltip.node.type] + '40',
              boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 20px ${NODE_COLORS[tooltip.node.type]}20`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: NODE_COLORS[tooltip.node.type],
                  boxShadow: `0 0 6px ${NODE_COLORS[tooltip.node.type]}60`,
                }}
              />
              <span className="text-[11px] font-bold font-mono" style={{ color: '#e0f7fa' }}>
                {tooltip.node.label}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'ID' : 'ID'}
                </span>
                <span className="text-[9px] font-mono" style={{ color: '#b0bec5' }}>
                  {tooltip.node.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'Jenis' : 'Type'}
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    color: NODE_COLORS[tooltip.node.type],
                    background: NODE_COLORS[tooltip.node.type] + '15',
                    border: `1px solid ${NODE_COLORS[tooltip.node.type]}25`,
                  }}
                >
                  {tooltip.node.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono" style={{ color: '#8899aa' }}>
                  {lang === 'ms' ? 'Keyakinan' : 'Confidence'}
                </span>
                <span className="text-[9px] font-mono font-bold" style={{ color: confidenceColor(tooltip.node.confidence) }}>
                  {(tooltip.node.confidence * 100).toFixed(0)}%
                </span>
              </div>
              {tooltip.node.alert && (
                <div className="flex items-center gap-1.5 pt-1 mt-1" style={{ borderTop: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 4px rgba(239,68,68,0.6)' }} />
                  <span className="text-[9px] font-mono" style={{ color: '#ef4444' }}>
                    {tooltip.node.alert}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Legend (bottom-left) ──────────────────────────────── */}
      <div
        className="absolute bottom-3 left-3 rounded-lg border p-3"
        style={{
          background: 'rgba(10,14,26,0.92)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(8px)',
          maxWidth: 220,
        }}
      >
        <div className="text-[9px] font-mono font-bold tracking-wider mb-2" style={{ color: '#06b6d4' }}>
          {lang === 'ms' ? 'LEGENDA' : 'LEGEND'}
        </div>

        {/* Node types */}
        <div className="space-y-1 mb-2.5">
          <div className="text-[8px] font-mono tracking-wider" style={{ color: '#6b7280' }}>
            {lang === 'ms' ? 'Jenis Nod' : 'NODE TYPES'}
          </div>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}40` }} />
              <span className="text-[8px] font-mono capitalize" style={{ color: '#b0bec5' }}>
                {type.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>

        {/* Link types */}
        <div className="space-y-1">
          <div className="text-[8px] font-mono tracking-wider" style={{ color: '#6b7280' }}>
            {lang === 'ms' ? 'Jenis Pautan' : 'LINK TYPES'}
          </div>
          {Object.entries(LINK_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="w-4 h-0"
                style={{
                  borderTop: type === 'INVERSELY_CORRELATES'
                    ? `1.5px dashed ${color}`
                    : `1.5px solid ${color}`,
                }}
              />
              <span className="text-[8px] font-mono" style={{ color: '#b0bec5' }}>
                {type.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mini stats (top-right) ────────────────────────────── */}
      <div
        className="absolute top-3 right-3 rounded-lg border p-2"
        style={{
          background: 'rgba(10,14,26,0.92)',
          borderColor: 'rgba(6,182,212,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] font-mono font-bold" style={{ color: '#06b6d4' }}>
              {NODES.length}
            </div>
            <div className="text-[7px] font-mono" style={{ color: '#6b7280' }}>
              {lang === 'ms' ? 'NOD' : 'NODES'}
            </div>
          </div>
          <div className="w-px h-6" style={{ background: 'rgba(6,182,212,0.12)' }} />
          <div className="text-center">
            <div className="text-[10px] font-mono font-bold" style={{ color: '#10b981' }}>
              {LINKS.length}
            </div>
            <div className="text-[7px] font-mono" style={{ color: '#6b7280' }}>
              {lang === 'ms' ? 'PAUTAN' : 'LINKS'}
            </div>
          </div>
          <div className="w-px h-6" style={{ background: 'rgba(6,182,212,0.12)' }} />
          <div className="text-center">
            <div className="text-[10px] font-mono font-bold" style={{ color: '#F59E0B' }}>
              {NODES.filter(n => n.alert).length}
            </div>
            <div className="text-[7px] font-mono" style={{ color: '#6b7280' }}>
              {lang === 'ms' ? 'AMARAN' : 'ALERTS'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OntologyGraph;
