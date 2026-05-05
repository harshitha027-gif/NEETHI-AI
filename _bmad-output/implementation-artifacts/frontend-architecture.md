# NEETHI AI — Frontend Architecture Plan

**Author:** Winston (System Architect)
**Date:** 2026-05-04
**Status:** Approved for implementation
**Scope:** Hackathon demo — static React + Tailwind SPA, Vercel deploy, mock data only

---

## 1. Project Structure

```
neethi-ai/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                    # React entry point, router setup
│   ├── App.jsx                     # Root component, RouterProvider
│   │
│   ├── data/                       # All mock data — treat as read-only at runtime
│   │   ├── tender.json             # Single mock tender (TEN-2024-KA-0047)
│   │   ├── bids.json               # 14 mock bids, all verdicts pre-set
│   │   ├── criteria.json           # Extracted criteria from mock tender
│   │   ├── auditLog.json           # Immutable audit trail records
│   │   └── users.json              # Mock user list for Admin screen
│   │
│   ├── context/
│   │   └── AppContext.jsx          # Single global context (see section 4)
│   │
│   ├── components/                 # Shared, reusable UI components
│   │   ├── layout/
│   │   │   ├── Shell.jsx           # Page chrome: sidebar + topbar wrapper
│   │   │   ├── Sidebar.jsx         # Left nav (Dashboard, Evaluations, Audit, Admin)
│   │   │   └── Topbar.jsx          # Agency name, officer name, breadcrumb
│   │   ├── ui/
│   │   │   ├── Badge.jsx           # Verdict badges (Eligible/Ineligible/Review/Pending)
│   │   │   ├── Button.jsx          # Primary/secondary/destructive variants
│   │   │   ├── Card.jsx            # Generic content card with optional header
│   │   │   ├── StepIndicator.jsx   # 3-step wizard progress bar
│   │   │   ├── StatusPill.jsx      # Processing / Complete / Failed pills
│   │   │   ├── Table.jsx           # Sortable data table (bids list, audit log)
│   │   │   ├── Modal.jsx           # Confirmation dialogs (sign-off, bulk approve)
│   │   │   ├── EmptyState.jsx      # Reusable empty/first-time state illustration
│   │   │   └── ErrorBanner.jsx     # Inline error display (processing failed)
│   │   └── domain/
│   │       ├── BidRow.jsx          # Single bid row used in verdict dashboard table
│   │       ├── CriterionDetail.jsx # Per-criterion pass/fail with citation
│   │       ├── AuditEntry.jsx      # Single immutable audit log row
│   │       ├── UploadZone.jsx      # Drag-and-drop upload area (mock — no real upload)
│   │       └── DocumentViewer.jsx  # Mock document panel with page citation highlight
│   │
│   └── pages/                      # One file per route/screen
│       ├── Landing.jsx             # Screen 1: Problem pitch + Open Demo CTA
│       ├── OfficerDashboard.jsx    # Screen 2: Home, recent evaluations
│       ├── eval/
│       │   ├── UploadTender.jsx    # Screen 3: Step 1 of 3
│       │   ├── UploadBids.jsx      # Screen 4: Step 2 of 3
│       │   ├── ConfirmCriteria.jsx # Screen 5: Step 3, extracted criteria review
│       │   ├── InProgress.jsx      # Screen 6: Processing status (auto-advances)
│       │   └── VerdictDashboard.jsx # Screen 7: 11/2/1 verdict summary
│       ├── bid/
│       │   ├── BidEligible.jsx     # Screen 8: Auto-Confirmed Eligible detail
│       │   ├── BidIneligible.jsx   # Screen 9: Auto-Flagged Ineligible detail
│       │   └── BidManualReview.jsx # Screen 10: Manual Review Required detail
│       ├── ReuploadDocument.jsx    # Screen 11: Re-upload + re-process flow
│       ├── SignOff.jsx             # Screen 12: Sign-off + evaluation completion
│       ├── KTPPReport.jsx          # Screen 13: KTPP report preview
│       ├── audit/
│       │   ├── AuditSearch.jsx     # Screen 14: Audit log search
│       │   └── AuditTrailDetail.jsx # Screen 15: Immutable record timeline
│       ├── admin/
│       │   ├── UserManagement.jsx  # Screen 16: User list + role management
│       │   └── TestEvalMode.jsx    # Screen 17: Admin test evaluation mode
│       ├── ErrorState.jsx          # Screen 18: Processing failed
│       └── EmptyDashboard.jsx      # Screen 19: First-time officer empty state
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── vercel.json                     # SPA fallback rewrite rule
```

---

## 2. Routing Strategy (React Router v6)

Use `createBrowserRouter` with a single root layout route wrapping all authenticated pages.
Landing page is outside the layout (no sidebar/topbar).

```jsx
// src/main.jsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,          // No shell — standalone marketing page
  },
  {
    path: "/app",
    element: <Shell />,            // Shell provides sidebar + topbar for all app pages
    children: [
      { index: true,               element: <OfficerDashboard /> },
      { path: "dashboard",         element: <OfficerDashboard /> },

      // New Evaluation wizard
      { path: "eval/upload-tender", element: <UploadTender /> },
      { path: "eval/upload-bids",   element: <UploadBids /> },
      { path: "eval/confirm",       element: <ConfirmCriteria /> },
      { path: "eval/processing",    element: <InProgress /> },

      // Verdict views (scoped to the one mock tender: TEN-2024-KA-0047)
      { path: "eval/:evalId/verdicts",              element: <VerdictDashboard /> },
      { path: "eval/:evalId/bid/:bidId/eligible",   element: <BidEligible /> },
      { path: "eval/:evalId/bid/:bidId/ineligible", element: <BidIneligible /> },
      { path: "eval/:evalId/bid/:bidId/review",     element: <BidManualReview /> },
      { path: "eval/:evalId/bid/:bidId/reupload",   element: <ReuploadDocument /> },
      { path: "eval/:evalId/signoff",               element: <SignOff /> },
      { path: "eval/:evalId/report",                element: <KTPPReport /> },

      // Audit
      { path: "audit",             element: <AuditSearch /> },
      { path: "audit/:caseId",     element: <AuditTrailDetail /> },

      // Admin
      { path: "admin/users",       element: <UserManagement /> },
      { path: "admin/test-eval",   element: <TestEvalMode /> },

      // Error and empty states
      { path: "error",             element: <ErrorState /> },
      { path: "empty",             element: <EmptyDashboard /> },
    ],
  },
]);
```

**Hard-coded mock IDs used in navigation:**
- `evalId`: `"TEN-2024-KA-0047"` — the one mock tender
- `bidId`: `"BID-001"` through `"BID-014"` — 14 mock bids

The wizard flow (screens 3-6) does not need params — it always targets the same mock evaluation.
After ConfirmCriteria, push to `/app/eval/processing`, which auto-advances to `/app/eval/TEN-2024-KA-0047/verdicts` after a 3-second mock delay.

`vercel.json` must have the SPA rewrite so direct URL loads work:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 3. Mock Data Structure

All files live in `src/data/`. Import directly into components — no fetch calls.

### `tender.json`
```json
{
  "id": "TEN-2024-KA-0047",
  "title": "Construction of Rural Road — Bidar District Phase 3",
  "agency": "Public Works Department, Karnataka",
  "issuedDate": "2024-10-15",
  "closingDate": "2024-11-10",
  "estimatedValue": "₹12.4 Crore",
  "status": "evaluation_complete",
  "totalBids": 14
}
```

### `criteria.json`
Array of extracted eligibility criteria — shown on Screen 5 and referenced in bid detail verdicts.
```json
[
  {
    "id": "C-001",
    "type": "mandatory",
    "description": "Minimum annual turnover of ₹5 Crore in last 3 financial years",
    "sourceClause": "Clause 4.2(a)",
    "extractionConfidence": 0.97
  },
  {
    "id": "C-002",
    "type": "mandatory",
    "description": "Valid GST registration certificate",
    "sourceClause": "Clause 4.2(b)",
    "extractionConfidence": 0.99
  },
  {
    "id": "C-003",
    "type": "mandatory",
    "description": "ISO 9001:2015 certification",
    "sourceClause": "Clause 4.3",
    "extractionConfidence": 0.94
  },
  {
    "id": "C-004",
    "type": "mandatory",
    "description": "Minimum 5 years experience in road construction",
    "sourceClause": "Clause 4.4",
    "extractionConfidence": 0.96
  },
  {
    "id": "C-005",
    "type": "optional",
    "description": "Prior experience in Karnataka government projects",
    "sourceClause": "Clause 4.5",
    "extractionConfidence": 0.91
  }
]
```

### `bids.json`
Array of 14 bids. The `verdict` field drives which detail page a row links to.
Verdict values: `"eligible"` | `"ineligible"` | `"manual_review"`.
```json
[
  {
    "id": "BID-001",
    "tenderId": "TEN-2024-KA-0047",
    "bidderName": "Sri Lakshmi Constructions Pvt Ltd",
    "bidderContact": "+91-9845012345",
    "submissionLanguage": "english",
    "submittedAt": "2024-11-09T14:23:00+05:30",
    "verdict": "eligible",
    "overallConfidence": 0.96,
    "criteria": [
      {
        "criterionId": "C-001",
        "status": "pass",
        "confidence": 0.97,
        "citation": { "document": "Audited Financial Statement 2023-24", "page": 3, "extract": "Annual turnover ₹8.2 Crore" }
      },
      {
        "criterionId": "C-002",
        "status": "pass",
        "confidence": 0.99,
        "citation": { "document": "GST Certificate", "page": 1, "extract": "GSTIN: 29AABCS1234D1Z5" }
      },
      {
        "criterionId": "C-003",
        "status": "pass",
        "confidence": 0.95,
        "citation": { "document": "ISO Certificate", "page": 1, "extract": "Valid until 2026-03-31" }
      },
      {
        "criterionId": "C-004",
        "status": "pass",
        "confidence": 0.98,
        "citation": { "document": "Experience Certificate", "page": 2, "extract": "7 years road construction, PWD-certified" }
      }
    ]
  },
  {
    "id": "BID-003",
    "tenderId": "TEN-2024-KA-0047",
    "bidderName": "Rajesh Road Works",
    "bidderContact": "+91-9731012345",
    "submissionLanguage": "kannada",
    "submittedAt": "2024-11-08T11:05:00+05:30",
    "verdict": "ineligible",
    "overallConfidence": 0.93,
    "criteria": [
      {
        "criterionId": "C-001",
        "status": "fail",
        "confidence": 0.93,
        "citation": { "document": "ಆರ್ಥಿಕ ವಿವರಣೆ 2023-24", "page": 3, "extract": "ವಾರ್ಷಿಕ ವಹಿವಾಟು ₹3.2 ಕೋಟಿ" },
        "failReason": "Mandatory criterion not met — Minimum turnover ₹5 Crore required. Bidder's audited statement (Page 3) shows ₹3.2 Crore."
      },
      {
        "criterionId": "C-002",
        "status": "pass",
        "confidence": 0.99,
        "citation": { "document": "GST ಪ್ರಮಾಣಪತ್ರ", "page": 1, "extract": "GSTIN: 29AAJCR5678E1Z3" }
      }
    ]
  },
  {
    "id": "BID-007",
    "tenderId": "TEN-2024-KA-0047",
    "bidderName": "Veeranna & Sons Contractors",
    "bidderContact": "+91-9900123456",
    "submissionLanguage": "kannada",
    "submittedAt": "2024-11-10T09:47:00+05:30",
    "verdict": "manual_review",
    "overallConfidence": 0.61,
    "manualReviewFlag": "OCR confidence 61% on Page 2 of experience certificate — possible date conflict. Stamp partially occluded, Kannada text unverifiable.",
    "criteria": [
      {
        "criterionId": "C-004",
        "status": "uncertain",
        "confidence": 0.61,
        "citation": { "document": "ಅನುಭವ ಪ್ರಮಾಣಪತ್ರ", "page": 2, "extract": "[OCR confidence too low to extract reliably]" },
        "flagReason": "Document quality insufficient for automated evaluation"
      }
    ]
  }
]
```

Build out all 14 bids following these three patterns: 11 `eligible`, 2 `ineligible`, 1 `manual_review`.
For eligible bids, vary the bidder names, languages (mix Kannada/English), and financial figures.

### `auditLog.json`
```json
[
  {
    "id": "AUD-001",
    "timestamp": "2024-11-10T16:00:00+05:30",
    "eventType": "evaluation_started",
    "actor": "Officer Ravi Kumar",
    "tenderId": "TEN-2024-KA-0047",
    "description": "Evaluation session initiated. 14 bidder packages submitted.",
    "immutable": true
  },
  {
    "id": "AUD-002",
    "timestamp": "2024-11-10T16:01:22+05:30",
    "eventType": "criteria_confirmed",
    "actor": "Officer Ravi Kumar",
    "tenderId": "TEN-2024-KA-0047",
    "description": "Officer confirmed 5 extracted criteria (4 Mandatory, 1 Optional).",
    "immutable": true
  },
  {
    "id": "AUD-010",
    "timestamp": "2024-11-10T16:42:18+05:30",
    "eventType": "verdict_generated",
    "actor": "NEETHI AI v1.0",
    "tenderId": "TEN-2024-KA-0047",
    "bidId": "BID-003",
    "description": "Auto-Flagged Ineligible. Criterion C-001 failed. Turnover ₹3.2 Crore < required ₹5 Crore. Citation: Audited Statement Page 3.",
    "immutable": true
  },
  {
    "id": "AUD-020",
    "timestamp": "2024-11-10T17:15:00+05:30",
    "eventType": "reupload",
    "actor": "Officer Ravi Kumar",
    "tenderId": "TEN-2024-KA-0047",
    "bidId": "BID-007",
    "description": "Replacement experience certificate uploaded for BID-007. Re-processing initiated.",
    "immutable": true
  },
  {
    "id": "AUD-030",
    "timestamp": "2024-11-10T17:45:00+05:30",
    "eventType": "evaluation_signed_off",
    "actor": "Officer Ravi Kumar",
    "tenderId": "TEN-2024-KA-0047",
    "description": "Evaluation signed off. 11 eligible, 2 ineligible, 1 manual review resolved. KTPP report generated.",
    "immutable": true
  }
]
```

### `users.json`
```json
[
  { "id": "U-001", "name": "Ravi Kumar", "email": "ravi.kumar@pwd.karnataka.gov.in", "role": "officer", "agency": "PWD Karnataka", "status": "active" },
  { "id": "U-002", "name": "Priya Sharma", "email": "priya.sharma@agkar.gov.in",     "role": "audit_viewer", "agency": "AG's Office Karnataka", "status": "active" },
  { "id": "U-003", "name": "Suresh Nair",  "email": "suresh.nair@bbmp.gov.in",        "role": "admin", "agency": "BBMP", "status": "active" }
]
```

---

## 4. State Management

**Decision: React Context + useState only. No Redux, no Zustand, no external store.**

Rationale: The demo has no real async, no cache invalidation, no concurrent mutations. A global context holding the current wizard step and any transient UI decisions is sufficient. Over-engineering this wastes demo build time.

### What context holds

```jsx
// src/context/AppContext.jsx
const defaultState = {
  // Wizard state (screens 3-6)
  wizardStep: 1,                  // 1 | 2 | 3
  uploadedTenderName: null,       // Mock filename for display only
  uploadedBidCount: 0,            // Mock count for display only

  // Evaluation in progress
  processingComplete: false,

  // Verdict dashboard
  selectedEvalId: "TEN-2024-KA-0047",

  // Sign-off flow
  signOffComplete: false,
  officerNotes: {},               // { [bidId]: "note string" }

  // Admin test mode
  testModeActive: false,
};
```

### What stays local (useState in component)

- Table sort/filter state (AuditSearch, VerdictDashboard)
- Modal open/closed
- Form field values (wizard steps — no persistence needed)
- Active tab within a bid detail page
- Audit search form inputs

### Pattern for accessing mock data

Import JSON directly — do not fetch, do not useEffect. Keep it simple.

```jsx
import bids from '../data/bids.json';
import tender from '../data/tender.json';

// In component:
const bid = bids.find(b => b.id === params.bidId);
```

---

## 5. Component Hierarchy

```
App
└── RouterProvider
    ├── Landing                         (no Shell)
    └── Shell
        ├── Sidebar
        ├── Topbar
        └── <Outlet>
            ├── OfficerDashboard
            │   └── Card (recent evaluations)
            │       └── StatusPill
            │
            ├── UploadTender
            │   ├── StepIndicator (step 1 active)
            │   └── UploadZone
            │
            ├── UploadBids
            │   ├── StepIndicator (step 2 active)
            │   └── UploadZone (multiple files)
            │
            ├── ConfirmCriteria
            │   ├── StepIndicator (step 3 active)
            │   └── Table (criteria rows, editable mock)
            │
            ├── InProgress
            │   └── StatusPill (animating)
            │
            ├── VerdictDashboard
            │   ├── Card (summary: 11/2/1 counts)
            │   │   └── Badge (verdict type)
            │   └── Table
            │       └── BidRow (×14)
            │           └── Badge
            │
            ├── BidEligible / BidIneligible / BidManualReview
            │   ├── Badge (verdict)
            │   ├── CriterionDetail (×N criteria)
            │   │   └── DocumentViewer (mock page citation)
            │   └── Button (approve / flag for review / add note)
            │
            ├── ReuploadDocument
            │   └── UploadZone (single replacement doc)
            │
            ├── SignOff
            │   └── Modal (confirmation)
            │
            ├── KTPPReport
            │   └── Card (report preview sections)
            │
            ├── AuditSearch
            │   ├── (filter inputs as local state)
            │   └── Table
            │       └── AuditEntry (×N)
            │
            ├── AuditTrailDetail
            │   └── AuditEntry (timeline view, ×N)
            │
            ├── UserManagement
            │   └── Table (users.json)
            │
            ├── TestEvalMode
            │   └── (mirrors wizard, labeled "Test Mode")
            │
            ├── ErrorState
            │   └── ErrorBanner
            │
            └── EmptyDashboard
                └── EmptyState
```

**Reuse notes:**
- `Table` is used in VerdictDashboard, AuditSearch, UserManagement — parameterize columns via props
- `Badge` covers all verdict types + processing statuses (drive from a `type` prop with a color map)
- `UploadZone` is used in steps 1, 2, and ReuploadDocument — mock behavior (show filename, no real upload)
- `CriterionDetail` is shared across all three bid detail pages — props drive pass/fail/uncertain state

---

## 6. Build and Deploy Setup

### Toolchain: Vite + Vercel (confirmed, no counter-recommendation)

Vite gives you sub-second HMR, a zero-config build output that Vercel handles natively, and no special adapter needed. Webpack/CRA would work but offer nothing additional for this demo and build slower.

### `package.json` — key dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

No other runtime dependencies. No UI library (Radix, shadcn, etc.) — keep Tailwind-only to avoid dependency surface and bundle size creep for a demo.

Exception: if you want icons without SVG file management, `lucide-react` is acceptable (tree-shakeable, zero config).

### `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },      // Use @/components/... everywhere
  },
});
```

### `tailwind.config.js`

```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // NEETHI brand palette — government blue, not startup teal
        neethi: {
          blue:   '#1a3a6b',
          gold:   '#c8922a',
          green:  '#1e7e34',
          red:    '#b02020',
          amber:  '#d97706',
          gray:   '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is non-negotiable — without it, any direct URL or browser refresh hits a 404.

### Deploy process

```bash
# First deploy
npm create vite@latest neethi-ai -- --template react
cd neethi-ai
npm install react-router-dom tailwindcss postcss autoprefixer lucide-react
npx tailwindcss init -p

# Push to GitHub, connect to Vercel
# Vercel auto-detects Vite: build command = "vite build", output = "dist"
# No environment variables needed — all data is static
```

---

## 7. Risks and Trade-offs

### Risk 1: InProgress screen (Screen 6) needs a fake timer

The processing screen auto-advances to the verdict dashboard. Use `setTimeout` + `useNavigate` — 3 seconds is enough to sell the "AI is working" story. Do not use a polling pattern; there is nothing to poll.

```jsx
// InProgress.jsx
useEffect(() => {
  const timer = setTimeout(() => {
    navigate('/app/eval/TEN-2024-KA-0047/verdicts');
  }, 3000);
  return () => clearTimeout(timer);
}, []);
```

### Risk 2: Bid detail routing — three pages or one

You could implement BidEligible / BidIneligible / BidManualReview as a single `BidDetail.jsx` that branches on `bid.verdict`. That's cleaner code. Trade-off: harder to show judges distinct "screens." Keep them separate in the file tree but extract shared logic into `CriterionDetail` and a `useBidData` hook.

### Risk 3: Mock data completeness

All 14 bids must be filled out fully before the demo or the verdict dashboard will look broken with undefined fields. Do not stub with `null` values and plan to fill later — this always burns demo day. Write all 14 bids in `bids.json` before building any UI components.

### Risk 4: KTPP Report (Screen 13) is PDF-like but cannot generate a real PDF

Options in order of effort:
- **Option A (recommended):** Render the report as a styled HTML page that looks like a printed document. Add a `window.print()` button styled as "Download PDF." Zero additional dependencies. Works in every browser.
- **Option B:** Use `jsPDF` or `react-pdf`. More realistic download, but 3-4 hours of setup and styling friction for demo purposes.

Recommendation: Option A. Judges will see the report structure and understand the output. A `window.print()` producing a formatted page is indistinguishable from PDF generation to a non-technical evaluator.

### Risk 5: No back-navigation guard on wizard

Judges may hit the browser back button from step 3 to step 1 and lose the sense of flow. Do not add a `beforeunload` guard — overkill for a demo. Instead, make the `StepIndicator` clickable so judges can navigate steps cleanly without using browser history.

### Risk 6: Tailwind purge — make sure class names are not dynamically assembled

```jsx
// WRONG — Tailwind cannot statically detect this class:
const color = verdict === 'eligible' ? 'green' : 'red';
<span className={`text-${color}-600`} />

// RIGHT — Use a lookup map with complete class strings:
const verdictClasses = {
  eligible:      'text-green-600 bg-green-50 border-green-200',
  ineligible:    'text-red-600 bg-red-50 border-red-200',
  manual_review: 'text-amber-600 bg-amber-50 border-amber-200',
};
<span className={verdictClasses[verdict]} />
```

This will silently break production builds if you miss it. Document this pattern in a comment inside `Badge.jsx`.

### Risk 7: Desktop-first at 1280px — do not waste time on responsive

The PRD explicitly says desktop-first, 1024px minimum. Set a fixed `max-w-screen-xl` container and center it. Do not add responsive breakpoints beyond that. Judges will view this on a laptop; optimize for 1280-1440px and stop.

---

## Implementation Order (Recommended)

1. Scaffold Vite project, install deps, configure Tailwind, push to GitHub, confirm Vercel deploy works (empty page) — **do this first, before writing a single component**
2. Write all mock JSON files (`tender.json`, `criteria.json`, all 14 bids in `bids.json`, `auditLog.json`, `users.json`)
3. Build Shell (Sidebar + Topbar) and confirm routing works across all routes
4. Landing page (Screen 1)
5. OfficerDashboard (Screen 2)
6. Wizard: UploadTender → UploadBids → ConfirmCriteria → InProgress → VerdictDashboard (Screens 3-7)
7. Bid detail pages: Eligible, Ineligible, ManualReview (Screens 8-10)
8. ReuploadDocument + SignOff + KTPPReport (Screens 11-13)
9. AuditSearch + AuditTrailDetail (Screens 14-15)
10. Admin: UserManagement + TestEvalMode (Screens 16-17)
11. ErrorState + EmptyDashboard (Screens 18-19)
12. Polish pass: consistent colors, spacing, verdict badge colors, Tailwind purge check
