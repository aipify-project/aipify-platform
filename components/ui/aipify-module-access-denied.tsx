"use client";

import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import {
  resolveAccessRequiredStatus,
  type AccessRequiredRule,
} from "@/lib/system-notice/access-rules";

type Props = {
  /** Access rule — drives title, description, and CTA from system notice presets. */
  rule?: AccessRequiredRule;
  /** Optional override when the module needs a specific line in the body. */
  message?: string;
  title?: string;
};

/** Branded module/panel access denied — uses Light Enterprise Theme. Design is fixed; copy and CTA vary by rule. */
export function AipifyModuleAccessDenied({ rule = "administrator", message, title }: Props) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <AipifySystemNotice
        status={resolveAccessRequiredStatus(rule)}
        title={title}
        message={message}
        fullPage={false}
      />
    </div>
  );
}
