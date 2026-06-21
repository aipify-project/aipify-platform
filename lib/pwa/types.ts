/** Chromium BeforeInstallPromptEvent — not in standard DOM typings. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export type PwaInstallVisibility = "hidden" | "install" | "installed" | "open";

export type PwaInstallCardLabels = {
  availableTitle: string;
  availableHint: string;
  installButton: string;
  alreadyInstalledTitle: string;
  alreadyInstalledHint: string;
  unsupportedTitle: string;
  unsupportedHint: string;
  dismissedTitle: string;
  dismissedHint: string;
  tryAgain: string;
  guideLink: string;
};

export type PwaInstallModalGuidanceLabels = {
  manualTitle: string;
  manualDescription: string;
  manualStep1: string;
  manualStep2: string;
  manualStep3: string;
  unsupportedTitle: string;
  unsupportedDescription: string;
  unsupportedHint: string;
  close: string;
};

export type PwaInstallLabels = {
  installAipify: string;
  installWebApp: string;
  openAsApp: string;
  installedTitle: string;
  installedHint: string;
  modalTitle: string;
  modalDescription: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  benefit5: string;
  continueInstall: string;
  notNow: string;
  browserConfirmation: string;
  learnMore: string;
  guideLink: string;
  card: PwaInstallCardLabels;
  modalGuidance: PwaInstallModalGuidanceLabels;
};
