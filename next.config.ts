import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ['21.0.5.95'],

  // Cloudflare Workers compatibility:
  // - @opennextjs/cloudflare handles the build output format automatically
  // - No "output: standalone" needed (Node.js-specific, incompatible with CF Workers)
  // - No explicit edge runtime needed in API routes (handled by adapter)

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
