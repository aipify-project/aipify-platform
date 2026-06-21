import type { BeforeInstallPromptEvent } from "./types";

type InstallPromptListener = () => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let dismissedThisSession = false;
let installed = false;
const listeners = new Set<InstallPromptListener>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeInstallPrompt(listener: InstallPromptListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function wasInstallPromptDismissed(): boolean {
  return dismissedThisSession;
}

export function isWebAppInstalled(): boolean {
  return installed;
}

export function captureBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
  event.preventDefault();
  deferredPrompt = event;
  notify();
}

export function clearDeferredInstallPrompt(): void {
  deferredPrompt = null;
  notify();
}

export function markInstallPromptDismissed(): void {
  dismissedThisSession = true;
  clearDeferredInstallPrompt();
}

export function resetInstallPromptDismissal(): void {
  dismissedThisSession = false;
  notify();
}

export function markWebAppInstalled(): void {
  installed = true;
  clearDeferredInstallPrompt();
  notify();
}

export function resetInstallPromptStoreForTests(): void {
  deferredPrompt = null;
  dismissedThisSession = false;
  installed = false;
  listeners.clear();
}

export async function invokeDeferredInstallPrompt(): Promise<"accepted" | "dismissed" | "unavailable"> {
  const prompt = deferredPrompt;
  if (!prompt) return "unavailable";
  clearDeferredInstallPrompt();
  await prompt.prompt();
  const choice = await prompt.userChoice;
  if (choice.outcome === "dismissed") {
    markInstallPromptDismissed();
  }
  if (choice.outcome === "accepted") {
    markWebAppInstalled();
  }
  return choice.outcome;
}
