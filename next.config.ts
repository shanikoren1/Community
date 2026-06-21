import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve static assets with long-lived cache headers
  async headers() {
    return [
      {
        source: "/:file(.*\\.(?:webp|jpg|jpeg|png|svg|ico|woff2|woff))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  // Compress responses
  compress: true,
};

export default nextConfig;
