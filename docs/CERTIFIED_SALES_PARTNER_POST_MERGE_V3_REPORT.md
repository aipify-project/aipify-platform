# Certified Sales Partner — Post-merge Complete-to-Live V3

**Dato:** 2026-11-25  
**Base:** `origin/main` @ `0eee20f2a` (#346 Production READY)  
**Branch:** `feat/csp-post-merge-complete-v3`

## Startgate

| Sjekk | Resultat |
|---|---|
| Repo / main | `aipify-project/aipify-platform` · `0eee20f2a` |
| Production deploy | Tre Vercel-apper SUCCESS på `0eee20f2a` |
| Migrasjon SHA | `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95` uendret |
| Prod ledger `qbcqoixhrvhnuwphefvw` | `csp_partner_profiles` **ABSENT** — SQL **IKKE ANVENDT** |
| Staging ledger `auedugihkduoaikfusqe` | samme — **IKKE ANVENDT** |
| Kompis Public Chain | CSP-diff rører **ikke** protected paths. Pre-eksisterende hash-drift på main mot manifest (4 filer) — håndteres av observed-drift ledger; **HOLD** på å endre dem i denne jobben |

## Hva denne PR-en leverer (ordinær APP, fail-closed)

- Partner workspace-paneler (home, produkter uten kjøp, lenker, salg, oppgjør RO, academy-test med Kompis sperret)
- Platform Selgere handlingspaneler (partnerstatus, produkt+fast provisjon, oppgjørsstatus)
- API: bank-profil (maskert), sales list, products upsert
- Stripe-adapter **kun** ren mapper + tester (ingen live webhook/betaling)
- SQL Gate S/P preflight: `docs/security-hardening/CSP_SQL_202619410_GATE_SP_PREFLIGHT.md`

## Modulstatus

| Modul | Kode | Test | Backend | Production | Blokker |
|---|---|---|---|---|---|
| Domain/rules | Ferdig | PASS | Nei | FAIL-CLOSED | SQL |
| Partner UI workspace | Ferdig | ui-support PASS | Nei | FAIL-CLOSED UI LIVE | SQL |
| Platform Selgere actions | Ferdig | — | Nei | FAIL-CLOSED UI LIVE | SQL |
| Stripe earn #1/#2 | Mapper ferdig | PASS | Nei | FAIL-CLOSED | SQL + betalingsamtykke |
| Oppgjør manuell bank | Regler+API | PASS | Nei | FAIL-CLOSED | SQL + finance |
| Kompis i test | Sperret UI | PASS | N/A | BLOCKED ærlig | — |

## Eierbeslutning som gjenstår

1. Gate S/P: apply eksakt SHA `ea676d4a…` til Staging og/eller Production (se preflight-doc).  
2. Betalingssamtykke for kontrollert Stripe #1/#2.  
3. E-postsender/domene før live partner-mail.

## Sluttstatus

**Ordinær CSP APP-kode utvidet og klar for merge som fail-closed.**  
**Kommersielt LIVE provisjon/utbetaling: IKKE AKTIV** før SQL Gate S/P.
