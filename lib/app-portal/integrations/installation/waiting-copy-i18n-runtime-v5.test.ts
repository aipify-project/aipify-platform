import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CUSTOMER_ACTIVE_LOCALE_ORDER } from "@/lib/i18n/customer-active-locale-registry";
import { buildAppPortalIntegrationsLabels } from "../labels";
import {
  buildInstallationWizardLabels,
  installationWizardMessageKeys,
} from "./labels";
import {
  isUnresolvedInstallationI18nValue,
  resolveInstallationWaitingCopyParty,
  resolveInstallationWaitingCopyText,
} from "./waiting-copy";

const keys = installationWizardMessageKeys();

function loadWizardLocale(locale: string) {
  const json = JSON.parse(
    readFileSync(
      join(process.cwd(), `locales/${locale}/customer-app/portalStructure.json`),
      "utf8"
    )
  );
  return json.portalStructure.integrations.installationWizard as {
    waiting: string;
    waitingByParty: Record<string, string>;
  };
}

function dictTranslator(locale: string): (key: string) => string {
  const wiz = loadWizardLocale(locale);
  const map: Record<string, string> = {
    [keys.waiting]: wiz.waiting,
    [keys.waitingByParty.aipify]: wiz.waitingByParty.aipify,
    [keys.waitingByParty.aipify_guided]: wiz.waitingByParty.aipifyGuided,
    [keys.waitingByParty.customer_it]: wiz.waitingByParty.customerIt,
    [keys.waitingByParty.partner]: wiz.waitingByParty.partner,
    [keys.waitingByParty.unknown]: wiz.waitingByParty.unknown,
  };
  return (key: string) => map[key] ?? key;
}

/** Production-equivalent: page builds messageCatalog, client only looks up catalog. */
function productionParityWizardLabels(locale: string) {
  const pageT = dictTranslator(locale);
  const labels = buildAppPortalIntegrationsLabels((key) => {
    const hit = pageT(key);
    if (hit !== key) return hit;
    // Other catalog keys resolve to a non-key placeholder so catalog build succeeds.
    return `resolved:${key.split(".").pop() ?? key}`;
  });
  const clientT = (key: string) => labels.setup.messageCatalog[key] ?? key;
  return {
    labels,
    clientT,
    wiz: buildInstallationWizardLabels(clientT),
  };
}

// A. Pre-fix shape: missing catalog entry surfaces raw key via naive lookup
{
  const pageT = dictTranslator("en");
  const naiveCatalog: Record<string, string> = {
    [keys.waiting]: pageT(keys.waiting),
  };
  const naiveT = (key: string) => naiveCatalog[key] ?? key;
  assert.equal(naiveT(keys.waitingByParty.aipify), keys.waitingByParty.aipify);
  assert.equal(
    isUnresolvedInstallationI18nValue(
      naiveT(keys.waitingByParty.aipify),
      keys.waitingByParty.aipify
    ),
    true
  );
}

// B. Production-parity catalog includes waitingByParty keys
{
  const { labels, wiz } = productionParityWizardLabels("en");
  assert.equal(
    Boolean(labels.setup.messageCatalog[keys.waitingByParty.aipify]),
    true
  );
  assert.equal(wiz.waitingForParty("aipify"), "Waiting for Aipify");
  assert.notEqual(wiz.waitingForParty("aipify"), keys.waitingByParty.aipify);
}

// C. Locale matrix — active customer locales, no hardcoded locale set
for (const locale of CUSTOMER_ACTIVE_LOCALE_ORDER) {
  const wizJson = loadWizardLocale(locale);
  assert.ok(wizJson.waitingByParty.aipify, `${locale}: aipify`);
  assert.ok(wizJson.waitingByParty.aipifyGuided, `${locale}: aipifyGuided`);
  assert.ok(wizJson.waitingByParty.customerIt, `${locale}: customerIt`);
  assert.ok(wizJson.waitingByParty.partner, `${locale}: partner`);
  assert.ok(wizJson.waitingByParty.unknown, `${locale}: unknown`);

  const { wiz, labels } = productionParityWizardLabels(locale);
  for (const partyKey of Object.values(keys.waitingByParty)) {
    assert.ok(
      labels.setup.messageCatalog[partyKey],
      `${locale}: catalog missing ${partyKey}`
    );
    assert.equal(
      isUnresolvedInstallationI18nValue(
        labels.setup.messageCatalog[partyKey],
        partyKey
      ),
      false,
      `${locale}: catalog stored raw for ${partyKey}`
    );
  }

  const aipify = wiz.waitingForParty("aipify");
  const guided = wiz.waitingForParty("aipify_guided");
  const it = wiz.waitingForParty("customer_it");
  const partner = wiz.waitingForParty("partner");
  const unknown = wiz.waitingForParty("unknown");

  assert.equal(aipify, wizJson.waitingByParty.aipify);
  assert.equal(guided, wizJson.waitingByParty.aipifyGuided);
  assert.equal(it, wizJson.waitingByParty.customerIt);
  assert.equal(partner, wizJson.waitingByParty.partner);
  assert.equal(unknown, wizJson.waitingByParty.unknown);
  for (const copy of [aipify, guided, it, partner, unknown]) {
    assert.equal(copy.includes("customerApp."), false, `${locale}: raw key leak`);
  }
}

assert.equal(
  productionParityWizardLabels("no").wiz.waitingForParty("aipify"),
  "Venter på Aipify"
);
assert.equal(
  productionParityWizardLabels("en").wiz.waitingForParty("aipify"),
  "Waiting for Aipify"
);

// D. Missing-key fallback: English generic then never raw key
{
  const missingT = (key: string) => key;
  const copy = resolveInstallationWaitingCopyText({
    translate: missingT,
    partyKey: keys.waitingByParty.aipify,
    waitingKey: keys.waiting,
  });
  assert.equal(copy, "Waiting on the responsible party");
  assert.equal(copy.includes("customerApp."), false);

  const onlyWaiting: Record<string, string> = {
    [keys.waiting]: "Waiting on the responsible party",
  };
  const partial = resolveInstallationWaitingCopyText({
    translate: (key) => onlyWaiting[key] ?? key,
    partyKey: keys.waitingByParty.aipify,
    waitingKey: keys.waiting,
  });
  assert.equal(partial, "Waiting on the responsible party");
}

// E. Party resolver unchanged (presentation only)
assert.equal(
  resolveInstallationWaitingCopyParty({
    assignedPartyType: "aipify",
    supportMode: "aipify_managed",
    sessionState: "awaiting_aipify",
  }),
  "aipify"
);

// F. Lifecycle surfaces untouched by this i18n repair
{
  const routeSrc = readFileSync(
    join(
      process.cwd(),
      "app/api/app-portal/integrations/[providerKey]/installation/handoff/route.ts"
    ),
    "utf8"
  );
  const catalogSrc = readFileSync(
    join(process.cwd(), "lib/app-portal/integrations/labels.ts"),
    "utf8"
  );
  assert.match(routeSrc, /create_app_portal_installation_handoff/);
  assert.match(catalogSrc, /waitingByParty\.aipify/);
  assert.match(catalogSrc, /installationWizardMessageKeys/);
}

// G. Hardcoding scan — wizard component must not embed Norwegian waiting copy
{
  const wizardSrc = readFileSync(
    join(process.cwd(), "components/app/app-portal/InstallationWizard.tsx"),
    "utf8"
  );
  assert.equal(wizardSrc.includes("Venter på Aipify"), false);
  assert.match(wizardSrc, /waitingForParty/);
  assert.match(wizardSrc, /labels\.setup\.messageCatalog/);
}

console.log("waiting-copy-i18n-runtime-v5.test.ts: ok");
