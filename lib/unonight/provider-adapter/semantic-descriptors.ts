import type { CompanionSemanticCapabilityDescriptor } from "@/lib/integration-intelligence/semantic/types";

/** Unonight-only entity aliases and metrics — Core reads these via manifest.semantic, not hardcoded phrases. */
export const UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS: readonly CompanionSemanticCapabilityDescriptor[] =
  [
    {
      capability_key: "member.read",
      entity: "member",
      metrics: ["total_members", "new_members", "member_growth"],
      operations: ["count", "compare", "trend", "read"],
      time_scopes: ["current", "since_last"],
      entity_aliases: {
        en: ["member", "members", "membership"],
        no: ["medlem", "medlemmer", "medlemskap"],
        sv: ["medlem", "medlemmar", "medlemskap"],
        da: ["medlem", "medlemmer", "medlemskab"],
        es: ["miembro", "miembros", "membresia"],
        pl: ["czlonek", "czlonkowie", "czlonkostwo"],
        uk: ["uchasnyk", "uchasnyky", "chlenstvo"],
      },
    },
    {
      capability_key: "activity.read",
      entity: "activity",
      metrics: ["activity_count", "recent_activity"],
      operations: ["count", "read", "list"],
      time_scopes: ["since_last", "current", "period"],
      entity_aliases: {
        en: ["activity", "engagement", "happened", "events"],
        no: ["aktivitet", "engasjement", "hendelser", "skjedd"],
        sv: ["aktivitet", "engagemang", "handelser"],
        da: ["aktivitet", "engagement", "haendelser"],
        es: ["actividad", "compromiso"],
        pl: ["aktywnosc", "zaangazowanie"],
        uk: ["aktyvnist", "zaluchenist"],
      },
    },
    {
      capability_key: "moderation_queue.read",
      entity: "moderation_queue",
      metrics: ["pending_moderation", "queue_count"],
      operations: ["count", "status", "read", "list"],
      time_scopes: ["current"],
      entity_aliases: {
        en: ["moderation", "moderate", "moderation queue", "review queue"],
        no: ["moderering", "modereringskø", "modereringsko", "venter på moderering"],
        sv: ["moderering", "modereringsko"],
        da: ["moderation", "modereringsko"],
        es: ["moderacion", "cola de moderacion"],
        pl: ["moderacja", "kolejka moderacji"],
        uk: ["moderatsiia", "cherga moderatsii"],
      },
    },
    {
      capability_key: "report.read",
      entity: "report",
      metrics: ["report_count", "open_reports"],
      operations: ["count", "status", "read", "list"],
      time_scopes: ["current"],
      entity_aliases: {
        en: ["report", "reports", "flagged"],
        no: ["rapport", "rapporter", "anmeldelser"],
        sv: ["rapport", "rapporter"],
        da: ["rapport", "rapporter"],
        es: ["reporte", "reportes"],
        pl: ["raport", "raporty", "zgloszenia"],
        uk: ["zvit", "zvity", "skargy"],
      },
    },
    {
      capability_key: "verification_status.read",
      entity: "verification_status",
      metrics: ["pending_verification", "verification_count"],
      operations: ["count", "status", "read", "list"],
      time_scopes: ["current"],
      entity_aliases: {
        en: ["verification", "verify", "verified", "pending verification"],
        no: ["verifisering", "verifiseringer", "verifiering", "venter verifisering"],
        sv: ["verifiering", "verifieringar"],
        da: ["verifikation", "verifikationer"],
        es: ["verificacion", "verificaciones"],
        pl: ["weryfikacja", "weryfikacje"],
        uk: ["veryfikatsiia", "veryfikatsii"],
      },
    },
    {
      capability_key: "listing.read",
      entity: "listing",
      metrics: ["listing_count", "marketplace_listings"],
      operations: ["count", "read", "list", "status"],
      time_scopes: ["current"],
      entity_aliases: {
        en: ["listing", "listings", "marketplace", "marketplace listing"],
        no: ["annonse", "annonser", "markedsplass", "markedsplassen"],
        sv: ["annons", "annonser", "marknadsplats"],
        da: ["annonce", "annoncer", "markedsplads"],
        es: ["anuncio", "anuncios", "mercado"],
        pl: ["ogloszenie", "ogloszenia", "marketplace"],
        uk: ["ogoloshennia", "marketpleis"],
      },
    },
  ] as const;

export function unonightSemanticDescriptorForCapability(
  capabilityKey: string,
): CompanionSemanticCapabilityDescriptor | undefined {
  return UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS.find(
    (entry) => entry.capability_key === capabilityKey,
  );
}
