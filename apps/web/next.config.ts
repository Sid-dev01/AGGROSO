import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: appRoot,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.join(appRoot, "node_modules/react"),
        "react-dom": path.join(appRoot, "node_modules/react-dom"),
      };
    }

    return config;
  },
};

export default nextConfig;
