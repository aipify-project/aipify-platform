import { IdentityDashboardPanel } from "@/components/app/assistant";
import {
  COMMUNICATION_STYLES,
  IDENTITY_MODES,
  IDENTITY_TONES,
  NAME_USAGE_OPTIONS,
  NOTIFICATION_STYLES,
  PROACTIVITY_LEVELS,
  RESPONSE_LENGTHS,
  SOCIAL_STYLES,
} from "@/lib/identity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantIdentityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const mapKeys = <T extends string>(keys: readonly T[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.identity.${prefix}.${k}`)])) as Record<
      T,
      string
    >;

  return (
    <IdentityDashboardPanel
      labels={{
        title: t("customerApp.identity.title"),
        subtitle: t("customerApp.identity.subtitle"),
        loading: t("customerApp.identity.loading"),
        back: t("customerApp.identity.back"),
        save: t("customerApp.identity.save"),
        saved: t("customerApp.identity.saved"),
        privacy: t("customerApp.identity.privacy"),
        explainability: t("customerApp.identity.explainability"),
        sections: {
          onboarding: t("customerApp.identity.sections.onboarding"),
          profile: t("customerApp.identity.sections.profile"),
          observations: t("customerApp.identity.sections.observations"),
          history: t("customerApp.identity.sections.history"),
          boundaries: t("customerApp.identity.sections.boundaries"),
          notifications: t("customerApp.identity.sections.notifications"),
          settings: t("customerApp.identity.sections.settings"),
        },
        onboarding: {
          start: t("customerApp.identity.onboarding.start"),
          complete: t("customerApp.identity.onboarding.complete"),
          useName: t("customerApp.identity.onboarding.useName"),
          dailySummaries: t("customerApp.identity.onboarding.dailySummaries"),
          reminders: t("customerApp.identity.onboarding.reminders"),
        },
        observations: {
          yes: t("customerApp.identity.observations.yes"),
          no: t("customerApp.identity.observations.no"),
          later: t("customerApp.identity.observations.later"),
        },
        modes: mapKeys(IDENTITY_MODES, "modes"),
        communicationStyles: mapKeys(COMMUNICATION_STYLES, "communicationStyles"),
        proactivityLevels: mapKeys(PROACTIVITY_LEVELS, "proactivityLevels"),
        tones: mapKeys(IDENTITY_TONES, "tones"),
        nameUsage: mapKeys(NAME_USAGE_OPTIONS, "nameUsage"),
        socialStyles: mapKeys(SOCIAL_STYLES, "socialStyles"),
        responseLengths: mapKeys(RESPONSE_LENGTHS, "responseLengths"),
        notificationStyles: mapKeys(NOTIFICATION_STYLES, "notificationStyles"),
        viewMemories: t("customerApp.identity.viewMemories"),
        viewLife: t("customerApp.identity.viewLife"),
      }}
    />
  );
}
