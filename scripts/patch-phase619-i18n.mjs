#!/usr/bin/env node
/** Patch Phase 619 i18n into customer-app split files (does NOT regenerate from customerApp.json). */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const locales = ["en", "no", "sv", "da", "pl", "uk"];

const headDash = JSON.parse(
  execSync("git show HEAD:locales/en/customer-app/dashboard.json", { encoding: "utf8" })
);
const restored = {
  servicePayments: headDash.servicePayments,
  serviceIntake: headDash.serviceIntake,
};

const phase619En = {
  serviceCommunications: {
    title: "Service Communications",
    subtitle: "Booking confirmations, reminders, customer replies, and governed templates — clear communication without pressure.",
    principle: "Aipify helps service businesses communicate clearly without pressure or spam.",
    privacyNote: "Communication access respects organization, location, provider, and customer scopes.",
    loading: "Loading",
    empty: "Service Communications Center is not available for this organization.",
    refresh: "Refresh",
    noRecords: "No records in this section yet.",
    companionAdvisor: "Companion Service Experience Advisor",
    sections: {
      overview: "Overview",
      messages: "Messages",
      scheduled: "Scheduled",
      failed: "Failed delivery",
      replies: "Customer replies",
      templates: "Templates",
      preferences: "Preferences",
      settings: "Settings",
    },
    stats: {
      scheduled: "Scheduled",
      delivered: "Delivered",
      failed: "Failed",
      repliesPending: "Replies pending",
      suppressed: "Suppressed",
    },
  },
  serviceRebooking: {
    title: "Service Rebooking",
    subtitle: "Governed rebooking recommendations connected to the existing booking engine.",
    principle: "Rebooking uses the existing booking engine — completed bookings are never rewritten.",
    privacyNote: "Rebooking visibility respects location and provider assignment.",
    loading: "Loading",
    empty: "Service Rebooking is not available for this organization.",
    refresh: "Refresh",
    noRecords: "No rebooking opportunities in this view yet.",
    stats: { rebookingDue: "Rebooking due", rebooked: "Rebooked", remindersSent: "Reminders sent" },
  },
  serviceFeedback: {
    title: "Service Feedback",
    subtitle: "Private customer feedback, service recovery, and optional review requests.",
    principle: "Private feedback is easy to ignore — public review requests are optional and frequency-limited.",
    privacyNote: "Feedback comments require appropriate permission — no review gating.",
    loading: "Loading",
    empty: "Service Feedback is not available for this organization.",
    refresh: "Refresh",
    noRecords: "No feedback records in this view yet.",
    stats: {
      newFeedback: "New feedback",
      followUpRequired: "Follow-up required",
      recoveryOpen: "Recovery open",
      reviewRequests: "Review requests",
    },
  },
  serviceQuality: {
    title: "Service Quality",
    subtitle: "Operational service quality insights — constructive, not surveillance.",
    principle: "Service quality insights improve operations — they must not become employee surveillance.",
    privacyNote: "Quality views respect organization, location, and provider scope.",
    loading: "Loading",
    empty: "Service Quality dashboard is not available for this organization.",
    refresh: "Refresh",
    noRecords: "No quality data for the selected view yet.",
    stats: {
      alertsOpen: "Open alerts",
      avgRating: "Average rating",
      deliverySuccessRate: "Delivery success",
      rebookingRate: "Rebooking rate",
    },
  },
};

const navLabels = {
  en: { servicePayments: "Service Payments", serviceIntake: "Service Intake", serviceCommunications: "Service Communications" },
  no: { servicePayments: "Servicebetalinger", serviceIntake: "Serviceinntak", serviceCommunications: "Servicekommunikation" },
  sv: { servicePayments: "Servicebetalningar", serviceIntake: "Serviceintag", serviceCommunications: "Servicekommunikation" },
  da: { servicePayments: "Servicebetalinger", serviceIntake: "Serviceindtag", serviceCommunications: "Servicekommunikation" },
  pl: { servicePayments: "Płatności serwisowe", serviceIntake: "Przyjęcie serwisowe", serviceCommunications: "Komunikacja serwisowa" },
  uk: { servicePayments: "Сервісні платежі", serviceIntake: "Сервісний intake", serviceCommunications: "Сервісна комунікація" },
};

for (const locale of locales) {
  const dashPath = path.join(root, `locales/${locale}/customer-app/dashboard.json`);
  const dash = JSON.parse(fs.readFileSync(dashPath, "utf8"));
  Object.assign(dash, restored, phase619En);
  const localeDash = {
    no: {
      serviceCommunications: {
        title: "Servicekommunikasjon",
        subtitle: "Bookingbekreftelser, påminnelser, kundesvar og styrte maler — tydelig kommunikasjon uten press.",
        principle: "Aipify hjelper servicebedrifter å kommunisere tydelig uten press eller spam.",
        empty: "Servicesenter for kommunikasjon er ikke tilgjengelig for denne organisasjonen.",
        companionAdvisor: "Companion rådgiver for serviceopplevelse",
        sections: {
          overview: "Oversikt",
          messages: "Meldinger",
          scheduled: "Planlagt",
          failed: "Mislykket levering",
          replies: "Kundesvar",
          templates: "Maler",
          preferences: "Preferanser",
          settings: "Innstillinger",
        },
      },
      serviceRebooking: {
        title: "Service rebooking",
        subtitle: "Styrte rebooking-anbefalinger koblet til eksisterende bookingmotor.",
        principle: "Rebooking bruker eksisterende bookingmotor — fullførte bookinger omskrives aldri.",
        empty: "Service rebooking er ikke tilgjengelig for denne organisasjonen.",
      },
      serviceFeedback: {
        title: "Service tilbakemelding",
        subtitle: "Privat kundetilbakemelding, servicegjenoppretting og valgfrie anmeldelsesforespørsler.",
        principle: "Privat tilbakemelding kan ignoreres — offentlige anmeldelsesforespørsler er valgfrie og frekvensbegrenset.",
        empty: "Service tilbakemelding er ikke tilgjengelig for denne organisasjonen.",
      },
      serviceQuality: {
        title: "Servicekvalitet",
        subtitle: "Operative innsikter om servicekvalitet — konstruktivt, ikke overvåking.",
        principle: "Innsikter om servicekvalitet forbedrer driften — de må ikke bli ansattovervåking.",
        empty: "Servicekvalitetsdashbordet er ikke tilgjengelig for denne organisasjonen.",
      },
    },
    sv: {
      serviceCommunications: {
        title: "Servicekommunikation",
        subtitle: "Bokningsbekräftelser, påminnelser, kundsvar och styrda mallar — tydlig kommunikation utan press.",
        principle: "Aipify hjälper serviceföretag att kommunicera tydligt utan press eller spam.",
        empty: "Servicekommunikationscenter är inte tillgängligt för denna organisation.",
        companionAdvisor: "Companion rådgivare för serviceupplevelse",
        sections: {
          overview: "Översikt",
          messages: "Meddelanden",
          scheduled: "Schemalagda",
          failed: "Misslyckad leverans",
          replies: "Kundsvar",
          templates: "Mallar",
          preferences: "Preferenser",
          settings: "Inställningar",
        },
      },
      serviceRebooking: {
        title: "Service ombokning",
        subtitle: "Styrda ombokningsrekommendationer kopplade till befintlig bokningsmotor.",
        principle: "Ombokning använder befintlig bokningsmotor — slutförda bokningar skrivs aldrig om.",
        empty: "Service ombokning är inte tillgänglig för denna organisation.",
      },
      serviceFeedback: {
        title: "Service feedback",
        subtitle: "Privat kundfeedback, serviceåterställning och valfria recensionsförfrågningar.",
        principle: "Privat feedback kan ignoreras — offentliga recensionsförfrågningar är valfria och frekvensbegränsade.",
        empty: "Service feedback är inte tillgänglig för denna organisation.",
      },
      serviceQuality: {
        title: "Servicekvalitet",
        subtitle: "Operativa insikter om servicekvalitet — konstruktivt, inte övervakning.",
        principle: "Insikter om servicekvalitet förbättrar verksamheten — de får inte bli medarbetarövervakning.",
        empty: "Servicekvalitetsdashboarden är inte tillgänglig för denna organisation.",
      },
    },
    da: {
      serviceCommunications: {
        title: "Servicekommunikation",
        subtitle: "Bookingbekræftelser, påmindelser, kundesvar og styrede skabeloner — tydelig kommunikation uden pres.",
        principle: "Aipify hjælper servicevirksomheder med at kommunikere tydeligt uden pres eller spam.",
        empty: "Servicekommunikationscenter er ikke tilgængeligt for denne organisation.",
        companionAdvisor: "Companion rådgiver for serviceoplevelse",
        sections: {
          overview: "Oversigt",
          messages: "Beskeder",
          scheduled: "Planlagt",
          failed: "Mislykket levering",
          replies: "Kundesvar",
          templates: "Skabeloner",
          preferences: "Præferencer",
          settings: "Indstillinger",
        },
      },
      serviceRebooking: {
        title: "Service genbooking",
        subtitle: "Styrede genbooking-anbefalinger koblet til eksisterende bookingmotor.",
        principle: "Genbooking bruger eksisterende bookingmotor — gennemførte bookinger omskrives aldrig.",
        empty: "Service genbooking er ikke tilgængelig for denne organisation.",
      },
      serviceFeedback: {
        title: "Service feedback",
        subtitle: "Privat kundefeedback, servicegenopretning og valgfrie anmeldelsesanmodninger.",
        principle: "Privat feedback kan ignoreres — offentlige anmeldelsesanmodninger er valgfrie og frekvensbegrænsede.",
        empty: "Service feedback er ikke tilgængelig for denne organisation.",
      },
      serviceQuality: {
        title: "Servicekvalitet",
        subtitle: "Operationelle indsigter i servicekvalitet — konstruktivt, ikke overvågning.",
        principle: "Indsigter i servicekvalitet forbedrer driften — de må ikke blive medarbejderovervågning.",
        empty: "Servicekvalitetsdashboard er ikke tilgængeligt for denne organisation.",
      },
    },
  }[locale];

  if (localeDash) {
    for (const [key, patch] of Object.entries(localeDash)) {
      dash[key] = { ...dash[key], ...patch };
      if (patch.sections) {
        dash[key].sections = { ...dash[key].sections, ...patch.sections };
      }
    }
  }
  fs.writeFileSync(dashPath, `${JSON.stringify(dash, null, 2)}\n`);

  const navPath = path.join(root, `locales/${locale}/customer-app/navigation.json`);
  const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
  Object.assign(nav.nav, navLabels[locale]);
  fs.writeFileSync(navPath, `${JSON.stringify(nav, null, 2)}\n`);
  console.log("Fixed", locale);
}
