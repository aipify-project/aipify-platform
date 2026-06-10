import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResetPasswordPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
    >
      <ResetPasswordForm
        labels={{
          password: t("auth.resetPassword.password"),
          confirmPassword: t("auth.resetPassword.confirmPassword"),
          submit: t("auth.resetPassword.submit"),
          success: t("auth.resetPassword.success"),
          backToLogin: t("auth.resetPassword.backToLogin"),
          requestNewLink: t("auth.resetPassword.requestNewLink"),
          verifying: t("auth.resetPassword.verifying"),
          invalidLink: t("auth.resetPassword.invalidLink"),
          passwordMismatch: t("auth.errors.passwordMismatch"),
          passwordTooShort: t("auth.errors.passwordTooShort"),
          requiredFields: t("auth.errors.requiredFields"),
          generic: t("auth.errors.generic"),
        }}
      />
    </AuthLayout>
  );
}
