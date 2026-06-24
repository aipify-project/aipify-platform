/** Lightweight session snapshot for active Companion chat — read by the unified notification feed. */

export type CompanionActiveSession = {
  panelVisible: boolean;
  conversationId: string | null;
  hasVisibleAssistantReply: boolean;
};

const EMPTY_SESSION: CompanionActiveSession = {
  panelVisible: false,
  conversationId: null,
  hasVisibleAssistantReply: false,
};

let activeSession: CompanionActiveSession = EMPTY_SESSION;

export function setCompanionActiveSession(next: CompanionActiveSession): void {
  activeSession = next;
}

export function getCompanionActiveSession(): CompanionActiveSession {
  return activeSession;
}

export function resetCompanionActiveSession(): void {
  activeSession = EMPTY_SESSION;
}
