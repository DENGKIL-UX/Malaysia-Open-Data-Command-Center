import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ['21.0.5.95'],

  // Cloudflare Workers compatibility:
  // NOTE: Do NOT add "sharp" to serverExternalPackages — it creates an
  // [externals] chunk that esbuild then fails to resolve during the
  // OpenNext Cloudflare build. Instead, renderer.ts loads sharp via
  // new Function() to hide it from static analysis.
  // - @opennextjs/cloudflare handles the build output format automatically
  // - No "output: standalone" needed (Node.js-specific, incompatible with CF Workers)
  // - IMPORTANT: API routes MUST have `export const runtime = "edge"` at the top
  //   Without it, Cloudflare Workers returns 404 for the route

  // Static asset headers for caching GeoJSON and other large files
  async headers() {
    return [
      {
        source: "/geodata/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
