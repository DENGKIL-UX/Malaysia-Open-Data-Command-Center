'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Radio, Shield, Wifi } from 'lucide-react';
import { TIMELINE_EVENTS } from '@/lib/data/malaysia-data';

function LiveClock() {
  const [time, setTime] = useState<string>('--:--:--');
  const [date, setDate] = useState<string>('---, -- --- ----');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Malaysia Time (UTC+8)
      const mytTime = new Date(now.getTime() + 8 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000);
      const hours = mytTime.getHours().toString().padStart(2, '0');
      const minutes = mytTime.getMinutes().toString().padStart(2, '0');
      const seconds = mytTime.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Kuala_Lumpur',
      };
      setDate(mytTime.toLocaleDateString('en-MY', options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <div
        className="text-xl md:text-2xl font-mono font-bold tracking-wider"
        style={{
          color: '#06b6d4',
          textShadow: '0 0 10px rgba(6, 182, 212, 0.5)',
        }}
      >
        {time}
        <span className="text-xs ml-1 opacity-60 font-normal">MYT</span>
      </div>
      <div className="text-[10px] font-mono opacity-50" style={{ color: '#06b6d4' }}>
        {date} | UTC+08:00
      </div>
    </div>
  );
}

function StatusIndicators() {
  return (
    <div className="flex items-center gap-4">
      {/* System Online — enhanced pulse */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full"
            style={{ border: '1px solid rgba(16, 185, 129, 0.4)' }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#10b981' }}>
          SYSTEM ONLINE
        </span>
      </div>

      {/* API Status — enhanced pulse */}
      <div className="hidden md:flex items-center gap-2">
        <div className="relative">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full"
            style={{ border: '1px solid rgba(16, 185, 129, 0.3)' }}
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-wider" style={{ color: 'rgba(6, 182, 212, 0.7)' }}>
          API CONNECTED
        </span>
      </div>

      {/* Data Sync — enhanced pulse */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="relative">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.7)' }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          <motion.div
            className="absolute inset-0 w-2 h-2 rounded-full"
            style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </div>
        <span className="text-[10px] font-mono tracking-wider" style={{ color: 'rgba(6, 182, 212, 0.7)' }}>
          SYNC 287 DATASETS
        </span>
      </div>

      {/* Icons */}
      <div className="hidden sm:flex items-center gap-2">
        <Wifi size={12} style={{ color: '#06b6d4' }} />
        <Shield size={12} style={{ color: '#10b981' }} />
        <Activity size={12} style={{ color: '#06b6d4' }} />
        <Radio size={12} style={{ color: '#f59e0b' }} />
      </div>
    </div>
  );
}

function ScrollingTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerItems] = useState(() => {
    // Build ticker items from timeline events
    return TIMELINE_EVENTS.map(
      (event) => `[${event.date}] ${event.event_en}`
    );
  });

  return (
    <div
      className="w-full overflow-hidden h-6 flex items-center"
      style={{
        backgroundColor: 'rgba(6, 182, 212, 0.05)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.1)',
      }}
    >
      {/* Left label */}
      <div
        className="flex-shrink-0 px-3 h-full flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider"
        style={{
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          color: '#06b6d4',
          borderRight: '1px solid rgba(6, 182, 212, 0.15)',
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ●
        </motion.div>
        LIVE
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          ref={tickerRef}
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {/* Duplicate items for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="inline-block px-4 text-[10px] font-mono"
              style={{ color: 'rgba(6, 182, 212, 0.7)' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function GridScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent)',
          boxShadow: '0 0 8px 1px rgba(6, 182, 212, 0.05)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

export default function Header() {
  return (
    <header
      className="relative w-full flex-shrink-0"
      style={{ backgroundColor: '#0a0e1a' }}
    >
      {/* Grid scan overlay */}
      <GridScanOverlay />

      {/* Scrolling ticker */}
      <ScrollingTicker />

      {/* Main header content */}
      <div
        className="relative z-10 px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderBottom: '1px solid rgba(6, 182, 212, 0.15)' }}
      >
        {/* Left: Title section */}
        <div className="flex flex-col items-center md:items-start">
          <h1
            className="text-lg md:text-xl lg:text-2xl font-bold tracking-[0.15em] glow-text"
            style={{
              color: '#06b6d4',
              textShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.15)',
            }}
          >
            MALAYSIA DATA COMMAND CENTER
          </h1>
          {/* Gradient underline animation */}
          <div className="w-full h-0.5 mt-1 rounded-full overflow-hidden" style={{ maxWidth: '320px' }}>
            <div
              className="h-full w-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #06b6d4, #10b981, #06b6d4, transparent)',
                backgroundSize: '200% 100%',
                animation: 'gradient-underline 3s ease-in-out infinite',
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div
              className="h-px w-8"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.3)' }}
            />
            <span
              className="text-[10px] font-mono tracking-[0.2em] opacity-60"
              style={{ color: '#06b6d4' }}
            >
              POWERED BY data.gov.my
            </span>
            <div
              className="h-px w-8"
              style={{ backgroundColor: 'rgba(6, 182, 212, 0.3)' }}
            />
          </div>
        </div>

        {/* Center: Status indicators */}
        <div className="hidden md:flex">
          <StatusIndicators />
        </div>

        {/* Right: Live clock */}
        <LiveClock />
      </div>

      {/* Mobile status bar */}
      <div
        className="md:hidden px-4 py-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}
      >
        <StatusIndicators />
      </div>

      {/* Data stream animation — dots moving across bottom */}
      <div className="w-full h-3 overflow-hidden relative" style={{ background: 'rgba(6, 182, 212, 0.02)' }}>
        {/* Dots line 1 */}
        <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-3" style={{ animation: 'data-stream 20s linear infinite' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`d1-${i}`}
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: i % 5 === 0 ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.2)',
                boxShadow: i % 5 === 0 ? '0 0 4px rgba(6, 182, 212, 0.4)' : 'none',
              }}
            />
          ))}
        </div>
        {/* Dots line 2 (slower, offset) */}
        <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-5" style={{ animation: 'data-stream 30s linear infinite', animationDelay: '-10s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`d2-${i}`}
              className="w-0.5 h-0.5 rounded-full"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                boxShadow: i % 4 === 0 ? '0 0 3px rgba(16, 185, 129, 0.3)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3), rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.3), transparent)',
        }}
      />
    </header>
  );
}
