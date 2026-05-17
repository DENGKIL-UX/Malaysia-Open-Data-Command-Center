// src/lib/dosm/direct-download.ts
// Direct CSV download from storage.data.gov.my
// Every dataset in datagovmy-meta has direct Parquet + CSV links
// These are MORE reliable than the API for bulk data and bypass rate limits
//
// URL pattern:
//   https://storage.data.gov.my/data-catalogue/{dataset_id}.csv
//   https://storage.data.gov.my/data-catalogue/{dataset_id}.parquet
//   https://storage.data.gov.my/data-catalogue/{dataset_id}_preview.parquet

import { parseDosmDate } from './yaml-reality';

// ── DIRECT DOWNLOAD URL BUILDERS ──
export const DIRECT_DOWNLOAD = {
  csv: (datasetId: string): string =>
    `https://storage.data.gov.my/data-catalogue/${datasetId}.csv`,

  parquet: (datasetId: string): string =>
    `https://storage.data.gov.my/data-catalogue/${datasetId}.parquet`,

  preview: (datasetId: string): string =>
    `https://storage.data.gov.my/data-catalogue/${datasetId}_preview.parquet`,
} as const;

// ── FETCH DoSM CSV DIRECTLY ──
// This is Tier 2 of the three-tier fallback strategy (API → CSV → Static)
export async function fetchDosmCSV(
  datasetId: string,
  valueField: string,
  dateField: string,
  options: {
    limit?: number;
    filters?: Record<string, string>;
    sortField?: string;
    sortAsc?: boolean;
  } = {}
): Promise<{
  data: Record<string, unknown>[];
  fields: string[];
  source: 'csv_direct';
  url: string;
  fetchedAt: Date;
}> {
  const url = DIRECT_DOWNLOAD.csv(datasetId);

  const res = await fetch(url, {
    headers: { Accept: 'text/csv, text/plain' },
    next: { revalidate: 300 }, // 5 min cache
  });

  if (!res.ok) {
    throw new Error(`CSV download failed: ${res.status} for ${url}`);
  }

  const csvText = await res.text();
  const allData = parseCSV(csvText);

  if (!allData.length) {
    throw new Error(`Empty CSV for ${datasetId}`);
  }

  // Apply filters
  let filtered = allData;
  if (options.filters) {
    filtered = allData.filter(row =>
      Object.entries(options.filters!).every(
        ([k, v]) => String(row[k]).toLowerCase() === v.toLowerCase()
      )
    );
  }

  // Sort by date (default: descending = latest first)
  const sortAsc = options.sortAsc ?? false;
  const sorted = filtered.sort((a, b) => {
    const dateA = parseDosmDate(String(a[dateField])).getTime();
    const dateB = parseDosmDate(String(b[dateField])).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  // Apply limit
  const limited = options.limit ? sorted.slice(0, options.limit) : sorted;

  return {
    data: limited,
    fields: Object.keys(allData[0] ?? {}),
    source: 'csv_direct',
    url,
    fetchedAt: new Date(),
  };
}

// ── MINIMAL CSV PARSER ──
// Handles standard CSV with header row, comma-separated values
// Respects quoted fields with commas inside
function parseCSV(text: string): Record<string, unknown>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line);
      const row: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        const raw = (values[i] ?? '').trim().replace(/^"|"$/g, '');
        // Auto-cast numbers
        if (raw !== '' && !isNaN(Number(raw)) && raw !== '') {
          row[h] = Number(raw);
        } else {
          row[h] = raw;
        }
      });
      return row;
    })
    .filter(row => Object.keys(row).length > 0);
}

// ── CSV LINE PARSER (respects quoted fields) ──
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
