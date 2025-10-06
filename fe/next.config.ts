import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Only run ESLint on these directories during builds
    dirs: ["src", "pages", "components", "lib", "app"],
    // Ignore ESLint errors during build (for deployment)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Don't run TypeScript checking during build if we have type errors
    ignoreBuildErrors: false,
  },
  // Experimental features that might help with build performance
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },
};

export default nextConfig;
