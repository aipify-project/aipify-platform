export type InboundEventClass =
  | "human"
  | "auto_reply"
  | "bounce"
  | "spam"
  | "out_of_office"
  | "loop"
  | "delivered";

const AUTO_SUBJECT =
  /^(auto:|automatic reply|autosvar|frånvaro|out of office|ooo:|undeliverable|delivery status notification|mail delivery failed)/i;

export function classifyInboundEvent(input: {
  eventType: string | null;
  headers?: Record<string, string>;
  subject?: string | null;
}): InboundEventClass {
  const type = (input.eventType ?? "").toLowerCase();
  if (type.includes("bounce")) return "bounce";
  if (type.includes("complain") || type.includes("spam")) return "spam";
  if (type === "email.delivered" || type.endsWith(".delivered")) return "delivered";

  const headers = input.headers ?? {};
  const read = (name: string) => {
    const found = Object.entries(headers).find(([key]) => key.toLowerCase() === name);
    return (found?.[1] ?? "").trim().toLowerCase();
  };
  const auto = read("auto-submitted");
  if (auto && auto !== "no") {
    if (auto.includes("vacation") || auto.includes("ooo")) return "out_of_office";
    return "auto_reply";
  }
  const precedence = read("precedence");
  if (precedence === "bulk" || precedence === "junk" || precedence === "list") return "loop";
  if (read("x-autoreply") === "yes" || read("x-autoreply") === "true" || read("x-autorespond")) return "auto_reply";
  const subject = (input.subject ?? "").trim();
  if (AUTO_SUBJECT.test(subject)) {
    if (/out of office|frånvaro|ooo:/i.test(subject)) return "out_of_office";
    if (/undeliverable|delivery status|mail delivery failed/i.test(subject)) return "bounce";
    return "auto_reply";
  }
  return "human";
}
