import type { MetadataRoute } from "next";

const BASE = "https://aipify.ai";

/**
 * Public sitemap after Growth Partners / signup cleanup.
 * Only real public surfaces — no APP, Platform, auth internals, or redirected hubs.
 * lastModified omitted so crawlers are not told content changes daily.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
    { path: "/growth-partners", priority: 0.7, changeFrequency: "weekly" },
    { path: "/certified-sales-partner", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact/support", priority: 0.5, changeFrequency: "monthly" },
  ];

  return pages.map((page) => ({
    url: `${BASE}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
