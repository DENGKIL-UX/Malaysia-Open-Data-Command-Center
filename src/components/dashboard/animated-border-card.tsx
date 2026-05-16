'use client';

import { motion } from 'framer-motion';

// ─── Animated Border Card ─────────────────────────────────────────
interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: string;
}

export function AnimatedBorderCard({ children, className = '', accentColor = '#06b6d4' }: AnimatedBorderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        border: `1px solid ${accentColor}20`,
      }}
    >
      {/* Animated gradient border accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)` }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {children}
    </motion.div>
  );
}

export default AnimatedBorderCard;
