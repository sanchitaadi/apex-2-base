import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
        hostname: "gkuuvmfuilrbvlwzburj.supabase.co",
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