'use client';

import { ExternalLink, Github } from 'lucide-react';
import type { Lang } from '@/lib/dashboard-types';

interface GitHubSourceLinkProps {
  datasetId: string;
  lang?: Lang;
  showLabel?: boolean;
}

export function GitHubSourceLink({ datasetId, lang = 'en', showLabel = true }: GitHubSourceLinkProps) {
  const metaUrl = `https://github.com/data-gov-my/datagovmy-meta/blob/main/data-catalogue/${datasetId}.json`;
  const dataGovUrl = `https://data.gov.my/data-catalogue/${datasetId}`;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <a
        href={metaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: '9px',
          fontFamily: 'monospace',
          color: '#06b6d4',
          textDecoration: 'none',
          padding: '2px 6px',
          borderRadius: 3,
          background: 'rgba(6,182,212,0.06)',
          border: '1px solid rgba(6,182,212,0.15)',
        }}
      >
        <Github size={10} />
        {showLabel && (lang === 'ms' ? 'Meta GitHub' : 'GitHub Meta')}
        <ExternalLink size={7} />
      </a>
      <a
        href={dataGovUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: '9px',
          fontFamily: 'monospace',
          color: '#f59e0b',
          textDecoration: 'none',
          padding: '2px 6px',
          borderRadius: 3,
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
        }}
      >
        {showLabel && (lang === 'ms' ? 'data.gov.my' : 'data.gov.my')}
        <ExternalLink size={7} />
      </a>
    </div>
  );
}
