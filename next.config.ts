import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
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
