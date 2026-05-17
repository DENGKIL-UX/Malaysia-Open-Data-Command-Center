/**
 * Data Ontology Graph — Correlation Engine
 *
 * Computes real statistical correlations between datasets for the
 * Malaysia Open Data Command Center. Uses Pearson correlation with
 * lag analysis, t-distribution p-values, and pairwise batch computation.
 *
 * Exported:
 *   - CorrelationResult  — interface for a single correlation result
 *   - CorrelationEngine  — class with compute / computeAll methods
 *   - correlationEngine  — singleton instance
 */

import type { RelationshipType } from "@/engine/ontology/types";

// ---------------------------------------------------------------------------
// Correlation Result
// ---------------------------------------------------------------------------

export interface CorrelationResult {
  datasetA:      string;
  datasetB:      string;
  pearson:       number;       // -1 to 1
  pValue:        number;       // Statistical significance
  dataPoints:    number;       // Overlapping periods
  lagMonths:     number;       // Best lag (0 = contemporaneous)
  isSignificant: boolean;      // pValue < 0.05
  edgeType:      RelationshipType;
  strength:      number;       // Absolute value of pearson
  label:         string;
  labelBM:       string;
}

// ---------------------------------------------------------------------------
// Internal constants
// ---------------------------------------------------------------------------

const MIN_DATA_POINTS = 6;
const MIN_ABS_R       = 0.3;
const ALPHA           = 0.05;

// ---------------------------------------------------------------------------
// Correlation Engine
// ---------------------------------------------------------------------------

export class CorrelationEngine {

  // -----------------------------------------------------------------------
  // Pearson Correlation Coefficient
  // -----------------------------------------------------------------------

  /**
   * Standard Pearson correlation coefficient.
   * Returns 0 when either array has zero variance or length mismatch.
   */
  private pearson(x: number[], y: number[]): number {
    const n = x.length;
    if (n === 0 || n !== y.length) return 0;

    let sumX = 0;
    let sumY = 0;
    for (let i = 0; i < n; i++) {
      sumX += x[i];
      sumY += y[i];
    }
    const meanX = sumX / n;
    const meanY = sumY / n;

    let num  = 0;
    let denX = 0;
    let denY = 0;

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      num  += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }

    const den = Math.sqrt(denX * denY);
    if (den === 0) return 0;

    // Clamp to [-1, 1] to handle floating-point drift
    return Math.max(-1, Math.min(1, num / den));
  }

  // -----------------------------------------------------------------------
  // Best Lag
  // -----------------------------------------------------------------------

  /**
   * Test correlations at lag 0, 1, … maxLag months.
   * A positive lag means A leads B: A[t] ↔ B[t + lag].
   * Returns the lag with the highest |r| and its correlation.
   */
  private bestLag(
    x: number[],
    y: number[],
    maxLag = 3,
  ): { lag: number; correlation: number } {
    let bestLag  = 0;
    let bestAbsR = 0;
    let bestR    = 0;

    for (let lag = 0; lag <= maxLag; lag++) {
      // Align: x[0 … n-lag-1] paired with y[lag … n-1]
      const xSlice = x.slice(0, x.length - lag);
      const ySlice = y.slice(lag);

      if (xSlice.length < MIN_DATA_POINTS) break;

      const r    = this.pearson(xSlice, ySlice);
      const absR = Math.abs(r);

      if (absR > bestAbsR) {
        bestAbsR = absR;
        bestR    = r;
        bestLag  = lag;
      }
    }

    return { lag: bestLag, correlation: bestR };
  }

  // -----------------------------------------------------------------------
  // p-Value (two-tailed, t-distribution)
  // -----------------------------------------------------------------------

  /**
   * Approximate two-tailed p-value for Pearson r using the
   * t-distribution with (n − 2) degrees of freedom.
   *
   * t = |r| × √((n − 2) / (1 − r²))
   * p = I_{df/(df+t²)}(df/2, ½)   via regularised incomplete beta
   */
  private pValue(r: number, n: number): number {
    if (n <= 2) return 1;

    const absR = Math.min(Math.abs(r), 0.9999); // avoid div-by-zero
    const t    = absR * Math.sqrt((n - 2) / (1 - absR * absR));
    const df   = n - 2;

    const x = df / (df + t * t);
    return this.regularisedIncompleteBeta(x, df / 2, 0.5);
  }

  // -----------------------------------------------------------------------
  // Regularised Incomplete Beta Function  I_x(a, b)
  // -----------------------------------------------------------------------

  /**
   * I_x(a, b) via continued-fraction (Lentz's method).
   * Uses symmetry relation when x > (a + 1) / (a + b + 2).
   */
  private regularisedIncompleteBeta(
    x: number,
    a: number,
    b: number,
  ): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    // Symmetry: I_x(a,b) = 1 − I_{1−x}(b,a)
    if (x > (a + 1) / (a + b + 2)) {
      return 1 - this.regularisedIncompleteBeta(1 - x, b, a);
    }

    const lnPrefix =
      a * Math.log(x) + b * Math.log(1 - x) - this.logBeta(a, b);

    // Continued fraction — Lentz's algorithm
    const maxIter = 200;
    const eps     = 1e-12;
    const tiny    = 1e-30;

    let f = 1;
    let c = 1;
    let d = 1 - ((a + b) * x) / (a + 1);

    if (Math.abs(d) < tiny) d = tiny;
    d = 1 / d;
    f = d;

    for (let m = 1; m <= maxIter; m++) {
      const m2 = 2 * m;

      // ── Even term ──
      let aa = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < tiny) d = tiny;
      c = 1 + aa / c;
      if (Math.abs(c) < tiny) c = tiny;
      d = 1 / d;
      f *= c * d;

      // ── Odd term ──
      aa = -((a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d;
      if (Math.abs(d) < tiny) d = tiny;
      c = 1 + aa / c;
      if (Math.abs(c) < tiny) c = tiny;
      d = 1 / d;
      const delta = c * d;
      f *= delta;

      if (Math.abs(delta - 1) < eps) break;
    }

    return Math.exp(lnPrefix) * f;
  }

  // -----------------------------------------------------------------------
  // Log Beta  &  Log Gamma
  // -----------------------------------------------------------------------

  /** ln B(a, b) = ln Γ(a) + ln Γ(b) − ln Γ(a + b) */
  private logBeta(a: number, b: number): number {
    return this.logGamma(a) + this.logGamma(b) - this.logGamma(a + b);
  }

  /** ln Γ(z) via Lanczos approximation (g = 7, n = 9 coefficients). */
  private logGamma(z: number): number {
    const c = [
      0.99999999999980993,   676.5203681218851,   -1259.1392167224028,
      771.32342877765313,   -176.61502916214059,    12.507343278686905,
      -0.13857109526572012,   9.9843695780195716e-6, 1.5056327351493116e-7,
    ];

    // Reflection formula for z < 0.5
    if (z < 0.5) {
      return (
        Math.log(Math.PI / Math.sin(Math.PI * z)) -
        this.logGamma(1 - z)
      );
    }

    z -= 1;
    let x = c[0];
    for (let i = 1; i < c.length; i++) {
      x += c[i] / (z + i);
    }

    const t = z + c.length - 1.5;
    return (
      0.5 * Math.log(2 * Math.PI) +
      (z + 0.5) * Math.log(t) -
      t +
      Math.log(x)
    );
  }

  // -----------------------------------------------------------------------
  // Time-Series Alignment
  // -----------------------------------------------------------------------

  /**
   * Align two time-series by date (normalised to YYYY-MM) and
   * return paired numeric value arrays plus overlap count.
   */
  private align(
    dataA:      Record<string, unknown>[],
    dataB:      Record<string, unknown>[],
    dateFieldA: string,
    dateFieldB: string,
    valueFieldA: string,
    valueFieldB: string,
  ): { a: number[]; b: number[]; n: number } {
    // Index dataset B by normalised date
    const mapB = new Map<string, number>();
    for (const row of dataB) {
      const key  = this.normaliseDate(row[dateFieldB]);
      const val  = Number(row[valueFieldB]);
      if (key !== null && !isNaN(val)) {
        mapB.set(key, val);
      }
    }

    // Walk dataset A and collect paired observations
    const a: number[] = [];
    const b: number[] = [];

    for (const row of dataA) {
      const key  = this.normaliseDate(row[dateFieldA]);
      const valA = Number(row[valueFieldA]);
      if (key === null || isNaN(valA)) continue;

      const valB = mapB.get(key);
      if (valB !== undefined) {
        a.push(valA);
        b.push(valB);
      }
    }

    return { a, b, n: a.length };
  }

  /**
   * Normalise various date representations to YYYY-MM
   * so that monthly data from different sources can be joined.
   */
  private normaliseDate(raw: unknown): string | null {
    if (raw == null) return null;

    // ── String ──
    if (typeof raw === "string") {
      const trimmed = raw.trim();

      // Already YYYY-MM or YYYY-MM-DD → extract YYYY-MM
      const m = trimmed.match(/^(\d{4})-(\d{2})/);
      if (m) return `${m[1]}-${m[2]}`;

      // Try native Date parse (handles ISO 8601, RFC 2822, etc.)
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      return null;
    }

    // ── Date object ──
    if (raw instanceof Date) {
      if (isNaN(raw.getTime())) return null;
      return `${raw.getFullYear()}-${String(raw.getMonth() + 1).padStart(2, "0")}`;
    }

    // ── Number (epoch ms or Excel serial) ──
    if (typeof raw === "number") {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
    }

    return null;
  }

  // -----------------------------------------------------------------------
  // Compute Single Pair
  // -----------------------------------------------------------------------

  /**
   * Compute the statistical correlation between two datasets.
   *
   * @returns `CorrelationResult` if the pair passes quality gates,
   *          or `null` if insufficient overlap / too weak.
   */
  compute(
    idA:    string,
    dataA:  Record<string, unknown>[],
    configA: { dateField: string; valueField: string },
    idB:    string,
    dataB:  Record<string, unknown>[],
    configB: { dateField: string; valueField: string },
  ): CorrelationResult | null {
    // ── 1. Align time series ──────────────────────────────────────────
    const { a, b, n } = this.align(
      dataA, dataB,
      configA.dateField, configB.dateField,
      configA.valueField, configB.valueField,
    );

    // Need at least 6 overlapping data points
    if (n < MIN_DATA_POINTS) return null;

    // ── 2. Find best lag and contemporaneous correlation ──────────────
    const { lag, correlation: r } = this.bestLag(a, b);

    // Skip correlations that are too weak
    if (Math.abs(r) < MIN_ABS_R) return null;

    // ── 3. Statistical significance ───────────────────────────────────
    const p             = this.pValue(r, n);
    const isSignificant = p < ALPHA;
    const strength      = Math.abs(r);

    // ── 4. Determine edge type ────────────────────────────────────────
    let edgeType: RelationshipType;
    if (lag > 0) {
      edgeType = "LEADS";
    } else if (r > 0) {
      edgeType = "CORRELATES_POSITIVE";
    } else {
      edgeType = "CORRELATES_NEGATIVE";
    }

    // ── 5. Build bilingual labels ─────────────────────────────────────
    const dirLabel   = r > 0 ? "positive" : "negative";
    const dirLabelBM = r > 0 ? "positif"  : "negatif";
    const lagLabel   = lag > 0 ? ` (leads by ${lag}m)`  : "";
    const lagLabelBM = lag > 0 ? ` (mendahului ${lag}bln)` : "";

    const label   = `${dirLabel} correlation r=${r.toFixed(2)}${lagLabel}`;
    const labelBM = `korelasi ${dirLabelBM} r=${r.toFixed(2)}${lagLabelBM}`;

    return {
      datasetA:      idA,
      datasetB:      idB,
      pearson:       r,
      pValue:        p,
      dataPoints:    n,
      lagMonths:     lag,
      isSignificant,
      edgeType,
      strength,
      label,
      labelBM,
    };
  }

  // -----------------------------------------------------------------------
  // Batch Compute All Pairs
  // -----------------------------------------------------------------------

  /**
   * Compute pairwise correlations across all provided datasets.
   * Datasets are identified by the keys of the record object.
   * Results are sorted by strength descending.
   */
  computeAll(
    datasets: Record<
      string,
      {
        data:   Record<string, unknown>[];
        config: { dateField: string; valueField: string };
      }
    >,
  ): CorrelationResult[] {
    const ids     = Object.keys(datasets);
    const results: CorrelationResult[] = [];

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const idA = ids[i];
        const idB = ids[j];
        const dsA = datasets[idA];
        const dsB = datasets[idB];

        const result = this.compute(
          idA, dsA.data, dsA.config,
          idB, dsB.data, dsB.config,
        );

        if (result) results.push(result);
      }
    }

    // Sort by strength descending
    results.sort((a, b) => b.strength - a.strength);

    return results;
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

export const correlationEngine = new CorrelationEngine();
