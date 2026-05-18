/**
 * useCopilot Hook (compatibility layer)
 * Provides registerView/registerSelection no-ops for dashboard sections
 * that previously used the CopilotProvider context.
 * The actual copilot logic is in useCopilot.ts (the active hook).
 */

// No-op stubs for backward compatibility with dashboard sections
// that imported registerView/registerSelection from this hook.
// These are safe to call but do nothing since the CopilotProvider
// has been consolidated into the single CopilotPanel system.

export function useCopilotContext() {
  return {
    context: { currentView: 'overview' },
    registerView: (_view: string, _metadata?: Record<string, unknown>) => {},
    registerSelection: (_type: 'state' | 'dataset' | 'metric', _value: string) => {},
  };
}

// Re-export registerView and registerSelection as individual functions
// for components that destructure them from useCopilot
export function useCopilot() {
  return {
    registerView: (_view: string, _metadata?: Record<string, unknown>) => {},
    registerSelection: (_type: 'state' | 'dataset' | 'metric', _value: string) => {},
    context: { currentView: 'overview' },
    executeAction: (_action: unknown) => {},
  };
}
