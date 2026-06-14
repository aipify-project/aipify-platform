import AuthLayout from "@/components/auth/AuthLayout";
import RegistrationWizard from "@/components/auth/RegistrationWizard";
import {
  INDUSTRIES,
  PACKAGE_PLANS,
  PRIMARY_USE_CASES,
  WORKSPACE_LANGUAGES,
  type PackagePlan,
  type WorkspaceLanguage,
} from "@/lib/auth/registration";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RegisterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth"]);
  const t = createTranslator(dict);

  const industries = Object.fromEntries(
    INDUSTRIES.map((industry) => [industry, t(`auth.wizard.industries.${industry}`)])
  );
  const useCases = Object.fromEntries(
    PRIMARY_USE_CASES.map((useCase) => [useCase, t(`auth.wizard.useCases.${useCase}`)])
  );
  const packages = Object.fromEntries(
    PACKAGE_PLANS.map((plan) => [
      plan,
      {
        name: t(`auth.wizard.packages.${plan}.name`),
        description: t(`auth.wizard.packages.${plan}.description`),
      },
    ])
  ) as Record<PackagePlan, { name: string; description: string }>;
  const languages = Object.fromEntries(
    WORKSPACE_LANGUAGES.map((lang) => [lang, t(`auth.wizard.languages.${lang}`)])
  ) as Record<WorkspaceLanguage, string>;

  return (
    <AuthLayout
      appName={t("common.appName")}
      title={t("auth.wizard.title")}
      subtitle={t("auth.wizard.subtitle")}
      trustNote={t("auth.wizard.trustNote")}
      wide
    >
      <RegistrationWizard
        labels={{
          progress: t("auth.wizard.progress"),
          back: t("auth.wizard.back"),
          continue: t("auth.wizard.continue"),
          createWorkspace: t("auth.wizard.createWorkspace"),
          hasAccount: t("auth.register.hasAccount"),
          signIn: t("auth.register.signIn"),
          checkEmail: t("auth.register.checkEmail"),
          completionTitle: t("auth.wizard.completionTitle"),
          completionMessage: t("auth.wizard.completionMessage"),
          steps: {
            owner: {
              title: t("auth.wizard.steps.owner.title"),
              subtitle: t("auth.wizard.steps.owner.subtitle"),
            },
            organization: {
              title: t("auth.wizard.steps.organization.title"),
              subtitle: t("auth.wizard.steps.organization.subtitle"),
            },
            package: {
              title: t("auth.wizard.steps.package.title"),
              subtitle: t("auth.wizard.steps.package.subtitle"),
            },
            needs: {
              title: t("auth.wizard.steps.needs.title"),
              subtitle: t("auth.wizard.steps.needs.subtitle"),
            },
            confirmation: {
              title: t("auth.wizard.steps.confirmation.title"),
              subtitle: t("auth.wizard.steps.confirmation.subtitle"),
            },
          },
          fields: {
            fullName: t("auth.wizard.fields.fullName"),
            businessEmail: t("auth.wizard.fields.businessEmail"),
            phone: t("auth.wizard.fields.phone"),
            phoneCountry: t("auth.wizard.fields.phoneCountry"),
            country: t("auth.wizard.fields.country"),
            password: t("auth.register.password"),
            confirmPassword: t("auth.register.confirmPassword"),
            companyName: t("auth.wizard.fields.companyName"),
            organizationNumber: t("auth.wizard.fields.organizationNumber"),
            website: t("auth.wizard.fields.website"),
            industry: t("auth.wizard.fields.industry"),
            employeeRange: t("auth.wizard.fields.employeeRange"),
            primaryUseCases: t("auth.wizard.fields.primaryUseCases"),
            primaryLanguage: t("auth.wizard.fields.primaryLanguage"),
            secondaryLanguages: t("auth.wizard.fields.secondaryLanguages"),
          },
          placeholders: {
            organizationNumber: t("auth.wizard.placeholders.organizationNumber"),
            website: t("auth.wizard.placeholders.website"),
            select: t("auth.wizard.placeholders.select"),
          },
          passwordStrength: {
            weak: t("auth.wizard.passwordStrength.weak"),
            fair: t("auth.wizard.passwordStrength.fair"),
            good: t("auth.wizard.passwordStrength.good"),
            strong: t("auth.wizard.passwordStrength.strong"),
          },
          packages,
          languages,
          confirmation: {
            selectedPackage: t("auth.wizard.confirmation.selectedPackage"),
            organization: t("auth.wizard.confirmation.organization"),
            trialStatus: t("auth.wizard.confirmation.trialStatus"),
            trialActive: t("auth.wizard.confirmation.trialActive"),
            nextStep: t("auth.wizard.confirmation.nextStep"),
            nextStepDetail: t("auth.wizard.confirmation.nextStepDetail"),
            securityNote: t("auth.wizard.confirmation.securityNote"),
          },
          security: {
            infoTitle: t("auth.wizard.security.infoTitle"),
            infoBody: t("auth.wizard.security.infoBody"),
            skipForNow: t("auth.wizard.security.skipForNow"),
            enableAfterWorkspace: t("auth.wizard.security.enableAfterWorkspace"),
            enableNote: t("auth.wizard.security.enableNote"),
          },
          terms: {
            acceptTerms: t("auth.wizard.terms.acceptTerms"),
            acceptAuthority: t("auth.wizard.terms.acceptAuthority"),
            productUpdates: t("auth.wizard.terms.productUpdates"),
            termsLink: t("auth.wizard.terms.termsLink"),
            privacyLink: t("auth.wizard.terms.privacyLink"),
          },
          industries,
          useCases,
          errors: {
            requiredFields: t("auth.errors.requiredFields"),
            passwordMismatch: t("auth.errors.passwordMismatch"),
            passwordTooShort: t("auth.errors.passwordTooShort"),
            businessEmailInvalid: t("auth.wizard.errors.businessEmailInvalid"),
            phoneInvalid: t("auth.wizard.errors.phoneInvalid"),
            useCasesRequired: t("auth.wizard.errors.useCasesRequired"),
            packageRequired: t("auth.wizard.errors.packageRequired"),
            termsRequired: t("auth.wizard.errors.termsRequired"),
            emailAlreadyRegistered: t("auth.errors.emailAlreadyRegistered"),
            rateLimit: t("auth.errors.rateLimit"),
            generic: t("auth.errors.generic"),
            alreadyCompleted: t("auth.wizard.errors.alreadyCompleted"),
          },
        }}
      />
    </AuthLayout>
  );
}
