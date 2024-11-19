import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    webpack: (config) => {
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                maxSize: 250000, // 청크 크기 제한
            },
        };
        return config;
    },
};

export default nextConfig;
