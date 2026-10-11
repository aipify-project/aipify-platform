# AIPIFY.KOMPIS.CORE.ANSWER.BEHAVIOR.RUNTIME.AUDIT.02 — RESULT

Date: 2026-10-11  
Mode: **kartlegging only** — no runtime code change, commit/PR/merge/deploy, SQL, secrets, provider config, ingest, or Host mutation.  
Inspected head: `origin/main` = `04a86e9bf21a39bc8c13c0ba00b1564740882e26` (workspace clean match).

## 1) Kort konklusjon

| Sikkert | Ukjent / NOT VERIFIED |
| --- | --- |
| Public Kompis bruker **Website Kompis**-stakken (grounded prompt, visitor-tone, boundary, safety, relevance) — **ikke** authenticated Companion/ILM/operator V3. | Om Production provider-path faktisk lykkes nå (tidligere `AI_PROVIDER_NOT_CONFIGURED` / cost-deny). HTTP 200/fallback ≠ provider-success. |
| Når provider/cost feiler, svarer extract → index → structured FAQ → warm fallback **uten** grounded system prompt. Da føles svarene «uten Core-oppsett». | Kundens faktiske `data-core-origin` / cached Host-asset i nettleser (krever Host DevTools). |
| 👍/👎 mangler fordi SQL `20261937900000` **NOT APPLIED** → ingen `answerId` → votes skjult. Forventet, ikke regresjon. | Om copy-ikonet er skjult av scroll/clipping i eiers viewport (kode viser copy alltid for ferdige assistant-svar). |
| Kontakt-knapp krever trygg samme-host URL fra **structured FAQ**-søk; site-index kontaktsider brukes **ikke**. Sparse FAQ uten `source_url` → knappen uteblir by design. | Om DOMENE har publisert contact-FAQ med `source_url` akkurat nå (sist audit: nesten uten). |
| `OPEN_HEIGHT=800` er preferanse; faktisk iframe-høyde er viewport-clamped (f.eks. 740→716). Åpen iframe er flush (`right/bottom:0`) + `overflow:hidden` → Design V1 border/shadow kan klippes («mangler ramme»). | Named eierbilder `13.37.04` / `13.37.22` / `13.38.53` — **ikke funnet** hos Cursor. |

**Hovedårsak til «svarer ikke som forventet»:** de fleste synlige svar går sannsynligvis i **non-provider**-grenene (cost/provider fail eller extract/FAQ), som **ikke** kjører `buildWebsiteKompisGroundedSystemPrompt`. Authenticated Companion-oppførsel er aldri lastet. Structured FAQ er tynn/stale vs site-index (gjenbrukt FAQ-sniffer-bevis). UI-avvik (copy/høyde/ramme/kontakt) er delvis forventet gate, delvis shell-klipping/viewport — ikke bevis på at polish-koden mangler på Core CDN.

## 2) Runtime-kjede (faktisk)

### Deploy / asset origins (skrivefri)

| Flate | Project | Production SHA | Alias | Loader SHA256 |
| --- | --- | --- | --- | --- |
| Canonical APP Core | `aipify-platform` | `04a86e9b` READY `dpl_2dxgjioS92T4fGgc8x5hbNd9FyRP` | `https://app.aipify.ai` | `6e686b069ce7b2d9…` |
| Default loader `coreOrigin` | `aipify-platform-iz5z` | `04a86e9b` READY `dpl_5ZwAWpvq2kxgoddYJvVQ8G8AYPyz` | `https://aipify.ai` (+ www) | same |
| Linked `aipify` | `aipify` | `04a86e9b` READY `dpl_3p5EUqSkT7FL1fKJmvvwSSVfrd2y` | `https://aipify.vercel.app` | same |

Loader default (`public/embed/website-kompis.js:18`): `data-core-origin` **eller** `https://aipify.ai`.  
Iframe: `{coreOrigin}/embed/website-kompis?…` (`…js:440`).  
Ask: iframe → `POST /api/marketing/companion/ask` på **samme** core origin.  
Host kan peke script-src mot en av originene ovenfor; CDN-innhold matcher `04a86e9b` i dag. Host-side cache av eldre script er fortsatt mulig og må bevises i nettleser — **ikke mutert her**.

### Beslutningskjede (filer)

| Steg | Fil:linje | Beslutning |
| --- | --- | --- |
| Loader mount / access | `public/embed/website-kompis.js:15–33`, `433–440` | install+domain fail-closed; host `data-aipify-kompis-access` |
| Page context | `…js:404–430`, `553–571` → widget `WebsiteKompisEmbedWidget.tsx:300–327` | host → postMessage |
| Metadata + contact | widget fetch → `app/api/embed/companion/launcher-icon/route.ts:67–77` | `resolveWebsiteKompisPublicContactUrl` (FAQ only); **Cache-Control max-age=86400** |
| Ask | `ask/route.ts` → `public-companion-ask.ts:askPublicPlatformCompanion` | thin route + feedback attach |
| Trust / license | `licensed-availability-server` + visitor context | fail-closed disabled |
| Private scope | `website-kompis-public-boundary` / ask `1020–1028` | refusal, no FAQ/provider |
| Safety | ask `1051–1059` | structured safety answer |
| Retrieval | ask `1062–1075` | FAQ RPC + site-index RPC + page evidence; follow-up via `buildPublicCompanionRetrievalQuestion` |
| Evidence prefer | `preferStrongSiteIndexOverSparseFaq` `97–128` | drop thin unsourced FAQ when index topic-strong |
| **Provider grounded** | ask `1102–1198` + `website-kompis-grounded-answer.ts:269–280` | **kun hvis** cost reserve allowed (+ provider configured) |
| Else current page | ask `1232–1255` | extract |
| Else site-index | ask `1258–1273` | extract compose |
| Else structured FAQ | ask `1276–1292` | FAQ answer |
| Else warm fallback | ask `1295–1300` + `visitor-tone.ts` | tone copy, no grounded prompt |
| UI actions | `WebsiteKompisAnswerActions.tsx:61–62`, `168–208` | copy always; votes iff `answerId` |

**Path chooser (customer site, not Aipify-product Q):**  
safety → **provider grounded** → page extract → index extract → structured FAQ → warm fallback.

## 3) Core-policy-tabell — bruker public Kompis avtalte regler?

| Oppsett | Scope | Callsite | Public ask | Fallback | Merknad |
| --- | --- | --- | --- | --- | --- |
| `buildWebsiteKompisGroundedSystemPrompt` | Public grounded LLM | `website-kompis-grounded-answer.ts:269` → synthesize | **JA** hvis provider | **NEI** | Hoved «svarmetode»-instruks |
| Public AI cost reserve | Anonymous metering | `website-kompis-public-ai-cost-controls` → ask `1104` | Gate | N/A | Deny → hopp over provider |
| `presentWebsiteKompisCustomerSiteAnswer` / warm fallback | Visitor tone | `visitor-tone.ts` | **JA** | **JA** | Softens/fallback wording |
| Public boundary / private scope | Tenant wall | `website-kompis-public-boundary.ts` | **JA** | **JA** | Blocks platform bleed / private Q |
| Safety FAQ filter | Consent/safety | `website-kompis-faq-match-safety.ts` | **JA** | N/A | Before grounded |
| Answer relevance helpers | Hub/price/topic | `website-kompis-answer-relevance.ts` | **JA** | Indirect | Shared filters |
| Install `sources.*` / `fallbackTone` | Per-install | `website-kompis-install-config` | **JA** | **JA** | Can disable FAQ/index/page |
| Operator `buildKompisSystemPromptV3` | Auth planner | `kompis-operator/prompt.ts` | **NEI** | **NEI** | Wrong channel |
| Companion output pipeline / ILM / personality | Auth Companion | `companion-runtime/*`, ILM | **NEI** | **NEI** | Never imported by marketing ask |
| Surface contract doc | Host mount | loader + docs | Host gate | N/A | Not answer prompt |

**Svar:** Public Kompis bruker **Website Kompis Core-regler**, ikke authenticated Companion-oppførsel. Fallback/extract **ignorerer** grounded system prompt. Hvis eier forventet Companion/ILM-tekster i public chat, er de **aldri lastet** — ikke en cache-bug.

Nettstedskunnskap (FAQ/index/page) styrer *hva* som kan hevdes. Core-prompt/tone/boundary styrer *hvordan*. Generell Aipify-produkttekst brukes kun på allow-Aipify / marketing-banen.

## 4) Case-tabell (lokale fixtures / tidligere RPC-bevis)

Verification levels: **LOCAL** = fixture/unit · **HIST** = prior read-only RPC/audit · **LIVE ASK** = not run (forbidden without separate auth).

| # | Spørsmål / kontekst | Forventet | Faktisk (evidens) | Årsak | Level |
| --- | --- | --- | --- | --- | --- |
| 1 | FAQ-side Q → konkret svar | Match Q+A, ikke hub-liste | LOCAL: hub-list rejected; real-name FAQ kept (`context-faq-answer-repair-02.test`) | Relevance filters work in Core; LIVE quality depends on published rows + which path wins | LOCAL |
| 2 | «Hva koster det?» på produktkort | Pris fra page/index eller ærlig gap | LOCAL: pageContext price preferred over bio; HIST: structured FAQ membership stale vs hub | Non-provider path may still surface stale FAQ if prefer-filter keeps score≥50 | LOCAL+HIST |
| 3 | «fortell mer» follow-up | Behold tema | Code: `buildPublicCompanionRetrievalQuestion` used for grounded + index (`public-companion-ask.ts:414`, `795`, `1062`) | Fixed in code vs older HIST gap; LIVE NOT VERIFIED | LOCAL |
| 4 | Nav til annen public side | Ny pageContext, samtale beholdt | Loader posts context; session local | Host access class must stay `public` | CODE |
| 5 | Unsupported locale | EN fallback | Embed locale allow-list + ask locale resolve | — | CODE |
| 6 | Manglende kunnskap | Kort ærlig + relevant public lenke | Warm fallback / gap; contact only if FAQ contact URL resolved | Contact discovery FAQ-only → ofte ingen lenke | CODE+HIST |
| 7 | Private/admin Q | Refusal uten å blokkere public login-guide | Private-scope gate before FAQ | — | CODE |
| 8 | Provider success | Grounded JSON answer | HIST: `AI_PROVIDER_NOT_CONFIGURED` possible; cost deny skips provider | **NOT VERIFIED** on current Production | HIST |

Index/FAQ tall (HIST, ikke fersk måling): ~212 docs / 188 active / 803 chunks; structured FAQ ~5 published, nesten uten `source_url`. Index ON / ingest OFF sist rapportert.

## 5) UI-tabell

| Symptom | Kode-status på `04a86e9b` / LIVE CDN | Mest sannsynlig forklaring | Observasjon |
| --- | --- | --- | --- |
| **Copy mangler** | Copy-knapp **alltid** rendered for ikke-failed assistant (`AnswerActions.tsx:199–208`). CSS `.ak-answer-actions` synlig. Loader has `allow="clipboard-write"`. | (a) eier ser welcome uten svar; (b) actions under fold i kort iframe; (c) Host cacher gammel embed-bundle — krever DevTools; (d) icon-only uten tekst lett å overse | Named 13.37/13.38 **ikke funnet**. Desktop 12.45/13.02 viser ikke åpen Kompis answer-row. |
| **👍/👎 mangler** | `votesEnabled` krever `answerId` + `feedbackPersistenceReady` (`AnswerActions.tsx:61–62`). Attach fail-closed uten schema. | **Forventet schema-gate** — SQL NOT APPLIED. Ikke regresjon. Ikke grunn til SQL i denne jobben. | Bekreftet i #112 RESULT + kode |
| **Chat for lav** | Prefer 800; `resolve…OpenHeight` clamps to `viewport−24`, min 560 (`website-kompis-embed.ts:96–111`). Sample: viewport 740→**716**, 667→**643**. Open host iframe `right/bottom:0` (`website-kompis.js:548–549`). | OPEN_HEIGHT≠målt høyde. Indre header+composer spiser message viewport. | Kodehypotese; browser-mål på eiers maskin mangler |
| **Kontakt support mangler** | Welcome viser knapp kun hvis `metadata.publicContactUrl` (`EmbedWidget.tsx:724–736`). Resolver: FAQ search «kontakt support» + `pick…` krever contact-type eller kontakt-ord **og** safe `source_url` (`public-contact-server.ts`, `public-contact.ts`). **Ikke** site-index. | Sparse FAQ uten `source_url` → null. Public kontaktside i index kobles ikke. Metadata cache 24h. | HIST FAQ nesten uten source_url |
| **Ramme mangler** | `.ak-widget` har `border` + `box-shadow` (`design-v1.css:8–10`). Host iframe `border:0; overflow:hidden` (`…js:450–456`). | Shadow/border klippes av iframe uten padding; flush corner forsterker «uten ramme». Closed launcher skal fortsatt være 72×72 uten hvit flate (`markShellReady`). | Kodehypotese; named bilder ikke observert |

Preview/SSO browser-QA: **ikke PASS** (deployment protection). Lokal contract tests passerte: embed, surface, contact, feedback, repair-02, visitor-tone.

## 6) Én prioritert minimal Core-reparasjonsplan

**Foreslått neste jobb (ikke startet her):**  
`AIPIFY.KOMPIS.CORE.ANSWER.BEHAVIOR.RUNTIME.REPAIR.01`

**Mål:** Få public svar + synlig shell til å følge allerede avtalte Website Kompis-regler på den stien eieren faktisk ser (ofte non-provider), uten ny motor, Host-patch, SQL eller reuse.

### Gjenbruk eksisterende pipeline

`askPublicPlatformCompanion` → evidence pack → grounded **eller** page/index/FAQ/fallback → `presentWebsiteKompisCustomerSiteAnswer` → embed UI. Ingen parallell chatmotor.

### Exact files (forventet scope)

| Prioritet | Fil | Endring |
| --- | --- | --- |
| P0 | `lib/marketing/public-companion-ask.ts` | Når grounded skippes: sørg for at index/FAQ/fallback composition følger samme gap/honesty/topic-kontrakt; logg/diagnostic flag (preview-safe) for `path=provider|page|index|faq|fallback` uten secrets |
| P0 | `lib/marketing/website-kompis-public-site-index/answer.ts` (+ tests) | Ærlig gap + optional same-host navigate action fra ranked hits; aldri hub-dump |
| P0 | `lib/marketing/website-kompis-public-contact.ts` + `-server.ts` | Utvid discovery til trygge samme-host treff fra **eksisterende** FAQ **og** public site-index (contact/support/guide), fortsatt allow-list — **ikke** hardkod URL |
| P1 | `public/embed/website-kompis.js` + `website-kompis-embed.ts` | Åpen shell: padding/margin så `.ak-widget` border/shadow ikke klippes; målbar open height (iframe vs inner chat scroll) |
| P1 | `components/embed/WebsiteKompisEmbedWidget.tsx` + `website-kompis-design-v1.css` | Copy-rad alltid synlig under assistant-svar (unngå fold-clip); behold votes gated |
| P1 | `app/api/embed/companion/launcher-icon/route.ts` | Reduser stale contact metadata (`max-age=86400` for aggressivt for contact URL) uten å åpne cache-bypass for ikoner generelt — smal endring |

### Tester

- Existing: `public-companion-ask.test.ts`, `website-kompis-public-site-index/answer.test.ts`, `website-kompis-public-contact.test.ts`, `website-kompis-embed.test.ts`, `website-kompis-context-faq-answer-repair-02.test.ts`, `website-kompis-answer-feedback.test.ts`
- Add: fixture cases for contact-from-index; open-shell resize includes frame gutter; fallback path does not invent price/URL

### Avhengigheter / stoppsignaler

- **Stop:** Host-endring, SQL APPLY, feedback activation, reuse ON, paid Production provider-ask uten egen autorisasjon, kundenavn/URL-hardkoding, ny parallell answer engine, Image-5 purple gjetting
- **Separate auth job later:** Production provider success proof (`reserve` + completion) with redacted diagnostics
- **Thumbs:** forbli fail-closed til SQL autoriseres — ikke del av REPAIR.01

## 7) Bekreftelser

- Ingen runtime-/Host-/SQL-/secrets-/provider-/ingest-endring i denne jobben  
- Ingen nye betalte modell-QA-kall  
- Feedback votes fortsatt gated; reuse OFF; SQL `20261937900000` NOT APPLIED  
- Named eierbilder 13.37/13.38: **ikke observert**  
- Eneste nye fil: denne rapporten  

**STOPP** — ingen reparasjon uten neste konkrete Core-instruks.
