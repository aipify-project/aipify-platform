import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildOperativeSettingsCategories } from "@/lib/app/settings/build-operative-settings-categories";
import {
  isOperativeSettingsHref,
  isUnsafeSettingsPresentationText,
} from "@/lib/app/settings/operative-settings";

describe("operative settings presentation", () => {
  it("rejects raw Label / Href / key-like text", () => {
    assert.equal(isUnsafeSettingsPresentationText("Label"), true);
    assert.equal(isUnsafeSettingsPresentationText("Href"), true);
    assert.equal(isUnsafeSettingsPresentationText("customerApp.settings.title"), true);
    assert.equal(isUnsafeSettingsPresentationText("additional_automation"), true);
    assert.equal(isUnsafeSettingsPresentationText("Påloggingsbekreftelse"), false);
  });

  it("builds only operative categories with localized labels", () => {
    const categories = buildOperativeSettingsCategories({
      customerApp: {
        settings: {
          operativeCategories: {
            accountSecurity: {
              title: "Sikkerhet",
              description: "Sikkerhetskontroller",
              links: {
                signInVerification: {
                  href: "/app/settings/two-factor",
                  label: "Påloggingsbekreftelse",
                },
                security: {
                  href: "/app/settings/security",
                  label: "Sikkerhetsoversikt",
                },
              },
            },
            billingSubscription: {
              title: "Fakturering",
              description: "Abonnement",
              links: {
                billing: {
                  href: "/app/settings/billing",
                  label: "Abonnement og fakturering",
                },
              },
            },
            integrations: {
              title: "Integrasjoner",
              description: "Tilkoblede systemer",
              links: {
                connectedApps: {
                  href: "/app/platform/integrations/connected",
                  label: "Tilkoblede apper",
                },
              },
            },
            developerAccess: {
              title: "Utvikler",
              description: "Utviklerinnstillinger",
              links: {
                developer: {
                  href: "/app/settings/developer",
                  label: "Utviklerinnstillinger",
                },
              },
            },
          },
        },
      },
    });

    assert.equal(categories.length, 4);
    const hrefs = categories.flatMap((c) => c.links.map((l) => l.href));
    assert.ok(hrefs.every((href) => isOperativeSettingsHref(href)));
    assert.ok(!hrefs.some((href) => href.includes("presence")));
    assert.ok(!hrefs.some((href) => href.includes("business-packs")));
    assert.ok(!categories.some((c) => c.links.some((l) => l.label === "Label")));
  });

  it("omits categories when labels are missing (English fallback only via merge, not humanize)", () => {
    const categories = buildOperativeSettingsCategories({
      customerApp: {
        settings: {
          operativeCategories: {
            accountSecurity: {
              title: "Security",
              description: "Security controls",
              links: {
                signInVerification: {
                  href: "/app/settings/two-factor",
                  label: "Label",
                },
              },
            },
          },
        },
      },
    });
    assert.equal(categories.length, 0);
  });

  it("never invents dead foundation links", () => {
    const categories = buildOperativeSettingsCategories({
      customerApp: {
        settings: {
          operativeCategories: {
            billingSubscription: {
              title: "Billing",
              description: "Billing",
              links: {
                billing: {
                  href: "/app/settings/billing",
                  label: "Billing",
                },
              },
            },
          },
        },
      },
    });
    assert.deepEqual(
      categories.flatMap((c) => c.links.map((l) => l.href)),
      ["/app/settings/billing"]
    );
  });
});
