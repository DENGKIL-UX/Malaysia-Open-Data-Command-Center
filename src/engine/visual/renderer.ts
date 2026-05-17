// Satori + Sharp rendering pipeline — JSX → SVG → PNG

import satori from 'satori';
import sharp from 'sharp';
import { loadFonts } from './fonts';

export interface RenderOptions {
  width: number;
  height: number;
  element: React.ReactNode;
}

/**
 * Render a React element to a high-quality PNG using Satori + Sharp.
 *
 * Pipeline: JSX → Satori (SVG) → Sharp (PNG with sharpening)
 */
export async function renderToPng(options: RenderOptions): Promise<Buffer> {
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

  // Step 2: Convert SVG → PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png({
      quality: 100,
      compressionLevel: 6,
    })
    .toBuffer();

  return pngBuffer;
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
