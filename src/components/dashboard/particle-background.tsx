'use client';

import { useMemo } from 'react';

// ─── Particle Background ─────────────────────────────────────────
export function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1,
      opacity: 0.1 + Math.random() * 0.3,
      duration: 30 + Math.random() * 30,
      delay: Math.random() * -60,
      driftX: (Math.random() - 0.5) * 20,
      driftY: (Math.random() - 0.5) * 20,
    })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <style>{`
        @keyframes particle-drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(var(--drift-x), var(--drift-y)); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: '#06b6d4',
            opacity: p.opacity,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── HUD Bracket Decoration ──────────────────────────────────────
export function HUDBracket() {
  return (
    <>
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 pointer-events-none" />
    </>
  );
}

export default ParticleBackground;
