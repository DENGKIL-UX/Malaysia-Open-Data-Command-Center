// src/lib/dosm/github-sources.ts
// GitHub-based data sources separate from api.data.gov.my
// These require a different fetch strategy (raw CSV via GitHub API)

export interface GitHubDatasetDef {
  id: string;
  label: string;
  labelBM: string;
  category: string;
  url: string;
  fields: string[];
  valueField: string;
  dateField: string;
  groupField?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'annual';
  priority: 'P1' | 'P2' | 'P3';
  notes?: string;
}

export interface GitHubOrg {
  org: string;
  url: string;
  repos: Record<string, {
    url: string;
    purpose: string;
    datasets: Record<string, GitHubDatasetDef>;
  }>;
}

// ── GitHub Data Sources ──────────────────────────────────────
export const GITHUB_DATA_SOURCES: Record<string, GitHubOrg> = {
  'MoH-Malaysia': {
    org: 'MoH-Malaysia',
    url: 'https://github.com/MoH-Malaysia',
    repos: {
      'covid19-public': {
        url: 'https://github.com/MoH-Malaysia/covid19-public',
        purpose: 'COVID-19 public data',
        datasets: {
          cases_malaysia: {
            id: 'covid_cases_my',
            label: 'COVID-19 Cases (Malaysia)',
            labelBM: 'Kes COVID-19 (Malaysia)',
            category: 'Healthcare',
            url: 'https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_malaysia.csv',
            fields: ['date', 'cases_new', 'cases_import', 'cases_recovered', 'cases_active', 'deaths_new'],
            valueField: 'cases_new',
            dateField: 'date',
            frequency: 'daily',
            priority: 'P2',
            notes: 'Historical COVID-19 data — still updated',
          },
          cases_state: {
            id: 'covid_cases_state',
            label: 'COVID-19 Cases by State',
            labelBM: 'Kes COVID-19 mengikut Negeri',
            category: 'Healthcare',
            url: 'https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_state.csv',
            fields: ['date', 'state', 'cases_new', 'cases_recovered', 'deaths_new'],
            valueField: 'cases_new',
            dateField: 'date',
            groupField: 'state',
            frequency: 'daily',
            priority: 'P3',
          },
          hospital: {
            id: 'covid_hospital',
            label: 'COVID-19 Hospital Capacity',
            labelBM: 'Kapasiti Hospital COVID-19',
            category: 'Healthcare',
            url: 'https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/hospital.csv',
            fields: ['date', 'state', 'beds', 'beds_covid', 'admitted_covid', 'discharged_covid', 'hosp_covid'],
            valueField: 'hosp_covid',
            dateField: 'date',
            groupField: 'state',
            frequency: 'daily',
            priority: 'P3',
          },
          vax_malaysia: {
            id: 'covid_vax_my',
            label: 'COVID-19 Vaccination (Malaysia)',
            labelBM: 'Vaksinasi COVID-19 (Malaysia)',
            category: 'Healthcare',
            url: 'https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/vaccination/vax_malaysia.csv',
            fields: ['date', 'daily_partial', 'daily_full', 'cumul_partial', 'cumul_full', 'cumul_booster'],
            valueField: 'daily_full',
            dateField: 'date',
            frequency: 'daily',
            priority: 'P3',
          },
        },
      },
      'kkmnow-public': {
        url: 'https://github.com/MoH-Malaysia/kkmnow-public',
        purpose: 'KKMNow health dashboard data',
        datasets: {
          blood_donations: {
            id: 'blood_donations_github',
            label: 'Blood Donations (KKMNow)',
            labelBM: 'Penderma Darah (KKMNow)',
            category: 'Healthcare',
            url: 'https://raw.githubusercontent.com/MoH-Malaysia/kkmnow-public/main/blood/donations_state.csv',
            fields: ['date', 'state', 'daily', 'blood_a', 'blood_b', 'blood_o', 'blood_ab'],
            valueField: 'daily',
            dateField: 'date',
            groupField: 'state',
            frequency: 'daily',
            priority: 'P2',
          },
        },
      },
    },
  },

  'Treasury-Malaysia': {
    org: 'Treasury-Malaysia',
    url: 'https://github.com/Treasury-Malaysia',
    repos: {
      'data': {
        url: 'https://github.com/Treasury-Malaysia/data',
        purpose: 'Federal government fiscal data',
        datasets: {
          budget_revenue: {
            id: 'treasury_revenue',
            label: 'Federal Revenue',
            labelBM: 'Hasil Persekutuan',
            category: 'Finance',
            url: 'https://raw.githubusercontent.com/Treasury-Malaysia/data/main/budget/revenue.csv',
            fields: ['year', 'source', 'amount_rm_mil'],
            valueField: 'amount_rm_mil',
            dateField: 'year',
            groupField: 'source',
            frequency: 'annual',
            priority: 'P2',
            notes: 'Verify repo structure — may have changed',
          },
          budget_expenditure: {
            id: 'treasury_expenditure',
            label: 'Federal Expenditure',
            labelBM: 'Perbelanjaan Persekutuan',
            category: 'Finance',
            url: 'https://raw.githubusercontent.com/Treasury-Malaysia/data/main/budget/expenditure.csv',
            fields: ['year', 'ministry', 'amount_rm_mil'],
            valueField: 'amount_rm_mil',
            dateField: 'year',
            groupField: 'ministry',
            frequency: 'annual',
            priority: 'P2',
            notes: 'Verify repo structure — may have changed',
          },
          federal_debt: {
            id: 'treasury_debt',
            label: 'Federal Debt',
            labelBM: 'Hutang Persekutuan',
            category: 'Finance',
            url: 'https://raw.githubusercontent.com/Treasury-Malaysia/data/main/debt/federal.csv',
            fields: ['date', 'domestic', 'external', 'total'],
            valueField: 'total',
            dateField: 'date',
            frequency: 'monthly',
            priority: 'P2',
            notes: 'Verify repo structure — may have changed',
          },
        },
      },
    },
  },
};

// ── Flat list of all GitHub datasets ────────────────────────
export function getAllGitHubDatasets(): GitHubDatasetDef[] {
  const all: GitHubDatasetDef[] = [];
  for (const org of Object.values(GITHUB_DATA_SOURCES)) {
    for (const repo of Object.values(org.repos)) {
      for (const dataset of Object.values(repo.datasets)) {
        all.push(dataset);
      }
    }
  }
  return all;
}

// ── GitHub CSV Fetcher (server-side only) ────────────────────
export async function fetchGitHubCSV(
  rawUrl: string,
  valueField: string,
  dateField: string,
  limit?: number
): Promise<{
  data: Record<string, unknown>[];
  fields: string[];
  source: string;
  fetchedAt: Date;
}> {
  const res = await fetch(rawUrl, {
    headers: {
      'Accept': 'text/plain',
      'User-Agent': 'MalaysiaOpenDataCommandCenter/1.0',
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`GitHub fetch failed: ${res.status} — ${rawUrl}`);
  }

  const csv = await res.text();
  const parsed = parseCSV(csv);

  const sorted = parsed
    .filter(row => row[dateField])
    .sort((a, b) =>
      new Date(String(b[dateField])).getTime() -
      new Date(String(a[dateField])).getTime()
    );

  return {
    data: limit ? sorted.slice(0, limit) : sorted,
    fields: Object.keys(parsed[0] ?? {}),
    source: rawUrl,
    fetchedAt: new Date(),
  };
}

function parseCSV(text: string): Record<string, unknown>[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const val = values[i];
      row[h] = val && !isNaN(Number(val)) ? Number(val) : val;
    });
    return row;
  });
}
