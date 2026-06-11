import { BusinessDnaAdminPanel } from "@/components/app/settings/BusinessDnaAdminPanel";
import { PROFILE_STATUSES, RISK_LEVELS, TONE_OF_VOICE } from "@/lib/business-dna-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessDnaSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.businessDna.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <BusinessDnaAdminPanel
      labels={{
        title: t("customerApp.businessDna.title"),
        subtitle: t("customerApp.businessDna.subtitle"),
        loading: t("customerApp.businessDna.loading"),
        back: t("customerApp.businessDna.back"),
        save: t("customerApp.businessDna.save"),
        saved: t("customerApp.businessDna.saved"),
        privacy: t("customerApp.businessDna.privacy"),
        seedInstall: t("customerApp.businessDna.seedInstall"),
        approveProfile: t("customerApp.businessDna.approveProfile"),
        youControl: t("customerApp.businessDna.youControl"),
        empty: t("customerApp.businessDna.empty"),
        sections: {
          overview: t("customerApp.businessDna.sections.overview"),
          profile: t("customerApp.businessDna.sections.profile"),
          knowledge: t("customerApp.businessDna.sections.knowledge"),
          templates: t("customerApp.businessDna.sections.templates"),
          workflows: t("customerApp.businessDna.sections.workflows"),
          escalation: t("customerApp.businessDna.sections.escalation"),
          automation: t("customerApp.businessDna.sections.automation"),
          emailTest: t("customerApp.businessDna.sections.emailTest"),
          audit: t("customerApp.businessDna.sections.audit"),
          settings: t("customerApp.businessDna.sections.settings"),
        },
        health: {
          score: t("customerApp.businessDna.health.score"),
          readiness: t("customerApp.businessDna.health.readiness"),
          gaps: t("customerApp.businessDna.health.gaps"),
        },
        settings: {
          humanReview: t("customerApp.businessDna.settings.humanReview"),
          automation: t("customerApp.businessDna.settings.automation"),
          learnReplies: t("customerApp.businessDna.settings.learnReplies"),
          importHistory: t("customerApp.businessDna.settings.importHistory"),
        },
        emailTest: {
          subject: t("customerApp.businessDna.emailTest.subject"),
          body: t("customerApp.businessDna.emailTest.body"),
          analyze: t("customerApp.businessDna.emailTest.analyze"),
          draft: t("customerApp.businessDna.emailTest.draft"),
          result: t("customerApp.businessDna.emailTest.result"),
        },
        profileStatuses: mapKeys(PROFILE_STATUSES, "profileStatuses"),
        riskLevels: mapKeys(RISK_LEVELS, "riskLevels"),
        toneOptions: mapKeys(TONE_OF_VOICE, "toneOptions"),
      }}
    />
  );
}
