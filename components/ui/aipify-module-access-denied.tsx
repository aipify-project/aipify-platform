"use client";

import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";

type Props = {
  message: string;
  title?: string;
};

/** Branded module/panel access denied — uses Light Enterprise Theme. */
export function AipifyModuleAccessDenied({ message, title }: Props) {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <AipifySystemNotice
        status="unauthorized_panel"
        title={title}
        message={message}
        fullPage={false}
      />
    </div>
  );
}
