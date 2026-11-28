"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { PersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { interestStored } from "@/lib/personal-sales-page/interest";

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
  }
  return `psp${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function PersonalSalesInterestForm({
  labels,
  enabled,
  code,
  productKey,
  locale,
}: {
  labels: PersonalSalesLabels;
  enabled: boolean;
  code: string;
  productKey: string;
  locale: string;
}) {
  const formId = useId();
  const [notice, setNotice] = useState(enabled ? "" : labels.interestPending);
  const [busy, setBusy] = useState(false);
  const [idempotencyKey] = useState(newIdempotencyKey);

  return (
    <form
      id={formId}
      className="personal-sales-interest-card"
      aria-labelledby="personal-sales-interest"
      onSubmit={(event) => {
        event.preventDefault();
        if (!enabled || busy) {
          setNotice(labels.interestPending);
          return;
        }
        const form = new FormData(event.currentTarget);
        setBusy(true);
        void fetch("/api/personal-sales-page/interest", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            code,
            display_name: form.get("display_name"),
            email: form.get("email"),
            product_key: productKey,
            locale,
            follow_up_acknowledged: form.get("follow_up_acknowledged") === "on",
            company_website: form.get("company_website"),
            idempotency_key: form.get("idempotency_key") || idempotencyKey,
          }),
        })
          .then(async (response) => {
            const payload: unknown = await response.json().catch(() => null);
            const error =
              payload && typeof payload === "object" ? (payload as { error?: unknown }).error : null;
            if (interestStored(payload)) {
              setNotice(labels.interestSaved);
              return;
            }
            if (error === "invalid_email") setNotice(labels.interestErrorEmail);
            else if (error === "acknowledgement_required") setNotice(labels.interestErrorAcknowledgement);
            else if (error === "rate_limited") setNotice(labels.interestErrorRateLimited);
            else if (
              error === "duplicate" ||
              (payload && typeof payload === "object" && (payload as { duplicate?: unknown }).duplicate === true)
            ) {
              setNotice(labels.interestDuplicate);
            } else if (error === "core_pending") setNotice(labels.interestPending);
            else setNotice(labels.interestErrorClosed);
          })
          .catch(() => setNotice(labels.interestErrorClosed))
          .finally(() => setBusy(false));
      }}
    >
      <header className="personal-sales-interest-header">
        <h2 id="personal-sales-interest" className="personal-sales-interest-title">
          {labels.interestTitle}
        </h2>
        <p className="personal-sales-interest-lead">{labels.interestPrivacy}</p>
      </header>

      <div className="personal-sales-interest-fields">
        <label className="personal-sales-interest-field">
          <span className="personal-sales-interest-label">{labels.interestName}</span>
          <input
            name="display_name"
            autoComplete="name"
            required
            disabled={!enabled || busy}
            className="personal-sales-interest-input"
          />
        </label>
        <label className="personal-sales-interest-field">
          <span className="personal-sales-interest-label">{labels.interestEmail}</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={!enabled || busy}
            className="personal-sales-interest-input"
          />
        </label>
      </div>

      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        defaultValue=""
      />
      <input type="hidden" name="idempotency_key" value={idempotencyKey} readOnly />

      <label className="personal-sales-interest-consent">
        <input
          name="follow_up_acknowledged"
          type="checkbox"
          disabled={!enabled || busy}
          required={enabled}
          className="personal-sales-interest-checkbox"
        />
        <span>{labels.interestAcknowledgement}</span>
      </label>

      <div className="personal-sales-interest-actions">
        <button
          type="submit"
          className="kompis-web-sales-primary personal-sales-interest-submit"
          disabled={!enabled || busy}
          aria-disabled={!enabled || busy}
        >
          {labels.interestTitle}
        </button>
        <Link href="/privacy" className="personal-sales-interest-privacy">
          {labels.privacyLink}
        </Link>
      </div>

      <p className="personal-sales-interest-status" role="status">
        {notice}
      </p>
    </form>
  );
}
