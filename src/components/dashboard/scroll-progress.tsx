'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  enabled: boolean;
}

export function ScrollProgress({ enabled }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0"
      style={{
        height: '3px',
        zIndex: 50,
        background: 'rgba(10,14,26,0.8)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <motion.div
        className="h-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #06b6d4, #10b981, #06b6d4)',
          boxShadow: '0 0 8px rgba(6,182,212,0.5)',
        }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </motion.div>
  );
}
