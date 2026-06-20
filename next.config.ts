import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { LEGACY_DASHBOARD_REDIRECTS } from "./lib/app/legacy-dashboard-redirects";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_DASHBOARD_REDIRECTS;
  },
  // validate:deployment runs `tsc --noEmit` before `next build`. Skipping the duplicate
  // Next.js typecheck avoids OOM on Vercel Enhanced (16 GB) during "Running TypeScript …".
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  // Prerender sourcemaps default true in Next 16 — disable to reduce generate-phase memory.
  enablePrerenderSourceMaps: false,
  staticPageGenerationTimeout: 300,
  outputFileTracingIncludes: {
    "/*": ["./locales/**/*"],
  },
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    cpus: 1,
    serverSourceMaps: false,
    // Off: worker IPC JSON.stringify hits V8 max string length on this repo size.
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
  },
  webpack: (config, { dev, webpack }) => {
    if (!dev) {
      config.cache = false;
      // Limit webpack parallelism to reduce V8 Worklist native memory alongside cpus: 1.
      config.parallelism = 1;
    }
    // Locale JSON is read at runtime via fs — keep it out of the webpack module graph.
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource: string) {
          return /[/\\]locales[/\\].+\.json$/.test(resource);
        },
      })
    );
    return config;
  },
};

export default nextConfig;
