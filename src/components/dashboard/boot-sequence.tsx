'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: 'INITIALIZING OPEN DATA COMMAND CENTER...', color: 'cyan' as const },
  { text: 'CONNECTING TO data.gov.my API...', color: 'cyan' as const },
  { text: 'LOADING 287 DATASETS...', color: 'cyan' as const },
  { text: 'SYNCING GEOSPATIAL BOUNDARIES...', color: 'cyan' as const },
  { text: 'CALIBRATING ANALYTICS ENGINE...', color: 'cyan' as const },
  { text: 'SYSTEM ONLINE — WELCOME, OPERATOR', color: 'green' as const },
];

const COLOR_MAP = {
  cyan: '#06b6d4',
  green: '#10b981',
};

function PulseAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Concentric pulse rings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: `rgba(6, 182, 212, ${0.3 - i * 0.05})`,
            borderWidth: 1,
          }}
          initial={{ width: 40, height: 40, opacity: 0 }}
          animate={{
            width: [40, 200 + i * 80],
            height: [40, 200 + i * 80],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Center core glow */}
      <motion.div
        className="absolute w-6 h-6 rounded-full"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          boxShadow: '0 0 30px 10px rgba(6, 182, 212, 0.3)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sound wave bars */}
      <div className="absolute flex items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full"
            style={{ backgroundColor: '#06b6d4' }}
            animate={{
              height: [8, 24 + Math.random() * 20, 8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ScanLineOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal scan line moving down */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4), transparent)',
          boxShadow: '0 0 10px 2px rgba(6, 182, 212, 0.1)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

function TypingLine({
  text,
  color,
  delay,
  onComplete: onLineComplete,
}: {
  text: string;
  color: 'cyan' | 'green';
  delay: number;
  onComplete: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Hide cursor after typing is done
          setTimeout(() => setShowCursor(false), 300);
          onLineComplete();
        }
      }, 18);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, onLineComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className="font-mono text-sm md:text-base flex items-center"
      style={{ color: COLOR_MAP[color] }}
    >
      <span className="mr-2 opacity-60">&gt;</span>
      <span>{displayedText}</span>
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="ml-px"
        >
          _
        </motion.span>
      )}
      {color === 'green' && !showCursor && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="ml-2"
        >
          &#10003;
        </motion.span>
      )}
    </motion.div>
  );
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);

  const handleLineComplete = useCallback(() => {
    setVisibleLines((prev) => {
      const next = prev + 1;
      return next;
    });
  }, []);

  // Progressive reveal of lines
  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, visibleLines === 0 ? 400 : 500);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  // Progress bar animation
  useEffect(() => {
    const totalDuration = 3500; // 3.5 seconds
    const interval = 50;
    const increment = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment + Math.random() * increment * 0.5;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Complete boot sequence
  useEffect(() => {
    if (progress >= 100 && visibleLines >= BOOT_LINES.length && !bootComplete) {
      const timer = setTimeout(() => {
        setBootComplete(true);
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, visibleLines, bootComplete, onComplete]);

  return (
    <AnimatePresence>
      {!bootComplete ? null : null}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0a0e1a' }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <ScanLineOverlay />

        {/* Pulse animation in center background */}
        <PulseAnimation />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl px-6">
          {/* Logo / System designation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <motion.div
              className="text-xs font-mono tracking-[0.3em] mb-2"
              style={{ color: 'rgba(6, 182, 212, 0.5)' }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              DATA.GOV.MY
            </motion.div>
            <div
              className="text-2xl md:text-3xl font-bold tracking-wider"
              style={{
                color: '#06b6d4',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)',
              }}
            >
              MALAYSIA OPEN DATA
            </div>
            <div
              className="text-2xl md:text-3xl font-bold tracking-wider"
              style={{
                color: '#06b6d4',
                textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.2)',
              }}
            >
              COMMAND CENTER
            </div>
          </motion.div>

          {/* Terminal output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full rounded border p-4 md:p-6 font-mono space-y-2"
            style={{
              backgroundColor: 'rgba(6, 182, 212, 0.03)',
              borderColor: 'rgba(6, 182, 212, 0.15)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.05), inset 0 0 20px rgba(6, 182, 212, 0.02)',
            }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
              <span className="ml-2 text-xs" style={{ color: 'rgba(6, 182, 212, 0.4)' }}>
                system@data-command-center ~ $
              </span>
            </div>

            {/* Boot lines with typing effect */}
            {BOOT_LINES.slice(0, Math.min(visibleLines, BOOT_LINES.length)).map((line, index) => (
              <TypingLine
                key={index}
                text={line.text}
                color={line.color}
                delay={index * 80}
                onComplete={handleLineComplete}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono" style={{ color: 'rgba(6, 182, 212, 0.5)' }}>
                SYSTEM INITIALIZATION
              </span>
              <span className="text-xs font-mono" style={{ color: '#06b6d4' }}>
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #06b6d4, #10b981)',
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
                  width: `${Math.min(progress, 100)}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress >= 100 ? 1 : 0 }}
            className="text-xs font-mono text-center"
            style={{
              color: '#10b981',
              textShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          >
            {progress >= 100 ? '● ALL SYSTEMS OPERATIONAL' : ''}
          </motion.div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 opacity-30" style={{ borderColor: '#06b6d4' }} />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 opacity-30" style={{ borderColor: '#06b6d4' }} />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 opacity-30" style={{ borderColor: '#06b6d4' }} />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 opacity-30" style={{ borderColor: '#06b6d4' }} />

        {/* Version info */}
        <motion.div
          className="absolute bottom-6 text-xs font-mono"
          style={{ color: 'rgba(6, 182, 212, 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          v3.0.0 | BUILD 2025.07 | UTC+08:00
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
