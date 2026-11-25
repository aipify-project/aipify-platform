import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { verifyCspCertificatePublic } from "@/lib/certified-sales-partner/academy/verify-certificate";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ certificateId: string }>;
};

export default async function PublicCertificateVerifyPage({ params }: PageProps) {
  const { certificateId } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "partnersPortal"]);
  const t = createTranslator(dict);
  const p = "partnersPortal.certifiedSalesPartner.verify";
  const result = await verifyCspCertificatePublic(certificateId);

  const statusTitle =
    result.status === "valid"
      ? t(`${p}.validTitle`)
      : result.status === "revoked"
        ? t(`${p}.revokedTitle`)
        : result.status === "unavailable"
          ? t(`${p}.unavailableTitle`)
          : t(`${p}.notFoundTitle`);

  const statusBody =
    result.status === "valid"
      ? t(`${p}.validBody`)
      : result.status === "revoked"
        ? t(`${p}.revokedBody`)
        : result.status === "unavailable"
          ? t(`${p}.unavailableBody`)
          : t(`${p}.notFoundBody`);

  const tone =
    result.status === "valid"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : result.status === "revoked"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-slate-200 bg-slate-50 text-slate-800";

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t(`${p}.pageTitle`)}
      subtitle={t(`${p}.pageSubtitle`)}
      alignTop
      wide
    >
      <div className={`rounded-2xl border p-6 sm:p-8 ${tone}`}>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          {t(`${p}.statusLabel`)}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{statusTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed">{statusBody}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide opacity-70">
              {t(`${p}.product`)}
            </dt>
            <dd className="mt-1 text-sm font-medium">{result.productLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide opacity-70">
              {t(`${p}.certificateId`)}
            </dt>
            <dd className="mt-1 break-all font-mono text-sm">{result.certificateId || "—"}</dd>
          </div>
          {result.issuedOn ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide opacity-70">
                {t(`${p}.issuedOn`)}
              </dt>
              <dd className="mt-1 text-sm font-medium">{result.issuedOn}</dd>
            </div>
          ) : null}
          {result.holderInitials ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide opacity-70">
                {t(`${p}.holder`)}
              </dt>
              <dd className="mt-1 text-sm font-medium">{result.holderInitials}</dd>
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide opacity-70">
              {t(`${p}.issuer`)}
            </dt>
            <dd className="mt-1 text-sm font-medium">
              {result.issuer} · {t(`${p}.orgNumber`)} {result.orgNumber} · {result.country}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-6 text-center text-sm text-[#687086]">
        <Link href="/certified-sales-partner" className="font-medium text-[#6042d4] hover:underline">
          {t(`${p}.backToProgram`)}
        </Link>
      </p>
    </AuthLayout>
  );
}
