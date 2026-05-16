'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { STATES } from '@/lib/data/malaysia-data';
import type { Lang } from '@/lib/dashboard-types';

interface StateSearchProps {
  lang: Lang;
  onSelect: (stateId: string) => void;
}

export function StateSearch({ lang, onSelect }: StateSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredStates = useMemo(() => {
    if (!query.trim()) return STATES.slice(0, 8);
    const q = query.toLowerCase().trim();
    const results = STATES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.name_ms.toLowerCase().includes(q) ||
      s.abbr.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
    return results.slice(0, 8);
  }, [query]);

  const maxPopulation = useMemo(() => Math.max(...STATES.map(s => s.population)), []);

  const handleSelect = useCallback((stateId: string) => {
    onSelect(stateId);
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  }, [onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || filteredStates.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredStates.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev <= 0 ? filteredStates.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredStates.length) {
          handleSelect(filteredStates[selectedIndex].id);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, filteredStates, selectedIndex, handleSelect]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex < 0 || !dropdownRef.current) return;
    const items = dropdownRef.current.querySelectorAll('[data-search-item]');
    if (items[selectedIndex]) {
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'rgba(6,182,212,0.5)' }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={lang === 'ms' ? 'Cari negeri...' : 'Search states...'}
          className="w-full pl-9 pr-3 py-2 rounded-md border text-[11px] font-mono tracking-wide outline-none transition-all duration-200"
          style={{
            background: 'rgba(10,14,26,0.9)',
            borderColor: isOpen ? 'rgba(6,182,212,0.4)' : 'rgba(6,182,212,0.15)',
            color: '#e0f7fa',
            boxShadow: isOpen ? '0 0 12px rgba(6,182,212,0.1)' : 'none',
          }}
        />
        {/* Keyboard hint */}
        {query.length === 0 && !isOpen && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1 py-0.5 rounded"
            style={{ color: 'rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.06)' }}
          >
            ↑↓
          </span>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && filteredStates.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-1 rounded-md border overflow-hidden z-50"
            style={{
              background: 'rgba(10,14,26,0.97)',
              borderColor: 'rgba(6,182,212,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(6,182,212,0.08)',
              transformOrigin: 'top',
            }}
          >
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {filteredStates.map((state, i) => {
                const isSelected = i === selectedIndex;
                const popPercent = (state.population / maxPopulation) * 100;
                return (
                  <div
                    key={state.id}
                    data-search-item
                    onClick={() => handleSelect(state.id)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-all duration-100"
                    style={{
                      background: isSelected ? 'rgba(6,182,212,0.12)' : 'transparent',
                      borderLeft: isSelected ? '2px solid #06b6d4' : '2px solid transparent',
                    }}
                  >
                    {/* State abbreviation */}
                    <span
                      className="text-[10px] font-mono font-bold w-8 text-center px-1 py-0.5 rounded flex-shrink-0"
                      style={{
                        color: isSelected ? '#06b6d4' : 'rgba(6,182,212,0.6)',
                        background: isSelected ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.06)',
                      }}
                    >
                      {state.abbr}
                    </span>

                    {/* State name + population indicator */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-mono truncate"
                          style={{ color: isSelected ? '#e0f7fa' : '#b8c5d4' }}
                        >
                          {lang === 'ms' ? state.name_ms : state.name}
                        </span>
                        {state.region === 'east_malaysia' && (
                          <span
                            className="text-[7px] font-mono px-1 py-0.5 rounded flex-shrink-0"
                            style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                          >
                            E.MY
                          </span>
                        )}
                      </div>
                      {/* Tiny population indicator bar */}
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(6,182,212,0.08)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${popPercent}%`,
                              background: isSelected ? '#06b6d4' : 'rgba(6,182,212,0.3)',
                              boxShadow: isSelected ? '0 0 4px rgba(6,182,212,0.4)' : 'none',
                            }}
                          />
                        </div>
                        <span className="text-[8px] font-mono flex-shrink-0" style={{ color: 'rgba(6,182,212,0.4)' }}>
                          {(state.population / 1000).toFixed(1)}M
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer hint */}
            <div
              className="px-3 py-1.5 border-t flex items-center gap-3"
              style={{ borderColor: 'rgba(6,182,212,0.08)', background: 'rgba(6,182,212,0.02)' }}
            >
              <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                ↑↓ Navigate
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                ↵ Select
              </span>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
                ESC Close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StateSearch;
