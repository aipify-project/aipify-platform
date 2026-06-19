import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/marketing/knowledge/registry";
import {
  PUBLIC_BUSINESS_PACK_SLUGS,
  PUBLIC_KNOWLEDGE_CATEGORIES,
  PUBLIC_KNOWLEDGE_INDUSTRIES,
} from "@/lib/marketing/knowledge/types";

const BASE = "https://aipify.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/product",
    "/pricing",
    "/enterprise",
    "/security",
    "/get-started",
    "/knowledge",
    "/growth-partners",
    "/company",
    "/careers",
    "/media",
    "/book-demo",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const categories = PUBLIC_KNOWLEDGE_CATEGORIES.map((category) => ({
    url: `${BASE}/knowledge/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articles = getAllArticleSlugs().map((slug) => ({
    url: `${BASE}/knowledge/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const industries = PUBLIC_KNOWLEDGE_INDUSTRIES.map((industry) => ({
    url: `${BASE}/knowledge/industry/${industry}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const businessPacks = PUBLIC_BUSINESS_PACK_SLUGS.map((slug) => ({
    url: `${BASE}/business-packs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categories, ...articles, ...industries, ...businessPacks];
}
