import nextEnv from "@next/env";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url));
loadEnvConfig(monorepoRoot);

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  turbopack: {
    root: monorepoRoot,
  },
  async redirects() {
    return [
      {
        source: "/product",
        destination: "/products/p1",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
