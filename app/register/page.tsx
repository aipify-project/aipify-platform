import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <RegisterForm
        labels={{
          fullName: t("auth.register.fullName"),
          companyName: t("auth.register.companyName"),
          email: t("auth.register.email"),
          password: t("auth.register.password"),
          confirmPassword: t("auth.register.confirmPassword"),
          createAccount: t("auth.register.createAccount"),
          hasAccount: t("auth.register.hasAccount"),
          signIn: t("auth.register.signIn"),
          checkEmail: t("auth.register.checkEmail"),
          passwordMismatch: t("auth.errors.passwordMismatch"),
          passwordTooShort: t("auth.errors.passwordTooShort"),
          requiredFields: t("auth.errors.requiredFields"),
          emailAlreadyRegistered: t("auth.errors.emailAlreadyRegistered"),
          rateLimit: t("auth.errors.rateLimit"),
          configError: t("auth.errors.configError"),
          generic: t("auth.errors.generic"),
        }}
      />
    </AuthLayout>
  );
}
