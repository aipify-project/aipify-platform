import type { Translator } from "@/lib/i18n/translate";
import {
  ENTERPRISE_ONBOARDING_ACTIONS,
  ENTERPRISE_PROCUREMENT_METHODS,
} from "./constants";
import type { BillingExperienceLabels } from "./types";

type LabelNamespace = "customerApp" | "platform" | "auth";

export function buildBillingExperienceLabels(
  t: Translator,
  namespace: LabelNamespace
): BillingExperienceLabels {
  const p = `${namespace}.billingExperience`;

  return {
    principle: t(`${p}.principle`),
    commercialPrinciple: {
      instant: t(`${p}.commercialPrinciple.instant`),
      enterprise: t(`${p}.commercialPrinciple.enterprise`),
      footer: t(`${p}.commercialPrinciple.footer`),
    },
    instantActivation: {
      title: t(`${p}.instantActivation.title`),
      description: t(`${p}.instantActivation.description`),
      message: t(`${p}.instantActivation.message`),
      activateWith: t(`${p}.instantActivation.activateWith`),
      checkout: t(`${p}.instantActivation.checkout`),
      checkingOut: t(`${p}.instantActivation.checkingOut`),
    },
    enterpriseProcurement: {
      title: t(`${p}.enterpriseProcurement.title`),
      description: t(`${p}.enterpriseProcurement.description`),
      message: t(`${p}.enterpriseProcurement.message`),
      manageLink: t(`${p}.enterpriseProcurement.manageLink`),
      methods: Object.fromEntries(
        ENTERPRISE_PROCUREMENT_METHODS.map((method) => [
          method,
          t(`${p}.enterpriseProcurement.methods.${method}`),
        ])
      ) as BillingExperienceLabels["enterpriseProcurement"]["methods"],
      actions: Object.fromEntries(
        ENTERPRISE_ONBOARDING_ACTIONS.map((action) => [
          action,
          t(`${p}.enterpriseProcurement.actions.${action}`),
        ])
      ) as BillingExperienceLabels["enterpriseProcurement"]["actions"],
    },
    smartRouting: {
      title: t(`${p}.smartRouting.title`),
      instant: {
        label: t(`${p}.smartRouting.instant.label`),
        description: t(`${p}.smartRouting.instant.description`),
      },
      enterprise: {
        label: t(`${p}.smartRouting.enterprise.label`),
        description: t(`${p}.smartRouting.enterprise.description`),
      },
    },
  };
}
