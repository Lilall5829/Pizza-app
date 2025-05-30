/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase images
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "qvaydsqqgpufbzjudzod.supabase.co",
        port: "",
        pathname: "/**",
      },
      // AWS S3 images
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "notjustdev-dummy.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      // Unsplash for background images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Other image sources
      {
        protocol: "https",
        hostname: "p16-flow-sign-va.ciciai.com",
        port: "",
        pathname: "/**",
      },
      // Local development only
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http",
              hostname: "localhost",
              port: "",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_USE_REAL_STRIPE: process.env.NEXT_PUBLIC_USE_REAL_STRIPE,
  },
  // Security headers for production
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Performance optimizations
  experimental: {
    // optimizeCss: true, // Disabled due to critters module issues
  },
  // Compress responses
  compress: true,
  // Power optimization for Vercel
  poweredByHeader: false,
};

module.exports = nextConfig;
