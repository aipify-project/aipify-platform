import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { LoginPortalExperience } from "@/components/auth/LoginPortalExperience";
import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "pwa"]);
  const t = createTranslator(dict);
  const p = "auth.portalEntry";

  return (
    <AuthLayout appName={t("common.appName")} title="" subtitle="" wide bare alignTop>
      <Suspense
        fallback={
          <AipifyLoadingState
            message={t("common.loadingState.loading")}
            statusLabel={t("common.loadingState.status.waiting")}
            centered
          />
        }
      >
        <LoginPortalExperience
          labels={{
            heading: t(`${p}.heading`),
            intro: t(`${p}.intro`),
            cards: {
              customer: {
                title: t(`${p}.cards.customer.title`),
                description: t(`${p}.cards.customer.description`),
                action: t(`${p}.cards.customer.action`),
                a11yLabel: t(`${p}.cards.customer.a11yLabel`),
              },
              partner: {
                title: t(`${p}.cards.partner.title`),
                description: t(`${p}.cards.partner.description`),
                action: t(`${p}.cards.partner.action`),
                a11yLabel: t(`${p}.cards.partner.a11yLabel`),
              },
              newCustomer: {
                title: t(`${p}.cards.newCustomer.title`),
                description: t(`${p}.cards.newCustomer.description`),
                action: t(`${p}.cards.newCustomer.action`),
                a11yLabel: t(`${p}.cards.newCustomer.a11yLabel`),
              },
            },
            forms: {
              customerHeading: t(`${p}.forms.customerHeading`),
              partnerHeading: t(`${p}.forms.partnerHeading`),
              backToSelection: t(`${p}.forms.backToSelection`),
            },
            selectedState: {
              customer: t(`${p}.selectedState.customer`),
              partner: t(`${p}.selectedState.partner`),
            },
            installPromotion: {
              heading: t(`${p}.installPromotion.heading`),
              description: t(`${p}.installPromotion.description`),
              primaryAction: t(`${p}.installPromotion.primaryAction`),
              secondaryAction: t(`${p}.installPromotion.secondaryAction`),
              primaryA11yLabel: t(`${p}.installPromotion.primaryA11yLabel`),
              secondaryA11yLabel: t(`${p}.installPromotion.secondaryA11yLabel`),
              panelA11yLabel: t(`${p}.installPromotion.panelA11yLabel`),
            },
          }}
          loginLabels={{
            email: t("auth.login.email"),
            password: t("auth.login.password"),
            signIn: t("auth.login.signIn"),
            forgotPassword: t("auth.login.forgotPassword"),
            createAccount: t("auth.login.createAccount"),
            noAccount: t("auth.login.noAccount"),
            invalidCredentials: t("auth.errors.invalidCredentials"),
            emailNotConfirmed: t("auth.errors.emailNotConfirmed"),
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
          pwaLabels={buildPwaInstallLabels(t)}
        />
      </Suspense>
    </AuthLayout>
  );
}
