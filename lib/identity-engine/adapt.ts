import type { IdentityProfile } from "./types";

/** Adapt assistant reply to identity profile — transparent, never manipulative. */
export function adaptReplyToIdentity(
  reply: string,
  profile: Pick<
    IdentityProfile,
    "communication_style" | "tone" | "name_usage" | "response_length"
  >,
  userName?: string | null
): string {
  let text = reply;

  if (profile.response_length === "short" && text.length > 120) {
    const sentence = text.split(/[.!?]/)[0]?.trim();
    text = sentence ? `${sentence}.` : text.slice(0, 120).trim() + "…";
  }

  if (profile.communication_style === "minimal") {
    text = text.replace(/^(I can help with that\. |Let's look at your day\. )/i, "");
  }

  if (profile.tone === "encouraging" && !/^you've got|great/i.test(text)) {
    text = `You've got this. ${text}`;
  } else if (profile.tone === "calm" && !/^take your time/i.test(text)) {
    text = `Take your time — ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  } else if (profile.tone === "direct") {
    text = text.replace(/\b(would you like|shall I)\b/gi, "Do you want");
  }

  const firstName = userName?.trim();
  if (
    firstName &&
    profile.name_usage === "always" &&
    !text.toLowerCase().includes(firstName.toLowerCase())
  ) {
    text = `${firstName}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  } else if (
    firstName &&
    profile.name_usage === "occasional" &&
    text.length % 3 === 0 &&
    !text.includes(firstName)
  ) {
    text = `${firstName}, ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  }

  if (profile.communication_style === "professional" || profile.communication_style === "formal") {
    text = text.replace(/\b(I'm listening|Tell me what matters)\b/gi, "Please share what you'd like remembered");
  }

  return text.trim();
}

export function buildExplainabilitySnippet(
  profile: Pick<
    IdentityProfile,
    "communication_style" | "proactivity_level" | "tone" | "name_usage"
  >
): string {
  const parts: string[] = [];
  if (profile.communication_style) {
    parts.push(`${profile.communication_style} communication`);
  }
  if (profile.proactivity_level) {
    parts.push(`${profile.proactivity_level} proactivity`);
  }
  if (profile.name_usage === "always") {
    parts.push("using your first name");
  }
  if (profile.tone) {
    parts.push(`${profile.tone} tone`);
  }
  return `You asked for ${parts.join(", ")}.`;
}
