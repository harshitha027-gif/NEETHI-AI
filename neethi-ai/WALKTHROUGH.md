# NEETHI AI — Demo Walkthrough

> Hackathon demo for AI-powered tender evaluation, Government of Karnataka.
> Built with React + TypeScript + Vite + Tailwind CSS.

---

## 1. Quick Start

```bash
cd neethi-ai
npm install
npm run dev
# Open http://localhost:5173
```

---

## 2. Full Demo Flow (Happy Path)

### Step 1 — Landing Page → Dashboard
- Open `/` → Click **"Go to Dashboard"**
- You land on `/dashboard` (Officer Dashboard)
- See 3 evaluation cards: one `completed`, one `in_review` (verdict ready), one `processing`

### Step 2 — Start New Evaluation (Wizard)
- Click **"New Evaluation"** → lands on `/evaluation/new/step1`
- **Upload Tender Document:**
  - Type any Tender Name (e.g. `NH-75 Bypass`)
  - Type any Reference No (e.g. `KTPP-2024-INF-001`)
  - Drag-and-drop OR click to upload any PDF file (use dummy PDF below)
  - Click **"Next: Upload Bid Documents"**

### Step 3 — Upload Bid Documents
- Page shows 2 pre-filled bidders (Hassan Infra, Mysuru Urban)
- Upload any PDF into each bidder's dropzone (click card or drag file onto it)
- You can add more bidders by clicking **"+ Add Bidder"**
- All bidders need ≥1 file before **"Continue to Review"** enables
- Click **"Continue to Review"**

### Step 4 — Confirm Criteria
- Shows summary: tender name from Step 1, bid count from Step 2
- Lists 6 evaluation criteria from mockData (Mandatory + Optional)
- Review, then click **"Start Evaluation"**
- Lands on `/evaluation/EVAL-2024-001/processing`

### Step 5 — Evaluation In Progress
- Animated progress screen
- Click **"View Results"** → lands on `/evaluation/EVAL-2024-001`

### Step 6 — Verdict Dashboard
- Shows 14 bids: 11 Eligible, 2 Ineligible, 1 Manual Review
- **Important:** Sign Off button is DISABLED until the 1 Manual Review bid is resolved
- Click **"View"** on any eligible bid → `/bid/BID-001/eligible`
- Click **"View"** on any ineligible bid → `/bid/BID-012/ineligible`
- Click **"Resolve"** on the manual review bid → `/bid/BID-014/manual-review`

### Step 7 — Bid Detail Screens

**Eligible Bid (`/bid/BID-001/eligible`):**
- Shows all 6 criteria with confidence scores
- Click **"Approve Eligibility"** → back to VerdictDashboard

**Ineligible Bid (`/bid/BID-012/ineligible`):**
- Shows fail reasons with evidence extracted
- Click **"Send to Manual Review"** → `/bid/BID-012/manual-review`
- OR click **"Confirm Rejection"** → back to VerdictDashboard

**Manual Review (`/bid/BID-014/manual-review`):**
- Officer override form with radio buttons + notes
- Select a decision **and** type at least one character in the notes field (both required — Submit stays disabled otherwise)
- Click **"Submit Decision"** → back to VerdictDashboard
- Manual review bid now shows **"Resolved ✓"** badge

### Step 8 — Sign Off
- After resolving all manual review bids, **"Sign Off"** button enables in VerdictDashboard
- Click **"Sign Off"** → `/evaluation/EVAL-2024-001/signoff`
- Read the Officer Certification Statement
- Check the confirmation checkbox
- Click **"Sign Off & Lock Evaluation"** → back to VerdictDashboard

### Step 9 — Supporting Screens
- **Audit Trail:** Click audit icon on any evaluation card → `/audit/EVAL-2024-001`
- **KTPP Report:** Click "Download Report" → `/report/EVAL-2024-001`
- **Bid Document Viewer:** Click any bid row in VerdictDashboard → `/bid/:bidId`
- **Audit Log Search:** Click "Audit Log" in top nav placeholder → `/audit-log/search`
- **User Management:** Navigate to `/admin/users` directly

---

## 3. Dummy PDF for Testing

Since this is a demo, any PDF works for upload (the app does not parse it — AI evaluation uses mockData).

**Quick options:**
1. Save any webpage as PDF from Chrome (Ctrl+P → Save as PDF)
2. Use any existing PDF on your machine
3. Create a minimal PDF with the text below

**Dummy bid content (copy into a text file and save as `.pdf` or print to PDF):**

```
ಟೆಂಡರ್ ಬಿಡ್ ಡಾಕ್ಯುಮೆಂಟ್
Tender Bid Document

ಕಂಪನಿ: ರಾಜೇಶ್ ಇನ್ಫ್ರಾಸ್ಟ್ರಕ್ಚರ್ ಪ್ರೈ. ಲಿ.
Company: Rajesh Infrastructure Pvt Ltd
GSTIN: 29AACFR1234A1Z5

ವಾರ್ಷಿಕ ವಹಿವಾಟು / Annual Turnover:
FY2023: ₹12.4 Crore
FY2022: ₹10.1 Crore
FY2021: ₹8.9 Crore

ISO 9001:2015 ಪ್ರಮಾಣಪತ್ರ / Certificate: #IN-9001-2022-04471
PWD ನೋಂದಣಿ / Registration: KA-PWD-I-2019-0034
ಅನುಭವ / Experience: 7 ಯೋಜನೆಗಳು, ಸರಾಸರಿ 9.2 ವರ್ಷ

ಒಟ್ಟು ಬಿಡ್ ಮೊತ್ತ / Total Bid Amount: ₹44.2 Crore
```

---

## 4. Test Data Summary

### mockData.ts — 14 Bids

| Bid ID | Vendor | Language | Verdict |
|--------|--------|----------|---------|
| BID-001 | Rajesh Infrastructure Pvt Ltd | Kannada | Eligible |
| BID-002 | Kaveri Constructions | Kannada | Eligible |
| BID-003 | Sri Ganesha Road Works | Kannada | Eligible |
| BID-004 | Deccan Highways Ltd | English | Eligible |
| BID-005 | Tungabhadra Civil Works | Kannada | Eligible |
| BID-006 | Mahadayi Infra Projects | Kannada | Eligible |
| BID-007 | Nandi Construction Corp | English | Eligible |
| BID-008 | Hemavathi Roads Pvt Ltd | Kannada | Eligible |
| BID-009 | Vedavathi Civil Engineering | Kannada | Eligible |
| BID-010 | Sharavathi Infra Solutions | Kannada | Eligible |
| BID-011 | Cauvery Road Builders | English | Eligible |
| BID-012 | Prakash Civil Contractors | Kannada | Ineligible |
| BID-013 | JSR Infrastructure | English | Ineligible |
| BID-014 | Amrutha Constructions | Kannada | Manual Review |

**Kannada bids: 10/14 = 71%** (exceeds 40% requirement)

---

## 5. Remaining Items (Not Built — Post-Hackathon)

### Missing Screens
| Screen | Route | Status |
|--------|-------|--------|
| Login / Auth | `/login` | Not built — no auth |
| Analytics | `/analytics` | Nav links exist, no page |
| Settings | `/settings` | Nav button exists, no page |

### Dead Nav Items (href="#" — no action)
| Location | Element | Notes |
|----------|---------|-------|
| All screens | Top nav "Tenders" | Dead link |
| All screens | Top nav "Analytics" | Dead link |
| All screens | Top nav "Audit Log" | Dead link (AuditLogSearch page exists at `/audit-log/search` but not wired) |
| All screens | Bell (notifications) | No panel |
| All screens | HelpCircle | No panel |
| All screens | User avatar | No dropdown |
| Sidebar | Settings | No navigation |
| Sidebar | Logout | No auth to log out from |

### Dead Buttons (render but no action)
| Screen | Button | Notes |
|--------|--------|-------|
| OfficerDashboard | Filter | No dropdown/logic |
| OfficerDashboard | Export Report | No file output |
| OfficerDashboard | Pagination prev/next | No page state |
| Step2UploadBids | Save Draft | No save logic |
| EvaluationSignOff | Download Preview | No file output |
| BidDetailsEligible | View Audit Log | Not navigating |
| BidDetails | PDF Summary | Calls `window.print()` — browser print dialog only |
| VerdictDashboard | Download Report | Links to `/report/:id` (KtppReport page exists) |

### Data Gaps
| Item | Status |
|------|--------|
| BidDetails breadcrumb | Hardcoded to `/evaluation/EVAL-2024-001` |
| ProcessingError retry | Shows spinner, no real retry |
| KtppReport | Page exists, no real PDF download |

---

## 6. Routes Reference

| Route | Component | Status |
|-------|-----------|--------|
| `/` | LandingPage | ✓ |
| `/dashboard` | OfficerDashboard | ✓ |
| `/evaluation/new/step1` | Step1UploadTender | ✓ |
| `/evaluation/new/step2` | Step2UploadBids | ✓ |
| `/evaluation/new/step3` | Step3ConfirmCriteria | ✓ |
| `/evaluation/:id/processing` | EvaluationInProgress | ✓ |
| `/evaluation/:id/error` | ProcessingError | ✓ |
| `/evaluation/:id/signoff` | EvaluationSignOff | ✓ |
| `/evaluation/:id` | VerdictDashboard | ✓ |
| `/bid/:bidId` | BidDetails | ✓ |
| `/bid/:bidId/eligible` | BidDetailsEligible | ✓ |
| `/bid/:bidId/ineligible` | BidDetailsIneligible | ✓ |
| `/bid/:bidId/manual-review` | BidDetailsManualReview | ✓ |
| `/audit/:evaluationId` | AuditTrail | ✓ |
| `/audit-log/search` | AuditLogSearch | ✓ |
| `/admin/users` | UserManagement | ✓ |
| `/report/:evaluationId` | KtppReport | ✓ |

**Total: 17 routed screens. All routes functional.**

---

## 7. Judging Demo Script (5-minute version)

1. **Land on `/`** — show branding, Government of Karnataka context → click **"Open Demo →"**
2. **Click "New Evaluation"** on OfficerDashboard — run wizard: upload tender → upload bids → confirm 6 criteria → Start Evaluation → auto-advances to verdict dashboard
3. **Jump to `/evaluation/EVAL-2024-001`** — show AI verdict dashboard: 11 eligible / 2 ineligible / 1 manual review, confidence bars, Kannada vendor names
4. **Click "View" on eligible bid (BID-001)** → `/bid/BID-001/eligible` — criterion-by-criterion breakdown, Kannada vendor "ರಾಜೇಶ್ ಇನ್ಫ್ರಾಸ್ಟ್ರಕ್ಚರ್" visible
5. **Click "View" on ineligible bid (BID-012)** → `/bid/BID-012/ineligible` — AI-extracted fail reasons with document page citations
6. **Click "Resolve" on manual review bid (BID-014)** → `/bid/BID-014/manual-review` — select a radio button decision + type a note (both required) → "Submit Decision" → VerdictDashboard shows "Resolved ✓" badge
7. **Sign Off button now enabled** — click "Sign Off Evaluation" → `/evaluation/EVAL-2024-001/signoff` — read certification statement, check confirmation box → "Sign Off & Lock Evaluation" → returns to VerdictDashboard
8. **Navigate to `/audit/EVAL-2024-001`** — show immutable audit trail: 12 events, AI + officer actions, cryptographic hashes
9. **Mention:** 71% Kannada vendor data (10/14 bids), KTPP Act 2000 Sections 13 & 14 compliance, real PWD/ISO/GST criteria, confidence-gated verdict engine

---

*Generated: May 2026 | NEETHI AI Hackathon Demo*
