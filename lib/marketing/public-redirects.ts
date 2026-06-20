import type { Redirect } from "next/dist/lib/load-custom-routes";

/** Canonical marketing route aliases — permanent redirects only. */
export const MARKETING_PUBLIC_REDIRECTS: Redirect[] = [
  { source: "/solutions", destination: "/customer-stories", permanent: true },
  { source: "/resources", destination: "/knowledge", permanent: true },
  { source: "/business-packs", destination: "/pricing#business-packs", permanent: true },
  { source: "/become-a-partner", destination: "/growth-partners", permanent: true },
  { source: "/sell-aipify", destination: "/growth-partners", permanent: true },
  { source: "/start-selling", destination: "/growth-partners", permanent: true },
];
