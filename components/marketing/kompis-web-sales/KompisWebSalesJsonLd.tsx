import { buildKompisWebSalesJsonLdScripts } from "@/lib/marketing/kompis-web-sales/structured-data";

/** Server-only JSON-LD for the public sales home. */
export default function KompisWebSalesJsonLd() {
  const scripts = buildKompisWebSalesJsonLdScripts();
  return (
    <>
      {scripts.map((json, index) => (
        <script
          // Static fact payloads — order is stable.
          key={`aipify-sales-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
    </>
  );
}
