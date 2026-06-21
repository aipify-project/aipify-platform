import type { PublicBreadcrumbItem } from "@/components/marketing/public/PublicBreadcrumbs";

type BusinessPackBreadcrumbJsonLdProps = {
  items: PublicBreadcrumbItem[];
  pageUrl: string;
};

export default function BusinessPackBreadcrumbJsonLd({ items, pageUrl }: BusinessPackBreadcrumbJsonLdProps) {
  const origin = "https://aipify.ai";

  const itemListElement = items
    .filter((item) => item.label)
    .map((item, index) => {
      const isLast = index === items.length - 1;
      const entry: Record<string, string | number> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (!isLast && item.href) {
        entry.item = item.href.startsWith("http") ? item.href : `${origin}${item.href}`;
      } else if (isLast) {
        entry.item = pageUrl.startsWith("http") ? pageUrl : `${origin}${pageUrl}`;
      }
      return entry;
    });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
