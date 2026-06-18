import type { Translator } from "@/lib/i18n/translate";

export function buildModuleRegistryLabels(t: Translator) {
  const p = "customerApp.moduleRegistry";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    accessDenied: t(`${p}.accessDenied`),
    appSuspended: t(`${p}.appSuspended`),
    singleAppRule: t(`${p}.singleAppRule`),
    modules: t(`${p}.modules`),
    roleAccess: t(`${p}.roleAccess`),
    canView: t(`${p}.canView`),
    canUse: t(`${p}.canUse`),
    canManage: t(`${p}.canManage`),
    save: t(`${p}.save`),
    saved: t(`${p}.saved`),
    coreModules: t(`${p}.coreModules`),
    packModules: t(`${p}.packModules`),
    navigationLocation: t(`${p}.navigationLocation`),
    businessPack: t(`${p}.businessPack`),
    licensed: t(`${p}.licensed`),
    hidden: t(`${p}.hidden`),
    back: t(`${p}.back`),
  };
}

export type ModuleRegistryLabels = ReturnType<typeof buildModuleRegistryLabels>;

export function buildSuperAdminModuleRegistryLabels(t: Translator) {
  const p = "superAdmin.superPortal.moduleRegistry";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    modules: t(`${p}.modules`),
    audit: t(`${p}.audit`),
    disable: t(`${p}.disable`),
    enable: t(`${p}.enable`),
    category: t(`${p}.category`),
    businessPack: t(`${p}.businessPack`),
    permissions: t(`${p}.permissions`),
    stats: {
      total: t(`${p}.stats.total`),
      active: t(`${p}.stats.active`),
      core: t(`${p}.stats.core`),
      pack: t(`${p}.stats.pack`),
    },
    back: t(`${p}.back`),
  };
}

export function buildPlatformModuleRegistryLabels(t: Translator) {
  const p = "platform.moduleRegistry";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    catalog: t(`${p}.catalog`),
    adoption: t(`${p}.adoption`),
    businessPacks: t(`${p}.businessPacks`),
    organizations: t(`${p}.organizations`),
    activations: t(`${p}.activations`),
    packActivations: t(`${p}.packActivations`),
    back: t(`${p}.back`),
  };
}
