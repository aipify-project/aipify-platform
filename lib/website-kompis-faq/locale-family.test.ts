import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { FIXTURE_SITE_A, FIXTURE_SITE_B, FaqLocalFixture } from "@/lib/website-kompis-faq/local-fixture-api";
import {
  acceptLocaleResponse,
  emptyLocaleVersion,
  localeDraftIsDirty,
  lookupExplicitFaqLocale,
} from "@/lib/website-kompis-faq/locale-family";
import type { WebsiteKompisFaqItem } from "@/lib/website-kompis-faq/types";

const group = "11111111-1111-4111-8111-111111111111";

function row(partial: Partial<WebsiteKompisFaqItem> & Pick<WebsiteKompisFaqItem, "id" | "locale" | "title" | "answer">): WebsiteKompisFaqItem {
  return {
    installId: FIXTURE_SITE_A,
    domain: "alpha.example",
    question: null,
    category: "medlemskap",
    contentType: "faq",
    status: "published",
    publicSafe: true,
    priority: 100,
    tags: ["medlem"],
    sourceUrl: "https://customer.example/de",
    validFrom: null,
    validUntil: null,
    lastReviewedAt: null,
    publishedAt: "2026-10-24T00:00:00.000Z",
    createdAt: "2026-10-24T00:00:00.000Z",
    updatedAt: "2026-10-24T00:00:00.000Z",
    translationGroupId: group,
    ...partial,
  };
}

const german = row({ id: "00000000-0000-4000-8000-0000000000de", locale: "de", title: "Deutscher Titel", answer: "Deutsche Antwort" });
const norwegian = row({
  id: "00000000-0000-4000-8000-0000000000a1",
  locale: "no",
  title: "Norsk tittel",
  answer: "Norsk svar",
});
const similar = row({
  id: "00000000-0000-4000-8000-0000000000b2",
  locale: "es",
  title: "Deutscher Titel",
  answer: "Otra respuesta",
  translationGroupId: "22222222-2222-4222-8222-222222222222",
});
const otherSite = row({
  id: "00000000-0000-4000-8000-0000000000c3",
  locale: "es",
  title: "Spansk på annet nettsted",
  answer: "Annet nettsted",
  installId: FIXTURE_SITE_B,
  domain: "beta.example",
});

const library = new FaqLocalFixture({ count: 0 });
library.rows.push(german, norwegian, similar, otherSite);

const toNorwegian = library.localeVersion(german.id, "no");
assert.equal(toNorwegian.status, 200);
const norwegianItem = (toNorwegian.body as { item: WebsiteKompisFaqItem }).item;
assert.equal(norwegianItem.title, "Norsk tittel");
assert.equal(norwegianItem.answer, "Norsk svar");
assert.equal(norwegianItem.locale, "no");
assert.notEqual(norwegianItem.title, german.title);

const toSpanish = library.localeVersion(german.id, "es");
assert.equal(toSpanish.status, 200);
assert.equal((toSpanish.body as { outcome: string }).outcome, "missing");
const blank = emptyLocaleVersion(german, "es");
assert.equal(blank.title, "");
assert.equal(blank.question, "");
assert.equal(blank.answer, "");
assert.equal(blank.category, "");
assert.equal(blank.sourceUrl, "");
assert.equal(blank.publicSafe, false);
assert.equal(blank.editorStatus, "new");
assert.equal(blank.tags.length, 0);
assert.equal(blank.contentType, "faq");
assert.equal(blank.installId, german.installId);

const created = library.createLocaleVersion({
  sourceItemId: german.id,
  locale: "es",
  title: "Título español",
  question: "Pregunta",
  answer: "Respuesta española",
  publicSafe: true,
  sourceUrl: "https://customer.example/should-not-copy",
});
assert.equal(created.status, 200);
assert.equal((created.body as { status: string }).status, "draft");
const createdId = (created.body as { id: string }).id;
const spanish = library.rows.find((item) => item.id === createdId)!;
assert.equal(spanish.publicSafe, false);
assert.equal(spanish.status, "draft");
assert.equal(spanish.title, "Título español");
assert.equal(spanish.sourceUrl, "https://customer.example/should-not-copy");
assert.equal(german.title, "Deutscher Titel");
assert.equal(german.status, "published");
assert.equal(german.publicSafe, true);
assert.equal(norwegian.title, "Norsk tittel");

const backToGerman = library.localeVersion(spanish.id, "de");
assert.equal((backToGerman.body as { item: WebsiteKompisFaqItem }).item.title, "Deutscher Titel");
const backToSpanish = library.localeVersion(german.id, "es");
assert.equal((backToSpanish.body as { item: WebsiteKompisFaqItem }).item.title, "Título español");
assert.equal(library.createLocaleVersion({ sourceItemId: german.id, locale: "es", title: "Otra", answer: "Otra" }).status, 409);

const missingNorwegian = lookupExplicitFaqLocale([german], german.id, "no");
assert.equal(missingNorwegian.outcome, "missing");
assert.equal(library.localeVersion(german.id, "no").status, 200);

assert.equal(lookupExplicitFaqLocale(library.rows, german.id, "es").outcome, "found");
assert.equal(lookupExplicitFaqLocale([german, otherSite], german.id, "es").outcome, "missing");
assert.equal(lookupExplicitFaqLocale([german, similar], german.id, "es").outcome, "missing");

const unlinked = row({ id: german.id, locale: "de", title: german.title, answer: german.answer, translationGroupId: null });
const unlinkedLibrary = new FaqLocalFixture({ count: 0 });
unlinkedLibrary.rows.push(unlinked);
assert.equal(unlinkedLibrary.localeVersion(unlinked.id, "no").status, 503);
assert.equal((unlinkedLibrary.localeVersion(unlinked.id, "no").body as { code: string }).code, "translation_group_unavailable");

const duplicate = row({ id: "00000000-0000-4000-8000-0000000000d4", locale: "no", title: "Annen norsk", answer: "Annen" });
assert.equal(lookupExplicitFaqLocale([german, norwegian, duplicate], german.id, "no").outcome, "ambiguous");

const viewer = new FaqLocalFixture({ count: 1, role: "viewer" });
assert.equal(viewer.localeVersion(viewer.rows[0]!.id, "es").status, 403);
assert.equal(viewer.createLocaleVersion({ sourceItemId: viewer.rows[0]!.id, locale: "es", title: "T", answer: "A" }).status, 403);
const anonymous = new FaqLocalFixture({ count: 1, role: "anonymous" });
assert.equal(anonymous.localeVersion(anonymous.rows[0]!.id, "es").status, 401);

assert.equal(localeDraftIsDirty({ ...blank, title: "Ulagret" }, blank), true);
assert.equal(localeDraftIsDirty(blank, blank), false);
assert.equal(acceptLocaleResponse(2, 2), true);
assert.equal(acceptLocaleResponse(1, 2), false);

const sql = readFileSync("docs/platform/NOT_APPLIED_website_kompis_faq_locale_family_v1.sql", "utf8");
assert.match(sql, /NOT APPLIED/);
assert.match(sql, /translation_group_id = id/);
assert.match(sql, /f\.tenant_id = v_tenant/);
assert.match(sql, /f\.translation_group_id = v_source\.translation_group_id/);
assert.doesNotMatch(sql, /\bilike\b|similarity\(/i);
assert.equal(readdirSync("supabase/migrations").some((name) => name.includes("locale_family")), false);
assert.equal(sql.includes("set title"), false);

const panel = readFileSync("components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx", "utf8");
assert.match(panel, /requestLocaleSwitch/);
assert.match(panel, /\/api\/website-kompis\/faq\/locale-version/);
assert.match(panel, /localeVersionNew/);
assert.match(panel, /localeUnsavedSave/);
assert.match(panel, /acceptLocaleResponse/);
assert.doesNotMatch(panel, /onChange=\{\(locale\) => setDraft\(\(current\) => \(\{ \.\.\.current, locale \}\)\)\}/);

const route = readFileSync("app/api/website-kompis/faq/locale-version/route.ts", "utf8");
assert.match(route, /getUser/);
assert.match(route, /get_tenant_public_companion_faq_locale_version/);
assert.match(route, /insert_tenant_public_companion_faq_locale_version/);
assert.doesNotMatch(route, /p_public_safe:\s*true/);

const deId = "00000000-0000-4000-8000-0000000000de";
const noId = "00000000-0000-4000-8000-0000000000a2";
const twinId = "00000000-0000-4000-8000-0000000000d8";
const occupiedGroup = "33333333-3333-4333-8333-333333333333";
const independent = new FaqLocalFixture({ count: 0 });
const standaloneGerman = row({
  id: deId,
  locale: "de",
  title: "Deutscher Titel",
  answer: "Deutsche Antwort",
  translationGroupId: deId,
  sourceUrl: "https://customer.example/de",
});
const standaloneNorwegian = row({
  id: noId,
  locale: "no",
  title: "Gammel norsk",
  answer: "Gammelt svar",
  translationGroupId: noId,
  sourceUrl: "https://customer.example/no",
});
const sameTitle = row({
  id: twinId,
  locale: "no",
  title: "Gammel norsk",
  answer: "Tvilling",
  translationGroupId: twinId,
  sourceUrl: "https://customer.example/no",
});
const otherInstall = row({
  id: "00000000-0000-4000-8000-0000000000b9",
  locale: "no",
  title: "Gammel norsk",
  answer: "Annet nettsted",
  translationGroupId: "00000000-0000-4000-8000-0000000000b9",
  installId: FIXTURE_SITE_B,
  domain: "beta.example",
  sourceUrl: "https://customer.example/no",
});
const occupied = row({
  id: "00000000-0000-4000-8000-0000000000c8",
  locale: "fr",
  title: "Occupe",
  answer: "Famille",
  translationGroupId: occupiedGroup,
});
const occupiedSibling = row({
  id: "00000000-0000-4000-8000-0000000000c9",
  locale: "sv",
  title: "Svensk",
  answer: "Svar",
  translationGroupId: occupiedGroup,
});
const archived = row({
  id: "00000000-0000-4000-8000-0000000000e8",
  locale: "no",
  title: "Arkiv",
  answer: "Arkiv",
  translationGroupId: "00000000-0000-4000-8000-0000000000e8",
  status: "archived",
});
independent.rows.push(standaloneGerman, standaloneNorwegian, sameTitle, otherInstall, occupied, occupiedSibling, archived);

assert.equal((independent.localeVersion(deId, "no").body as { outcome: string }).outcome, "missing");
const found = independent.searchLocaleLink(deId, "no", "Gammel") ;
assert.equal(found.status, 200);
const choices = (found.body as { candidates: Array<{ id: string; installId: string | null }> }).candidates;
assert.deepEqual(choices.map((choice) => choice.id).sort(), [noId, twinId].sort());
assert.equal(choices.every((choice) => choice.installId === FIXTURE_SITE_A), true);
assert.equal(independent.linkLocaleMember({ sourceItemId: deId, candidateId: noId, locale: "no", confirmed: false }).status, 400);
assert.equal(standaloneNorwegian.translationGroupId, noId);
assert.equal(sameTitle.translationGroupId, twinId);
const linked = independent.linkLocaleMember({ sourceItemId: deId, candidateId: noId, locale: "no", confirmed: true });
assert.equal(linked.status, 200);
assert.equal((linked.body as { item: WebsiteKompisFaqItem }).item.id, noId);
assert.equal(standaloneNorwegian.title, "Gammel norsk");
assert.equal(standaloneNorwegian.answer, "Gammelt svar");
assert.equal(standaloneNorwegian.sourceUrl, "https://customer.example/no");
assert.equal(standaloneNorwegian.status, "published");
assert.equal(standaloneNorwegian.publicSafe, true);
assert.equal(standaloneNorwegian.translationGroupId, deId);
assert.equal(standaloneGerman.title, "Deutscher Titel");
assert.equal(standaloneGerman.answer, "Deutsche Antwort");
assert.equal((independent.localeVersion(deId, "no").body as { item: WebsiteKompisFaqItem }).item.id, noId);
assert.equal(independent.linkLocaleMember({ sourceItemId: deId, candidateId: occupied.id, locale: "fr", confirmed: true }).status, 409);
assert.equal(
  (independent.linkLocaleMember({ sourceItemId: deId, candidateId: occupied.id, locale: "fr", confirmed: true }).body as { code: string }).code,
  "family_conflict",
);
assert.equal(occupied.translationGroupId, occupiedGroup);
assert.equal(
  (independent.linkLocaleMember({ sourceItemId: deId, candidateId: otherInstall.id, locale: "no", confirmed: true }).body as { code: string }).code,
  "website",
);
assert.equal(
  (independent.linkLocaleMember({ sourceItemId: deId, candidateId: archived.id, locale: "no", confirmed: true }).body as { code: string }).code,
  "archived",
);
assert.equal(independent.linkLocaleMember({ sourceItemId: deId, candidateId: noId, locale: "", confirmed: true }).status, 409);

const linkViewer = new FaqLocalFixture({ count: 1, role: "viewer" });
assert.equal(linkViewer.searchLocaleLink(linkViewer.rows[0]!.id, "no", "").status, 403);
assert.equal(linkViewer.linkLocaleMember({ sourceItemId: linkViewer.rows[0]!.id, candidateId: noId, locale: "no", confirmed: true }).status, 403);
const linkAnonymous = new FaqLocalFixture({ count: 1, role: "anonymous" });
assert.equal(linkAnonymous.searchLocaleLink(linkAnonymous.rows[0]!.id, "no", "").status, 401);

const linkSql = readFileSync("docs/platform/NOT_APPLIED_website_kompis_faq_locale_family_link_v1.sql", "utf8");
assert.match(linkSql, /NOT APPLIED/);
assert.match(linkSql, /translation_group_id = id/);
assert.match(linkSql, /set translation_group_id = v_source\.translation_group_id/);
assert.match(linkSql, /family_conflict/);
assert.match(linkSql, /wpkf\.faq_family_link/);
assert.match(linkSql, /f\.tenant_id = v_tenant/);
assert.match(linkSql, /revoke all on function public\.link_tenant_public_companion_faq_locale_member/);
assert.match(linkSql, /grant execute on function public\.link_tenant_public_companion_faq_locale_member/);
assert.doesNotMatch(linkSql, /set title|set answer|set public_safe|set status|set source_url/);
assert.equal(readdirSync("supabase/migrations").some((name) => name.includes("locale_family")), false);

assert.match(panel, /localeMissingInFamily/);
assert.match(panel, /localeLinkAction/);
assert.match(panel, /collationLocale=\{labels\.languageCollation\}\s+disabled=\{localeLoading\}/);
assert.match(panel, /disabled=\{busy \|\| localeLoading \|\| !isWebsiteKompisFaqEditorValid\(draft\)\}/);
assert.match(panel, /setLinkSearched\(false\)/);
const linkDialog = readFileSync("components/app/website-kompis/WebsiteKompisFaqLocaleLinkDialog.tsx", "utf8");
assert.match(linkDialog, /searched && !error && candidates\.length === 0/);
assert.match(linkDialog, /aria-label=\{labels\.localeLinkSearch\}/);
assert.match(panel, /localeCreateInstead/);
assert.match(panel, /\/api\/website-kompis\/faq\/locale-link/);
assert.equal(panel.split("<FaqContentLanguagePicker").length - 1, 2);

const linkRoute = readFileSync("app/api/website-kompis/faq/locale-link/route.ts", "utf8");
assert.match(linkRoute, /getUser/);
assert.match(linkRoute, /search_tenant_public_companion_faq_locale_candidates/);
assert.match(linkRoute, /link_tenant_public_companion_faq_locale_member/);
assert.match(linkRoute, /confirmed !== true/);

console.log("locale-family.test.ts: ok");
