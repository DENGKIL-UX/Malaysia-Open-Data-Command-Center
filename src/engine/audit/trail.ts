// ============================================================================
// Malaysia Open Data Command Center — Audit Trail Engine
// Full implementation for tracking all user/system actions
// Stores in localStorage with session tracking
// ============================================================================

type AuditEventType =
  | 'DATA_ACCESS'
  | 'INSIGHT_GENERATED'
  | 'EXPORT_PNG'
  | 'ANOMALY_DETECTED'
  | 'CONFIDENCE_CALCULATED'
  | 'GRAPH_TRAVERSED'
  | 'COMMAND_EXECUTED'
  | 'FILTER_APPLIED'
  | 'TAB_CHANGED'
  | 'LANGUAGE_TOGGLED'
  | 'INFOGRAPHIC_GENERATED';

export interface AuditEvent {
  id: string;
  ts: number; // Unix timestamp
  type: AuditEventType;
  actor: 'USER' | 'SYSTEM';
  dataset: string;
  action: string;
  outcome: 'SUCCESS' | 'FAILED';
  meta?: Record<string, unknown>;
  sessionId: string;
}

class AuditTrail {
  private readonly MAX_EVENTS = 500;
  private readonly STORE_KEY = 'intel_audit_v2';

  private getSession(): string {
    if (typeof window === 'undefined') return 'server';
    let id = sessionStorage.getItem('intel_session');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('intel_session', id);
    }
    return id;
  }

  log(
    type: AuditEventType,
    dataset: string,
    action: string,
    outcome: 'SUCCESS' | 'FAILED' = 'SUCCESS',
    meta?: Record<string, unknown>
  ): void {
    if (typeof window === 'undefined') return;

    const event: AuditEvent = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      type,
      actor:
        type === 'DATA_ACCESS' ||
        type === 'COMMAND_EXECUTED' ||
        type === 'TAB_CHANGED' ||
        type === 'LANGUAGE_TOGGLED'
          ? 'USER'
          : 'SYSTEM',
      dataset,
      action,
      outcome,
      meta,
      sessionId: this.getSession(),
    };

    try {
      const existing: AuditEvent[] = JSON.parse(
        localStorage.getItem(this.STORE_KEY) ?? '[]'
      );
      existing.push(event);
      localStorage.setItem(
        this.STORE_KEY,
        JSON.stringify(existing.slice(-this.MAX_EVENTS))
      );
    } catch {
      // Storage full or unavailable — silently fail
    }

    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log(
        `[AUDIT] ${event.type} | ${event.dataset} | ${event.action}`,
        meta ?? ''
      );
    }
  }

  getAll(): AuditEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(this.STORE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  getRecent(n = 20): AuditEvent[] {
    return this.getAll().slice(-n).reverse();
  }

  getByDataset(dataset: string): AuditEvent[] {
    return this.getAll().filter((e) => e.dataset === dataset);
  }

  getByType(type: AuditEventType): AuditEvent[] {
    return this.getAll().filter((e) => e.type === type);
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORE_KEY);
    }
  }

  // ── Shorthand methods ──
  access = (d: string, meta?: Record<string, unknown>) =>
    this.log('DATA_ACCESS', d, `Accessed ${d}`, 'SUCCESS', meta);

  insight = (d: string, h: string) =>
    this.log('INSIGHT_GENERATED', d, h, 'SUCCESS');

  export_ = (d: string, fmt: string) =>
    this.log('EXPORT_PNG', d, `Exported ${fmt}`, 'SUCCESS');

  anomaly = (d: string, desc: string) =>
    this.log('ANOMALY_DETECTED', d, desc, 'SUCCESS');

  command = (cmd: string) =>
    this.log('COMMAND_EXECUTED', cmd, `CMD: ${cmd}`, 'SUCCESS');

  filter = (d: string, filters: Record<string, unknown>) =>
    this.log('FILTER_APPLIED', d, 'Filter applied', 'SUCCESS', filters);

  tabChange = (tab: string) =>
    this.log('TAB_CHANGED', 'ui', `Switched to ${tab}`, 'SUCCESS');

  langToggle = (lang: string) =>
    this.log('LANGUAGE_TOGGLED', 'ui', `Switched to ${lang}`, 'SUCCESS');

  infographic = (datasetId: string, format: string) =>
    this.log('INFOGRAPHIC_GENERATED', datasetId, `Generated ${format} infographic`, 'SUCCESS');
}

export const auditTrail = new AuditTrail();
