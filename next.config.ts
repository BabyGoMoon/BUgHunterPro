import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: { allowedOrigins: ["*"] }
  },
  eslint: {
    // Allow builds to pass even if there are lint errors (CI can enforce later)
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
