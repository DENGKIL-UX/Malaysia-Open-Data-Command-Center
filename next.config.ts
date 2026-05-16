import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // Cloudflare Pages compatibility:
  // - Removed "output: standalone" (Node.js-specific, incompatible with CF Pages)
  // - @cloudflare/next-on-pages handles the build output format automatically
  // - Edge runtime used for API routes (see individual route.ts files)

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
