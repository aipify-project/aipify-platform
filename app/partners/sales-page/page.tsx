import Link from "next/link";
import { CertifiedSalesPartnerWorkspacePanel } from "@/components/partners-portal/CertifiedSalesPartnerWorkspacePanel";
import { CopyLinkButton } from "@/components/personal-sales-page/CopyLinkButton";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import { evaluateSalesLinkGates } from "@/lib/certified-sales-partner/partner-overview";
import { parseCspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { buildCspPublicLinkPath, isCspLinkCode } from "@/lib/certified-sales-partner/attribution-policy";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { parsePersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { buildCspWorkspaceLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { createClient } from "@/lib/supabase/server";

/**
 * Isolated from the open sales-tools navigation in PR #445.
 * Reachable at /partners/sales-page until that navigation can take a new label.
 */
export default async function PartnerPersonalSalesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["partnersPortal", "marketing"]);
  const t = createTranslator(dict);
  const labels = parsePersonalSalesLabels((dict.marketing as { personalSalesPage?: unknown }).personalSalesPage);
  const shell = buildCspWorkspaceLabels(
    t,
    "partnersPortal.certifiedSalesPartner.pages.home.title",
    "partnersPortal.certifiedSalesPartner.pages.home.subtitle",
  );
  shell.title = labels.previewTitle;
  shell.subtitle = labels.previewBody;

  const supabase = await createClient();
  const overview = await callCspRpc(supabase, "csp_get_partner_overview");
  const view = overview.ready ? parseCspPortalView(overview.data) : null;
  const raw = overview.ready && overview.data && typeof overview.data === "object" ? (overview.data as Record<string, unknown>) : {};
  const salesMeasured = raw.sales_summary != null;
  const gate = view ? evaluateSalesLinkGates(view.overview, "kompis_web") : null;
  const link = view?.links.find((item) => item.active && isCspLinkCode(item.code)) ?? null;
  const personalPath = link?.code ? `/s/${link.code}?lang=${locale}` : null;
  const salesPath =
    link?.code && gate?.allowed
      ? buildCspPublicLinkPath({ code: link.code, productKey: "kompis_web", channel: "referral_link" })
      : null;

  return (
    <CertifiedSalesPartnerWorkspacePanel labels={shell}>
      <section className="space-y-6" aria-labelledby="my-sales-page">
        <h2 id="my-sales-page" className="text-xl font-semibold text-slate-900">
          {labels.previewTitle}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">{labels.previewBody}</p>
        {!overview.ready || !view ? <p>{labels.notAvailable}</p> : null}
        {view && !gate?.allowed ? <p>{labels.gateBlocked}</p> : null}
        {view && gate?.allowed && !link ? <p>{labels.noLink}</p> : null}
        {personalPath ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">{labels.personalLink}</h3>
            <p className="break-all text-sm">{personalPath}</p>
            <div className="flex flex-wrap gap-2">
              <CopyLinkButton value={personalPath} copyLabel={labels.copy} copiedLabel={labels.copied} />
              <Link className="inline-flex min-h-11 items-center text-sm font-semibold text-[#5538D3]" href={personalPath}>
                {labels.open}
              </Link>
            </div>
          </div>
        ) : null}
        {salesPath ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">{labels.attributionLink}</h3>
            <p className="break-all text-sm">{salesPath}{`&lang=${locale}`}</p>
            <CopyLinkButton value={`${salesPath}&lang=${locale}`} copyLabel={labels.copy} copiedLabel={labels.copied} />
          </div>
        ) : null}
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold">{labels.sales}</dt>
            <dd>{salesMeasured && view ? String(view.salesTotal) : labels.notMeasured}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold">{labels.registrations}</dt>
            <dd>{labels.notMeasured}</dd>
          </div>
        </dl>
      </section>
    </CertifiedSalesPartnerWorkspacePanel>
  );
}
