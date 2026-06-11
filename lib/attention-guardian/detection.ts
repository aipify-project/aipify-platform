import type { FocusModeProposal } from "./types";

const FOCUS_PATTERNS = [
  /\bi'?m working on\b/i,
  /\bi am working on\b/i,
  /\bneed to focus\b/i,
  /\bdeep work\b/i,
  /\bdon'?t interrupt\b/i,
  /\bprotect my (time|focus|morning|afternoon)\b/i,
  /\bfocus mode\b/i,
  /\bconcentrat(e|ing)\b/i,
  /\bthis morning\b/i,
  /\bthis afternoon\b/i,
  /\buntil noon\b/i,
  /\buntil \d{1,2}(:\d{2})?\s*(am|pm)?\b/i,
];

function inferSessionType(message: string): string {
  if (/family|kids|children/i.test(message)) return "family";
  if (/exercise|workout|run|gym/i.test(message)) return "exercise";
  if (/plan|strateg/i.test(message)) return "strategic_planning";
  if (/reflect|journal/i.test(message)) return "reflection";
  if (/creative|design|write/i.test(message)) return "creative";
  return "deep_work";
}

function extractFocusTitle(message: string): string {
  const workingOn = message.match(/\bworking on\s+(.+?)(?:\s+this|\s+until|\.|$)/i);
  if (workingOn?.[1]) {
    const t = workingOn[1].trim();
    return t.length <= 60 ? t : `${t.slice(0, 57)}…`;
  }
  if (message.length <= 60) return message.trim();
  return `${message.trim().slice(0, 57)}…`;
}

function extractEndHint(message: string): string | null {
  if (/until noon/i.test(message)) return "noon";
  if (/this morning/i.test(message)) return "noon";
  if (/this afternoon/i.test(message)) return "evening";
  const until = message.match(/until\s+(\d{1,2}(:\d{2})?\s*(?:am|pm)?)/i);
  return until?.[1] ?? null;
}

export function detectFocusIntent(message: string): FocusModeProposal | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  const matches = FOCUS_PATTERNS.some((p) => p.test(trimmed));
  if (!matches) return null;

  const title = extractFocusTitle(trimmed);
  const endHint = extractEndHint(trimmed);
  const sessionType = inferSessionType(trimmed);

  const prompt = endHint
    ? `Would you like me to reduce non-essential interruptions until ${endHint}?`
    : "Would you like me to activate focus mode and reduce non-essential interruptions?";

  return {
    detected: true,
    title,
    session_type: sessionType,
    ends_at_hint: endHint,
    prompt,
  };
}
