import type { MetadataRoute } from "next";

/**
 * Public crawl policy for aipify.ai after public website cleanup.
 * Prefer sales home, legal, Growth Partners apply, and honest contact intake.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/privacy",
          "/terms",
          "/start",
          "/growth-partners",
          "/certified-sales-partner",
          "/contact/support",
        ],
        disallow: [
          "/api/",
          "/app/",
          "/platform/",
          "/super/",
          "/dashboard/",
          "/partners/",
          "/login",
          "/book-demo",
          "/kompis-web",
        ],
      },
    ],
    sitemap: "https://aipify.ai/sitemap.xml",
    host: "https://aipify.ai",
  };
}
