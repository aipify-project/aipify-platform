import type { createTranslator } from "@/lib/i18n/translate";

type AuthTranslator = ReturnType<typeof createTranslator>;

export function getResetPasswordFormLabels(t: AuthTranslator) {
  return {
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
  };
}
