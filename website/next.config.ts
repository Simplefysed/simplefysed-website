import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  images: {
    domains: [],
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
