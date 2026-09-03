import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    optimizeCss: true,
    optimizePackageImports: ['@/components'],
    // Disable web vitals in development to prevent errors
    webVitalsAttribution: [],
    // Optimized caching strategy
    inlineCss: true,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },

  // Production optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Caching optimization
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50MB
};

export default nextConfig;
