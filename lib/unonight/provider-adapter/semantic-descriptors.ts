import type { CompanionSemanticCapabilityDescriptor } from "@/lib/integration-intelligence/semantic/types";

/** Unonight-only entity aliases and metrics — Core reads these via manifest.semantic, not hardcoded phrases. */
export const UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS: readonly CompanionSemanticCapabilityDescriptor[] =
  [
    {
      capability_key: "member.read",
      entity: "member",
      domain: "community",
      metrics: ["total_members", "new_members", "member_growth", "active_members", "member_list"],
      operations: ["count", "compare", "trend", "read", "list"],
      time_scopes: ["current", "since_last", "period"],
      entity_aliases: {
        en: ["member", "members", "membership", "users", "user base", "registered"],
        no: ["medlem", "medlemmer", "medlemskap", "brukere", "medlemsbase", "registrert"],
        sv: ["medlem", "medlemmar", "medlemskap", "anvandare", "medlemsbas"],
        da: ["medlem", "medlemmer", "medlemskab", "brugere", "medlemsbase", "registreret"],
        es: ["miembro", "miembros", "membresia", "usuarios", "base de miembros"],
        pl: ["czlonek", "czlonkowie", "czlonkostwo", "uzytkownicy", "baza czlonkow"],
        uk: ["uchasnyk", "uchasnyky", "chlenstvo", "korystuvachi"],
      },
      metric_mappings: [
        { requested_metric: "member_list", when: { metric: "list", operation: "list" }, period: "current" },
        { requested_metric: "active_members", when: { metric: "active" }, period: "current" },
        { requested_metric: "new_members", when: { metric: "new" }, period: "since_last" },
        { requested_metric: "new_members", when: { time_scope: "since_last" }, period: "since_last" },
        { requested_metric: "member_growth", when: { metric: "growth", operation: "trend" }, period: "current" },
        { requested_metric: "members_last_30_days", when: { time_scope: "period" }, period: "period" },
        { requested_metric: "total_members", when: { metric: "total", operation: "count" }, period: "current" },
        { requested_metric: "total_members", when: { operation: "count" }, period: "current" },
      ],
    },
    {
      capability_key: "activity.read",
      entity: "activity",
      domain: "community",
      metrics: ["activity_count", "recent_activity", "activity_since_last"],
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
      metric_mappings: [
        { requested_metric: "activity_since_last", when: { time_scope: "since_last" }, period: "since_last" },
        { requested_metric: "recent_activity", when: { operation: "read" }, period: "current" },
      ],
    },
    {
      capability_key: "moderation_queue.read",
      entity: "moderation_queue",
      domain: "community",
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
      metric_mappings: [
        { requested_metric: "pending_moderation", when: { operation: "status" }, period: "current" },
        { requested_metric: "pending_moderation", when: { operation: "count" }, period: "current" },
      ],
    },
    {
      capability_key: "report.read",
      entity: "report",
      domain: "community",
      metrics: ["report_count", "open_reports", "reports_attention"],
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
      metric_mappings: [{ requested_metric: "reports_attention", when: { operation: "read" }, period: "current" }],
    },
    {
      capability_key: "verification_status.read",
      entity: "verification_status",
      domain: "community",
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
      metric_mappings: [
        { requested_metric: "pending_verification", when: { operation: "status" }, period: "current" },
      ],
    },
    {
      capability_key: "listing.read",
      entity: "listing",
      domain: "community",
      metrics: ["listing_count", "marketplace_listings", "pending_listing_count"],
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
      metric_mappings: [
        { requested_metric: "pending_listing_count", when: { operation: "status" }, period: "current" },
      ],
    },
  ] as const;

export function unonightSemanticDescriptorForCapability(
  capabilityKey: string,
): CompanionSemanticCapabilityDescriptor | undefined {
  return UNONIGHT_COMMUNITY_SEMANTIC_DESCRIPTORS.find(
    (entry) => entry.capability_key === capabilityKey,
  );
}
