import {
  canOfferWebAppInstall,
  isIosSafari,
  isStandaloneDisplayMode,
  isUnsupportedEmbeddedBrowser,
  supportsBeforeInstallPrompt,
  supportsManualInstallHint,
} from "./capability";
import { getDeferredInstallPrompt, isWebAppInstalled, wasInstallPromptDismissed } from "./install-prompt-store";

export type WebAppInstallCardState = "available" | "already_installed" | "unsupported" | "dismissed";

export type WebAppInstallModalPhase = "benefits" | "manual" | "unsupported";

export type WebAppInstallRuntimeSnapshot = {
  userAgent: string;
  standalone: boolean;
  installed: boolean;
  dismissed: boolean;
  hasDeferredPrompt: boolean;
};

export function readWebAppInstallRuntimeSnapshot(): WebAppInstallRuntimeSnapshot {
  if (typeof window === "undefined") {
    return createSsrWebAppInstallRuntimeSnapshot();
  }

  return {
    userAgent: window.navigator.userAgent,
    standalone: isStandaloneDisplayMode(),
    installed: isWebAppInstalled(),
    dismissed: wasInstallPromptDismissed(),
    hasDeferredPrompt: Boolean(getDeferredInstallPrompt()),
  };
}

/** Stable SSR/first-paint snapshot — must match server render for hydration. */
export function createSsrWebAppInstallRuntimeSnapshot(): WebAppInstallRuntimeSnapshot {
  return {
    userAgent: "",
    standalone: false,
    installed: false,
    dismissed: false,
    hasDeferredPrompt: false,
  };
}

export function resolveWebAppInstallCardState(snapshot: WebAppInstallRuntimeSnapshot): WebAppInstallCardState {
  if (snapshot.standalone || snapshot.installed) return "already_installed";
  if (!canOfferWebAppInstall(snapshot.userAgent, snapshot.standalone)) return "unsupported";
  if (snapshot.dismissed && !snapshot.hasDeferredPrompt) return "dismissed";
  return "available";
}

export function resolveWebAppInstallModalPhase(
  snapshot: WebAppInstallRuntimeSnapshot
): WebAppInstallModalPhase {
  if (snapshot.hasDeferredPrompt) return "benefits";
  if (supportsManualInstallHint(snapshot.userAgent)) return "manual";
  if (!canOfferWebAppInstall(snapshot.userAgent, snapshot.standalone)) return "unsupported";
  return "benefits";
}

export function resolveWebAppInstallVisibility(snapshot: WebAppInstallRuntimeSnapshot): "hidden" | "install" | "installed" {
  if (snapshot.standalone || snapshot.installed) return "installed";
  if (!canOfferWebAppInstall(snapshot.userAgent, snapshot.standalone)) return "hidden";
  if (snapshot.dismissed && !snapshot.hasDeferredPrompt) return "hidden";
  return "install";
}

export function shouldUseNativeInstallPrompt(snapshot: WebAppInstallRuntimeSnapshot): boolean {
  return snapshot.hasDeferredPrompt && supportsBeforeInstallPrompt(snapshot.userAgent);
}

export function shouldShowManualInstallGuidance(snapshot: WebAppInstallRuntimeSnapshot): boolean {
  return !snapshot.hasDeferredPrompt && supportsManualInstallHint(snapshot.userAgent);
}

export function isTrulyUnsupportedBrowser(userAgent: string): boolean {
  return isUnsupportedEmbeddedBrowser(userAgent) || (!supportsBeforeInstallPrompt(userAgent) && !supportsManualInstallHint(userAgent));
}

export function isAppleManualInstallBrowser(userAgent: string): boolean {
  return isIosSafari(userAgent);
}
