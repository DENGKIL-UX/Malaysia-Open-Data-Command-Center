'use client';

import { ExternalLink, Download, Clock, Database, Github, FileDown, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDosmCatalogue } from '@/hooks/useDosmData';
import type { Lang } from '@/lib/dashboard-types';

// ---------------------------------------------------------------------------
// Skeleton loader shown while metadata is being fetched
// ---------------------------------------------------------------------------
function MetadataSkeleton() {
  return (
    <div className="rounded-md border p-3 space-y-3" style={{
      background: 'rgba(10,14,26,0.8)',
      borderColor: 'rgba(6,182,212,0.08)',
    }}>
      {/* Title skeleton */}
      <div className="space-y-1.5">
        <div className="h-3 w-24 rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.15)' }} />
        <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.1)' }} />
      </div>
      {/* Description skeleton */}
      <div className="space-y-1">
        <div className="h-3 w-full rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.08)' }} />
        <div className="h-3 w-2/3 rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.08)' }} />
      </div>
      {/* Badges skeleton */}
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.08)' }} />
        <div className="h-5 w-20 rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.08)' }} />
      </div>
      {/* Link skeletons */}
      <div className="space-y-2">
        <div className="h-8 w-full rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.06)' }} />
        <div className="h-8 w-full rounded animate-pulse" style={{ background: 'rgba(6,182,212,0.06)' }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface DatasetMetadataPanelProps {
  /** Dataset ID used to fetch metadata from GitHub */
  datasetId: string;
  /** Current language for bilingual labels */
  lang: Lang;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DatasetMetadataPanel({ datasetId, lang }: DatasetMetadataPanelProps) {
  const { data, isLoading, isError, error, refetch } = useDosmCatalogue(datasetId);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="rounded-md border p-3" style={{
        background: 'rgba(6,182,212,0.03)',
        borderColor: 'rgba(6,182,212,0.08)',
      }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Database size={12} style={{ color: '#06b6d4' }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
            {lang === 'ms' ? 'META GITHUB' : 'GITHUB META'}
          </span>
          <motion.span
            className="ml-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={10} style={{ color: '#06b6d4' }} />
          </motion.span>
        </div>
        <MetadataSkeleton />
      </div>
    );
  }

  // ── Error state ──
  if (isError) {
    return (
      <div className="rounded-md border p-3" style={{
        background: 'rgba(10,14,26,0.8)',
        borderColor: 'rgba(239,68,68,0.15)',
      }}>
        <div className="flex items-center gap-1.5 mb-2">
          <AlertCircle size={12} style={{ color: '#ef4444' }} />
          <span className="text-[10px] font-mono tracking-wider" style={{ color: '#ef4444' }}>
            {lang === 'ms' ? 'META GITHUB' : 'GITHUB META'}
          </span>
        </div>
        <p className="text-[10px] font-mono mb-2" style={{ color: 'rgba(239,68,68,0.7)' }}>
          {lang === 'ms'
            ? 'Metadata GitHub tidak tersedia'
            : 'GitHub metadata unavailable'}
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border transition-colors hover:border-cyan-500/30"
          style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
        >
          <RefreshCw size={9} />
          {lang === 'ms' ? 'Cuba lagi' : 'Retry'}
        </button>
      </div>
    );
  }

  // ── No data (shouldn't normally happen) ──
  if (!data) return null;

  const isMs = lang === 'ms';
  const title = isMs ? data.title_ms : data.title_en;
  const description = isMs ? data.description_ms : data.description_en;
  const freqLabel = isMs ? data.frequencyLabel.ms : data.frequencyLabel.en;
  const githubMetaUrl = `https://github.com/data-gov-my/datagovmy-meta/blob/main/data-catalogue/${datasetId}.json`;

  return (
    <div className="rounded-md border p-3 space-y-3" style={{
      background: 'rgba(6,182,212,0.03)',
      borderColor: 'rgba(6,182,212,0.12)',
    }}>
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <Database size={12} style={{ color: '#06b6d4' }} />
        <span className="text-[10px] font-mono tracking-wider" style={{ color: '#06b6d4' }}>
          {isMs ? 'META GITHUB' : 'GITHUB META'}
        </span>
        <span className="ml-auto text-[7px] font-mono px-1.5 py-0.5 rounded" style={{
          background: 'rgba(6,182,212,0.1)',
          color: '#06b6d4',
          border: '1px solid rgba(6,182,212,0.15)',
        }}>
          LIVE
        </span>
      </div>

      {/* Live Title from GitHub */}
      {title && title !== datasetId && (
        <div>
          <span className="text-[9px] font-mono block mb-0.5" style={{ color: 'rgba(6,182,212,0.5)' }}>
            {isMs ? 'Tajuk (GitHub)' : 'Title (GitHub)'}
          </span>
          <span className="text-xs font-mono font-bold" style={{ color: '#e0f7fa' }}>
            {title}
          </span>
        </div>
      )}

      {/* Live Description from GitHub (if different from local) */}
      {description && (
        <p className="text-[10px] leading-relaxed" style={{ color: '#b8c5d4' }}>
          {description}
        </p>
      )}

      {/* Frequency badge */}
      <div className="flex flex-wrap items-center gap-2">
        {freqLabel && (
          <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded font-mono" style={{
            background: 'rgba(6,182,212,0.08)',
            color: '#06b6d4',
            border: '1px solid rgba(6,182,212,0.15)',
          }}>
            <Clock size={9} />
            {freqLabel}
          </span>
        )}
        {data.lastFetched && (
          <span className="text-[8px] font-mono" style={{ color: 'rgba(6,182,212,0.3)' }}>
            {isMs ? 'Diambil pada' : 'Fetched'} {new Date(data.lastFetched).toLocaleTimeString(isMs ? 'ms-MY' : 'en-MY')}
          </span>
        )}
      </div>

      {/* Date Range */}
      {data.dateRange?.start && data.dateRange?.end && (
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono" style={{ color: '#10b981' }}>
            {data.dateRange.start} → {data.dateRange.end}
          </span>
        </div>
      )}

      {/* Download links from GitHub metadata */}
      <div className="space-y-1.5">
        {data.link_csv && (
          <a
            href={data.link_csv}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[10px] font-mono transition-all hover:border-cyan-500/30"
            style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
          >
            <Download size={10} />
            <span>CSV</span>
            <span className="ml-auto text-[7px] opacity-40 truncate max-w-[120px]">{data.link_csv.split('/').pop()}</span>
          </a>
        )}
        {data.link_parquet && (
          <a
            href={data.link_parquet}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[10px] font-mono transition-all hover:border-cyan-500/30"
            style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}
          >
            <Download size={10} />
            <span>Parquet</span>
            <span className="ml-auto text-[7px] opacity-40 truncate max-w-[120px]">{data.link_parquet.split('/').pop()}</span>
          </a>
        )}
      </div>

      {/* View on GitHub link */}
      <a
        href={githubMetaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[9px] font-mono transition-colors hover:text-cyan-300"
        style={{ color: 'rgba(6,182,212,0.6)' }}
      >
        <Github size={10} />
        {isMs ? 'Lihat di GitHub' : 'View on GitHub'}
        <ExternalLink size={7} />
      </a>
    </div>
  );
}
