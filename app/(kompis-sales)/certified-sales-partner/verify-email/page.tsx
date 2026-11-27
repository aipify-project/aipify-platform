import type { Metadata } from "next";
import Link from "next/link";
import { CspVerifyEmailResend } from "@/components/marketing/CspVerifyEmailResend";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

type SearchParams = Record<string, string | string[] | undefined>;

const KEY = "marketing.certifiedSalesPartner.verifyEmail";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const t = createTranslator(await getDictionary(locale, ["marketing", "common"]));
  return {
    title: t(`${KEY}.meta.title`),
    description: t(`${KEY}.meta.description`),
    robots: { index: false, follow: false },
  };
}

function hasLinkError(searchParams: SearchParams): boolean {
  const code = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  return Boolean(code(searchParams.error) || code(searchParams.error_code) || code(searchParams.error_description));
}

export default async function CertifiedSalesPartnerVerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { labels: salesLabels, appName, locale } = await loadKompisWebSalesRouteContext();
  const t = createTranslator(await getDictionary(locale, ["marketing", "common"]));
  const invalid = hasLinkError(await searchParams);

  return (
    <KompisWebSalesChrome
      labels={salesLabels}
      appName={appName}
      locale={locale}
      showTitle={false}
      contentMaxWidth={720}
    >
      <p className="kompis-web-sales-eyebrow">{appName}</p>
      <div className="kompis-web-sales-panel" style={{ padding: 28 }}>
        <h1 className="kompis-web-sales-display" style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)" }}>
          {invalid ? t(`${KEY}.invalidTitle`) : t(`${KEY}.title`)}
        </h1>
        <p className="kompis-web-sales-lead" style={{ marginTop: 12 }}>
          {invalid ? t(`${KEY}.invalidBody`) : t(`${KEY}.body`)}
        </p>
        {invalid ? null : (
          <p className="kompis-web-sales-note" style={{ marginTop: 10 }}>
            {t(`${KEY}.hint`)}
          </p>
        )}
        <div style={{ marginTop: 22 }}>
          <CspVerifyEmailResend
            labels={{
              resendCta: t(`${KEY}.resendCta`),
              resendAccepted: t(`${KEY}.resendAccepted`),
              resendAlreadyVerified: t(`${KEY}.resendAlreadyVerified`),
              resendRateLimited: t(`${KEY}.resendRateLimited`),
              resendFailed: t(`${KEY}.resendFailed`),
              loginCta: t(`${KEY}.loginCta`),
            }}
          />
        </div>
        <p style={{ marginTop: 22 }}>
          <Link href="/certified-sales-partner" className="kompis-web-sales-cta-quiet">
            {t(`${KEY}.backCta`)}
          </Link>
        </p>
      </div>
    </KompisWebSalesChrome>
  );
}
