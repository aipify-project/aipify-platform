"use client";

import { Building2, Handshake, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ComponentProps } from "react";
import type { PwaInstallLabels } from "@/lib/pwa/types";
import LoginForm from "./LoginForm";
import {
  LoginInstallPromotionPanel,
  type LoginInstallPromotionLabels,
} from "./LoginInstallPromotionPanel";
import { PortalEntryCard } from "./PortalEntryCard";

export type PortalEntrySelection = "customer" | "partner";

export type LoginPortalExperienceLabels = {
  heading: string;
  intro: string;
  cards: {
    customer: { title: string; description: string; action: string; a11yLabel: string };
    partner: { title: string; description: string; action: string; a11yLabel: string };
    newCustomer: { title: string; description: string; action: string; a11yLabel: string };
  };
  forms: {
    customerHeading: string;
    partnerHeading: string;
    backToSelection: string;
  };
  selectedState: {
    customer: string;
    partner: string;
  };
  installPromotion: LoginInstallPromotionLabels;
};

type LoginFormLabels = ComponentProps<typeof LoginForm>["labels"];

type LoginPortalExperienceProps = {
  labels: LoginPortalExperienceLabels;
  loginLabels: LoginFormLabels;
  pwaLabels: PwaInstallLabels;
};

function parsePortalParam(value: string | null): PortalEntrySelection | null {
  if (value === "customer" || value === "partner") return value;
  return null;
}

export function LoginPortalExperience({
  labels,
  loginLabels,
  pwaLabels,
}: LoginPortalExperienceProps) {
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<PortalEntrySelection | null>(null);

  useEffect(() => {
    const fromQuery = parsePortalParam(searchParams.get("portal"));
    if (fromQuery) setSelection(fromQuery);
  }, [searchParams]);

  function showSelection(next: PortalEntrySelection | null) {
    setSelection(next);
  }

  if (!selection) {
    return (
      <div className="space-y-6 sm:space-y-7">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {labels.heading}
          </h1>
          <p className="mt-2.5 text-base leading-relaxed text-gray-600 sm:text-lg">{labels.intro}</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <PortalEntryCard
            icon={Building2}
            title={labels.cards.customer.title}
            description={labels.cards.customer.description}
            actionLabel={labels.cards.customer.action}
            a11yLabel={labels.cards.customer.a11yLabel}
            onSelect={() => showSelection("customer")}
          />
          <PortalEntryCard
            icon={Handshake}
            title={labels.cards.partner.title}
            description={labels.cards.partner.description}
            actionLabel={labels.cards.partner.action}
            a11yLabel={labels.cards.partner.a11yLabel}
            onSelect={() => showSelection("partner")}
          />
          <PortalEntryCard
            icon={UserPlus}
            title={labels.cards.newCustomer.title}
            description={labels.cards.newCustomer.description}
            actionLabel={labels.cards.newCustomer.action}
            a11yLabel={labels.cards.newCustomer.a11yLabel}
            href="/register"
          />
        </div>

        <LoginInstallPromotionPanel labels={labels.installPromotion} />
      </div>
    );
  }

  const formHeading =
    selection === "partner" ? labels.forms.partnerHeading : labels.forms.customerHeading;
  const postLoginNext = selection === "partner" ? "/partners" : undefined;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => showSelection(null)}
        className="inline-flex min-h-11 items-center text-sm font-medium text-violet-700 hover:text-violet-800"
      >
        ← {labels.forms.backToSelection}
      </button>

      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{formHeading}</h1>
      </div>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 sm:p-8">
        <LoginForm
          labels={loginLabels}
          pwaLabels={pwaLabels}
          hideRegisterLink
          postLoginNext={postLoginNext}
          showInstallLinks={false}
        />
      </div>
    </div>
  );
}
