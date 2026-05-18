'use client';

import type { DataSourceTier } from '@/lib/dosm/dosm-data-source';
import { getDataSourceBadge } from '@/lib/dosm/dosm-data-source';

interface DataSourceBadgeProps {
  source: DataSourceTier;
  lang?: 'en' | 'ms';
  size?: 'sm' | 'md';
  showDescription?: boolean;
}

export function DataSourceBadge({ source, lang = 'en', size = 'sm', showDescription = false }: DataSourceBadgeProps) {
  const badge = getDataSourceBadge(source);
  if (!badge) return null;
  
  const labelMap: Record<DataSourceTier, { en: string; ms: string }> = {
    static_json: { en: 'Static', ms: 'Statik' },
    github_meta: { en: 'GitHub', ms: 'GitHub' },
    dosm_storage: { en: 'DOSM Storage', ms: 'Storan DOSM' },
    dosm_api: { en: 'DOSM API', ms: 'API DOSM' },
    csv_fallback: { en: 'CSV Fallback', ms: 'CSV Sandaran' },
  };
  
  const label = labelMap[source]?.[lang] || badge.label;
  const fontSize = size === 'sm' ? '8px' : '10px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';
  
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize,
        fontFamily: 'monospace',
        padding,
        borderRadius: 3,
        background: `${badge.color}12`,
        border: `1px solid ${badge.color}30`,
        color: badge.color,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: badge.color, boxShadow: `0 0 4px ${badge.color}60` }} />
      {label}
      {showDescription && (
        <span style={{ color: `${badge.color}80`, fontSize: '7px' }}>
          {badge.description}
        </span>
      )}
    </span>
  );
}
