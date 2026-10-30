import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ForgotPasswordPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);
  const backToLogin = t("auth.forgotPassword.backToLogin");

  return (
    <AuthLayout appName={t("common.appName")} title="" subtitle="" wide bare alignTop>
      <div className="space-y-6">
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[#6042d4] hover:text-[#7357e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5577f2]/45 focus-visible:ring-offset-2"
        >
          ← {backToLogin}
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1f2235] sm:text-3xl">
            {t("auth.forgotPassword.title")}
          </h1>
          <p className="mt-3 text-base text-[#687086] sm:text-lg">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[28px] border border-[rgba(96,82,176,.15)] bg-white p-6 shadow-[0_12px_30px_rgba(38,33,87,.07)] sm:p-8">
          <ForgotPasswordForm
            showBackLink={false}
            labels={{
              email: t("auth.forgotPassword.email"),
              sendInstructions: t("auth.forgotPassword.sendInstructions"),
              backToLogin,
              success: t("auth.forgotPassword.success"),
              emailRequired: t("auth.errors.emailRequired"),
              deliveryFailed: t("auth.forgotPassword.errors.deliveryFailed"),
              rateLimited: t("auth.forgotPassword.errors.rateLimited"),
              requestFailed: t("auth.forgotPassword.errors.requestFailed"),
              generic: t("auth.errors.generic"),
            }}
          />
        </div>
      </div>
    </AuthLayout>
  );
}
