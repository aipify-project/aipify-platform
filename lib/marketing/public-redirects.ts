import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * Canonical marketing route aliases — permanent redirects only.
 * Kompis Web funnel: root `/` is the only public sales URL; legacy hub pages fold into it.
 */
export const MARKETING_PUBLIC_REDIRECTS: Redirect[] = [
  { source: "/solutions", destination: "/customer-stories", permanent: true },
  { source: "/resources", destination: "/knowledge", permanent: true },
  { source: "/business-packs", destination: "/pricing#business-packs", permanent: true },
  { source: "/become-a-partner", destination: "/growth-partners", permanent: true },
  { source: "/sell-aipify", destination: "/growth-partners", permanent: true },
  { source: "/start-selling", destination: "/growth-partners", permanent: true },
  /** Former sales alias — one indexable home. */
  { source: "/kompis-web", destination: "/", permanent: true },
  /** Enterprise demo is not part of the Kompis Web self-serve funnel. */
  { source: "/book-demo", destination: "/", permanent: true },
  /** Legacy contact hub; sales footer uses mailto instead. */
  { source: "/contact", destination: "/", permanent: true },
];
