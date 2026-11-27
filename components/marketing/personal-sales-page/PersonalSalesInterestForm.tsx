"use client";

import { useState } from "react";
import Link from "next/link";
import type { PersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { interestStored } from "@/lib/personal-sales-page/interest";

export function PersonalSalesInterestForm({
  labels,
  enabled,
  productKey,
  locale,
}: {
  labels: PersonalSalesLabels;
  enabled: boolean;
  productKey: string;
  locale: string;
}) {
  const [notice, setNotice] = useState(labels.interestPending);

  return (
    <form
      className="space-y-3"
      aria-labelledby="personal-sales-interest"
      onSubmit={(event) => {
        event.preventDefault();
        if (!enabled) {
          setNotice(labels.interestPending);
          return;
        }
        const form = new FormData(event.currentTarget);
        void fetch("/api/personal-sales-page/interest", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            display_name: form.get("display_name"),
            email: form.get("email"),
            product_key: productKey,
            locale,
            follow_up_acknowledged: form.get("follow_up_acknowledged") === "on",
            company_website: form.get("company_website"),
            idempotency_key: form.get("idempotency_key"),
          }),
        })
          .then(async (response) => {
            const payload: unknown = await response.json().catch(() => null);
            setNotice(interestStored(payload) ? labels.interestSaved : labels.interestPending);
          })
          .catch(() => setNotice(labels.interestPending));
      }}
    >
      <h2 id="personal-sales-interest">{labels.interestTitle}</h2>
      <p>{labels.interestPrivacy}</p>
      <label className="block text-sm">
        {labels.interestName}
        <input name="display_name" autoComplete="name" required disabled={!enabled} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </label>
      <label className="block text-sm">
        {labels.interestEmail}
        <input name="email" type="email" autoComplete="email" required disabled={!enabled} className="mt-1 w-full rounded-xl border px-3 py-2" />
      </label>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />
      <input type="hidden" name="idempotency_key" value="" />
      <label className="flex items-start gap-2 text-sm">
        <input name="follow_up_acknowledged" type="checkbox" disabled={!enabled} />
        <span>{labels.interestAcknowledgement}</span>
      </label>
      <p>
        <Link href="/privacy">{labels.privacyLink}</Link>
      </p>
      <button type="submit" className="kompis-web-sales-primary" disabled={!enabled} aria-disabled={!enabled}>
        {labels.interestTitle}
      </button>
      <p role="status">{notice}</p>
    </form>
  );
}
