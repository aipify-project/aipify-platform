import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import TwoFactorVerifyForm from "@/components/auth/TwoFactorVerifyForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function VerifyTwoFactorPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);
  const p = "auth.twoFactor";

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t(`${p}.verifyTitle`)}
      subtitle={t(`${p}.verifySubtitle`)}
    >
      <Suspense fallback={<p className="text-sm text-gray-500">{t("common.loading")}</p>}>
        <TwoFactorVerifyForm
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
