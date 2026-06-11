import type {
  AssistantCommunicationPreferences,
  AssistantGreeting,
  AssistantIdentityBundle,
  AssistantIdentityCard,
  AssistantIdentityProfile,
  WelcomeCompleteResult,
} from "./types";

export function parseAssistantIdentityBundle(data: unknown): AssistantIdentityBundle {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled as boolean | undefined,
    require_welcome_flow: d.require_welcome_flow as boolean | undefined,
    profile: d.profile as AssistantIdentityProfile | undefined,
    preferences: (d.preferences as AssistantCommunicationPreferences | null) ?? null,
    display_name: d.display_name as string | null | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseAssistantIdentityCard(data: unknown): AssistantIdentityCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    welcome_completed: d.welcome_completed as boolean | undefined,
    require_welcome_flow: d.require_welcome_flow as boolean | undefined,
    display_name: d.display_name as string | null | undefined,
    philosophy: d.philosophy as string | undefined,
  };
}

export function parseAssistantGreeting(data: unknown): AssistantGreeting {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    greeting: d.greeting as string | undefined,
    display_name: d.display_name as string | undefined,
    use_personalization: d.use_personalization as boolean | undefined,
  };
}

export function parseWelcomeComplete(data: unknown): WelcomeCompleteResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    completed: Boolean(d.completed),
    welcome_message: d.welcome_message as string | undefined,
    profile: d.profile as AssistantIdentityProfile | undefined,
  };
}

export function renderPhraseTemplate(body: string, variables: Record<string, string>): string {
  let result = body;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
