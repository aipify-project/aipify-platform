"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { UserRound } from "lucide-react";
import type { AccountProfileLabels } from "@/lib/app/account-profile/labels";
import type { AccountProfileView } from "@/lib/app/account-profile/types";
import {
  ACCOUNT_PROFILE_INPUT_CLASS,
  ACCOUNT_PROFILE_PRIMARY_BUTTON_CLASS,
  ACCOUNT_PROFILE_READONLY_VALUE_CLASS,
  ACCOUNT_PROFILE_SECONDARY_BUTTON_CLASS,
} from "@/lib/app/account-profile/form-styles";
import {
  ACCOUNT_PROFILE_PHONE_COUNTRIES,
  composeE164,
  isPlausibleE164,
  phoneCountryByDial,
  splitStoredPhone,
} from "@/lib/app/account-profile/phone";
import { AccountPhoneCountryFlag } from "./AccountPhoneCountryFlag";
import {
  AccountProfileFormCard,
  AccountProfileFormField,
} from "./AccountProfileFormCard";

type Props = {
  view: AccountProfileView;
  labels: AccountProfileLabels;
};

function fieldFallback(value: string | null, labels: AccountProfileLabels): string {
  if (value) return value;
  return labels.notRegistered;
}

/** Option text only — flag mark is rendered beside the select (avoids double flags). */
function phoneOptionLabel(dial: string, countryName: string): string {
  return [countryName, dial].filter(Boolean).join(" · ");
}

export function AccountPersonalEditor({ view, labels }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const initialPhone = splitStoredPhone(view.phone.value);
  const [fullName, setFullName] = useState(view.fullName.value ?? "");
  const [dial, setDial] = useState(initialPhone.dial);
  const [national, setNational] = useState(initialPhone.national);
  const [avatarUrl, setAvatarUrl] = useState(view.avatarUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedCountry = useMemo(() => phoneCountryByDial(dial), [dial]);
  const selectedName = labels.phoneCountries[selectedCountry.labelKey] ?? selectedCountry.iso2;
  const composedPhone = composeE164(dial, national);
  const baselineName = view.fullName.value ?? "";
  const baselinePhone = view.phone.value ?? "";
  const dirty =
    fullName.trim() !== baselineName.trim() || composedPhone !== baselinePhone.trim();

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const busy = pending || status === "saving";

  function resetForm() {
    setFullName(view.fullName.value ?? "");
    const phone = splitStoredPhone(view.phone.value);
    setDial(phone.dial);
    setNational(phone.national);
    setError(null);
    setStatus("idle");
  }

  async function saveProfile() {
    setStatus("saving");
    setError(null);
    if (composedPhone && !isPlausibleE164(composedPhone)) {
      setStatus("error");
      setError(labels.phoneInvalid);
      return;
    }
    const res = await fetch("/api/app/account-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: fullName.trim(), phone: composedPhone }),
    });
    if (!res.ok) {
      setStatus("error");
      setError(labels.saveError);
      return;
    }
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  async function uploadAvatar(file: File) {
    setStatus("saving");
    setError(null);
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/app/account-profile/avatar", { method: "POST", body: form });
    if (!res.ok) {
      setStatus("error");
      setError(labels.avatarUploadError);
      return;
    }
    const body = (await res.json()) as { avatarUrl?: string };
    setAvatarUrl(body.avatarUrl ?? null);
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  async function removeAvatar() {
    setStatus("saving");
    setError(null);
    const res = await fetch("/api/app/account-profile/avatar", { method: "DELETE" });
    if (!res.ok) {
      setStatus("error");
      setError(labels.avatarRemoveError);
      return;
    }
    setAvatarUrl(null);
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <AccountProfileFormCard
      title={labels.personalTitle}
      titleIcon={<UserRound aria-hidden className="h-4 w-4 text-[#7C3AED]" />}
      footer={
        <>
          {status === "saved" ? (
            <p className="mr-auto text-sm text-emerald-700" role="status">
              {labels.saveSuccess}
            </p>
          ) : null}
          {status === "error" && error ? (
            <p className="mr-auto text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            disabled={busy || !dirty}
            onClick={resetForm}
            className={ACCOUNT_PROFILE_SECONDARY_BUTTON_CLASS}
          >
            {labels.cancel}
          </button>
          <button
            type="button"
            disabled={busy || fullName.trim().length < 1 || !dirty}
            onClick={() => startTransition(() => void saveProfile())}
            className={ACCOUNT_PROFILE_PRIMARY_BUTTON_CLASS}
          >
            {labels.save}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- same-origin avatar pointer or legacy https
          <img
            src={avatarUrl}
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-[rgba(124,58,237,.12)] text-xl font-semibold text-[#7C3AED]"
            aria-hidden
          >
            {view.initials}
          </div>
        )}
        <div className="min-w-0 space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) startTransition(() => void uploadAvatar(file));
              event.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className={ACCOUNT_PROFILE_SECONDARY_BUTTON_CLASS}
            >
              {labels.avatarUpload}
            </button>
            {avatarUrl ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => startTransition(() => void removeAvatar())}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-200 bg-white px-5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {labels.avatarRemove}
              </button>
            ) : null}
          </div>
          {!avatarUrl ? (
            <p className="text-xs leading-relaxed text-gray-500">{labels.avatarFallback}</p>
          ) : null}
        </div>
      </div>

      <AccountProfileFormField label={labels.fullName} htmlFor="account-profile-full-name">
        <input
          id="account-profile-full-name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={120}
          autoComplete="name"
          className={ACCOUNT_PROFILE_INPUT_CLASS}
        />
      </AccountProfileFormField>

      <AccountProfileFormField
        label={labels.loginEmail}
        lockReason={labels.emailLockedReason}
        hint={labels.loginEmailHelp}
      >
        <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
          {fieldFallback(view.email.value, labels)}
        </div>
      </AccountProfileFormField>

      <div>
        <p className="block text-sm font-medium text-gray-700">{labels.phone}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,15rem)_1fr]">
          <label className="block min-w-0" htmlFor="account-profile-phone-country">
            <span className="sr-only">{labels.phoneCountry}</span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <AccountPhoneCountryFlag country={selectedCountry} />
              </span>
              <select
                id="account-profile-phone-country"
                value={dial}
                aria-label={`${labels.phoneCountry}: ${selectedName} ${dial}`}
                onChange={(event) => setDial(event.target.value)}
                className={`${ACCOUNT_PROFILE_INPUT_CLASS} mt-0 appearance-none pl-14`}
              >
                {ACCOUNT_PROFILE_PHONE_COUNTRIES.map((country) => {
                  const name = labels.phoneCountries[country.labelKey] ?? country.iso2;
                  return (
                    <option key={country.iso2} value={country.dial}>
                      {phoneOptionLabel(country.dial, name)}
                    </option>
                  );
                })}
              </select>
            </div>
          </label>
          <label className="block min-w-0" htmlFor="account-profile-phone-national">
            <span className="sr-only">{labels.phoneNational}</span>
            <input
              id="account-profile-phone-national"
              value={national}
              onChange={(e) => setNational(e.target.value)}
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={labels.phoneNationalPlaceholder}
              className={`${ACCOUNT_PROFILE_INPUT_CLASS} mt-0`}
            />
          </label>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{labels.phoneHelp}</p>
      </div>

      <AccountProfileFormField
        label={labels.address}
        lockReason={labels.addressBlockedReason}
        hint={labels.addressBlockedReason}
      >
        <div className={ACCOUNT_PROFILE_READONLY_VALUE_CLASS}>
          {view.address.source === "unavailable"
            ? labels.addressUnavailable
            : fieldFallback(view.address.value, labels)}
        </div>
      </AccountProfileFormField>
    </AccountProfileFormCard>
  );
}
