'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

interface FlowLine {
  id: string;
  fromSelector: string;
  toSelector: string;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
}

interface DataFlowLinesProps {
  enabled: boolean;
}

// Define connections between elements using CSS selectors
const FLOW_CONNECTIONS: { id: string; from: string; to: string }[] = [
  { id: 'pop-kpi-to-chart', from: '[data-flow="kpi-population"]', to: '[data-flow="chart-popgdp"]' },
  { id: 'gdp-kpi-to-chart', from: '[data-flow="kpi-gdp"]', to: '[data-flow="chart-popgdp"]' },
  { id: 'engine-to-feed', from: '[data-flow="data-engine"]', to: '[data-flow="activity-feed"]' },
  { id: 'health-to-cards', from: '[data-flow="health-index"]', to: '[data-flow="state-cards"]' },
];

function calculateFlowPositions(enabled: boolean): { lines: FlowLine[]; isDesktop: boolean } {
  if (!enabled) {
    return { lines: [], isDesktop: false };
  }

  // Check if desktop (lg breakpoint = 1024px)
  const isDesktop = window.innerWidth >= 1024;

  if (!isDesktop) {
    return { lines: [], isDesktop };
  }

  const newLines: FlowLine[] = [];

  for (const conn of FLOW_CONNECTIONS) {
    const fromEl = document.querySelector(conn.from);
    const toEl = document.querySelector(conn.to);

    if (fromEl && toEl) {
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      // Calculate center-bottom of from element and center-top of to element
      const fromX = fromRect.left + fromRect.width / 2;
      const fromY = fromRect.bottom;
      const toX = toRect.left + toRect.width / 2;
      const toY = toRect.top;

      // Only draw line if both elements are visible in viewport area
      if (fromY < window.innerHeight && toY > 0) {
        newLines.push({
          id: conn.id,
          fromSelector: conn.from,
          toSelector: conn.to,
          fromPos: { x: fromX, y: fromY },
          toPos: { x: toX, y: toY },
        });
      }
    }
  }

  return { lines: newLines, isDesktop };
}

export function DataFlowLines({ enabled }: DataFlowLinesProps) {
  const [lines, setLines] = useState<FlowLine[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const animationFrameRef = useRef<number>(0);

  const updatePositions = useCallback(() => {
    const result = calculateFlowPositions(enabled);
    setLines(result.lines);
    setIsDesktop(result.isDesktop);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial calculation (deferred to avoid synchronous setState in effect)
    const initialRaf = requestAnimationFrame(updatePositions);

    // Recalculate on resize
    const handleResize = () => {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(updatePositions);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Also recalculate periodically as content may shift (layout changes, etc.)
    const intervalId = setInterval(updatePositions, 3000);

    return () => {
      cancelAnimationFrame(initialRaf);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      clearInterval(intervalId);
    };
  }, [enabled, updatePositions]);

  if (!enabled || !isDesktop || lines.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      <style>{`
        @keyframes flow-dash {
          to { stroke-dashoffset: -20; }
        }
        @keyframes flow-dot-fade {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          {lines.map(line => (
            <path
              key={`path-${line.id}`}
              id={`flow-path-${line.id}`}
              d={createPath(line.fromPos, line.toPos)}
              fill="none"
              stroke="rgba(6,182,212,0.15)"
              strokeWidth="1"
              strokeDasharray="6 4"
              style={{
                animation: 'flow-dash 1.5s linear infinite',
              }}
            />
          ))}
        </defs>

        {lines.map(line => {
          const pathD = createPath(line.fromPos, line.toPos);
          return (
            <g key={line.id}>
              {/* Flowing dashed line */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(6,182,212,0.15)"
                strokeWidth="1"
                strokeDasharray="6 4"
                style={{
                  animation: 'flow-dash 1.5s linear infinite',
                }}
              />
              {/* Animated dot traveling along the path */}
              <circle r="2" fill="#06b6d4" style={{ animation: 'flow-dot-fade 2s ease-in-out infinite' }}>
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path={pathD}
                />
              </circle>
              {/* Start point indicator */}
              <circle
                cx={line.fromPos.x}
                cy={line.fromPos.y}
                r="2"
                fill="rgba(6,182,212,0.3)"
              />
              {/* End point indicator */}
              <circle
                cx={line.toPos.x}
                cy={line.toPos.y}
                r="2"
                fill="rgba(6,182,212,0.3)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Create a smooth bezier curve path between two points
function createPath(from: { x: number; y: number }, to: { x: number; y: number }): string {
  const controlOffset = Math.abs(to.y - from.y) * 0.3;

  return `M ${from.x} ${from.y} C ${from.x} ${from.y + controlOffset}, ${to.x} ${to.y - controlOffset}, ${to.x} ${to.y}`;
}

export default DataFlowLines;
