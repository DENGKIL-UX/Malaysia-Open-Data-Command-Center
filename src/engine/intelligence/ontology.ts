// ============================================================================
// Malaysia Open Data Command Center — Ontology System
// Palantir-grade intelligence: transforming flat data into connected objects
// ============================================================================

import { STATES, MALAYSIA_TOTALS, MAP_LAYERS } from '@/lib/data/malaysia-data';

// ─── Type System ─────────────────────────────────────────────────────────────

export type ObjectType =
  | 'economic_indicator'
  | 'demographic_metric'
  | 'geographic_region'
  | 'data_quality'
  | 'social_indicator'
  | 'health_indicator';

export type RelationshipType =
  | 'DRIVES'
  | 'CORRELATES_WITH'
  | 'INVERSELY_CORRELATES'
  | 'CONTAINS'
  | 'PART_OF'
  | 'DEPENDS_ON'
  | 'INFLUENCES'
  | 'COMPOSES';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLabel = 'CONFIRMED' | 'HIGH' | 'MODERATE' | 'UNVERIFIED';

export interface Source {
  name: string;
  url?: string;
  reliability: number; // 0-1
  lastUpdated?: string;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  detectedAt: string;
  metric: string;
  value: number;
  threshold: number;
}

export interface OntologyObject {
  id: string;
  type: ObjectType;
  name: string;
  properties: Record<string, unknown>;
  sources: Source[];
  confidence: number; // 0-1
  alerts: Alert[];
  tags: string[];
  lastUpdated?: string;
}

export interface Relationship {
  id: string;
  fromId: string;
  toId: string;
  type: RelationshipType;
  strength: number; // 0-1 correlation / causal strength
  lag?: string; // e.g. "2 months"
  description?: string;
  bidirectional: boolean;
}

// ─── OntologyRegistry ────────────────────────────────────────────────────────

export class OntologyRegistry {
  private objects: Map<string, OntologyObject> = new Map();
  private relationships: Relationship[] = [];

  /** Register an object into the ontology */
  register(obj: OntologyObject): void {
    this.objects.set(obj.id, obj);
  }

  /** Retrieve an object by ID */
  get(id: string): OntologyObject | undefined {
    return this.objects.get(id);
  }

  /** Get all registered objects */
  getAll(): OntologyObject[] {
    return Array.from(this.objects.values());
  }

  /** Filter objects by type */
  getByType(type: ObjectType): OntologyObject[] {
    return this.getAll().filter((obj) => obj.type === type);
  }

  /** Add a relationship between two objects */
  addRelationship(rel: Relationship): void {
    this.relationships.push(rel);
  }

  /** Get all relationships */
  getRelationships(): Relationship[] {
    return [...this.relationships];
  }

  /** Get relationships for a specific object */
  getRelationshipsFor(id: string): Relationship[] {
    return this.relationships.filter(
      (r) => r.fromId === id || r.toId === id
    );
  }

  /** Get objects with active alerts */
  getAlerts(): OntologyObject[] {
    return this.getAll().filter((obj) => obj.alerts.length > 0);
  }

  /**
   * Find connected objects using BFS traversal.
   * @param id Starting object ID
   * @param depth Maximum traversal depth (default: 1)
   * @returns Set of connected object IDs within the given depth
   */
  getRelated(id: string, depth: number = 1): OntologyObject[] {
    const visited = new Set<string>();
    const queue: Array<{ nodeId: string; currentDepth: number }> = [
      { nodeId: id, currentDepth: 0 },
    ];

    visited.add(id);

    while (queue.length > 0) {
      const { nodeId, currentDepth } = queue.shift()!;

      if (currentDepth >= depth) continue;

      const neighbors = this.getNeighborIds(nodeId);
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push({ nodeId: neighborId, currentDepth: currentDepth + 1 });
        }
      }
    }

    visited.delete(id); // exclude the starting object itself
    return Array.from(visited)
      .map((oid) => this.objects.get(oid))
      .filter((obj): obj is OntologyObject => obj !== undefined);
  }

  /**
   * Find a causal chain (shortest path) between two objects using BFS.
   * @param fromId Starting object ID
   * @param toId Target object ID
   * @returns Array of object IDs forming the path, or null if no path exists
   */
  getCausalChain(fromId: string, toId: string): string[] | null {
    if (fromId === toId) return [fromId];

    const visited = new Set<string>([fromId]);
    const parent = new Map<string, string>();
    const queue: string[] = [fromId];

    while (queue.length > 0) {
      const current = queue.shift()!;

      const neighbors = this.getNeighborIds(current);
      for (const neighborId of neighbors) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          parent.set(neighborId, current);

          if (neighborId === toId) {
            // Reconstruct path
            const path: string[] = [toId];
            let node = toId;
            while (parent.has(node)) {
              node = parent.get(node)!;
              path.unshift(node);
            }
            return path;
          }

          queue.push(neighborId);
        }
      }
    }

    return null; // No path found
  }

  /** Get the full causal chain as OntologyObjects with relationships */
  getCausalChainDetailed(
    fromId: string,
    toId: string
  ): Array<{ object: OntologyObject; relationship?: Relationship }> | null {
    const path = this.getCausalChain(fromId, toId);
    if (!path) return null;

    return path.map((id, index) => {
      const obj = this.objects.get(id)!;
      let relationship: Relationship | undefined;

      if (index > 0) {
        const prevId = path[index - 1];
        relationship = this.relationships.find(
          (r) =>
            (r.fromId === prevId && r.toId === id) ||
            (r.bidirectional && r.fromId === id && r.toId === prevId)
        );
      }

      return { object: obj, relationship };
    });
  }

  // ─── Private Helpers ───────────────────────────────────────────────────

  private getNeighborIds(id: string): string[] {
    const neighbors: string[] = [];

    for (const rel of this.relationships) {
      if (rel.fromId === id && this.objects.has(rel.toId)) {
        neighbors.push(rel.toId);
      }
      if (
        (rel.bidirectional || rel.type === 'CORRELATES_WITH' || rel.type === 'INVERSELY_CORRELATES') &&
        rel.toId === id &&
        this.objects.has(rel.fromId)
      ) {
        neighbors.push(rel.fromId);
      }
    }

    return neighbors;
  }
}

// ─── Pre-populate Malaysia Ontology ──────────────────────────────────────────

function buildMalaysiaOntology(): OntologyRegistry {
  const registry = new OntologyRegistry();

  // ── Economic Indicators ──────────────────────────────────────────────────

  registry.register({
    id: 'indicator-gdp-growth',
    type: 'economic_indicator',
    name: 'GDP Growth Rate',
    properties: {
      value: MALAYSIA_TOTALS.gdpGrowth,
      unit: '%',
      period: '2024',
      category: 'National Accounts',
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-04' },
    ],
    confidence: 0.98,
    alerts: [],
    tags: ['gdp', 'growth', 'macroeconomic'],
    lastUpdated: '2025-04',
  });

  registry.register({
    id: 'indicator-unemployment',
    type: 'economic_indicator',
    name: 'Unemployment Rate',
    properties: {
      value: MALAYSIA_TOTALS.unemployment,
      unit: '%',
      period: '2024',
      category: 'Labour Markets',
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-03' },
    ],
    confidence: 0.95,
    alerts: [],
    tags: ['unemployment', 'labour', 'macroeconomic'],
    lastUpdated: '2025-03',
  });

  registry.register({
    id: 'indicator-gdp-per-capita',
    type: 'economic_indicator',
    name: 'GDP Per Capita',
    properties: {
      value: Math.round((MALAYSIA_TOTALS.gdp * 1000) / MALAYSIA_TOTALS.population),
      unit: 'RM',
      period: '2024',
      category: 'National Accounts',
      derived: true,
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-04' },
    ],
    confidence: 0.88,
    alerts: [],
    tags: ['gdp', 'per-capita', 'derived'],
    lastUpdated: '2025-04',
  });

  registry.register({
    id: 'indicator-cpi',
    type: 'economic_indicator',
    name: 'Consumer Price Index (CPI)',
    properties: {
      value: 130.5,
      unit: 'index',
      baseYear: 2020,
      period: '2024',
      category: 'Prices',
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-01' },
    ],
    confidence: 0.95,
    alerts: [],
    tags: ['cpi', 'inflation', 'prices'],
    lastUpdated: '2025-01',
  });

  registry.register({
    id: 'indicator-trade',
    type: 'economic_indicator',
    name: 'Total Trade Volume',
    properties: {
      value: 2710.0,
      unit: 'RM billions',
      period: '2024',
      category: 'Economic Sectors',
    },
    sources: [
      { name: 'BNM', url: 'https://www.bnm.gov.my', reliability: 0.95, lastUpdated: '2025-03' },
    ],
    confidence: 0.93,
    alerts: [],
    tags: ['trade', 'exports', 'imports'],
    lastUpdated: '2025-03',
  });

  // ── Demographic Metrics ─────────────────────────────────────────────────

  registry.register({
    id: 'metric-population',
    type: 'demographic_metric',
    name: 'Total Population',
    properties: {
      value: MALAYSIA_TOTALS.population,
      unit: "'000",
      period: '2025',
      category: 'Demography',
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-07' },
    ],
    confidence: 0.97,
    alerts: [],
    tags: ['population', 'demography'],
    lastUpdated: '2025-07',
  });

  registry.register({
    id: 'metric-birth-rate',
    type: 'demographic_metric',
    name: 'Birth Rate',
    properties: {
      value: MALAYSIA_TOTALS.births,
      unit: "'000",
      period: '2024',
      category: 'Demography',
    },
    sources: [
      { name: 'JPN', reliability: 0.96, lastUpdated: '2024-11' },
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2024-11' },
    ],
    confidence: 0.96,
    alerts: [],
    tags: ['births', 'fertility', 'demography'],
    lastUpdated: '2024-11',
  });

  registry.register({
    id: 'metric-death-rate',
    type: 'demographic_metric',
    name: 'Death Rate',
    properties: {
      value: MALAYSIA_TOTALS.deaths,
      unit: "'000",
      period: '2024',
      category: 'Demography',
    },
    sources: [
      { name: 'JPN', reliability: 0.96, lastUpdated: '2024-11' },
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2024-11' },
    ],
    confidence: 0.96,
    alerts: [],
    tags: ['deaths', 'mortality', 'demography'],
    lastUpdated: '2024-11',
  });

  registry.register({
    id: 'metric-population-growth',
    type: 'demographic_metric',
    name: 'Population Growth Rate',
    properties: {
      value: 1.1,
      unit: '%',
      period: '2024',
      category: 'Demography',
      derived: true,
    },
    sources: [
      { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-07' },
    ],
    confidence: 0.85,
    alerts: [],
    tags: ['population', 'growth', 'derived'],
    lastUpdated: '2025-07',
  });

  // ── Health / Social Indicators ───────────────────────────────────────────

  registry.register({
    id: 'indicator-healthcare-quality',
    type: 'health_indicator',
    name: 'Healthcare Quality Index',
    properties: {
      value: 72.4,
      unit: 'index',
      period: '2024',
      category: 'Healthcare',
    },
    sources: [
      { name: 'KKM', url: 'https://data.gov.my', reliability: 0.90, lastUpdated: '2024-10' },
    ],
    confidence: 0.90,
    alerts: [],
    tags: ['healthcare', 'quality', 'health'],
    lastUpdated: '2024-10',
  });

  // ── Geographic Regions (16 states/FTs) ──────────────────────────────────

  for (const state of STATES) {
    const alerts: Alert[] = [];

    // Alert: Unemployment > 5%
    if (state.unemployment > 5) {
      alerts.push({
        id: `alert-unemployment-${state.id}`,
        severity: 'high',
        title: `High Unemployment in ${state.name}`,
        description: `${state.name} has an unemployment rate of ${state.unemployment}%, exceeding the 5% threshold. National average: ${MALAYSIA_TOTALS.unemployment}%.`,
        detectedAt: new Date().toISOString(),
        metric: 'unemployment',
        value: state.unemployment,
        threshold: 5.0,
      });
    }

    // Alert: Extreme population density (> 5000/km²)
    if (state.density > 5000) {
      alerts.push({
        id: `alert-density-${state.id}`,
        severity: 'critical',
        title: `Extreme Population Density in ${state.name}`,
        description: `${state.name} has a population density of ${state.density}/km², far exceeding the 5000/km² threshold. National average: ${MALAYSIA_TOTALS.density}/km².`,
        detectedAt: new Date().toISOString(),
        metric: 'density',
        value: state.density,
        threshold: 5000,
      });
    }

    // Alert: High density (> 1500/km² but <= 5000/km²)
    if (state.density > 1500 && state.density <= 5000) {
      alerts.push({
        id: `alert-density-moderate-${state.id}`,
        severity: 'medium',
        title: `High Population Density in ${state.name}`,
        description: `${state.name} has a population density of ${state.density}/km², exceeding the 1500/km² moderate threshold.`,
        detectedAt: new Date().toISOString(),
        metric: 'density',
        value: state.density,
        threshold: 1500,
      });
    }

    // Alert: GDP Growth outlier (top 15% or bottom 15%)
    const growthValues = STATES.map((s) => s.gdpGrowth).sort((a, b) => a - b);
    const q85 = growthValues[Math.floor(growthValues.length * 0.85)];
    const q15 = growthValues[Math.ceil(growthValues.length * 0.15)];
    if (state.gdpGrowth >= q85) {
      alerts.push({
        id: `alert-gdp-growth-high-${state.id}`,
        severity: 'low',
        title: `GDP Growth Outlier (High) in ${state.name}`,
        description: `${state.name} has a GDP growth rate of ${state.gdpGrowth}%, in the top 15% nationally. This may indicate overheating or concentrated economic activity.`,
        detectedAt: new Date().toISOString(),
        metric: 'gdpGrowth',
        value: state.gdpGrowth,
        threshold: q85,
      });
    } else if (state.gdpGrowth <= q15) {
      alerts.push({
        id: `alert-gdp-growth-low-${state.id}`,
        severity: 'medium',
        title: `GDP Growth Outlier (Low) in ${state.name}`,
        description: `${state.name} has a GDP growth rate of ${state.gdpGrowth}%, in the bottom 15% nationally. This may indicate structural economic challenges.`,
        detectedAt: new Date().toISOString(),
        metric: 'gdpGrowth',
        value: state.gdpGrowth,
        threshold: q15,
      });
    }

    // Alert: Unemployment 4-5% (warning level)
    if (state.unemployment >= 4 && state.unemployment <= 5) {
      alerts.push({
        id: `alert-unemployment-warning-${state.id}`,
        severity: 'medium',
        title: `Elevated Unemployment in ${state.name}`,
        description: `${state.name} has an unemployment rate of ${state.unemployment}%, above the national average of ${MALAYSIA_TOTALS.unemployment}%.`,
        detectedAt: new Date().toISOString(),
        metric: 'unemployment',
        value: state.unemployment,
        threshold: 4.0,
      });
    }

    registry.register({
      id: `region-${state.id}`,
      type: 'geographic_region',
      name: state.name,
      properties: {
        abbr: state.abbr,
        population: state.population,
        gdp: state.gdp,
        gdpGrowth: state.gdpGrowth,
        gdpPerCapita: Math.round((state.gdp * 1000) / state.population),
        births: state.births,
        deaths: state.deaths,
        unemployment: state.unemployment,
        datasets: state.datasets,
        area: state.area,
        density: state.density,
        region: state.region,
      },
      sources: [
        { name: 'DOSM', url: 'https://open.dosm.gov.my', reliability: 0.98, lastUpdated: '2025-04' },
      ],
      confidence: 0.95,
      alerts,
      tags: [state.region, 'state', state.abbr.toLowerCase()],
      lastUpdated: '2025-04',
    });
  }

  // ── Data Quality Objects ─────────────────────────────────────────────────

  registry.register({
    id: 'quality-dataset-coverage',
    type: 'data_quality',
    name: 'Dataset Coverage',
    properties: {
      totalDatasets: MALAYSIA_TOTALS.datasets,
      avgPerState: Math.round(MALAYSIA_TOTALS.datasets / STATES.length),
      coverage: MAP_LAYERS.length,
      minState: Math.min(...STATES.map((s) => s.datasets)),
      maxState: Math.max(...STATES.map((s) => s.datasets)),
    },
    sources: [
      { name: 'JDN', url: 'https://data.gov.my', reliability: 0.90, lastUpdated: '2025-01' },
    ],
    confidence: 0.90,
    alerts: [],
    tags: ['data-quality', 'coverage'],
    lastUpdated: '2025-01',
  });

  registry.register({
    id: 'quality-source-reliability',
    type: 'data_quality',
    name: 'Source Reliability Score',
    properties: {
      dosm: 0.98,
      bnm: 0.95,
      kkm: 0.90,
      jdn: 0.90,
      governmentAvg: 0.92,
      derivedComputed: 0.85,
    },
    sources: [
      { name: 'JDN', url: 'https://data.gov.my', reliability: 0.90 },
    ],
    confidence: 0.85,
    alerts: [],
    tags: ['data-quality', 'reliability', 'source'],
  });

  // ── Relationships ────────────────────────────────────────────────────────

  let relId = 0;
  const nextRelId = () => `rel-${++relId}`;

  // GDP → DRIVES → Employment
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-gdp-growth',
    toId: 'indicator-unemployment',
    type: 'DRIVES',
    strength: 0.87,
    lag: '2 months',
    description: 'GDP growth drives employment with a 2-month lag; higher GDP reduces unemployment.',
    bidirectional: false,
  });

  // GDP → CORRELATES_WITH → CPI
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-gdp-growth',
    toId: 'indicator-cpi',
    type: 'CORRELATES_WITH',
    strength: 0.72,
    description: 'GDP growth correlates with consumer price inflation.',
    bidirectional: true,
  });

  // GDP → DRIVES → Trade
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-gdp-growth',
    toId: 'indicator-trade',
    type: 'DRIVES',
    strength: 0.65,
    description: 'GDP growth drives trade volume expansion.',
    bidirectional: false,
  });

  // Population → DRIVES → GDP
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'metric-population',
    toId: 'indicator-gdp-growth',
    type: 'DRIVES',
    strength: 0.78,
    description: 'Population growth drives GDP expansion through labour force and consumption.',
    bidirectional: false,
  });

  // Birth Rate → CORRELATES_WITH → Population Growth
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'metric-birth-rate',
    toId: 'metric-population-growth',
    type: 'CORRELATES_WITH',
    strength: 0.91,
    description: 'Birth rate strongly correlates with population growth rate.',
    bidirectional: true,
  });

  // Death Rate → INVERSELY_CORRELATES → Healthcare Quality
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'metric-death-rate',
    toId: 'indicator-healthcare-quality',
    type: 'INVERSELY_CORRELATES',
    strength: 0.68,
    description: 'Higher death rates inversely correlate with healthcare quality.',
    bidirectional: true,
  });

  // Unemployment → INVERSELY_CORRELATES → GDP Growth
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-unemployment',
    toId: 'indicator-gdp-growth',
    type: 'INVERSELY_CORRELATES',
    strength: 0.76,
    description: 'Unemployment inversely correlates with GDP growth; Okun\'s Law relationship.',
    bidirectional: true,
  });

  // Selangor → CONTAINS → WP Kuala Lumpur
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'region-selangor',
    toId: 'region-wp-kuala-lumpur',
    type: 'CONTAINS',
    strength: 0.95,
    description: 'W.P. Kuala Lumpur is geographically enclaved within Selangor.',
    bidirectional: false,
  });

  // WP Kuala Lumpur → PART_OF → Selangor (economic region)
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'region-wp-kuala-lumpur',
    toId: 'region-selangor',
    type: 'PART_OF',
    strength: 0.95,
    description: 'W.P. Kuala Lumpur is part of the Greater KL/Selangor economic region.',
    bidirectional: false,
  });

  // WP Putrajaya → PART_OF → Selangor
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'region-wp-putrajaya',
    toId: 'region-selangor',
    type: 'PART_OF',
    strength: 0.90,
    description: 'W.P. Putrajaya is enclaved within Selangor.',
    bidirectional: false,
  });

  // State-level: GDP → DRIVES → Employment for each state
  for (const state of STATES) {
    // State GDP Growth → DRIVES → National GDP Growth (for high-contribution states)
    if (state.gdp > 100000) {
      registry.addRelationship({
        id: nextRelId(),
        fromId: `region-${state.id}`,
        toId: 'indicator-gdp-growth',
        type: 'INFLUENCES',
        strength: Math.min(1, (state.gdp / MALAYSIA_TOTALS.gdp) * 3), // Scale up for significance
        description: `${state.name} (RM ${state.gdp}M GDP) significantly influences national GDP growth.`,
        bidirectional: false,
      });
    }

    // State Unemployment → DEPENDS_ON → National Employment
    if (state.unemployment > MALAYSIA_TOTALS.unemployment) {
      registry.addRelationship({
        id: nextRelId(),
        fromId: `region-${state.id}`,
        toId: 'indicator-unemployment',
        type: 'DEPENDS_ON',
        strength: 0.7,
        description: `${state.name}'s above-average unemployment rate (${state.unemployment}%) impacts national labour market.`,
        bidirectional: false,
      });
    }

    // Peninsular vs East Malaysia cross-references
    if (state.region === 'east_malaysia') {
      const peninsularStates = STATES.filter((s) => s.region === 'peninsular');
      // Link major EM states to comparable peninsular states
      if (state.id === 'sabah') {
        registry.addRelationship({
          id: nextRelId(),
          fromId: 'region-sabah',
          toId: 'region-kelantan',
          type: 'CORRELATES_WITH',
          strength: 0.55,
          description: 'Sabah and Kelantan share similar challenges: higher unemployment, lower GDP per capita.',
          bidirectional: true,
        });
      }
      if (state.id === 'sarawak') {
        registry.addRelationship({
          id: nextRelId(),
          fromId: 'region-sarawak',
          toId: 'region-pahang',
          type: 'CORRELATES_WITH',
          strength: 0.50,
          description: 'Sarawak and Pahang share similar characteristics: large area, resource-based economy.',
          bidirectional: true,
        });
      }
    }
  }

  // GDP Per Capita → DEPENDS_ON → GDP + Population
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-gdp-per-capita',
    toId: 'indicator-gdp-growth',
    type: 'DEPENDS_ON',
    strength: 0.92,
    description: 'GDP per capita is derived from GDP and population.',
    bidirectional: false,
  });

  registry.addRelationship({
    id: nextRelId(),
    fromId: 'indicator-gdp-per-capita',
    toId: 'metric-population',
    type: 'DEPENDS_ON',
    strength: 0.92,
    description: 'GDP per capita is derived from GDP and population.',
    bidirectional: false,
  });

  // Dataset Coverage → INFLUENCES → Confidence
  registry.addRelationship({
    id: nextRelId(),
    fromId: 'quality-dataset-coverage',
    toId: 'quality-source-reliability',
    type: 'INFLUENCES',
    strength: 0.60,
    description: 'Better dataset coverage improves overall source reliability assessment.',
    bidirectional: true,
  });

  // State relationships with national indicators
  for (const state of STATES) {
    // State → COMPOSES → National Population
    registry.addRelationship({
      id: nextRelId(),
      fromId: `region-${state.id}`,
      toId: 'metric-population',
      type: 'COMPOSES',
      strength: state.population / MALAYSIA_TOTALS.population,
      description: `${state.name} contributes ${(state.population / MALAYSIA_TOTALS.population * 100).toFixed(1)}% of national population.`,
      bidirectional: false,
    });
  }

  return registry;
}

// ─── Singleton Instance ──────────────────────────────────────────────────────

export const malaysiaOntology = buildMalaysiaOntology();
