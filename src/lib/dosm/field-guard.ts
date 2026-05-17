// src/lib/dosm/field-guard.ts
// Prevents wrong field names from silently breaking charts and data displays.
// When the upstream API changes a column name (e.g. "u_rate" → "unemployment_rate"),
// charts that reference the old name render blank without any visible error.
// This module catches those mismatches early and provides actionable suggestions.

import { type DatasetConfig, DOSM_REGISTRY, type DatasetId } from './registry';

// ── PUBLIC TYPES ──────────────────────────────────────────────

export interface FieldGuardResult {
  /** `true` only when ALL expected fields exist in the data */
  safe: boolean;
  /** Field names found in the first data row */
  actualFields: string[];
  /** Expected fields that were NOT found in the data */
  missingFields: string[];
  /** Human-readable suggestion listing actual fields */
  suggestion: string;
}

// ── INTERNAL HELPERS ──────────────────────────────────────────

/**
 * Collect the core expected field names: valueField, dateField,
 * and the optional groupField.
 */
function collectExpectedFields(
  expected: { valueField: string; dateField: string; groupField?: string },
): string[] {
  const fields = [expected.valueField, expected.dateField];
  if (expected.groupField) {
    fields.push(expected.groupField);
  }
  return fields;
}

/**
 * Build a readable suggestion string that lists the actual fields
 * found in the data, so developers can quickly identify the correct
 * field names to use.
 */
function buildSuggestion(
  datasetId: string,
  actualFields: string[],
  missingFields: string[],
): string {
  if (missingFields.length === 0) {
    return `[field-guard:${datasetId}] All expected fields present.`;
  }

  const fieldList = actualFields.length > 0
    ? actualFields.map(f => `"${f}"`).join(', ')
    : '(none — data is empty)';

  return (
    `[field-guard:${datasetId}] Missing fields: ${missingFields.join(', ')}. ` +
    `Actual fields in data: ${fieldList}. ` +
    `Update the registry config or check if the upstream API schema changed.`
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────

/**
 * Validate that the supplied data rows contain the expected field names.
 *
 * @param data        - Array of row objects returned from the API
 * @param datasetId   - Identifier used for logging / suggestions
 * @param expectedFields - Which fields must exist (valueField & dateField required;
 *                          groupField is optional)
 * @returns A `FieldGuardResult` describing whether the data is safe to render.
 */
export function guardFields(
  data: Record<string, any>[],
  datasetId: string,
  expectedFields: {
    valueField: string;
    dateField: string;
    groupField?: string;
  },
): FieldGuardResult {
  // 1. Empty data → not safe
  if (!data || data.length === 0) {
    const missing = [expectedFields.valueField, expectedFields.dateField];
    if (expectedFields.groupField) missing.push(expectedFields.groupField);

    const suggestion =
      `[field-guard:${datasetId}] Data array is empty. ` +
      `Cannot verify fields: ${missing.join(', ')}.`;

    console.error(
      `[field-guard] dataset=${datasetId} | data is empty | ` +
      `expected fields: ${missing.join(', ')}`,
    );

    return {
      safe: false,
      actualFields: [],
      missingFields: missing,
      suggestion,
    };
  }

  // 2. Get actual field names from the first row
  const firstRow = data[0];
  const actualFields = Object.keys(firstRow);

  // 3. Compare with expected fields
  const expected = collectExpectedFields(expectedFields);
  const actualSet = new Set(actualFields);
  const missingFields = expected.filter(f => !actualSet.has(f));

  // 4. Build result
  const safe = missingFields.length === 0;
  const suggestion = buildSuggestion(datasetId, actualFields, missingFields);

  // 5. Log to console.error when fields are missing
  if (!safe) {
    console.error(
      `[field-guard] dataset=${datasetId} | ` +
      `missing=[${missingFields.join(', ')}] | ` +
      `expected=[${expected.join(', ')}] | ` +
      `actual=[${actualFields.join(', ')}]`,
    );
  }

  return {
    safe,
    actualFields,
    missingFields,
    suggestion,
  };
}

// ── REGISTRY VALIDATION HELPER ────────────────────────────────

/**
 * Validate live data against a full registry entry.
 *
 * This is a convenience wrapper around `guardFields` that pulls
 * `valueField`, `dateField`, and `groupField` from the registry
 * config and also validates `extraFields`.
 *
 * @param data     - Array of row objects returned from the API
 * @param config   - A `DatasetConfig` object (usually from `DOSM_REGISTRY`)
 * @returns A `FieldGuardResult` describing whether the data is safe to render.
 */
export function validateRegistryEntry(
  data: Record<string, any>[],
  config: DatasetConfig,
): FieldGuardResult {
  const expectedFields: { valueField: string; dateField: string; groupField?: string } = {
    valueField: config.valueField,
    dateField: config.dateField,
    groupField: config.groupField,
  };

  // Run the base guard (this already logs on mismatch)
  const baseResult = guardFields(data, config.id, expectedFields);

  // If there are extraFields, also check those
  if (config.extraFields?.length) {
    const actualSet = new Set(baseResult.actualFields);
    const missingExtra = config.extraFields.filter(f => !actualSet.has(f));

    if (missingExtra.length > 0) {
      // Merge missing extra fields into the result
      const allMissing = [...baseResult.missingFields, ...missingExtra];
      const mergedSuggestion =
        `[field-guard:${config.id}] Missing fields: ${allMissing.join(', ')}. ` +
        `Actual fields in data: ${baseResult.actualFields.map(f => `"${f}"`).join(', ')}. ` +
        `Update the registry config or check if the upstream API schema changed.`;

      console.error(
        `[field-guard] dataset=${config.id} | ` +
        `missing-extra=[${missingExtra.join(', ')}] | ` +
        `expected-extra=[${config.extraFields.join(', ')}] | ` +
        `actual=[${baseResult.actualFields.join(', ')}]`,
      );

      return {
        safe: false,
        actualFields: baseResult.actualFields,
        missingFields: allMissing,
        suggestion: mergedSuggestion,
      };
    }
  }

  return baseResult;
}

// ── BULK VALIDATION ───────────────────────────────────────────

/**
 * Validate all (or a subset of) registry datasets against supplied data.
 * Useful for startup health-checks or CI smoke tests.
 *
 * @param dataMap - A map from dataset id to its data array
 * @param ids     - Optional list of dataset ids to check; defaults to all in registry
 * @returns A map from dataset id to its `FieldGuardResult`
 */
export function validateAllRegistryEntries(
  dataMap: Partial<Record<DatasetId, Record<string, any>[]>>,
  ids?: DatasetId[],
): Record<string, FieldGuardResult> {
  const targets = ids ?? (Object.keys(DOSM_REGISTRY) as DatasetId[]);
  const results: Record<string, FieldGuardResult> = {};

  for (const id of targets) {
    const config = DOSM_REGISTRY[id];
    const data = dataMap[id];

    if (!config) {
      results[id] = {
        safe: false,
        actualFields: [],
        missingFields: [],
        suggestion: `[field-guard:${id}] Dataset not found in registry.`,
      };
      continue;
    }

    if (!data) {
      results[id] = {
        safe: false,
        actualFields: [],
        missingFields: [config.valueField, config.dateField],
        suggestion:
          `[field-guard:${id}] No data supplied for validation. ` +
          `Expected fields: ${config.valueField}, ${config.dateField}` +
          (config.groupField ? `, ${config.groupField}` : '') + '.',
      };
      continue;
    }

    results[id] = validateRegistryEntry(data, config);
  }

  return results;
}
