/** Chromium BeforeInstallPromptEvent — not in standard DOM typings. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export type PwaInstallVisibility = "hidden" | "install" | "installed" | "open";

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
};
