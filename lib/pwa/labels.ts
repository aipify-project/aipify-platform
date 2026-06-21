import type { PwaInstallLabels } from "./types";

type TranslateFn = (key: string) => string;

export function buildPwaInstallLabels(t: TranslateFn): PwaInstallLabels {
  const prefix = "pwa";
  const card = `${prefix}.installCard`;
  const guidance = `${prefix}.modalGuidance`;

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
    card: {
      availableTitle: t(`${card}.availableTitle`),
      availableHint: t(`${card}.availableHint`),
      installButton: t(`${card}.installButton`),
      alreadyInstalledTitle: t(`${card}.alreadyInstalledTitle`),
      alreadyInstalledHint: t(`${card}.alreadyInstalledHint`),
      unsupportedTitle: t(`${card}.unsupportedTitle`),
      unsupportedHint: t(`${card}.unsupportedHint`),
      dismissedTitle: t(`${card}.dismissedTitle`),
      dismissedHint: t(`${card}.dismissedHint`),
      tryAgain: t(`${card}.tryAgain`),
      guideLink: t(`${card}.guideLink`),
    },
    modalGuidance: {
      manualTitle: t(`${guidance}.manualTitle`),
      manualDescription: t(`${guidance}.manualDescription`),
      manualStep1: t(`${guidance}.manualStep1`),
      manualStep2: t(`${guidance}.manualStep2`),
      manualStep3: t(`${guidance}.manualStep3`),
      unsupportedTitle: t(`${guidance}.unsupportedTitle`),
      unsupportedDescription: t(`${guidance}.unsupportedDescription`),
      unsupportedHint: t(`${guidance}.unsupportedHint`),
      close: t(`${guidance}.close`),
    },
  };
}
