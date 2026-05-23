// =============================================================================
// Dynamic Dataset Fetcher
// Fetches dataset catalogue from data-gov-my/datagovmy-meta (primary source)
// Falls back to static data if GitHub is unreachable
// =============================================================================

import { githubDOSMClient } from '../dosm/github-dosm-client';

// Type for dataset catalogue entries
export interface Dataset {
  id: string;
  title_en: string;
  title_ms: string;
  description_en: string;
  description_ms: string;
  frequency: string;
  geography: string[];
  demography: string[];
  dataset_begin: number;
  dataset_end: number;
  data_source: string[];
  category_en: string;
  category_ms: string;
  subcategory_en: string;
  subcategory_ms: string;
  category_sort: number;
  link_parquet?: string;
  link_csv?: string;
  last_updated?: string;
  data_as_of?: string;
}

// Cache for fetched datasets (5-minute TTL)
let datasetsCache: { data: Dataset[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Fetch all datasets from GitHub (data-gov-my/datagovmy-meta)
 * Falls back to static data if GitHub is unreachable
 */
export const fetchDatasets = async (): Promise<Dataset[]> => {
  // Return cached data if fresh
  if (datasetsCache && Date.now() - datasetsCache.timestamp < CACHE_TTL_MS) {
    return datasetsCache.data;
  }

  try {
    // Fetch dataset IDs from GitHub
    const datasetIds = await githubDOSMClient.getCatalogueIndex();
    
    // Fetch metadata for each dataset in parallel
    const datasets = await Promise.all(
      datasetIds.map(async (id) => {
        const meta = await githubDOSMClient.getDatasetMeta(id);
        if (!meta) return null;
        
        // Map GitHub metadata to Dataset interface
        return {
          id: meta.id,
          title_en: meta.title.en,
          title_ms: meta.title.ms,
          description_en: meta.description.en,
          description_ms: meta.description.ms,
          frequency: meta.frequency.id,
          geography: meta.geography,
          demography: meta.demography,
          dataset_begin: parseInt(meta.date_range.start),
          dataset_end: parseInt(meta.date_range.end),
          data_source: meta.source,
          category_en: meta.fields.find(f => f.id === 'category')?.description.en || '',
          category_ms: meta.fields.find(f => f.id === 'category')?.description.ms || '',
          subcategory_en: meta.fields.find(f => f.id === 'subcategory')?.description.en || '',
          subcategory_ms: meta.fields.find(f => f.id === 'subcategory')?.description.ms || '',
          category_sort: 1, // Default sort order
          link_parquet: meta.link_parquet,
          link_csv: meta.link_csv,
          last_updated: meta._fetched_at,
          data_as_of: meta.date_range.end,
        };
      })
    );

    // Filter out null entries and cache
    const validDatasets = datasets.filter(Boolean) as Dataset[];
    datasetsCache = { data: validDatasets, timestamp: Date.now() };
    return validDatasets;
  } catch (error) {
    console.error('[fetchDatasets] Error fetching from GitHub:', error);
    // Return empty array and let caller use static fallback
    return [];
  }
};

/**
 * Get datasets (prefer runtime fetch, but allow static import for edge cases)
 * This maintains backward compatibility with existing code
 */
export const getDatasets = async (): Promise<Dataset[]> => {
  const datasets = await fetchDatasets();
  return datasets.length > 0 ? datasets : [];
};

// Export for backward compatibility with existing imports
// Note: This will be populated at runtime, not at build time
export const DATASETS: Dataset[] = [];
