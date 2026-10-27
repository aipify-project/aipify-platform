import type { MetadataRoute } from "next";

/**
 * Public crawl policy for aipify.ai after Kompis Web sales became root.
 * Prefer the clean sales home + legal pages; do not advertise legacy hub URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/start", "/login"],
        disallow: [
          "/api/",
          "/app/",
          "/platform/",
          "/super/",
          "/dashboard/",
          "/book-demo",
          "/contact",
          "/kompis-web",
        ],
      },
    ],
    sitemap: "https://aipify.ai/sitemap.xml",
    host: "https://aipify.ai",
  };
}
