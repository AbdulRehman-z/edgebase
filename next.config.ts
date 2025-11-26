import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false,
      },
    ];
  },
  experimental: {
    // browserDebugInfoInTerminal:true,
    // turbopackFileSystemCacheForDev: true,
    typedEnv: true,
  },
  // cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
