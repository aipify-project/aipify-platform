import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { buildRecoveryCallbackRedirectUrl } from "@/lib/auth/recovery-session";
import { getResetPasswordFormLabels } from "@/lib/auth/reset-password-page";
import type { AuthRecoveryErrorCode } from "@/lib/auth/auth-recovery-log";
import { checkRecoverySessionReady } from "@/lib/auth/recovery-session";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type AuthUpdatePasswordPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | null {
  const value = params[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

export default async function AuthUpdatePasswordPage({
  searchParams,
}: AuthUpdatePasswordPageProps) {
  const params = await searchParams;
  const code = readParam(params, "code");
  const tokenHash = readParam(params, "token_hash");
  const type = readParam(params, "type");
  const recoveryError = readParam(params, "error") as AuthRecoveryErrorCode | null;

  if (code) {
    redirect(buildRecoveryCallbackRedirectUrl(code));
  }

  if (tokenHash && type === "recovery") {
    const params = new URLSearchParams({
      token_hash: tokenHash,
      type: "recovery",
      next: "/auth/update-password",
    });
    redirect(`/auth/callback?${params.toString()}`);
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  const supabase = await createClient();
  const sessionCheck = await checkRecoverySessionReady(supabase);

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.resetPassword.title")}
      subtitle={t("auth.resetPassword.subtitle")}
    >
      <ResetPasswordForm
        labels={getResetPasswordFormLabels(t)}
        initialSessionReady={sessionCheck.ready}
        recoveryError={recoveryError}
      />
    </AuthLayout>
  );
}
