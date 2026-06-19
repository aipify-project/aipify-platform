import type { Translator } from "@/lib/i18n/translate";
import type { ServiceIntakeSection } from "./config";
export type ServiceIntakeLabels = {
  title: string; subtitle: string; loading: string; empty: string; refresh: string; principle: string; privacyNote: string; noRecords: string; companionAdvisor: string;
  sections: Record<ServiceIntakeSection, string>;
  stats: { activeForms: string; pendingSubmissions: string; consentsRequired: string; deliveryTasksOpen: string; readinessBlocked: string };
  detail: { back: string; overview: string; notFound: string };
  entityTypes: { form: string; submission: string };
  readiness: { ready: string; blocked: string; principle: string };
};
export function buildServiceIntakeLabels(t: Translator): ServiceIntakeLabels {
  const p = "customerApp.serviceIntake";
  return {
    title: t(`${p}.title`), subtitle: t(`${p}.subtitle`), loading: t(`${p}.loading`), empty: t(`${p}.empty`), refresh: t(`${p}.refresh`), principle: t(`${p}.principle`), privacyNote: t(`${p}.privacyNote`), noRecords: t(`${p}.noRecords`), companionAdvisor: t(`${p}.companionAdvisor`),
    sections: { forms: t(`${p}.sections.forms`), submissions: t(`${p}.sections.submissions`), consents: t(`${p}.sections.consents`), serviceDelivery: t(`${p}.sections.serviceDelivery`) },
    stats: { activeForms: t(`${p}.stats.activeForms`), pendingSubmissions: t(`${p}.stats.pendingSubmissions`), consentsRequired: t(`${p}.stats.consentsRequired`), deliveryTasksOpen: t(`${p}.stats.deliveryTasksOpen`), readinessBlocked: t(`${p}.stats.readinessBlocked`) },
    detail: { back: t(`${p}.detail.back`), overview: t(`${p}.detail.overview`), notFound: t(`${p}.detail.notFound`) },
    entityTypes: { form: t(`${p}.entityTypes.form`), submission: t(`${p}.entityTypes.submission`) },
    readiness: { ready: t(`${p}.readiness.ready`), blocked: t(`${p}.readiness.blocked`), principle: t(`${p}.readiness.principle`) },
  };
}
