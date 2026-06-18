import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
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
            trustSecurity: t("auth.login.trustSecurity"),
            trustTwoFactor: t("auth.login.trustTwoFactor"),
          }}
        />
      </Suspense>
    </AuthLayout>
  );
}
