import type { PwaInstallLabels } from "./types";

type TranslateFn = (key: string) => string;

export function buildPwaInstallLabels(t: TranslateFn): PwaInstallLabels {
  const prefix = "pwa";
  return {
    installAipify: t(`${prefix}.installAipify`),
    installWebApp: t(`${prefix}.installWebApp`),
    openAsApp: t(`${prefix}.openAsApp`),
    installedTitle: t(`${prefix}.installedTitle`),
    installedHint: t(`${prefix}.installedHint`),
    modalTitle: t(`${prefix}.modalTitle`),
    modalDescription: t(`${prefix}.modalDescription`),
    benefit1: t(`${prefix}.benefit1`),
    benefit2: t(`${prefix}.benefit2`),
    benefit3: t(`${prefix}.benefit3`),
    benefit4: t(`${prefix}.benefit4`),
    benefit5: t(`${prefix}.benefit5`),
    continueInstall: t(`${prefix}.continueInstall`),
    notNow: t(`${prefix}.notNow`),
    browserConfirmation: t(`${prefix}.browserConfirmation`),
    learnMore: t(`${prefix}.learnMore`),
    guideLink: t(`${prefix}.guideLink`),
  };
}
