import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // This is to handle node modules that use "fs"
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  eslint: {
    // Disable ESLint during build as we're handling it separately
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
