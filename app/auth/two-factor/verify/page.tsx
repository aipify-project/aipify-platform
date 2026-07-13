import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import TwoFactorVerifyForm from "@/components/auth/TwoFactorVerifyForm";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { resolveMfaSuccessDestination } from "@/lib/auth/two-factor/mfa-portal-routing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function NeutralTwoFactorVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);
  const p = "auth.twoFactor";
  const defaultDestination = resolveMfaSuccessDestination(params.next, "platform");

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t(`${p}.verifyTitle`)}
      subtitle={t(`${p}.verifySubtitle`)}
    >
      <Suspense
        fallback={
          <AipifyLoadingState
            message={t("common.loadingState.loading")}
            statusLabel={t("common.loadingState.status.waiting")}
            centered
          />
        }
      >
        <TwoFactorVerifyForm
          defaultDestination={defaultDestination}
          labels={{
            codeLabel: t(`${p}.codeLabel`),
            verify: t(`${p}.verify`),
            useRecovery: t(`${p}.useRecovery`),
            recoveryTitle: t(`${p}.recoveryTitle`),
            recoveryHint: t(`${p}.recoveryHint`),
            recoverySubmit: t(`${p}.recoverySubmit`),
            backToSignIn: t(`${p}.backToSignIn`),
            codeRequired: t(`${p}.errors.codeRequired`),
            invalidCode: t(`${p}.errors.invalidCode`),
            challengeLocked: t(`${p}.errors.challengeLocked`),
            generic: t(`${p}.errors.generic`),
            verifying: t(`${p}.verifying`),
          }}
        />
      </Suspense>
    </AuthLayout>
  );
}
