// ============================================================================
// Malaysia Open Data Command Center — Confidence Scoring Engine
// Weighted confidence analysis from multiple reliability dimensions
// ============================================================================

import type { ConfidenceLabel, Source } from './ontology';

// ─── Types ───────────────────────────────────────────────────────────────────

export type RiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical';

export interface Evidence {
  /** What this evidence supports */
  claim: string;
  /** Strength of this evidence (0-1) */
  weight: number;
  /** Source of the evidence */
  source: string;
  /** Type of evidence */
  type: 'statistical' | 'empirical' | 'expert' | 'derived' | 'historical';
}

export interface ConfidenceContext {
  /** When the data was collected/last updated (ISO string or date string) */
  dataDate?: string;
  /** Number of data points in the sample */
  sampleSize?: number;
  /** Data sources used */
  sources?: Source[];
  /** Whether the metric is derived/computed from other metrics */
  isDerived?: boolean;
  /** Historical trend consistency (0-1, how consistent the trend has been) */
  trendConsistency?: number;
  /** Geographic coverage: fraction of regions covered (0-1) */
  geographicCoverage?: number;
  /** Category of the dataset */
  category?: string;
}

export interface IntelligenceOutput {
  /** The finding or insight being assessed */
  finding: string;
  /** Overall confidence score (0-1) */
  confidence: number;
  /** Human-readable confidence label */
  confidenceLabel: ConfidenceLabel;
  /** Supporting evidence */
  evidence: Evidence[];
  /** Actionable recommendation based on the finding */
  recommendation: string;
  /** Risk level associated with acting on this intelligence */
  riskLevel: RiskLevel;
  /** Sources used in the analysis */
  sources: Source[];
  /** Breakdown of confidence dimensions */
  dimensions: ConfidenceDimensions;
}

export interface ConfidenceDimensions {
  /** How recent the data is (0-1) */
  dataRecency: number;
  /** Statistical power from sample size (0-1) */
  sampleSize: number;
  /** Source reliability aggregate (0-1) */
  sourceReliability: number;
  /** How consistent the trend is (0-1) */
  trendConsistency: number;
  /** Geographic coverage completeness (0-1) */
  geographicCoverage: number;
}

// ─── Confidence Weights ──────────────────────────────────────────────────────

const DIMENSION_WEIGHTS = {
  dataRecency: 0.20,
  sampleSize: 0.15,
  sourceReliability: 0.30,
  trendConsistency: 0.20,
  geographicCoverage: 0.15,
} as const;

// ─── Core Analysis Function ──────────────────────────────────────────────────

/**
 * Analyze a dataset and compute a weighted confidence score.
 *
 * @param dataset - Name/identifier of the dataset being analyzed
 * @param data - The numeric data array
 * @param context - Additional context for the analysis
 * @returns IntelligenceOutput with confidence assessment
 */
export function analyze(
  dataset: string,
  data: number[],
  context: ConfidenceContext = {}
): IntelligenceOutput {
  const dimensions = computeDimensions(data, context);
  const confidence = computeWeightedConfidence(dimensions);
  const confidenceLabel = labelConfidence(confidence);
  const riskLevel = assessRiskLevel(confidence, context);
  const evidence = buildEvidence(data, context, dimensions);
  const finding = buildFinding(dataset, data, context);
  const recommendation = buildRecommendation(confidenceLabel, riskLevel, context);
  const sources = context.sources ?? [];

  return {
    finding,
    confidence: Math.round(confidence * 1000) / 1000,
    confidenceLabel,
    evidence,
    recommendation,
    riskLevel,
    sources,
    dimensions,
  };
}

// ─── Dimension Computation ───────────────────────────────────────────────────

function computeDimensions(
  data: number[],
  context: ConfidenceContext
): ConfidenceDimensions {
  return {
    dataRecency: computeDataRecency(context.dataDate),
    sampleSize: computeSampleSize(data.length),
    sourceReliability: computeSourceReliability(context.sources, context.isDerived),
    trendConsistency: context.trendConsistency ?? computeDefaultTrendConsistency(data),
    geographicCoverage: context.geographicCoverage ?? 0.85,
  };
}

/**
 * Compute data recency score based on how old the data is.
 * Data within 1 month = 1.0, decaying to 0.3 after 2 years.
 */
function computeDataRecency(dataDate?: string): number {
  if (!dataDate) return 0.5; // Unknown date → moderate

  try {
    const date = new Date(dataDate);
    const now = new Date();
    const ageMs = now.getTime() - date.getTime();
    const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.44);

    if (ageMonths <= 1) return 1.0;
    if (ageMonths <= 3) return 0.95;
    if (ageMonths <= 6) return 0.90;
    if (ageMonths <= 12) return 0.80;
    if (ageMonths <= 18) return 0.65;
    if (ageMonths <= 24) return 0.50;
    return 0.30;
  } catch {
    return 0.5;
  }
}

/**
 * Compute sample size score.
 * Larger samples → higher confidence.
 */
function computeSampleSize(size: number): number {
  if (size <= 0) return 0.0;
  if (size <= 5) return 0.3;
  if (size <= 10) return 0.5;
  if (size <= 30) return 0.7;
  if (size <= 100) return 0.85;
  if (size <= 500) return 0.92;
  return 0.98;
}

/**
 * Compute source reliability score.
 * Aggregates reliability from multiple sources, with penalty for derived data.
 */
function computeSourceReliability(sources?: Source[], isDerived?: boolean): number {
  if (!sources || sources.length === 0) return 0.4;

  const avgReliability =
    sources.reduce((sum, s) => sum + s.reliability, 0) / sources.length;

  // Derived data has inherent uncertainty
  const derivedPenalty = isDerived ? 0.08 : 0;

  // Multiple sources increase confidence
  const diversityBonus = sources.length >= 3 ? 0.05 : 0;

  return Math.min(1, Math.max(0, avgReliability - derivedPenalty + diversityBonus));
}

/**
 * Compute a default trend consistency score from the data.
 * Uses coefficient of variation — lower CV = more consistent.
 */
function computeDefaultTrendConsistency(data: number[]): number {
  if (data.length < 3) return 0.5;

  const m = mean(data);
  if (m === 0) return 0.5;

  const sd = stdDev(data);
  const cv = sd / Math.abs(m); // Coefficient of variation

  // Lower CV → higher consistency
  if (cv <= 0.05) return 0.98;
  if (cv <= 0.10) return 0.92;
  if (cv <= 0.20) return 0.85;
  if (cv <= 0.30) return 0.70;
  if (cv <= 0.50) return 0.55;
  return 0.35;
}

// ─── Weighted Confidence ─────────────────────────────────────────────────────

function computeWeightedConfidence(dimensions: ConfidenceDimensions): number {
  return (
    dimensions.dataRecency * DIMENSION_WEIGHTS.dataRecency +
    dimensions.sampleSize * DIMENSION_WEIGHTS.sampleSize +
    dimensions.sourceReliability * DIMENSION_WEIGHTS.sourceReliability +
    dimensions.trendConsistency * DIMENSION_WEIGHTS.trendConsistency +
    dimensions.geographicCoverage * DIMENSION_WEIGHTS.geographicCoverage
  );
}

// ─── Confidence Labeling ─────────────────────────────────────────────────────

function labelConfidence(confidence: number): ConfidenceLabel {
  if (confidence >= 0.90) return 'CONFIRMED';
  if (confidence >= 0.75) return 'HIGH';
  if (confidence >= 0.55) return 'MODERATE';
  return 'UNVERIFIED';
}

// ─── Risk Assessment ─────────────────────────────────────────────────────────

function assessRiskLevel(confidence: number, context: ConfidenceContext): RiskLevel {
  // Low confidence → higher risk
  if (confidence < 0.40) return 'critical';
  if (confidence < 0.55) return 'high';
  if (confidence < 0.70) return 'moderate';
  if (confidence < 0.85) return 'low';

  // Even with high confidence, derived data carries some risk
  if (context.isDerived) return 'low';
  return 'minimal';
}

// ─── Evidence Building ───────────────────────────────────────────────────────

function buildEvidence(
  data: number[],
  context: ConfidenceContext,
  dimensions: ConfidenceDimensions
): Evidence[] {
  const evidence: Evidence[] = [];

  // Source reliability evidence
  if (context.sources && context.sources.length > 0) {
    const avgReliability = computeSourceReliability(context.sources, context.isDerived);
    evidence.push({
      claim: `Data sourced from ${context.sources.length} source(s) with average reliability ${(avgReliability * 100).toFixed(0)}%`,
      weight: avgReliability,
      source: context.sources.map((s) => s.name).join(', '),
      type: 'empirical',
    });
  }

  // Sample size evidence
  if (data.length > 0) {
    evidence.push({
      claim: `Analysis based on ${data.length} data points (sample size score: ${(dimensions.sampleSize * 100).toFixed(0)}%)`,
      weight: dimensions.sampleSize,
      source: 'statistical_analysis',
      type: 'statistical',
    });
  }

  // Data recency evidence
  if (context.dataDate) {
    evidence.push({
      claim: `Data as of ${context.dataDate} (recency score: ${(dimensions.dataRecency * 100).toFixed(0)}%)`,
      weight: dimensions.dataRecency,
      source: 'metadata',
      type: 'empirical',
    });
  }

  // Trend consistency evidence
  if (data.length >= 3) {
    evidence.push({
      claim: `Trend consistency: ${(dimensions.trendConsistency * 100).toFixed(0)}% (coefficient of variation analysis)`,
      weight: dimensions.trendConsistency,
      source: 'trend_analysis',
      type: 'statistical',
    });
  }

  // Derived data caveat
  if (context.isDerived) {
    evidence.push({
      claim: 'This metric is derived/computed from other metrics, introducing additional uncertainty',
      weight: 0.3,
      source: 'methodology',
      type: 'expert',
    });
  }

  return evidence;
}

// ─── Finding & Recommendation ────────────────────────────────────────────────

function buildFinding(
  dataset: string,
  data: number[],
  context: ConfidenceContext
): string {
  if (data.length === 0) return `No data available for ${dataset}`;

  const m = mean(data);
  const latest = data[data.length - 1];
  const category = context.category ?? 'General';

  let trend = 'stable';
  if (data.length >= 2) {
    const change = latest - data[data.length - 2];
    if (Math.abs(change) > m * 0.02) {
      trend = change > 0 ? 'upward' : 'downward';
    }
  }

  return `${dataset} (${category}): Latest value ${latest.toFixed(2)}, mean ${m.toFixed(2)}, trend ${trend}. Based on ${data.length} observations.`;
}

function buildRecommendation(
  confidenceLabel: ConfidenceLabel,
  riskLevel: RiskLevel,
  context: ConfidenceContext
): string {
  if (confidenceLabel === 'CONFIRMED') {
    return 'High confidence finding. Suitable for policy decisions and strategic planning.';
  }

  if (confidenceLabel === 'HIGH') {
    return 'Reliable finding with minor uncertainty. Recommended for operational decisions with periodic review.';
  }

  if (confidenceLabel === 'MODERATE') {
    if (context.isDerived) {
      return 'Moderate confidence in derived metric. Verify source data before critical decisions. Consider cross-referencing with primary sources.';
    }
    return 'Moderate confidence finding. Recommend additional data collection or validation before using for important decisions.';
  }

  // UNVERIFIED
  if (riskLevel === 'critical') {
    return 'Very low confidence with critical risk. Do NOT use for decision-making. Immediate data quality review recommended.';
  }
  return 'Unverified finding. Requires additional validation, more data, or alternative sources before any use.';
}

// ─── Utility Functions ───────────────────────────────────────────────────────

function mean(data: number[]): number {
  if (data.length === 0) return 0;
  return data.reduce((sum, v) => sum + v, 0) / data.length;
}

function stdDev(data: number[]): number {
  if (data.length <= 1) return 0;
  const m = mean(data);
  const variance = data.reduce((sum, v) => sum + (v - m) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}
