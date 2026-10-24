/**
 * The FAQ editor sits inside DashboardShell's animate-fade-in-up wrapper.
 * That animation ends on transform: translateY(0) with fill-mode forwards,
 * so position:fixed inside the page is anchored to the tall document, not
 * the visible viewport. The publish dialog must portal to document.body.
 */
export type PublishDialogInitialFocus = "acknowledge" | "cancel";

export function publishDialogInitialFocus(hasAcknowledgement: boolean): PublishDialogInitialFocus {
  return hasAcknowledgement ? "acknowledge" : "cancel";
}
