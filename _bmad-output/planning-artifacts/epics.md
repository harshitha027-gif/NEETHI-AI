---
status: active
lastUpdated: 2026-05-05
source: neethi-ai/WALKTHROUGH.md (sections mapped to epics)
---

# NEETHI AI — Epics & Progress

## Epic 1: Project Setup & Quick Start
**Status:** SKIPPED (not required)
**Source:** WALKTHROUGH.md §1
Scaffold, install, dev server spin-up. Pre-existing — not a tracked deliverable.

---

## Epic 2: Full Demo Flow (Happy Path)
**Status:** ✅ DONE
**Source:** WALKTHROUGH.md §2
All 17 routes functional. Complete wizard flow (Step1 → Step2 → Step3 → Processing → Verdict Dashboard). Bid detail screens (Eligible, Ineligible, Manual Review). Sign-off flow. KTPP Report. Audit Trail.

---

## Epic 3: Demo Assets & Testing Support
**Status:** ✅ DONE
**Source:** WALKTHROUGH.md §3
Upload zones accept any PDF (mock, no real parse). Dummy bid content documented. App runs on `npm run dev`.

---

## Epic 4: Test Data Completeness & Accuracy
**Status:** ✅ DONE (2026-05-05)
**Source:** WALKTHROUGH.md §4
Ensure mockData.ts matches the WALKTHROUGH §4 spec exactly: correct bid IDs, vendor names, languages, verdicts, and the 71% Kannada ratio.

### Stories

#### Story 4.1 — Align WALKTHROUGH §4 table to mockData.ts (code is source of truth)
**Status:** ✅ DONE (2026-05-05)
**Description:** Updated WALKTHROUGH.md §4 bid table, §2 step 6 demo routes, and §2 step 7 bid detail routes to match actual mockData.ts. Ineligible bids now correctly cited as BID-012/BID-013; Manual Review as BID-014. Kannada ratio 10/14 = 71% confirmed correct.

#### Story 4.2 — Kannada vendor names visible in VerdictDashboard
**Status:** ✅ DONE (pre-existing)
**Description:** VerdictDashboard already renders `bid.vendorNameKannada` under English name (VerdictDashboard.tsx:327-328). §7 demo script calls for verbal mention of 71% — no dedicated UI widget required.

---

## Epic 5: Remaining Items & Nav Fixes
**Status:** ✅ DONE (2026-05-05)
**Source:** WALKTHROUGH.md §5

Fixed:
- All sidebar NAV_ITEMS across 9 pages: wired to /dashboard (Overview) or /evaluation/EVAL-2024-001 (all others)
- EvaluationSignOff/EvaluationInProgress/Step3ConfirmCriteria top nav Dashboard+Tenders+Analytics — added navigate()
- VerdictDashboard "New Evaluation" button → /evaluation/new/step1
- UserManagement "New Evaluation" button → /evaluation/new/step1
- UserManagement missing useNavigate import + hook added (was runtime error)
- BidDetailsEligible PDF Summary → window.print()
- EvaluationSignOff Download Preview → /report/:evaluationId
- BidDetailsManualReview breadcrumb links → /evaluation/EVAL-2024-001

Intentionally skipped (not in demo path):
- Filter dropdown, Export Report, Pagination (cosmetic only)
- Save Draft (wizard, no demo requirement)
- Bell panel ✓ and HelpCircle panel ✓ were already working

---

## Epic 6: Routes Verification
**Status:** ✅ DONE (2026-05-05)
**Source:** WALKTHROUGH.md §6

Verified:
- All 17 WALKTHROUGH §6 routes registered in App.tsx ✓
- All 19 page components exist and export default ✓
- vercel.json SPA rewrite `/(.*) → index.html` confirmed ✓
- `npm run build` succeeds (892ms, no errors) ✓
- Dev server returns 200 on spot-checked routes ✓
- UserManagement.jsx runtime bug fixed: missing `useNavigate` import (would have crashed /admin/users)
- Note: `tsc --noEmit` shows pre-existing errors (missing @types/react) — Vite uses esbuild, not tsc, so build is unaffected

---

## Epic 7: Judging Demo Script Prep
**Status:** ✅ DONE (2026-05-05)
**Source:** WALKTHROUGH.md §7

Traced all 9 demo steps against live code. Two critical runtime bugs found and fixed:

1. **VerdictDashboard crash** — `{ state: { resolvedBids } }` destructured from context that returns flat `{ resolvedBids }`. Fixed to `{ resolvedBids }`.
2. **`pendingReview` and `counts` undefined** — used in JSX but never declared. Added derived computations from `BIDS` array. Sign-off gate now works correctly.

Demo script updated:
- Correct bid IDs in §7 (BID-001 eligible, BID-012 ineligible, BID-014 manual review)
- Notes requirement clarified (both decision + notes required to enable Submit)
- Detailed step-by-step with exact routes and visible elements

Build: ✓ 626ms, no errors.
