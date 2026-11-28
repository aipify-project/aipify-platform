"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  AipifyHumanVerification,
  PublicFormHoneypot,
} from "@/components/ui/aipify-human-verification";
import { PublicFormInfoNotice } from "@/components/ui/public-form-info-notice";
import { AipifyPublicFormClasses } from "@/lib/public-forms/public-form-ui";
import { usePublicFormGuard } from "@/lib/public-forms/use-public-form-guard";
import { sanitizeSupportIntakePayload, type IntakeValidationField } from "@/lib/support-intake/sanitize";
import type { HumanVerificationLabels } from "@/lib/system-notice/types";

export type SupportIntakeFormLabels = {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
  submitting: string;
  /** Shown when intake gates are off — never a success claim. */
  successCorePending: string;
  /** Shown when intake is live but the server is temporarily unavailable (e.g. 503). */
  temporaryUnavailable: string;
  /** Shown only after a real accepted ticket write. */
  successSubmitted?: string;
  errorGeneric: string;
  mailtoFallback: string;
  mailtoLabel: string;
  verificationRequired: string;
  privacy: string;
  nameRequired: string;
  emailInvalid: string;
  subjectTooShort: string;
  messageTooShort: string;
  referenceLabel: string;
};

type Props = {
  labels: SupportIntakeFormLabels;
  verificationLabels: HumanVerificationLabels;
  /** When false, the form stays visible but cannot create a ticket. */
  intakeLive?: boolean;
};

type FormStatus = "idle" | "submitting" | "blocked" | "done" | "error";

const SUPPORT_EMAIL = "support@aipify.ai";
const TICKET_NUMBER_RE = /^SUP-[A-Z0-9]{8}$/;

function fieldError(
  field: IntakeValidationField,
  labels: SupportIntakeFormLabels,
): string {
  switch (field) {
    case "name":
      return labels.nameRequired;
    case "email":
      return labels.emailInvalid;
    case "subject":
      return labels.subjectTooShort;
    case "message":
      return labels.messageTooShort;
    default:
      return labels.errorGeneric;
  }
}

function mailtoHref(fields: { name: string; email: string; subject: string; message: string }): string {
  const params = new URLSearchParams();
  const subject = fields.subject.trim().slice(0, 200);
  if (subject) params.set("subject", subject);
  const body = [fields.name.trim(), fields.email.trim(), fields.message.trim()]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 2000);
  if (body) params.set("body", body);
  const query = params.toString();
  return query ? `mailto:${SUPPORT_EMAIL}?${query}` : `mailto:${SUPPORT_EMAIL}`;
}

export default function SupportIntakeForm({
  labels,
  verificationLabels,
  intakeLive = false,
}: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const idempotencyKey = useRef(crypto.randomUUID());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const {
    requireVerification,
    guardFields,
    onVerified,
    onVerificationReset,
    verificationRequired,
  } = usePublicFormGuard();

  const emailHref = useMemo(
    () => mailtoHref({ name, email, subject, message }),
    [name, email, subject, message],
  );
  const gateClosed = !intakeLive;
  const temporarilyUnavailable = intakeLive && status === "blocked";
  const availabilityNotice = gateClosed
    ? labels.successCorePending
    : temporarilyUnavailable
      ? labels.temporaryUnavailable
      : null;
  const confirmed = status === "done" && ticketNumber != null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!intakeLive) return;
    setError(null);
    setTicketNumber(null);

    const draft = {
      contactName: name,
      contactEmail: email,
      subject,
      message,
    };
    const sanitized = sanitizeSupportIntakePayload(draft, "web");
    if (!sanitized.ok) {
      setStatus("error");
      setError(fieldError(sanitized.field, labels));
      return;
    }
    if (!requireVerification()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/support-intake/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          guardFields(sanitized.value.contactEmail ?? "", {
            contactName: sanitized.value.contactName,
            contactEmail: sanitized.value.contactEmail,
            subject: sanitized.value.subject,
            message: sanitized.value.message,
            idempotencyKey: idempotencyKey.current,
            _honeypot: new FormData(e.currentTarget).get("_honeypot"),
          }),
        ),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        field?: IntakeValidationField;
        ok?: boolean;
        live?: boolean;
        ticket_number?: string;
        ticketNumber?: string;
      };

      // temporaryUnavailable only for true intake unavailability — never spam/honeypot.
      if (
        res.status === 503 ||
        json.code === "rate_limit_unavailable" ||
        json.code === "core_not_applied" ||
        json.code === "channel_not_activated" ||
        json.code === "feature_gate_off"
      ) {
        setStatus("blocked");
        onVerificationReset();
        return;
      }
      if (json.code === "validation" && json.field) {
        setStatus("error");
        setError(fieldError(json.field, labels));
        return;
      }
      const returned =
        typeof json.ticket_number === "string"
          ? json.ticket_number.trim()
          : typeof json.ticketNumber === "string"
            ? json.ticketNumber.trim()
            : "";
      if (!res.ok || json.ok !== true || !TICKET_NUMBER_RE.test(returned)) {
        setStatus("error");
        setError(labels.errorGeneric);
        return;
      }
      setTicketNumber(returned);
      setStatus("done");
      idempotencyKey.current = crypto.randomUUID();
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      onVerificationReset();
    } catch {
      setStatus("error");
      setError(labels.errorGeneric);
    }
  }

  return (
    <section className={AipifyPublicFormClasses.panel} data-testid="public-support-intake-form">
      <h1 className={AipifyPublicFormClasses.title}>{labels.title}</h1>
      <p className={AipifyPublicFormClasses.subtitle}>{labels.subtitle}</p>

      {confirmed ? (
        <div className={`mt-6 ${AipifyPublicFormClasses.noticeSuccess}`} role="status">
          <p className="font-medium">{labels.successSubmitted}</p>
          <p className="mt-2 text-sm">
            {labels.referenceLabel}: <span className="font-semibold">{ticketNumber}</span>
          </p>
        </div>
      ) : (
        <form className={AipifyPublicFormClasses.formStack} onSubmit={onSubmit} noValidate>
          {availabilityNotice ? (
            <div
              id="support-intake-closed"
              className={AipifyPublicFormClasses.noticeWarning}
              role="status"
            >
              {availabilityNotice}
            </div>
          ) : null}

          <PublicFormHoneypot />

          <label className={AipifyPublicFormClasses.field}>
            <span className={AipifyPublicFormClasses.label}>{labels.name}</span>
            <input
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className={AipifyPublicFormClasses.input}
            />
          </label>
          <label className={AipifyPublicFormClasses.field}>
            <span className={AipifyPublicFormClasses.label}>{labels.email}</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className={AipifyPublicFormClasses.input}
            />
          </label>
          <label className={AipifyPublicFormClasses.field}>
            <span className={AipifyPublicFormClasses.label}>{labels.subject}</span>
            <input
              name="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              className={AipifyPublicFormClasses.input}
            />
          </label>
          <label className={AipifyPublicFormClasses.field}>
            <span className={AipifyPublicFormClasses.label}>{labels.message}</span>
            <textarea
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              rows={6}
              className={AipifyPublicFormClasses.input}
            />
          </label>

          <p className={AipifyPublicFormClasses.hint}>{labels.privacy}</p>

          <div id="support-intake-verification" tabIndex={-1} className="focus:outline-none">
            <AipifyHumanVerification
              labels={verificationLabels}
              variant="light"
              compact
              onVerified={onVerified}
              onReset={onVerificationReset}
            />
            {verificationRequired && intakeLive ? (
              <p className="mt-2 text-sm font-medium text-amber-800" role="alert">
                {labels.verificationRequired}
              </p>
            ) : null}
          </div>

          <PublicFormInfoNotice testId="support-intake-email-alternative">
            <p>
              <a className={AipifyPublicFormClasses.link} href={emailHref}>
                {labels.mailtoLabel}
              </a>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-aipify-text-muted">{labels.mailtoFallback}</p>
          </PublicFormInfoNotice>

          {error ? (
            <p className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <div>
            <button
              type="submit"
              disabled={!intakeLive || status === "submitting"}
              aria-describedby={availabilityNotice ? "support-intake-closed" : undefined}
              className={
                intakeLive ? AipifyPublicFormClasses.submit : AipifyPublicFormClasses.submitQuiet
              }
            >
              {status === "submitting" ? labels.submitting : labels.submit}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
