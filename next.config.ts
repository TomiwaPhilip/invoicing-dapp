import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  serverExternalPackages: ["@mysten/dapp-kit"],
};

export default nextConfig;
