type TranslateFn = (key: string) => string;

export function buildHostsUpgradeSignalsBannerLabels(t: TranslateFn): Record<string, string> {
  const p = "hosts.upgradeSignals";
  return {
    upgrade: t(`${p}.upgrade`),
    addPropertyLicense: t(`${p}.addPropertyLicense`),
    viewPlans: t(`${p}.viewPlans`),
    learnMore: t(`${p}.learnMore`),
  };
}
