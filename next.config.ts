import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 80, 82, 90, 92, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apexpublicschool.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.apexpublicschool.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
