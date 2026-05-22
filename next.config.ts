import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  // Cloudflare Workers compatibility:
  // - @opennextjs/cloudflare handles the build output format automatically
  // - No "output: standalone" needed (Node.js-specific, incompatible with CF Workers)
  // - Image optimization: sharp is NOT available on CF Workers → use unoptimized mode
  // - API routes MUST have `export const runtime = "edge"` for CF Workers compatibility

  images: {
    unoptimized: true,
  },

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
