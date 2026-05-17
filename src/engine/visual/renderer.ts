// Satori + Sharp rendering pipeline — JSX → SVG → PNG
// On Cloudflare Workers, sharp is unavailable, so we fall back to SVG output.

import satori from 'satori';
import { loadFonts } from './fonts';

export interface RenderOptions {
  width: number;
  height: number;
  element: React.ReactNode;
}

export interface RenderResult {
  buffer: Buffer;
  contentType: 'image/png' | 'image/svg+xml';
  format: 'png' | 'svg';
}

/**
 * Check if sharp is available in the current runtime.
 * Sharp is a native Node.js addon and won't work in edge/worker runtimes.
 */
async function isSharpAvailable(): Promise<boolean> {
  try {
    await import('sharp');
    return true;
  } catch {
    return false;
  }
}

/**
 * Render a React element to PNG (using Satori + Sharp) or SVG (Satori only).
 *
 * Pipeline: JSX → Satori (SVG) → Sharp (PNG)  [Node.js runtime]
 * Pipeline: JSX → Satori (SVG)                [Edge/Worker runtime]
 */
export async function renderToPng(options: RenderOptions): Promise<Buffer> {
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
  const fonts = await loadFonts();

  // Step 1: Render JSX → SVG using Satori
  const svg = await satori(element as Parameters<typeof satori>[0], {
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

  // Step 2: Try Sharp SVG → PNG conversion (Node.js only)
  if (await isSharpAvailable()) {
    const sharp = (await import('sharp')).default;
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({
        quality: 100,
        compressionLevel: 6,
      })
      .toBuffer();

    return {
      buffer: pngBuffer,
      contentType: 'image/png',
      format: 'png',
    };
  }

  // Fallback: Return raw SVG (Cloudflare Workers / edge runtime)
  return {
    buffer: Buffer.from(svg),
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
