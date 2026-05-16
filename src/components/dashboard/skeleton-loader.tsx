'use client';

import React from 'react';

// ─── Shimmer Keyframes (inline) ──────────────────────────────────
const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(15,20,40,1) 25%, rgba(20,30,55,1) 50%, rgba(15,20,40,1) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

// Inject keyframes globally once
if (typeof document !== 'undefined' && !document.getElementById('skeleton-shimmer-keyframes')) {
  const style = document.createElement('style');
  style.id = 'skeleton-shimmer-keyframes';
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

// ─── SkeletonCard ─────────────────────────────────────────────────
interface SkeletonCardProps {
  width?: string;
  height?: string;
}

export function SkeletonCard({ width = '100%', height = '120px' }: SkeletonCardProps) {
  return (
    <div
      style={{
        width,
        height,
        ...shimmerStyle,
        borderRadius: 8,
        border: '1px solid rgba(6,182,212,0.08)',
      }}
    />
  );
}

// ─── SkeletonText ─────────────────────────────────────────────────
interface SkeletonTextProps {
  width?: string;
  lines?: number;
}

export function SkeletonText({ width = '80%', lines = 1 }: SkeletonTextProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => {
        // Vary width slightly per line for realism
        const lineVariation = lines > 1 ? Math.max(50, 100 - i * 8) : 100;
        const lineW = i === lines - 1 && lines > 1 ? `${lineVariation * 0.6}%` : width;
        return (
          <div
            key={i}
            style={{
              width: lineW,
              height: 10,
              ...shimmerStyle,
              borderRadius: 4,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── SkeletonChart ────────────────────────────────────────────────
export function SkeletonChart() {
  const barHeights = [65, 40, 80, 55, 90, 35, 70, 45];
  return (
    <div
      style={{
        width: '100%',
        height: 200,
        borderRadius: 8,
        border: '1px solid rgba(6,182,212,0.08)',
        background: 'rgba(10,14,26,0.6)',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Chart header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: 3, ...shimmerStyle }} />
        <div style={{ width: 120, height: 10, borderRadius: 4, ...shimmerStyle }} />
      </div>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flex: 1 }}>
        {barHeights.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              ...shimmerStyle,
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
      </div>
      {/* X-axis line */}
      <div style={{ height: 1, background: 'rgba(6,182,212,0.08)', width: '100%' }} />
    </div>
  );
}

// ─── SkeletonMap ──────────────────────────────────────────────────
export function SkeletonMap() {
  return (
    <div
      style={{
        width: '100%',
        height: 350,
        borderRadius: 8,
        border: '1px solid rgba(6,182,212,0.08)',
        background: 'rgba(10,14,26,0.6)',
        padding: 16,
        display: 'flex',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Map blob shape (Malaysia-like silhouette) */}
      <div style={{ flex: 3, position: 'relative' }}>
        {/* Peninsular blob */}
        <div
          style={{
            position: 'absolute',
            left: '15%',
            top: '20%',
            width: '35%',
            height: '60%',
            ...shimmerStyle,
            borderRadius: '40% 50% 45% 35%',
          }}
        />
        {/* East Malaysia blob */}
        <div
          style={{
            position: 'absolute',
            left: '60%',
            top: '25%',
            width: '25%',
            height: '50%',
            ...shimmerStyle,
            borderRadius: '45% 35% 50% 40%',
          }}
        />
        {/* South China Sea label placeholder */}
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '45%',
            width: 80,
            height: 8,
            ...shimmerStyle,
            borderRadius: 4,
            opacity: 0.5,
          }}
        />
      </div>
      {/* Sidebar placeholder */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ width: '80%', height: 10, borderRadius: 4, ...shimmerStyle }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 16, height: 10, borderRadius: 2, ...shimmerStyle }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, ...shimmerStyle }} />
          </div>
        ))}
      </div>
    </div>
  );
}
