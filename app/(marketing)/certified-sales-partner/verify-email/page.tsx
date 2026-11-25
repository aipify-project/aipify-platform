import type { Metadata } from "next";
import Link from "next/link";
import { CspVerifyEmailResend } from "@/components/marketing/CspVerifyEmailResend";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type SearchParams = Record<string, string | string[] | undefined>;

const KEY = "marketing.certifiedSalesPartner.verifyEmail";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
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
  const locale = await getLocale();
  const t = createTranslator(await getDictionary(locale, ["marketing", "common"]));
  const invalid = hasLinkError(await searchParams);

  return (
    <div className={`min-w-0 ${AipifyMarketingClasses.canvas}`}>
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <div className={`${AipifyMarketingClasses.card} space-y-5 bg-aipify-surface p-6 sm:p-8`}>
          <h1 className="text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl">
            {invalid ? t(`${KEY}.invalidTitle`) : t(`${KEY}.title`)}
          </h1>
          <p className="text-base leading-relaxed text-aipify-text-secondary">
            {invalid ? t(`${KEY}.invalidBody`) : t(`${KEY}.body`)}
          </p>
          {invalid ? null : (
            <p className="text-sm text-aipify-text-secondary">{t(`${KEY}.hint`)}</p>
          )}
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
          <Link href="/certified-sales-partner" className="inline-flex text-sm font-semibold text-aipify-companion">
            {t(`${KEY}.backCta`)}
          </Link>
        </div>
      </div>
    </div>
  );
}
