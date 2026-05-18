// ============================================================================
// Malaysia Open Data Command Center — Anomaly Detection Engine
// Z-score + rate-of-change anomaly detection for time-series data
// ============================================================================

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AnomalyResult {
  /** Index in the input data array */
  index: number;
  /** The actual value at this index */
  value: number;
  /** Z-score of this value relative to the dataset */
  zScore: number;
  /** Absolute rate of change from the previous data point */
  rateOfChange: number;
  /** Percentage rate of change from the previous data point */
  rateOfChangePercent: number;
  /** Severity classification */
  severity: AnomalySeverity;
  /** Human-readable description of the anomaly */
  description: string;
  /** Type of anomaly detected */
  type: 'z_score' | 'rate_of_change' | 'both';
}

/**
 * Compute the mean of a numeric array.
 */
function mean(data: number[]): number {
  if (data.length === 0) return 0;
  return data.reduce((sum, v) => sum + v, 0) / data.length;
}

/**
 * Compute the population standard deviation of a numeric array.
 */
function stdDev(data: number[]): number {
  if (data.length <= 1) return 0;
  const m = mean(data);
  const variance = data.reduce((sum, v) => sum + (v - m) ** 2, 0) / data.length;
  return Math.sqrt(variance);
}

/**
 * Classify anomaly severity based on z-score and rate of change.
 */
function classifySeverity(zScore: number, rateOfChangePercent: number, type: AnomalyResult['type']): AnomalySeverity {
  if (type === 'both') {
    if (Math.abs(zScore) > 3.5 || Math.abs(rateOfChangePercent) > 50) return 'critical';
    if (Math.abs(zScore) > 3.0 || Math.abs(rateOfChangePercent) > 40) return 'high';
    return 'medium';
  }

  if (type === 'z_score') {
    if (Math.abs(zScore) > 3.5) return 'critical';
    if (Math.abs(zScore) > 3.0) return 'high';
    if (Math.abs(zScore) > 2.5) return 'medium';
    return 'low';
  }

  // rate_of_change
  if (Math.abs(rateOfChangePercent) > 50) return 'critical';
  if (Math.abs(rateOfChangePercent) > 35) return 'high';
  if (Math.abs(rateOfChangePercent) > 25) return 'medium';
  return 'low';
}

/**
 * Generate a human-readable description for the anomaly.
 */
function describeAnomaly(
  index: number,
  value: number,
  zScore: number,
  rateOfChangePercent: number,
  type: AnomalyResult['type'],
  severity: AnomalySeverity
): string {
  const direction = zScore > 0 ? 'above' : 'below';
  const changeDirection = rateOfChangePercent > 0 ? 'increase' : 'decrease';

  const parts: string[] = [];

  if (type === 'z_score' || type === 'both') {
    parts.push(
      `Value ${value.toFixed(2)} at index ${index} is ${Math.abs(zScore).toFixed(2)} standard deviations ${direction} the mean`
    );
  }

  if (type === 'rate_of_change' || type === 'both') {
    parts.push(
      `${Math.abs(rateOfChangePercent).toFixed(1)}% ${changeDirection} from previous value`
    );
  }

  const severityPrefix: Record<AnomalySeverity, string> = {
    critical: '🚨 CRITICAL',
    high: '🔴 HIGH',
    medium: '🟡 MEDIUM',
    low: '🟢 LOW',
  };

  return `${severityPrefix[severity]}: ${parts.join('; ')}`;
}

/**
 * Detect anomalies in a numeric dataset using Z-score and rate-of-change analysis.
 *
 * @param data - Array of numeric values (time-series or sequential data)
 * @returns Array of AnomalyResult objects for each detected anomaly
 *
 * Thresholds:
 * - Z-score > 2.5 → anomaly, > 3.5 → critical
 * - Rate of change > 25% → medium anomaly, > 50% → critical
 */
export function detect(data: number[]): AnomalyResult[] {
  if (data.length < 3) return [];

  const m = mean(data);
  const sd = stdDev(data);

  // If standard deviation is 0 (all values identical), no anomalies
  if (sd === 0) return [];

  const results: AnomalyResult[] = [];

  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const zScore = (value - m) / sd;

    // Rate of change (compared to previous value)
    const prevValue = i > 0 ? data[i - 1] : value;
    const rateOfChange = value - prevValue;
    const rateOfChangePercent = prevValue !== 0 ? (rateOfChange / Math.abs(prevValue)) * 100 : 0;

    // Check thresholds
    const isZScoreAnomaly = Math.abs(zScore) > 2.5;
    const isRateOfChangeAnomaly = i > 0 && Math.abs(rateOfChangePercent) > 25;

    if (isZScoreAnomaly || isRateOfChangeAnomaly) {
      const type: AnomalyResult['type'] =
        isZScoreAnomaly && isRateOfChangeAnomaly
          ? 'both'
          : isZScoreAnomaly
            ? 'z_score'
            : 'rate_of_change';

      const severity = classifySeverity(zScore, rateOfChangePercent, type);
      const description = describeAnomaly(i, value, zScore, rateOfChangePercent, type, severity);

      results.push({
        index: i,
        value,
        zScore: Math.round(zScore * 100) / 100,
        rateOfChange: Math.round(rateOfChange * 100) / 100,
        rateOfChangePercent: Math.round(rateOfChangePercent * 100) / 100,
        severity,
        description,
        type,
      });
    }
  }

  return results;
}

/**
 * Convenience: detect anomalies and return only critical + high severity.
 */
export function detectCritical(data: number[]): AnomalyResult[] {
  return detect(data).filter((a) => a.severity === 'critical' || a.severity === 'high');
}

/**
 * Convenience: get a summary of anomaly detection results.
 */
export function detectSummary(data: number[]): {
  totalAnomalies: number;
  bySeverity: Record<AnomalySeverity, number>;
  byType: Record<AnomalyResult['type'], number>;
  anomalies: AnomalyResult[];
} {
  const anomalies = detect(data);

  const bySeverity: Record<AnomalySeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const byType: Record<AnomalyResult['type'], number> = {
    z_score: 0,
    rate_of_change: 0,
    both: 0,
  };

  for (const a of anomalies) {
    bySeverity[a.severity]++;
    byType[a.type]++;
  }

  return {
    totalAnomalies: anomalies.length,
    bySeverity,
    byType,
    anomalies,
  };
}
