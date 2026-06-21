import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "pwa"]);
  const t = createTranslator(dict);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
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
        <LoginForm
          pwaLabels={buildPwaInstallLabels(t)}
          labels={{
            email: t("auth.login.email"),
            password: t("auth.login.password"),
            signIn: t("auth.login.signIn"),
            forgotPassword: t("auth.login.forgotPassword"),
            createAccount: t("auth.login.createAccount"),
            noAccount: t("auth.login.noAccount"),
            invalidCredentials: t("auth.errors.invalidCredentials"),
            requiredFields: t("auth.errors.requiredFields"),
            generic: t("auth.errors.generic"),
            networkTitle: t("auth.errors.networkTitle"),
            networkBody: t("auth.errors.networkBody"),
            networkTryAgain: t("auth.errors.networkTryAgain"),
            networkStatus: t("auth.errors.networkStatus"),
            networkSupport: t("auth.errors.networkSupport"),
            trustSecurity: t("auth.login.trustSecurity"),
            trustTwoFactor: t("auth.login.trustTwoFactor"),
          }}
        />
      </Suspense>
    </AuthLayout>
  );
}
