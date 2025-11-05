import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
    // allow external https images (wildcard) for dynamic sources used in content
    remotePatterns: [
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
