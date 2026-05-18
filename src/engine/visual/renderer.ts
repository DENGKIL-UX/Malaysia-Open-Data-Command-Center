// Visual rendering pipeline — DEPRECATED SERVER-SIDE RENDERER
// Satori + Sharp have been removed due to Edge Runtime incompatibility.
// Infographic generation is now handled client-side via html-to-image
// (see InfographicModal component).
//
// This module provides dimension helpers only — the render functions
// return structured JSON data for client-side consumption.

export interface RenderOptions {
  width: number;
  height: number;
  element: React.ReactNode;
}

export interface RenderResult {
  buffer: Uint8Array;
  contentType: 'application/json';
  format: 'json';
}

/**
 * Get the dimensions for a given aspect ratio
 */
export function getExportDimensions(format: '16:9' | '9:16'): { width: number; height: number } {
  switch (format) {
    case '16:9':
      return { width: 1920, height: 1080 };
    case '9:16':
      return { width: 1080, height: 1920 };
    default:
      return { width: 1920, height: 1080 };
  }
}

/**
 * Server-side rendering is no longer supported.
 * Returns a JSON payload instructing the client to use client-side rendering.
 */
export async function render(options: RenderOptions): Promise<RenderResult> {
  const { width, height } = options;
  const payload = JSON.stringify({
    message: 'Server-side infographic rendering is not available on this runtime.',
    suggestion: 'Use the client-side InfographicModal with html-to-image for PNG export.',
    dimensions: { width, height },
    engine: 'client-side',
  });
  return {
    buffer: new TextEncoder().encode(payload),
    contentType: 'application/json',
    format: 'json',
  };
}

/**
 * Alias for render — returns JSON data only
 */
export async function renderToPng(options: RenderOptions): Promise<Uint8Array> {
  const result = await render(options);
  return result.buffer;
}
