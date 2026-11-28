/**
 * Fact-based JSON-LD for public sales chrome only.
 * No unverified product claims, pricing, or testimonials.
 */

export const AIPIFY_ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aipify Group AS",
  url: "https://aipify.ai/",
  logo: "https://aipify.ai/brand/aipify-mark.svg",
  sameAs: [] as string[],
} as const;

export const AIPIFY_SOFTWARE_APPLICATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Aipify",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://aipify.ai/",
  publisher: {
    "@type": "Organization",
    name: "Aipify Group AS",
  },
} as const;

export function buildKompisWebSalesJsonLdScripts(): string[] {
  return [
    JSON.stringify(AIPIFY_ORGANIZATION_JSON_LD),
    JSON.stringify(AIPIFY_SOFTWARE_APPLICATION_JSON_LD),
  ];
}
