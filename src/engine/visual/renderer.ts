// Visual rendering pipeline — JSX → SVG → PNG
// On Cloudflare Workers / Edge Runtime, both satori and sharp may be unavailable.
// Satori is imported statically (it IS edge-compatible as pure JS/WASM),
// while sharp is loaded dynamically since it's a native C++ addon.
// Fully compatible with Edge Runtime (Cloudflare Workers, Vercel Edge, etc.)

import satori from 'satori';
import { loadFonts } from './fonts';

export interface RenderOptions {
  width: number;
  height: number;
  element: React.ReactNode;
}

export interface RenderResult {
  buffer: Uint8Array;
  contentType: 'image/png' | 'image/svg+xml';
  format: 'png' | 'svg';
}

/**
 * Convert a string to Uint8Array (edge-safe replacement for Buffer.from)
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Render a React element to PNG (using Satori + Sharp) or SVG (Satori only).
 *
 * Pipeline: JSX → Satori (SVG) → Sharp (PNG)  [Node.js runtime]
 * Pipeline: JSX → Satori (SVG)                [Edge/Worker runtime]
 */
export async function renderToPng(options: RenderOptions): Promise<Uint8Array> {
  const result = await render(options);
  return result.buffer;
}

/**
 * Render a React element to PNG or SVG depending on runtime capability.
 * Returns both the buffer and metadata about the output format.
 */
export async function render(options: RenderOptions): Promise<RenderResult> {
  const { width, height, element } = options;

  // Load fonts for Satori
  let fonts: Awaited<ReturnType<typeof loadFonts>>;
  try {
    fonts = await loadFonts();
  } catch (err) {
    throw new Error(
      `Font loading failed in this runtime environment: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 1: Render JSX → SVG using Satori
  let svg: string;
  try {
    svg = await satori(element as Parameters<typeof satori>[0], {
      width,
      height,
      fonts: fonts.length > 0 ? fonts.map(f => ({
        name: f.name,
        data: f.data,
        weight: f.weight as 400 | 600 | 700 | 800,
        style: f.style as 'normal',
      })) : undefined,
      embedFont: true,
    });
  } catch (err) {
    throw new Error(
      `Satori rendering failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 2: Try Sharp SVG → PNG conversion (Node.js only)
  // Sharp is a native C++ addon that cannot run on edge/worker runtimes.
  // We check for Node.js at runtime to avoid loading it on Workers.
  let sharpModule: any = null;
  try {
    if (typeof globalThis.process !== 'undefined') {
      const sharp = await import('sharp');
      sharpModule = sharp.default || sharp;
    }
  } catch {
    // sharp not available (edge runtime or not installed)
  }

  if (sharpModule) {
    try {
      const pngBuffer = await sharpModule(stringToUint8Array(svg))
        .png({
          quality: 100,
          compressionLevel: 6,
        })
        .toBuffer();

      return {
        buffer: new Uint8Array(pngBuffer),
        contentType: 'image/png',
        format: 'png',
      };
    } catch {
      // Sharp failed, fall back to SVG
    }
  }

  // Fallback: Return raw SVG (Cloudflare Workers / edge runtime)
  return {
    buffer: stringToUint8Array(svg),
    contentType: 'image/svg+xml',
    format: 'svg',
  };
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
