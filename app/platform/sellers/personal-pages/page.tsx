import { requirePlatformServerAccess } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import { parseSellersOverview } from "@/lib/certified-sales-partner/platform-sellers-view";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import { parsePersonalPageInterests } from "@/lib/personal-sales-page/interest";
import { parsePersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { createClient } from "@/lib/supabase/server";

export default async function PlatformPersonalSalesPages() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["marketing"]);
  const labels = parsePersonalSalesLabels((dict.marketing as { personalSalesPage?: unknown }).personalSalesPage);
  await requirePlatformServerAccess("/platform/sellers/personal-pages");
  const supabase = await createClient();

  const result = await callCspRpc(supabase, "csp_get_platform_overview");
  const overview = result.ready ? parseSellersOverview(result.data) : null;
  const interests = await callCspRpc(supabase, "list_platform_personal_sales_page_interests");
  const interestRows = interests.ready ? parsePersonalPageInterests(interests.data) : null;
  const productNames = new Map(getLocalizedCspCatalogProducts(locale).map((product) => [product.key, product.title]));

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.platformTitle}</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{labels.platformBody}</p>
      </header>
      {!overview ? <p>{labels.notAvailable}</p> : null}
      {overview ? (
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-sm font-semibold">{labels.partners}</dt>
            <dd>{overview.partnersTotal === null ? labels.notAvailable : String(overview.partnersTotal)}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-sm font-semibold">{labels.publishedProducts}</dt>
            <dd>{overview.productsPublished === null ? labels.notAvailable : String(overview.productsPublished)}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <dt className="text-sm font-semibold">{labels.personalLink}</dt>
            <dd>{labels.publishedLinksUnavailable}</dd>
          </div>
        </dl>
      ) : null}
      <section className="space-y-3" aria-labelledby="platform-personal-interests">
        <h2 id="platform-personal-interests" className="text-lg font-semibold text-slate-900">{labels.platformInterestTitle}</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{labels.platformInterestBody}</p>
        {interestRows === null ? <p className="text-sm text-slate-600">{labels.notAvailable}</p> : null}
        {interestRows && interestRows.length === 0 ? <p className="text-sm text-slate-600">{labels.platformInterestEmpty}</p> : null}
        {interestRows && interestRows.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <tbody>
                {interestRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">{row.contactName}</td>
                    <td className="px-4 py-3">{row.contactEmail}</td>
                    <td className="px-4 py-3">{productNames.get(row.productKey) ?? labels.notAvailable}</td>
                    <td className="px-4 py-3">{row.partnerName}</td>
                    <td className="px-4 py-3">{labels.platformInterestTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
