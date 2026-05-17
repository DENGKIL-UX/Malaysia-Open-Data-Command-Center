/**
 * Auto-Classification Engine — Ontology Graph Builder
 *
 * Reads the GROUND_TRUTH_REGISTRY and produces a complete OntologyGraph
 * with category nodes, dataset nodes, and multiple edge types:
 *
 *   - CONTAINS:        dataset → category membership
 *   - SHARES_GEOGRAPHY: datasets sharing the same geography scope
 *   - SHARES_FREQUENCY: P0/P1 datasets sharing the same frequency
 *   - Domain knowledge: expert-defined causal / correlational edges
 *
 * Node sizes are priority-based (P0=28, P1=22, P2=16, P3=12),
 * category nodes are 40. Colors come from CATEGORY_COLORS.
 */

import type { OntologyNode, OntologyEdge, OntologyGraph, RelationshipType } from "@/engine/ontology/types";
import { MALAYSIA_DOMAIN_EDGES } from "@/engine/ontology/domain-knowledge";
import { CATEGORY_COLORS } from "@/design/blueprint-tokens";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Group an array of items by a key extractor function. */
function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const group = map.get(key);
    if (group) {
      group.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

/** Priority → node size mapping. */
const PRIORITY_SIZE: Record<string, number> = {
  P0: 28,
  P1: 22,
  P2: 16,
  P3: 12,
};

/** Category node size. */
const CATEGORY_NODE_SIZE = 40;

/** Default color when a category is not in CATEGORY_COLORS. */
const DEFAULT_COLOR = "#ABB3BF";

/** Max geography-sharing edges per pair of groups to avoid explosion. */
const MAX_GEO_EDGES_PER_GROUP = 15;

// ---------------------------------------------------------------------------
// Internal types for registry iteration
// ---------------------------------------------------------------------------

interface RegistryEntry {
  apiId?: string;
  title_ms?: string;
  title_en?: string;
  frequency?: string;
  geography?: string;
  category?: string;
  priority?: string;
  valueField?: string;
  dateField?: string;
  unit?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

/**
 * Build the full OntologyGraph from the GROUND_TRUTH_REGISTRY.
 *
 * @param registry  The GROUND_TRUTH_REGISTRY object (keyed by dataset key)
 * @param liveData  Optional live data snapshot (latestValue, trend, etc.)
 *                  keyed by dataset key — merged into dataset nodes.
 */
export function buildOntologyFromRegistry(
  registry: Record<string, any>,
  liveData?: Record<string, any>,
): OntologyGraph {
  const nodes: OntologyNode[] = [];
  const edges: OntologyEdge[] = [];
  const edgeIdSet = new Set<string>();

  // ── Collect registry entries ──────────────────────────────────────────

  const entries: Array<{ key: string; entry: RegistryEntry }> = [];
  for (const [key, rawEntry] of Object.entries(registry)) {
    entries.push({ key, entry: rawEntry as RegistryEntry });
  }

  // ── 1. Category nodes ────────────────────────────────────────────────

  const categoriesSeen = new Set<string>();
  for (const { entry } of entries) {
    const cat = entry.category;
    if (cat && !categoriesSeen.has(cat)) {
      categoriesSeen.add(cat);
      const colorInfo = CATEGORY_COLORS[cat];
      nodes.push({
        id: `cat:${cat}`,
        type: "category",
        label: cat,
        labelBM: cat, // categories don't have BM variants
        category: cat,
        size: CATEGORY_NODE_SIZE,
        color: colorInfo?.color ?? DEFAULT_COLOR,
      });
    }
  }

  // ── 2. Dataset nodes ─────────────────────────────────────────────────

  for (const { key, entry } of entries) {
    const cat = entry.category ?? "Unknown";
    const colorInfo = CATEGORY_COLORS[cat];
    const priority = entry.priority ?? "P3";

    const live = liveData?.[key] as Record<string, unknown> | undefined;

    const node: OntologyNode = {
      id: `ds:${key}`,
      type: "dataset",
      label: entry.title_en ?? key,
      labelBM: entry.title_ms ?? key,
      category: cat,
      datasetId: entry.apiId ?? key,
      valueField: entry.valueField,
      unit: entry.unit,
      geography: entry.geography,
      frequency: entry.frequency,
      priority,
      size: PRIORITY_SIZE[priority] ?? 12,
      color: colorInfo?.color ?? DEFAULT_COLOR,
      tier: "api",
    };

    // Merge live data if available
    if (live) {
      if (typeof live.latestValue === "number") node.latestValue = live.latestValue;
      if (live.trend === "up" || live.trend === "down" || live.trend === "flat") {
        node.trend = live.trend;
      }
      if (typeof live.confidence === "number") node.confidence = live.confidence;
      if (live.alertLevel === "CRITICAL" || live.alertLevel === "HIGH" || live.alertLevel === "MEDIUM") {
        node.alertLevel = live.alertLevel;
      }
      if (live.freshness instanceof Date) node.freshness = live.freshness;
    }

    nodes.push(node);
  }

  // ── 3. CONTAINS edges (dataset → category) ──────────────────────────

  for (const { key, entry } of entries) {
    const cat = entry.category ?? "Unknown";
    const edgeId = `${key}-belongs-to-${cat}`;
    if (!edgeIdSet.has(edgeId)) {
      edgeIdSet.add(edgeId);
      edges.push({
        id: edgeId,
        source: `ds:${key}`,
        target: `cat:${cat}`,
        type: "CONTAINS" as RelationshipType,
        strength: 1.0,
        isComputed: true,
        confidence: 1.0,
      });
    }
  }

  // ── 4. SHARES_GEOGRAPHY edges ────────────────────────────────────────
  // Group datasets by geography, then create edges between pairs.
  // Limit edges per group to avoid combinatorial explosion.

  const byGeo = groupBy(entries, (e) => e.entry.geography ?? "unknown");
  for (const [geo, group] of byGeo) {
    if (group.length < 2) continue;

    // Sort by priority so P0 comes first, then P1, etc.
    const sorted = [...group].sort((a, b) => {
      const pa = a.entry.priority ?? "P3";
      const pb = b.entry.priority ?? "P3";
      return pa.localeCompare(pb);
    });

    let count = 0;
    for (let i = 0; i < sorted.length && count < MAX_GEO_EDGES_PER_GROUP; i++) {
      for (let j = i + 1; j < sorted.length && count < MAX_GEO_EDGES_PER_GROUP; j++) {
        const keyA = sorted[i].key;
        const keyB = sorted[j].key;
        // Normalise edge ID so A-B and B-A are the same
        const [lo, hi] = keyA < keyB ? [keyA, keyB] : [keyB, keyA];
        const edgeId = `geo:${lo}-${hi}`;
        if (!edgeIdSet.has(edgeId)) {
          edgeIdSet.add(edgeId);
          edges.push({
            id: edgeId,
            source: `ds:${lo}`,
            target: `ds:${hi}`,
            type: "SHARES_GEOGRAPHY" as RelationshipType,
            strength: 0.3,
            isComputed: true,
            confidence: 0.9,
            label: `Shared geography: ${geo}`,
            labelBM: `Geografi sama: ${geo}`,
          });
          count++;
        }
      }
    }
  }

  // ── 5. SHARES_FREQUENCY edges (P0/P1 only) ──────────────────────────

  const highPriority = entries.filter(
    (e) => e.entry.priority === "P0" || e.entry.priority === "P1",
  );
  const byFreq = groupBy(highPriority, (e) => e.entry.frequency ?? "unknown");
  for (const [freq, group] of byFreq) {
    if (group.length < 2) continue;

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const keyA = group[i].key;
        const keyB = group[j].key;
        const [lo, hi] = keyA < keyB ? [keyA, keyB] : [keyB, keyA];
        const edgeId = `freq:${lo}-${hi}`;
        if (!edgeIdSet.has(edgeId)) {
          edgeIdSet.add(edgeId);
          edges.push({
            id: edgeId,
            source: `ds:${lo}`,
            target: `ds:${hi}`,
            type: "SHARES_FREQUENCY" as RelationshipType,
            strength: 0.25,
            isComputed: true,
            confidence: 0.85,
            label: `Shared frequency: ${freq}`,
            labelBM: `Kekerapan sama: ${freq}`,
          });
        }
      }
    }
  }

  // ── 6. Domain knowledge edges ────────────────────────────────────────
  // Each edge from MALAYSIA_DOMAIN_EDGES already has source/target
  // in `ds:{key}` format but lacks an `id`. We generate it as
  // `domain:{sourceKey}-{targetKey}`.

  for (const domainEdge of MALAYSIA_DOMAIN_EDGES) {
    // Extract the registry key from the `ds:{key}` format
    const sourceKey = domainEdge.source.replace(/^ds:/, "");
    const targetKey = domainEdge.target.replace(/^ds:/, "");
    const edgeId = `domain:${sourceKey}-${targetKey}`;

    if (!edgeIdSet.has(edgeId)) {
      edgeIdSet.add(edgeId);
      edges.push({
        id: edgeId,
        ...domainEdge,
      });
    }
  }

  // ── 7. Compute metadata ──────────────────────────────────────────────

  const coverageByCategory: Record<string, number> = {};
  for (const { entry } of entries) {
    const cat = entry.category ?? "Unknown";
    coverageByCategory[cat] = (coverageByCategory[cat] ?? 0) + 1;
  }

  // ── Return ───────────────────────────────────────────────────────────

  return {
    nodes,
    edges,
    metadata: {
      totalDatasets: entries.length,
      totalRelations: edges.length,
      computedAt: new Date(),
      coverageByCategory,
    },
  };
}
