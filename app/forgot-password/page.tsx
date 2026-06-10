import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ForgotPasswordPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
    >
      <ForgotPasswordForm
        labels={{
          email: t("auth.forgotPassword.email"),
          sendInstructions: t("auth.forgotPassword.sendInstructions"),
          backToLogin: t("auth.forgotPassword.backToLogin"),
          success: t("auth.forgotPassword.success"),
          emailRequired: t("auth.errors.emailRequired"),
          generic: t("auth.errors.generic"),
        }}
      />
    </AuthLayout>
  );
}
