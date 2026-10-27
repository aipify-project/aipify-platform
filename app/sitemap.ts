import type { MetadataRoute } from "next";

const BASE = "https://aipify.ai";

/**
 * Minimal public sitemap for the Kompis Web sales funnel.
 * Legal pages stay; legacy marketing hubs and demo/contact are omitted (redirected).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
  ];

  return pages.map((page) => ({
    url: `${BASE}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
