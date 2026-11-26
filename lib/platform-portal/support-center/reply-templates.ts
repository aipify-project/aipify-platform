/**
 * Support reply starter templates (V1).
 * Norwegian is complete for admin. Other locales marked as fallback-to-no
 * until human translation — never machine-translate legal/sensitive copy here.
 */

import type { SupportTemplateVariable } from "./types";

export type SupportReplyTemplateCategory =
  | "intake"
  | "followup"
  | "access"
  | "billing"
  | "product"
  | "partner"
  | "status"
  | "resolution"
  | "bug"
  | "feedback";

export type SupportReplyTemplate = {
  id: string;
  name: string;
  category: SupportReplyTemplateCategory;
  locale: "no";
  subject: string;
  body: string;
  variables: SupportTemplateVariable[];
  active: boolean;
  version: number;
  starter: true;
  ownerNote: string;
};

const STARTER_NOTE =
  "Forslag til startmal — rediger før sending. Ingen uverifiserte løfter.";

export const SUPPORT_REPLY_STARTER_TEMPLATES_NO: readonly SupportReplyTemplate[] = [
  {
    id: "ack_received",
    name: "Takk for henvendelsen – vi har mottatt saken",
    category: "intake",
    locale: "no",
    subject: "Vi har mottatt saken din ({{ticket_number}})",
    body: `Hei {{customer_name}},

takk for at du kontaktet Aipify Support. Vi har mottatt henvendelsen din og registrert den med saksnummer {{ticket_number}}.

Vi går gjennom saken og følger opp så snart vi har mer informasjon. Du trenger ikke svare på denne meldingen med mindre du har ytterligere opplysninger å legge til.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "need_more_info",
    name: "Vi trenger flere opplysninger",
    category: "followup",
    locale: "no",
    subject: "Trenger mer informasjon – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for henvendelsen (sak {{ticket_number}}). For å kunne hjelpe deg videre trenger vi noen flere opplysninger:

1. Hva forsøkte du å gjøre da problemet oppsto?
2. Ser du en feilmelding? I så fall, hva står det (gjerne ordrett)?
3. Når skjedde dette (dato/klokkeslett og tidssone)?

Svar gjerne direkte på denne meldingen. Del ikke passord eller engangskoder.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "login_access",
    name: "Hjelp med innlogging og kontotilgang",
    category: "access",
    locale: "no",
    subject: "Hjelp med innlogging – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for at du tok kontakt om innlogging/kontotilgang (sak {{ticket_number}}).

Vi ber deg aldri om å sende passord. Bruk «Glemt passord» på innloggingssiden, og sjekk søppelpost hvis du ikke ser e-posten.

Hvis du fortsatt ikke kommer inn, svar med:
- e-postadressen knyttet til kontoen
- om du får en konkret feilmelding (uten å dele koder)

Da følger vi opp saken videre.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "subscription_license",
    name: "Spørsmål om abonnement eller lisens",
    category: "billing",
    locale: "no",
    subject: "Abonnement / lisens – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for spørsmålet om abonnement eller lisens (sak {{ticket_number}}). Produkt: {{product_name}}.

Vi ser på kundeforholdet knyttet til denne henvendelsen og kommer tilbake med status. Eventuelle endringer i abonnement gjennomføres først etter at riktig konto og produkt er bekreftet.

Har du fakturanummer eller organisasjonsnavn som matcher saken, kan du gjerne legge det ved.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "product_name", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "kompis_product",
    name: "Spørsmål om Kompis Web / Kompis Bedrift",
    category: "product",
    locale: "no",
    subject: "Kompis – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for henvendelsen om {{product_name}} (sak {{ticket_number}}).

Vi følger opp produktspørsmålet ditt. For å sikre at vi ser på riktig miljø, bekreft gjerne om dette gjelder Kompis Web (nettsted) eller Kompis Bedrift (APP), og om problemet er knyttet til en bestemt side eller arbeidsflate.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "product_name", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "sales_partner",
    name: "Spørsmål fra Aipify Sales Partner",
    category: "partner",
    locale: "no",
    subject: "Sales Partner – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for henvendelsen som Aipify Sales Partner (sak {{ticket_number}}).

Vi behandler partnersaker i egen kø med tilgang begrenset til din partnerkonto. Kundedata tilhørende andre partnere deles ikke.

Beskriv kort hva du trenger hjelp til (portal, sertifisering, kundehenvisning eller teknisk), så følger vi opp.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "in_progress",
    name: "Saken er til behandling",
    category: "status",
    locale: "no",
    subject: "Oppdatering – sak {{ticket_number}} er under behandling",
    body: `Hei {{customer_name}},

vi vil bare bekrefte at sak {{ticket_number}} er under behandling hos oss.

Du trenger ikke gjøre noe nå. Vi tar kontakt igjen når vi har en oppdatering eller trenger mer informasjon fra deg.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "resolution",
    name: "Løsning / oppfølging / avslutning",
    category: "resolution",
    locale: "no",
    subject: "Oppfølging – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

her er en kort oppdatering på sak {{ticket_number}}:

[Beskriv løsning eller oppfølging her — erstatt denne setningen før sending.]

Hvis dette løste behovet, kan vi lukke saken. Svar gjerne innen noen dager hvis noe fortsatt er uklart, så gjenåpner vi oppfølgingen.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "bug_received",
    name: "Feilrapport mottatt",
    category: "bug",
    locale: "no",
    subject: "Feilrapport mottatt – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for feilrapporten (sak {{ticket_number}}). Vi har registrert den og vil undersøke hva som skjer.

Hvis du har skjermbilder, tidspunkt eller stegene som reproduserer feilen, kan du svare på denne meldingen. Unngå å sende personlige tilgangskoder.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
  {
    id: "feedback_received",
    name: "Tilbakemelding / produktforslag mottatt",
    category: "feedback",
    locale: "no",
    subject: "Takk for tilbakemeldingen – sak {{ticket_number}}",
    body: `Hei {{customer_name}},

takk for tilbakemeldingen eller produktforslaget (sak {{ticket_number}}).

Vi leser alle innspill. Dette er ikke en garanti for at forslaget blir implementert, men det hjelper oss å prioritere forbedringer.

Hvis du vil legge til flere detaljer, svar gjerne på denne meldingen.

Med vennlig hilsen
{{agent_name}}
Aipify Support`,
    variables: ["customer_name", "ticket_number", "agent_name"],
    active: true,
    version: 1,
    starter: true,
    ownerNote: STARTER_NOTE,
  },
] as const;

/** Strip mustache conditionals that are not in the allowlist (subscription template cleanup). */
export function normalizeStarterTemplateBody(body: string): string {
  return body
    .replace(/\{\{#product\}\}\s*for \{\{product_name\}\}\{\{\/product\}\}/g, " for {{product_name}}")
    .replace(/\{\{#\w+\}\}[\s\S]*?\{\{\/\w+\}\}/g, "");
}

export function listSupportReplyStarterTemplates(): SupportReplyTemplate[] {
  return SUPPORT_REPLY_STARTER_TEMPLATES_NO.map((t) => ({
    ...t,
    body: normalizeStarterTemplateBody(t.body),
  }));
}

export function getSupportReplyStarterTemplate(
  id: string,
): SupportReplyTemplate | null {
  const found = listSupportReplyStarterTemplates().find((t) => t.id === id);
  return found ?? null;
}

/** Persistence of custom templates requires Core SQL (Phase B). */
export const SUPPORT_TEMPLATE_PERSIST_CONFIGURED = false as const;
