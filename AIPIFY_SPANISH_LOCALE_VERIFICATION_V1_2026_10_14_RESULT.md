# AIPIFY — Spanish Locale Verification V1

**Date:** 2026-10-14  
**Mode:** **READ-ONLY** — no implementation, no SQL, no frozen-file edits  
**Repo:** `origin/main` @ `0ea45aa3351b16809abd64086a20a13863502728`  
**Verdict:** **PARTIAL**

Spanish (`es`) is a registered, selectable APP locale and loads through the canonical i18n pipeline. Kompis Bedrift panel copy appears in English because Spanish translation **coverage is incomplete** (missing modules + many keys left as English strings), and the loader **correctly falls back to English** — not because Spanish is absent from the registry or because of a wrong namespace.

---

## 1. Canonical active language register

| Source | Locales |
|--------|---------|
| **Core foundation** `CORE_LOCALES` (`lib/i18n/config.ts`) | `en`, `no`, `sv`, `da`, `pl`, `uk` |
| **Extended** `EXTENDED_LOCALES` | **`es`** |
| **Runtime `LOCALES`** | core + `es` |
| **Customer APP active order** `CUSTOMER_ACTIVE_LOCALE_ORDER` (`lib/i18n/customer-active-locale-registry.ts`) | `no`, `sv`, `da`, `en`, **`es`**, `pl`, `uk` |
| **Public footer** `PUBLIC_FOOTER_ENABLED_LOCALES` | includes `es` |
| **Picker labels** | `es: "Español"` |

Spanish is **in** the central register and is treated as an active customer locale (extended, not core-foundation-mandatory).

---

## 2. Does Spanish exist in files?

| Area | `es` present? |
|------|----------------|
| `locales/es/` tree | **Yes** (29 files observed) |
| `locales/es/customer-app/portalStructure.json` | **Yes** |
| `locales/es/customer-app/*.json` splits | **Same split set as `en`** (no missing split filenames) |
| Root namespaces `common`, `shell`, `platform`, `marketing`, `auth` | **Yes** |
| Frozen Website Kompis chain | **0 / 46** mismatches (untouched) |

---

## 3. Root cause (CONFIRMED)

Loading path is correct:

- `getCustomerAppDictionaryForSplits` / `mergeDictionary` merge locale overlay onto **English baseline**.
- Missing keys → English. Keys present but copied from English → English UI.

For **Kompis Bedrift panel** specifically:

| Layer | Behavior |
|-------|----------|
| Sidebar nav (`portalStructure.nav.kompisBedrift*`) | **Mostly Spanish** (e.g. Empleados y acceso, FAQ y conocimiento) |
| Hub copy (`customerApp.portalStructure.productHubs.bedrift.*` via `hubT` in `lib/app-portal/hubs/hub-copy.ts`) | **Largely English** — keys exist in `es` but **values equal `en`** while `no` is translated |
| Foundation dashboard Bedrift cards | **English** (same pattern) |
| Ansattkunnskap labels (`customerApp.employeeKnowledge.*` from `locales/*/customer-app/core.json`) | **`employeeKnowledge` block missing entirely in `es`** → full English fallback |

**Not the cause:** wrong locale code, Spanish omitted from picker, broken namespace path for `portalStructure`, or need for a new i18n system.

---

## 4. Comparison vs Norwegian and other actives

| Locale | `portalStructure` leaf keys | Missing vs `en` (approx) | Notes |
|--------|----------------------------|---------------------------|--------|
| `en` | 6571 | — | Baseline |
| `no` | 6636 | 0 | Bedrift hubs translated |
| `sv` / `da` | ~6637 | 3 | Near-complete |
| `pl` / `uk` | 5856 | ~915 | Gaps elsewhere; not this job’s focus |
| **`es`** | **5660** | **~1107** | Largest gap among actives for this file |

`portalStructure` keys where **`es == en` and `no != en`:** **~470** (many outside Bedrift too).

**Kompis Bedrift-focused subset** (`productHubs.bedrift.*`, `productHubs.common.*`, `foundationDashboard.*`, Bedrift nav group):

| Metric | Count |
|--------|-------|
| Keys translated (es ≠ en) | **17** |
| Keys still English (es == en, no ≠ en) | **59** |
| Keys missing in es | **0** (for this subset — they exist as English text) |

---

## 5. Core / Platform / APP consistency

| Surface | Spanish status |
|---------|----------------|
| **APP customer-active registry** | `es` included |
| **APP `customer-app/core.json`** | **Incomplete** — **6** top-level modules vs **166** in `en`/`no`; **160 missing** including **`employeeKnowledge`**. Present only: `boardInvestorIntelligence`, `enterpriseTransformationChange`, `kompisOperator`, `websiteCms`, `customerApp`, `websiteRuntime` |
| **APP `portalStructure.json`** | Present but many English stubs + ~1107 keys missing vs en |
| **Platform `platform.json`** | File exists but **thin**: ~**497** keys vs en ~**5968** / pl·uk full — Platform Spanish also incomplete (English fallback) |
| **Core foundation rule** | Core list does **not** require `es`; APP extended list does — consistent with “extended” design, but APP claims `es` as customer-active without complete coverage |

---

## 6. Exact components / keys (Bedrift panel)

### A. Hub / panel copy still English (representative — full list of 59 under prefixes above)

`portalStructure.productHubs.bedrift.dashboardTitle`  
`…employeesCard` / `employeesDescription`  
`…knowledgeCard` / `knowledgeDescription` / `knowledgeEmptyTitle` / `knowledgeEmptyBody` / `knowledgePublicSeparation` / `knowledgeWorkspaceHint` / `openInternalKnowledge`  
`…modulesCard` / `modulesDescription` / `modulesAccountHint`  
`…settingsDescription` / `settingsHint` / `settingsEmployeesCard` / `settingsKnowledgeCard` / `settingsModulesCard` / `settingsAccountSeparation`  
`…documentsDescription` / `commsDescription` / `meetingsDescription`  
`portalStructure.productHubs.common.home` / `backToBedrift` / `backToAccount` / `openWorkspace` / `orgFallback` / `statusReady`  
Plus most `portalStructure.foundationDashboard.*` strings including `bedriftDescription`, `openBedrift`, `webDescription`, etc.

### B. Missing module (English via merge)

Entire tree: **`employeeKnowledge`** in `locales/es/customer-app/core.json` (and ensure `customerApp.employeeKnowledge` resolution path used by `buildEmployeeKnowledgeLabels`).

Affected UI: Ansattkunnskap / four FAQ cards labels (`workspace.createFaq`, `articles`, `pendingReview`, `gaps`, `loadError`, …).

### C. Already OK in Spanish (examples)

`portalStructure.nav.kompisBedriftEmployees` → Empleados y acceso  
`portalStructure.nav.kompisBedriftFaq` → FAQ y conocimiento  
`portalStructure.navGroups.kompisBedrift` → Kompis Empresa  

That explains a mixed UI: Spanish sidebar + English panel body.

---

## 7. Recommended bounded fix (DO NOT IMPLEMENT in this job)

1. **Translate** `locales/es/customer-app/portalStructure.json` keys under `productHubs.bedrift`, `productHubs.common`, and `foundationDashboard` (replace English stubs).  
2. **Add** full `employeeKnowledge` (and ideally other missing top-level modules from `en`/`no` `customer-app/core.json`) to `locales/es/customer-app/core.json`.  
3. Optionally align Platform `locales/es/platform.json` in a separate job if Platform UI is in scope.  
4. Re-run existing APP i18n validation / key-diff against `en` for `es`.  
5. Do **not** invent a new language system; keep `EXTENDED_LOCALES` + `mergeDictionary` English fallback.

---

## Gate summary

| Check | Result |
|-------|--------|
| Spanish in central registry | **PASS** |
| Spanish files load / namespace | **PASS** |
| Kompis Bedrift panel fully Spanish | **FAIL** (content coverage) |
| Norwegian Bedrift coverage | **PASS** (reference) |
| Frozen WK chain | **PASS** (0 diff) |
| Implementation | **NOT RUN** (read-only) |

**Overall: PARTIAL**

---

## STOP

No code or locale edits in this job. Owner may authorize a focused Spanish translation fill for Bedrift hubs + `employeeKnowledge` next.
