import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer remotePatterns over the deprecated `domains` setting.
    // Allow ImageKit plus any https external hosts used for dynamic content.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      // allow external https images (wildcard) for dynamic sources used in content
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  // Configure server to bind to localhost on Windows
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001"],
    },
  },
};

export default nextConfig;
