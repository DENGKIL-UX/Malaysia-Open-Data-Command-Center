// src/lib/dosm/yaml-sync.ts
// Reads YAML metadata from github.com/data-gov-my/datagovmy-meta
// to validate and keep our registry in sync with upstream changes

const YAML_BASE =
  'https://raw.githubusercontent.com/data-gov-my/datagovmy-meta/main/data-catalogue';

export interface ParsedYAML {
  id: string;
  title_en: string;
  title_ms: string;
  frequency: string;
  geography: string;
  fields: ParsedField[];
  dateField: string;
  valueFields: string[];
  groupFields: string[];
}

interface ParsedField {
  id: string;
  type: string;
  unit?: string;
  choices?: string[];
}

/**
 * Fetch and parse a dataset's YAML definition from datagovmy-meta.
 * Uses a minimal YAML parser that handles the specific structure.
 * Server-side only — requires network access to GitHub.
 */
export async function fetchAndParseYAML(
  datasetId: string
): Promise<ParsedYAML | null> {
  const url = `${YAML_BASE}/${datasetId}.yaml`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    if (!res.ok) return null;

    const text = await res.text();
    return parseMinimalYAML(text, datasetId);
  } catch {
    return null;
  }
}

/**
 * Minimal YAML parser for datagovmy-meta YAML files.
 * Handles the specific structure without external dependencies.
 */
function parseMinimalYAML(text: string, id: string): ParsedYAML {
  const lines = text.split('\n');

  const get = (key: string): string => {
    const line = lines.find(l => l.startsWith(`${key}:`));
    return line ? line.replace(`${key}:`, '').trim().replace(/['"]/g, '') : '';
  };

  const fields: ParsedField[] = [];
  const dateFields: string[] = [];
  const valueFields: string[] = [];
  const groupFields: string[] = [];

  let inFields = false;
  let currentField: Partial<ParsedField> = {};

  lines.forEach(line => {
    if (line.trim() === 'fields:') {
      inFields = true;
      return;
    }
    if (!inFields) return;

    // New field entry
    if (line.match(/^\s+- id:/)) {
      // Push previous field
      if (currentField.id) {
        fields.push(currentField as ParsedField);
        if (currentField.type === 'date') {
          dateFields.push(currentField.id);
        } else if (['float', 'integer'].includes(currentField.type ?? '')) {
          valueFields.push(currentField.id);
        } else if (currentField.type === 'categorical') {
          groupFields.push(currentField.id);
        }
      }
      currentField = { id: line.replace(/.*- id:/, '').trim() };
    } else if (line.match(/^\s+type:/)) {
      currentField.type = line.replace(/.*type:/, '').trim();
    } else if (line.match(/^\s+unit:/)) {
      currentField.unit = line.replace(/.*unit:/, '').trim();
    }
  });

  // Push last field
  if (currentField.id) {
    fields.push(currentField as ParsedField);
    if (currentField.type === 'date') {
      dateFields.push(currentField.id);
    } else if (['float', 'integer'].includes(currentField.type ?? '')) {
      valueFields.push(currentField.id);
    } else if (currentField.type === 'categorical') {
      groupFields.push(currentField.id);
    }
  }

  return {
    id,
    title_en: get('title_en'),
    title_ms: get('title_ms'),
    frequency: get('frequency'),
    geography: get('geography'),
    fields,
    dateField: dateFields[0] ?? 'date',
    valueFields,
    groupFields,
  };
}

/**
 * Validate a registry entry against the live YAML definition.
 * Returns validation result with errors and warnings.
 */
export async function validateRegistryAgainstYAML(
  datasetId: string,
  ourConfig: {
    valueField: string;
    dateField: string;
    groupField?: string;
  }
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  yaml?: ParsedYAML;
}> {
  const yaml = await fetchAndParseYAML(datasetId);
  if (!yaml) {
    return {
      valid: false,
      errors: [`YAML not found for "${datasetId}" — dataset may not exist`],
      warnings: [],
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate valueField
  if (
    !yaml.valueFields.includes(ourConfig.valueField) &&
    !yaml.fields.find(f => f.id === ourConfig.valueField)
  ) {
    errors.push(
      `valueField "${ourConfig.valueField}" not in YAML. ` +
      `Available numeric fields: ${yaml.valueFields.join(', ')}`
    );
  }

  // Validate dateField
  if (yaml.dateField !== ourConfig.dateField) {
    warnings.push(
      `dateField mismatch: we use "${ourConfig.dateField}", ` +
      `YAML says "${yaml.dateField}"`
    );
  }

  // Validate groupField
  if (
    ourConfig.groupField &&
    !yaml.groupFields.includes(ourConfig.groupField)
  ) {
    errors.push(
      `groupField "${ourConfig.groupField}" not categorical in YAML. ` +
      `Categorical fields: ${yaml.groupFields.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    yaml,
  };
}

/**
 * Validate multiple P0/P1 datasets against their YAML definitions.
 * Returns a summary of results.
 */
export async function validatePriorityDatasets(
  registry: Record<string, { id?: string; valueField: string; dateField: string; groupField?: string; priority?: string }>
): Promise<{
  passed: string[];
  failed: Array<{ id: string; reason: string }>;
  summary: string;
}> {
  const passed: string[] = [];
  const failed: Array<{ id: string; reason: string }> = [];

  const p0p1 = Object.entries(registry).filter(
    ([, v]) => v.priority === 'P0' || v.priority === 'P1'
  );

  for (const [key, config] of p0p1) {
    const result = await validateRegistryAgainstYAML(config.id ?? key, {
      valueField: config.valueField,
      dateField: config.dateField,
      groupField: config.groupField,
    });

    if (!result.valid) {
      failed.push({
        id: key,
        reason: result.errors.join('; '),
      });
    } else if (result.warnings.length > 0) {
      console.warn(`⚠️  ${key} (${config.id}): ${result.warnings.join(', ')}`);
      passed.push(key);
    } else {
      passed.push(key);
    }
  }

  const summary = `${passed.length}/${p0p1.length} P0/P1 datasets passed YAML validation`;
  return { passed, failed, summary };
}
