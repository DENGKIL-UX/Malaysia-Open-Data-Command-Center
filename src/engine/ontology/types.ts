/**
 * Data Ontology Graph — Type System
 *
 * Supports 287+ datasets from the GROUND_TRUTH_REGISTRY,
 * with multiple node and relationship types for the
 * Malaysia Open Data Command Center.
 */

// ---------------------------------------------------------------------------
// Node Types
// ---------------------------------------------------------------------------

export type NodeType =
  | "category"
  | "dataset"
  | "metric"
  | "geography"
  | "temporal"
  | "policy_event"
  | "external"

// ---------------------------------------------------------------------------
// Relationship Types
// ---------------------------------------------------------------------------

export type RelationshipType =
  | "DRIVES"
  | "CORRELATES_POSITIVE"
  | "CORRELATES_NEGATIVE"
  | "LEADS"
  | "LAGS"
  | "CONTAINS"
  | "SHARES_GEOGRAPHY"
  | "SHARES_FREQUENCY"
  | "POLICY_TRANSMITS"

// ---------------------------------------------------------------------------
// Ontology Node
// ---------------------------------------------------------------------------

export interface OntologyNode {
  id:            string
  type:          NodeType
  label:         string
  labelBM:       string
  category:      string
  datasetId?:    string
  valueField?:   string
  latestValue?:  number
  unit?:         string
  trend?:        "up" | "down" | "flat"
  confidence?:   number
  alertLevel?:   "CRITICAL" | "HIGH" | "MEDIUM" | null
  geography?:    string
  frequency?:    string
  freshness?:    Date
  tier?:         "api" | "csv" | "static"
  tags?:         string[]
  priority?:     string
  color?:        string
  size?:         number
  x?:            number
  y?:            number
  fx?:           number
  fy?:           number
}

// ---------------------------------------------------------------------------
// Ontology Edge
// ---------------------------------------------------------------------------

export interface OntologyEdge {
  id:            string
  source:        string
  target:        string
  type:          RelationshipType
  strength:      number
  lagMonths?:    number
  pValue?:       number
  dataPoints?:   number
  direction?:    "positive" | "negative" | "unknown"
  isComputed:    boolean
  confidence:    number
  label?:        string
  labelBM?:      string
}

// ---------------------------------------------------------------------------
// Ontology Graph
// ---------------------------------------------------------------------------

export interface OntologyGraph {
  nodes:         OntologyNode[]
  edges:         OntologyEdge[]
  metadata: {
    totalDatasets:  number
    totalRelations: number
    computedAt:     Date
    coverageByCategory: Record<string, number>
  }
}
