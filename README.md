# NEETHI AI — Neural Evaluation Engine for Transparent & Honest Inquiry

**Live Demo:** [https://shiny-piroshki-8c98b3.netlify.app/](https://shiny-piroshki-8c98b3.netlify.app/)

---

## Overview

NEETHI AI is a production-grade AI-powered tender evaluation system designed for the Government of Karnataka's Public Procurement Department. It automates bid analysis against the **Karnataka Transparency in Public Procurements (KTPP) Act, 2000** — evaluating bidder eligibility across six mandatory and optional criteria with cryptographic audit trails.

The system ingests bid documents (PDF, JPG, PNG) and returns structured verdicts: **Eligible**, **Ineligible**, or **Manual Review**, each with criterion-level confidence scores and AI-extracted evidence citations.

---

## Key Features

### 🤖 Real AI Evaluation Engine
- **Gemma 4 31B-IT Integration:** Each uploaded bid document is sent directly to Google's Gemma LLM for criterion-by-criterion analysis
- **Inline Document Processing:** PDFs and images processed as base64 payloads — no extraction step, no preprocessing
- **Structured JSON Output:** AI returns verdicts, confidence scores, and criterion-specific notes in a deterministic schema

### 📋 Full Tender Workflow
1. **Step 1:** Upload tender document + reference details
2. **Step 2:** Upload bid documents for one or more bidders (click-or-drag upload)
3. **Step 3:** Review 6 KTPP evaluation criteria
4. **Step 4:** Run evaluation (real AI processes all bids sequentially)
5. **Step 5:** Review verdict dashboard with detailed findings
6. **Step 6:** Resolve any manual-review flags via officer override
7. **Step 7:** Sign off evaluation with cryptographic audit lock

### 🎯 Intelligent Verdict Logic
- **Eligible:** All 4 mandatory criteria (C1–C4) pass
- **Ineligible:** Any mandatory criterion fails with confidence ≥80%
- **Manual Review:** Ambiguous findings (confidence <70%) routed to officer for resolution

### 📊 Verdict Dashboard
- Live bid table with verdict badges (Eligible / Ineligible / Manual Review)
- Criterion-level breakdown with AI confidence bars
- Kannada vendor names displayed alongside English (supports bilingual document analysis)
- Officer sign-off gate: locked until all manual-review bids are resolved
- Filtering by verdict type

### 🔐 Audit & Compliance
- **Immutable Audit Trail:** 12+ timestamped events per evaluation (AI verdict, officer overrides, sign-offs)
- **Cryptographic Hashes:** Each event sealed with SHA256
- **KTPP Act §13 & §14 Compliance:** Documented evidence extraction and decision rationale
- **Export:** KTPP Report with all verdicts, criteria scores, and officer certifications

### 🌍 Multilingual Support
- AI evaluation works across **Kannada and English** documents
- Extracts and displays vendor names in original script
- OCR-ready for future PDF parsing improvements

---

## The Evaluation Criteria

| ID | Criterion | Type | Threshold |
|----|-----------|------|-----------|
| C1 | Annual Turnover | Mandatory | ≥₹5 Crore for each of 3 consecutive years |
| C2 | ISO 9001:2015 Certification | Mandatory | Valid, current certificate |
| C3 | PWD Registration | Mandatory | Karnataka PWD Class I contractor |
| C4 | Prior Experience | Mandatory | ≥5 years in ₹10Cr+ road projects |
| C5 | GST Registration | Optional | Valid active GSTIN |
| C6 | Bonded Labour Compliance | Optional | BLS Abolition Act certificate |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite |
| **Routing** | React Router v7 (client-side SPA) |
| **Styling** | Tailwind CSS v4 + Lucide Icons |
| **State** | Context API (EvaluationStateContext, EvaluationWizardContext) |
| **AI Engine** | Gemma 4 31B-IT via Google Generative AI API |
| **Hosting** | Netlify (SPA rewrite to `/index.html`) |
| **Testing** | Vitest + React Testing Library |
| **Build** | Vite (esbuild) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Gemini API key (free tier available at [ai.google.dev](https://ai.google.dev))

### Installation

```bash
cd neethi-ai
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Warning:** This exposes your API key in the browser (Vite `VITE_` prefix). Fine for hackathons/prototypes; for production, proxy through a backend.

### Development

```bash
npm run dev
# Opens http://localhost:5173
```

### Testing

```bash
npm test                # Run all tests once
npm run test:watch     # Run with file watching
```

---

## Quick Demo Flow (5 minutes)

1. **Land on `/`** → Click "Open Demo" → Officer Dashboard
2. **Click "New Evaluation"** → Wizard: upload tender document
3. **Upload bids** → Upload PDF for 2+ bidders
4. **Confirm criteria** → Review 6 criteria → Start Evaluation
5. **Processing** → Live queue shows each bid being evaluated by AI
6. **View Results** → VerdictDashboard shows AI verdicts + confidence scores
7. **Resolve Manual Review** → Select officer override + notes → Submit
8. **Sign Off** → Check confirmation → Evaluation locked with audit seal

**Test Files:** See `/demo-assets/` for sample bid PDFs and form field templates.

---

## Project Structure

```
src/
├── pages/
│   ├── wizard/                    # Evaluation wizard (Steps 1–3)
│   │   ├── Step1UploadTender.jsx
│   │   ├── Step2UploadBids.jsx
│   │   ├── Step3ConfirmCriteria.jsx
│   │   ├── EvaluationInProgress.jsx   # Real AI evaluation loop
│   │   └── EvaluationSignOff.jsx
│   ├── VerdictDashboard.tsx           # Results + bid detail screens
│   ├── BidDetailsEligible.jsx
│   ├── BidDetailsIneligible.jsx
│   ├── BidDetailsManualReview.jsx     # Officer override form
│   ├── AuditTrail.tsx                 # Immutable event log
│   ├── KtppReport.tsx                 # Export report
│   └── ...
├── context/
│   ├── EvaluationWizardContext.tsx    # Stores tender + bid files
│   ├── EvaluationStateContext.tsx     # Stores AI verdicts + officer resolutions
│   └── ...
├── lib/
│   └── geminiEvaluator.ts             # AI API client (Gemma 4 31B-IT)
├── data/
│   └── mockData.ts                    # Fallback schema (if accessed directly)
└── components/
    └── TopNavActions.jsx               # Shared nav (notifications, help, user)
```

---

## How AI Evaluation Works

### The Flow

```
EvaluationInProgress.jsx
  → For each bidder:
    → Read File from context
    → FileReader → base64 encode
    → geminiEvaluator.evaluateBid()
      → Gemma 4 31B-IT API call
      → PDF as inlineData (mimeType: application/pdf)
      → Structured prompt (6 criteria definitions)
      → Parse JSON response
    → Store result in EvaluationStateContext
    → Update progress bar + queue table (live)
  → Redirect to VerdictDashboard
  → VerdictDashboard reads realBids from context
```

### The Prompt

The AI receives:
- **Input:** PDF content (base64) + structured criteria definitions
- **Output Schema:** JSON with `verdict`, `confidence`, per-criterion `status`/`confidence`/`note`, and `failReasons`
- **Temperature:** 0.1 (deterministic, not creative)
- **Response Format:** `application/json` (structured output)

### Why Real Evaluation Matters

- **No Simulation:** Actual AI processes actual bid documents
- **Deterministic Schema:** Same verdict structure every run (testable, auditable)
- **Confidence Scoring:** AI assigns 0–100 confidence per criterion — used for sign-off gates
- **Evidence Citations:** AI extracts brief notes explaining each verdict (displayed in UI)

---

## Testing

**All 33 tests passing:**

```bash
npm test
```

### Test Coverage

| Module | Tests | Focus |
|--------|-------|-------|
| `geminiEvaluator.test.ts` | 6 | API calls, PDF encoding, response parsing, error handling |
| `evaluationStateContext.test.tsx` | 5 | State management, resolveReview, setRealBids |
| `mockData.test.ts` | 11 | Schema integrity, verdict distribution, criteria validation |
| `verdictDashboard.test.tsx` | 11 | Verdict display, filters, sign-off gates, bulk actions |

---

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | LandingPage | Entry point |
| `/dashboard` | OfficerDashboard | Active evaluations |
| `/evaluation/new/step1` | Step1UploadTender | Tender upload |
| `/evaluation/new/step2` | Step2UploadBids | Bid uploads |
| `/evaluation/new/step3` | Step3ConfirmCriteria | Criteria review |
| `/evaluation/:id/processing` | EvaluationInProgress | AI evaluation (live) |
| `/evaluation/:id` | VerdictDashboard | Verdict view + resolution |
| `/bid/:bidId/eligible` | BidDetailsEligible | Eligible bid detail |
| `/bid/:bidId/ineligible` | BidDetailsIneligible | Ineligible bid detail |
| `/bid/:bidId/manual-review` | BidDetailsManualReview | Officer override form |
| `/evaluation/:id/signoff` | EvaluationSignOff | Sign-off & lock |
| `/audit/:evaluationId` | AuditTrail | Event log |
| `/report/:evaluationId` | KtppReport | KTPP-format export |
| `/audit-log/search` | AuditLogSearch | Search past evaluations |
| `/admin/users` | UserManagement | Officer accounts |

---

## Deployment

### Netlify (Current)
- Live at: [https://shiny-piroshki-8c98b3.netlify.app/](https://shiny-piroshki-8c98b3.netlify.app/)
- SPA rewrite: `/` → `index.html` (handled by `vercel.json`)
- Environment variable: Set `VITE_GEMINI_API_KEY` in Netlify dashboard

### Build & Preview
```bash
npm run build              # Vite → dist/
npm run preview            # Local preview of production build
```

---

## Compliance & Standards

- **KTPP Act 2000, Sections 13–14:** Transparent, documented bid evaluation
- **Cryptographic Audit:** SHA256 event hashing
- **Bilingual:** Kannada + English document support
- **Accessibility:** Keyboard navigation, semantic HTML, ARIA labels

---

## Known Limitations & Future Work

- **PDF Parsing:** Currently sends full PDF to AI; future: extract text with pdfjs-dist for cost optimization
- **Authentication:** No login (demo mode); production requires OAuth/SSO
- **Database:** In-memory context only; production requires PostgreSQL + backend API
- **Multi-Tender:** Currently single-tender session; future: tender search & management
- **Real File Storage:** Uploads held in memory; future: cloud storage (S3, GCS)

---

## Support & Questions

For documentation, issues, or feedback:
- **Documentation:** See `/WALKTHROUGH.md` for full demo script
- **Tests:** Run `npm test` for unit test suite
- **API Reference:** See `src/lib/geminiEvaluator.ts` for AI integration details

---

**Built with ❤️ for the Government of Karnataka | CRPF Hackathon 2024**
