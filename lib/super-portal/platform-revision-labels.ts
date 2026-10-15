import type { Translator } from "@/lib/i18n/translate";

export type PlatformSuperRevisionLabels = {
  title: string;
  subtitle: string;
  sourceNote: string;
  periodNote: string;
  loading: string;
  loadError: string;
  retry: string;
  empty: string;
  unavailableTitle: string;
  unavailableMessage: string;
  openSuperRevision: string;
  backToPlatform: string;
  columns: {
    actor: string;
    action: string;
    when: string;
    previous: string;
    next: string;
  };
  noValue: string;
};

export function buildPlatformSuperRevisionLabels(
  t: Translator,
): PlatformSuperRevisionLabels {
  const k = "platform.portalStructure.superRevision";
  return {
    title: t(`${k}.title`),
    subtitle: t(`${k}.subtitle`),
    sourceNote: t(`${k}.sourceNote`),
    periodNote: t(`${k}.periodNote`),
    loading: t(`${k}.loading`),
    loadError: t(`${k}.loadError`),
    retry: t(`${k}.retry`),
    empty: t(`${k}.empty`),
    unavailableTitle: t(`${k}.unavailableTitle`),
    unavailableMessage: t(`${k}.unavailableMessage`),
    openSuperRevision: t(`${k}.openSuperRevision`),
    backToPlatform: t(`${k}.backToPlatform`),
    columns: {
      actor: t(`${k}.columns.actor`),
      action: t(`${k}.columns.action`),
      when: t(`${k}.columns.when`),
      previous: t(`${k}.columns.previous`),
      next: t(`${k}.columns.next`),
    },
    noValue: t(`${k}.noValue`),
  };
}
