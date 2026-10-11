# AIPIFY.KOMPIS.CORE.FULL.ROUTE.READ.AUDIT.03 — Result

Date: 2026-10-11  
Mode: **READ-ONLY** — no code, Host, SQL apply, secrets, provider, cost, ingest, or deploy changes.  
No new paid provider calls. No new Production ask.

## Statusgate (verified now)

| Item | Value |
|------|-------|
| Inspected worktree | `/Users/veltrix/Development/aipify-kompis-repair-05` on `main` |
| `origin/main` / HEAD | `0e711642dc0a0bc3e72c96d370123ca4273605a7` (merge #115 REPAIR.05) |
| Production project | `aipify-platform` → `https://app.aipify.ai` |
| Production deploy | READY `dpl_3Zt9TofF2pdm7YNos2gLrN7gj1VF` · `aipify-platform-71ucxvshz-…` · source SHA `0e711642` |
| LIVE loader | `https://app.aipify.ai/embed/website-kompis.js` = `https://aipify.ai/embed/website-kompis.js` = repo |
| Loader SHA-256 | `88e6e191d22d9196e22c5134949509a9e7afc9f1b2b057d05e9f30cbb331e5cd` |
| Loader markers | `OPEN_WIDTH=420` · `OPEN_HEIGHT=800` · `OPEN_FRAME_OUTSET=12` · `reclampOpenFromHostViewport` |
| Ask origin | iframe same `coreOrigin` → `POST /api/marketing/companion/ask` |
| Prior reports read | AUDIT.02, REPAIR.04, REPAIR.05, PREVIEW_TO_LIVE.01, POLISH.01, FEEDBACK_COPY.V1, REPAIR.02/03 |
| Other worktrees listed | repair-04 @ `1e080e2f`; readonly-search @ `04a86e9b`; many unrelated — **none mutated** |

Note: Brief cited REPAIR.04 @ `df72b6e3` / `dpl_3ZP1…`. That is superseded by REPAIR.05 @ `0e711642` / `dpl_3Zt9…` (verified).

---

## PRIMARY FIRST FAILURE

**Structured FAQ cannot carry the public answer/contact contract on Production Core.**

| Fact (Aipify Core DB, read-only aggregates) | Value |
|--------------------------------------------|-------|
| Published FAQ rows | **5** |
| With non-empty `source_url` | **0** |
| `content_type = contact` | **0** |
| Contactish title/URL among FAQ | **0** |
| Enabled Website Kompis install configs | **1** (FAQ + page + **publicSiteIndex ON**) |
| Site-index active docs / chunks | **188** / **803** |
| Active index docs with contact-like path/title | **13** |

**Why this is first:** Control plane correctly enables FAQ+index+page. Data plane ask prefers FAQ in several places (contact start-screen historically FAQ-first; sparse FAQ still participates in evidence). With **zero** FAQ `source_url` and **zero** contact FAQ, Kontakt cannot appear from FAQ, and many questions cannot be answered from FAQ alone. Answers then depend on site-index extract and/or provider grounded synthesis. Unit tests inject rich FAQ fixtures and mocked completions — green while Production FAQ is empty of URLs.

**Confidence:** **HIGH** for FAQ inadequacy as the first knowledge-layer break.  
**Not proven without ask correlation:** whether the owner's last question then failed at index ranking, cost deny, or provider gap (see observability gap).

---

## SECONDARY FAILURES

1. **Thumbs schema absent** — `website_kompis_answer_receipts` / `website_kompis_answer_feedback` = NULL; RPCs `create_website_kompis_answer_receipt` / `record_…` **missing**. Votes fail-closed. SQL `20261937900000` NOT APPLIED (SHA256 `81f347c1…`). Expected, not unknown.  
2. **Kontakt may still hide despite 13 contactish index docs** — resolver (REPAIR.04/05) can use index, but start CTA depends on `searchTenantPublicSiteIndex` returning those hits for locale contact queries + launcher metadata. If CTA missing: rank/query miss, cache, or install/domain bind — **not** invent-`/contact`. Distinguish from FAQ data gap above.  
3. **Production ask observability gap** — Vercel runtime log queries for `website-kompis`, `grounded`, `companion/ask` over 24h returned **no rows**. Visitor responses do not include `diagnostics` outside Preview. Cannot correlate owner's last ask to `answerPath` / cost reason / provider status.  
4. **Frame complaint after REPAIR.05** — CDN loader has host-floor + reclamp (proved). If browser still shows &lt;420×800 on spacious desktop: Host-cached script, measuring content without outset, or session before `0e711642` — **NOT VERIFIED on owner browser**.  
5. **Authoritative Kompis AI env key MISSING** — `AIPIFY_KOMPIS_AI_API_KEY` MISSING; `OPENAI_API_KEY` EXISTS (fallback accepted by `hasKompisAiProviderSecretConfigured`). Provider is **reachable in principle**; not the same as proven LIVE provider-success.

---

## CONFIRMED WORKING LINKS

| Link | Evidence |
|------|----------|
| Core CDN → customer-visible design/assets | Owner sees Core design changes; LIVE loader SHA matches `0e711642` |
| Loader → iframe mount | `public/embed/website-kompis.js` → `{coreOrigin}/embed/website-kompis` |
| License/trust/install config RPCs | `get_website_kompis_public_install_config`, domain trust resolvers present |
| Public AI cost RPCs | `reserve_website_kompis_public_ai_call` + `finalize_…` **EXIST** in Core |
| FAQ + site-index search RPCs | `search_tenant_public_visitor_knowledge`, `search_tenant_public_site_index` EXIST |
| REPAIR.05 code on LIVE | gap→FAQ fallthrough, frame reclamp, contact alt query — in loader + main SHA |
| APP panel is config-only | Saves `tenant_public_companion_install_config`; **not** on anonymous ask HTTP path |

---

## NOT VERIFIED

- Owner browser DevTools: actual `data-core-origin`, loader SHA, iframe `getBoundingClientRect` after hard refresh  
- One correlated Production ask (path, cost reason, provider status, top retrieval hits, final answer text)  
- Whether cost reserve returns `allowed` for TENANT in Production (budget/rate/circuit)  
- Whether provider HTTP succeeds with fallback `OPENAI_API_KEY` (no paid probe)  
- Whether contactish index docs are returned by the contact search queries for that install/locale  
- Safari / Host soft-nav edge cases  

---

## OWNER IMPACT

| Symptom | Bound to |
|---------|----------|
| «Svarer ikke på spørsmålet» | Thin FAQ (5/0 URLs) → index extract / provider / warm gap; mocks hide this |
| «Kundeservice mangler» | FAQ contact = 0; must use index (13 contactish exist) — if still missing, contact **retrieval/UI**, not missing resolver code on `0e711642` |
| «Rammen for liten» | Pre-#115 iframe-viewport shrink fixed on CDN; re-check after hard refresh |
| «Tomler mangler» | Schema NOT APPLIED — expected gate |

Design-through proves **asset path only**, not ask/knowledge/provider success.

---

## 1) Control plane

APP panels **administrate** config; they are **not** on the ask request path.

| # | Step | Authoritative surface | Bind ID | Status | UX if fails |
|---|------|----------------------|---------|--------|-------------|
| 1 | Platform entitlement | `GET/POST …/website-kompis` → `activate_platform_portal_customer_website_kompis` | `customer_id` → `tenant_modules.website_kompis` | PASS (wired) | Module unavailable |
| 2 | License service | `resolve_license_service_status` / `evaluateWebsiteKompisLicensedAvailability` | `tenant_id` | FAIL-CLOSED | Widget disabled |
| 3 | Domain + install trust | `customer_domains` + `installations` → `resolveWebsiteKompisPublicInstallDomainTrust` | `install_id` + verified `domain` → `tenant_id` | FAIL-CLOSED | Unavailable |
| 4 | APP domain settings | `/app/domains` → `POST /api/app/domains/website-kompis` → `update_website_kompis_install_config` | `install_id` | PASS (admin) | Stale public config |
| 5 | APP FAQ admin | `/app/website-kompis/faq` → publish RPCs | `tenant_id` | PASS (admin) | Empty/stale FAQ at ask |
| 6 | Public reads config | `get_website_kompis_public_install_config(install_id, domain)` | same | PASS | Defaults / disabled |
| 7 | Provider/cost config | Env + `reserve_website_kompis_public_ai_call` | `tenant_id`/`install_id`/`domain` | Key fallback EXISTS; cost RPC EXISTS | Skip provider → extract/FAQ/gap |
| 8 | Index ingest write | `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=false` | — | FAIL-CLOSED (writes) | Index not refreshed; existing 188 docs remain |

---

## 2) Data plane

| # | Stage | File / API | Bind | Status |
|---|-------|------------|------|--------|
| 1 | Host loads loader | `website-kompis.js` + `data-install-id`/`data-domain`/`data-core-origin` | install+domain | PASS if Host current |
| 2 | Iframe | `/embed/website-kompis?…` | same | PASS (CDN) |
| 3 | Page context | postMessage `aipify.websiteKompis.pageContext` | pathname/title/snippets | PASS when public |
| 4 | Metadata + contact | `GET /api/embed/companion/launcher-icon` | install+domain → `publicContactUrl` | FAIL-CLOSED / null if no hit |
| 5 | Ask | `POST /api/marketing/companion/ask` | body installId+domain+locale+question(+page/recent) | PASS route |
| 6 | Resolve visitor | `_wpkf_resolve` / visitor context | tenant=install.customer | FAIL-CLOSED |
| 7 | License + enabled | ask ~1030–1058 | module+config.enabled | FAIL-CLOSED |
| 8 | Private scope | ask ~1060–1068 | question class | FAIL-CLOSED refusal |
| 9 | Evidence | FAQ RPC + index RPC + page | install scope | FAQ thin; index present |
| 10 | Cost reserve | `reserve_website_kompis_public_ai_call` | tenant/install/domain | RPC EXISTS; result NOT VERIFIED |
| 11 | Provider | `requestKompisGroundedTextCompletion` | OPENAI fallback EXISTS | Success NOT VERIFIED |
| 12 | Gap fallthrough (#115) | `isWebsiteKompisProviderKnowledgeGapResponse` → page→index→FAQ | — | CODE LIVE |
| 13 | Deterministic policy | `evaluateWebsiteKompisDeterministicAnswerPolicy` | — | CODE LIVE |
| 14 | Response + feedback attach | `attachWebsiteKompisAnswerFeedbackReceipt` | answerId | **FAIL-CLOSED** (no schema) |
| 15 | Render | `WebsiteKompisEmbedWidget` + `AnswerActions` | copy always; votes gated | Votes hidden |

---

## 3) Identity / gates truth table

| Gate | Production evidence | Decision | Visitor sees |
|------|---------------------|----------|--------------|
| Module `website_kompis` | 1 enabled install config | Allow if licensed | Disabled copy if off |
| Domain trust | Code fail-closed | Must match verified host | Unavailable |
| `sources.faq/index/page` | All ON for enabled config | Retrieval allowed | — |
| FAQ content | 5 pub / 0 URLs / 0 contact | Weak | Gap / no Kontakt from FAQ |
| Site index | 188 active / 13 contactish | Usable if search hits | Extract / contact candidate |
| Cost RPC | EXISTS | Reserve may still deny | Silent skip to deterministic (no tech error) |
| Provider secret | `OPENAI_API_KEY` EXISTS; authoritative key MISSING | Fallback OK in code | NOT VERIFIED success |
| Index writes | env `false` | No new crawl | Stale risk |
| Feedback schema | MISSING | Votes off | No thumbs |
| Diagnostics | Preview-only | Prod visitors get no path reason | «Trygt» gap without why |

IDs that must stay aligned: `installId` (loader=iframe=ask) · verified `domain` · `tenant_id=customers.id` · locale · page pathname · FAQ/index document scope.

---

## 4) Request trace / observability gap

**No correlatable Production ask found** in Vercel function logs (24h queries: `website-kompis`, `grounded`, `companion/ask` → empty). Runtime errors present are unrelated marketing `eyebrow` on `/companion`.

| Needed for one-request proof | Status |
|------------------------------|--------|
| Request id / timestamp / deploy SHA | MISSING in accessible logs |
| `answerPath` / cost reason / provider status | Only Preview `diagnostics` or server `console.warn` — not visitor-visible; not retrieved here |
| Retrieval top candidates | Not logged at info level in accessible stream |

**Proposed later test (separate auth):** one Preview ask with diagnostics ON + known TENANT fixtures, or temporary structured server log field (`answerPath`, `costReason`, `providerOk`, `faqCount`, `indexCount`) without secrets — expect write=log only, cost=one reserved call if provider exercised.

---

## 5) Active answer engine (public Website Kompis)

Not authenticated Companion/ILM.

| Stage | File:line (anchors) |
|-------|---------------------|
| Normalize | `public-boundary.ts`, `faq-match-safety.ts`, ask trim |
| Page/topic/history | `buildPublicCompanionRetrievalQuestion`; page extract `public-page-context.ts` |
| FAQ search | `searchPublicCompanionTenantFaq` → RPC |
| Index search | `searchTenantPublicSiteIndex` → RPC |
| Question type | private / price / platform-allow helpers |
| Evidence select | `preferStrongSiteIndexOverSparseFaq`; `buildWebsiteKompisEvidencePack` |
| Provider policy | `buildWebsiteKompisPublicAnswerPolicyPrompt` |
| Deterministic policy | `evaluateWebsiteKompisDeterministicAnswerPolicy` |
| Cost/provider | `reserveWebsiteKompisPublicAiCostControls`; `grounded-completion.ts` |
| Compose | grounded JSON / page / index compose / FAQ response / warm fallback |
| Gap | provider knowledge_gap → retry (#115) → safe_fallback |

**Path examples with content asserts (mocks):**

| Path | Test | Asserts answer text |
|------|------|---------------------|
| Provider covered true | `public-companion-ask.test.ts` Bronze/Gold | `/Gold/` · forbids ABOS/799 |
| covered false → FAQ | same (~913) | Bronze/Gold · forbids gap copy |
| Provider fail → FAQ | same (~1104) | Bronze/Gold content |
| Safe fallback | `public-boundary` / visitor-tone tests | warm gap copy |

Cost-deny → FAQ **content** path: no dedicated ask-chain content test (gap).

---

## 6) Tests that created false confidence

| Proof | Class | Green while UX bad because |
|-------|-------|----------------------------|
| FAQ/relevance unit fixtures | Unit | Rich FAQ; Production has 5/0 URLs |
| Ask tests with `groundedCompletion` inject | Mock | Never hits LIVE cost/provider |
| Cost controls unit | Contract | Shape only, no answer text |
| Contact picker unit | Unit | Fixtures have contact URLs; Production FAQ has none |
| Embed OPEN_* / loader SHA | Deploy contract | Assets ≠ answers |
| REPAIR.05 frame harness | Local browser | Not Host+cache session |
| Preview READY / CI | Deploy | SSO-blocked visitor QA marked elsewhere as incomplete |
| «Copy always rendered» | Code | May be below fold; thumbs still gated |

**Mandatory next E2E gate:** fixed question → expected substrings in **visible** answer → tenant source URL that contains the fact → loader SHA = Production SHA → Kontakt/copy/thumbs rules as applicable. HTTP200 / `sources.length` alone = FAIL.

---

## 7) Kontakt / frame / copy / votes (same runtime `0e711642`)

| Area | Status |
|------|--------|
| Kontakt | FAQ path **cannot** supply URL (0/0). Index has 13 contactish docs — resolver code LIVE; visibility depends on search hit + launcher metadata. |
| Frame | LIVE loader: preferred 420×800 content / 444×824 host; rejects undersized iframe posts; host reclamp. Owner re-measure after hard refresh. |
| Copy | Rendered for finished non-failed assistant answers (`WebsiteKompisAnswerActions`). Missing feel → scroll/clip/welcome-only/wrong bundle. |
| Votes | Schema MISSING → `answerId` null → hidden. Separate SQL approval. |

---

## 8) Prioritized Core repair plan (order)

| Priority | Class | Action | Files / stop |
|----------|-------|--------|--------------|
| P0 | **Data / APP ops** (not more frame code) | Publish FAQ rows with real same-host `source_url` for contact + top visitor Qs; verify index contact pages rank for «kontakt support» | APP FAQ admin + index; **stop** when Kontakt CTA appears and FAQ questions return expected facts |
| P1 | **Observability** | Add Production-safe structured ask log (path, costReason, providerOk, faqCount, indexCount, install hash) — no secrets/PII | `public-companion-ask.ts` / cost finalize; **stop** when one visitor ask is correlatable |
| P2 | **Config activation** (separate) | Confirm Production cost reserve `allowed` for TENANT; optionally set authoritative `AIPIFY_KOMPIS_AI_API_KEY`; one authorized provider-success probe | Env/cost — **not** this audit |
| P3 | **SQL separate approval** | Apply `20261937900000…` SHA `81f347c1…` then vote E2E | Feedback migration — **owner gate** |
| P4 | **Code only if P0+P1 prove** | Index contact search miss, extract answerability, cost-deny content tests | Exact files after correlated failure |

Do **not** start another general audit or parallel chatbot engine. Do **not** treat design CDN success as answer-engine success.

---

## Confirmations

- No files / runtime / Host / SQL / config / secrets / provider / ingest changed in this job  
- No new paid calls  
- All proposed remediations are Core-only (plus APP content publish for FAQ — tenant data, not Host code)

**STOP.**
