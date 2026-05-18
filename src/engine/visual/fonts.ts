// Font loader for Satori — minimal set for server-side rendering
// Uses Google Fonts API to get binary font data
// Caches fonts in memory for subsequent requests

interface FontData {
  name: string;
  weight: number;
  style: 'normal' | 'italic';
  data: ArrayBuffer;
}

const FONT_CACHE = new Map<string, ArrayBuffer>();
let fontsLoaded = false;
let cachedFonts: FontData[] = [];

async function fetchFont(name: string, weight: number): Promise<ArrayBuffer> {
  const cacheKey = `${name}-${weight}`;
  if (FONT_CACHE.has(cacheKey)) {
    return FONT_CACHE.get(cacheKey)!;
  }

  const googleFontsMap: Record<string, string> = {
    'Inter': 'Inter',
    'JetBrains Mono': 'JetBrains+Mono',
  };

  const family = googleFontsMap[name];
  if (!family) {
    return new ArrayBuffer(0);
  }

  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
    const cssResponse = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const cssText = await cssResponse.text();

    const urlMatch = cssText.match(/src:\s*url\(([^)]+)\)/);
    if (!urlMatch) {
      return new ArrayBuffer(0);
    }

    const fontUrl = urlMatch[1];
    const fontResponse = await fetch(fontUrl);
    const fontData = await fontResponse.arrayBuffer();

    FONT_CACHE.set(cacheKey, fontData);
    return fontData;
  } catch {
    return new ArrayBuffer(0);
  }
}

export async function loadFonts(): Promise<FontData[]> {
  if (fontsLoaded && cachedFonts.length > 0) {
    return cachedFonts;
  }

  // Minimal font set: Inter (body) + JetBrains Mono (data)
  const fontConfigs: Array<{ name: string; weight: number }> = [
    { name: 'Inter', weight: 400 },
    { name: 'Inter', weight: 600 },
    { name: 'Inter', weight: 700 },
    { name: 'Inter', weight: 800 },
    { name: 'JetBrains Mono', weight: 400 },
    { name: 'JetBrains Mono', weight: 700 },
  ];

  const results = await Promise.allSettled(
    fontConfigs.map(async (config) => {
      const data = await fetchFont(config.name, config.weight);
      if (data.byteLength > 0) {
        return {
          name: config.name,
          weight: config.weight,
          style: 'normal' as const,
          data,
        };
      }
      return null;
    })
  );

  const fonts: FontData[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      fonts.push(result.value);
    }
  }

  cachedFonts = fonts;
  fontsLoaded = true;
  return fonts;
}
