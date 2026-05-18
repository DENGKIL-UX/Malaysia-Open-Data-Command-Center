// Visual rendering pipeline — Client-side infographic helper
// Infographic generation is handled entirely client-side via html-to-image
// (see InfographicModal / infographic-preview components).
//
// This module provides dimension helpers for infographic exports.

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
