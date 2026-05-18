// Satori + Sharp rendering pipeline — JSX → SVG → PNG
// On Cloudflare Workers, sharp is unavailable, so we fall back to SVG output.
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
 * Dynamically load sharp at runtime without letting the bundler know about it.
 *
 * Sharp is a native C++ Node.js addon (libvips) that:
 * - Cannot be bundled by esbuild/Turbopack for edge/worker runtimes
 * - Won't exist in Cloudflare Workers environment
 * - Must be loaded completely dynamically to prevent build failures
 *
 * We use `new Function()` to construct the import at runtime,
 * which prevents static analysis by bundlers (Turbopack, webpack, esbuild).
 */
async function loadSharp(): Promise<any> {
  try {
    // Use indirect dynamic import that bundlers cannot statically analyze.
    // The `new Function` constructor creates a function at runtime,
    // so the string 'sharp' never appears as a static import/require.
    // On Cloudflare Workers / Edge Runtime, this will simply fail and return null.
    const dynamicImport = new Function('module', 'return import(module)');
    const mod = await dynamicImport('sharp');
    return mod.default || mod;
  } catch {
    return null;
  }
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
      `Satori rendering is not supported in this environment: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Step 2: Try Sharp SVG → PNG conversion (Node.js only)
  const sharpModule = await loadSharp();
  if (sharpModule) {
    const pngBuffer = await sharpModule(Buffer.from(svg))
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
