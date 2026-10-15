import type { Translator } from "@/lib/i18n/translate";

export type PlatformSuperRoleAccessLabels = {
  title: string;
  subtitle: string;
  sourceNote: string;
  definitionNote: string;
  loading: string;
  loadError: string;
  retry: string;
  empty: string;
  unavailableTitle: string;
  unavailableMessage: string;
  openSuperMatrix: string;
  backToPlatform: string;
  totalPermissions: string;
  totalModules: string;
  organizationsWithGrants: string;
  totalRoleGrants: string;
  userOverrides: string;
  customRoles: string;
  templates: string;
};

export function buildPlatformSuperRoleAccessLabels(
  t: Translator,
): PlatformSuperRoleAccessLabels {
  const k = "platform.portalStructure.superRoleAccess";
  return {
    title: t(`${k}.title`),
    subtitle: t(`${k}.subtitle`),
    sourceNote: t(`${k}.sourceNote`),
    definitionNote: t(`${k}.definitionNote`),
    loading: t(`${k}.loading`),
    loadError: t(`${k}.loadError`),
    retry: t(`${k}.retry`),
    empty: t(`${k}.empty`),
    unavailableTitle: t(`${k}.unavailableTitle`),
    unavailableMessage: t(`${k}.unavailableMessage`),
    openSuperMatrix: t(`${k}.openSuperMatrix`),
    backToPlatform: t(`${k}.backToPlatform`),
    totalPermissions: t(`${k}.totalPermissions`),
    totalModules: t(`${k}.totalModules`),
    organizationsWithGrants: t(`${k}.organizationsWithGrants`),
    totalRoleGrants: t(`${k}.totalRoleGrants`),
    userOverrides: t(`${k}.userOverrides`),
    customRoles: t(`${k}.customRoles`),
    templates: t(`${k}.templates`),
  };
}
