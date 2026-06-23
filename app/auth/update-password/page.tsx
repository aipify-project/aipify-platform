import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { getResetPasswordFormLabels } from "@/lib/auth/reset-password-page";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AuthUpdatePasswordPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
    >
      <ResetPasswordForm labels={getResetPasswordFormLabels(t)} />
    </AuthLayout>
  );
}
