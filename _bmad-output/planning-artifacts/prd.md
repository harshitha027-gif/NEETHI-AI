---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-12-complete']
releaseMode: 'phased'
status: 'complete'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-NEETHI-AI.md'
  - '_bmad-output/planning-artifacts/product-brief-NEETHI-AI-distillate.md'
workflowType: 'prd'
briefCount: 2
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
classification:
  projectType: 'web_app + document_processing + decision_support_platform'
  domain: 'govtech (procurement subtype)'
  complexity: 'high'
  complexityDrivers:
    - 'OCR reliability — multilingual Kannada/English on low-quality government scans'
    - 'LLM reasoning correctness — criteria extraction errors cascade to all verdicts'
    - 'Regulatory compliance — KTPP Act shapes every design decision'
    - 'Audit trail as primary business object, not logging'
  projectContext: 'greenfield codebase, established domain'
  successMetric: 'Trust — procurement officer confidently signs off on AI recommendation'
  notes:
    - 'Explainability is a legal requirement, not a UX feature'
    - 'Audit trail is infrastructure — must be queried by auditors, survive migrations'
    - 'Stakeholders: procurement officers, auditors, CRPF leadership, vendor community'
    - 'Every recommendation must be translatable to non-technical user in Kannada or English'
---

# Product Requirements Document - NEETHI AI

**Author:** Harshitha
**Date:** 2026-05-04

## Executive Summary

NEETHI AI is a government procurement evaluation platform that automates Karnataka's tender bid assessment — replacing a manual, linguistically biased, legally indefensible process with a fast, multilingual, auditable one. The platform serves Karnataka government procurement officers who currently spend 5–14 days per tender applying criteria inconsistently across documents in two languages, producing no auditable record, and exposing themselves to personal legal liability in over 2,983 active High Court disputes. NEETHI AI compresses this to under 24 hours, eliminates language-driven disqualifications of Kannada-submitting contractors, and generates KTPP Act-compliant audit trails that constitute a court-ready evidence chain for every evaluation decision.

The system ingests English tender documents and multilingual bidder submissions (typed PDFs, scanned images, handwritten Kannada), extracts eligibility criteria via LLM, parses bidder documents via multilingual OCR (Kannada/English), and returns one of three verdicts per bid: Auto-Confirmed Eligible, Auto-Flagged Ineligible, or Routed to Manual Review. Every verdict is criterion-by-criterion, document-and-page cited, and immutably logged. Ambiguous cases are never silently rejected — they are escalated to human officers with a specific flag, preserving officer accountability while automating routine evaluation.

Target users: Karnataka government procurement evaluation committee officers (primary), Kannada-speaking small and micro contractors who submit in regional language (secondary beneficiary), government legal and audit teams (tertiary).

### What Makes This Special

Three capabilities working together, none replicated by existing tools:

1. **Kannada as first-class input.** Not a translation layer over an English-first system. Dedicated OCR pipeline (Tesseract v5 + Google Vision, Kannada-customized) and NLP models (MuRIL + IndicBERT) treat Kannada documents as primary inputs. Eliminates the structural bias that currently disqualifies qualified contractors based on document language, not bid merit.

2. **Explainability as legal infrastructure.** The three-verdict engine produces KTPP Act Sections 13/14-compliant reports with exact document citations, not a generic pass/fail score. When a contractor sues the government over a rejected bid, NEETHI provides the evidence chain. Explainability is the product, not a feature on top of it.

3. **Human-in-the-loop by design.** The Manual Review verdict path ensures low-confidence cases (blurry scans, ambiguous translations, conflicting dates) reach human officers with the specific issue flagged — never silently rejected. Officer accountability is preserved; only routine, high-confidence evaluations are automated.

Core insight: The real failure of Karnataka's current procurement evaluation is not speed — it is structural injustice (language bias) and legal indefensibility (no audit trail). Speed is a consequence of fixing those. A system that is fast but still biased or still legally opaque has not solved the problem.

## Project Classification

- **Project Type:** Web application + document processing pipeline + decision support platform
- **Domain:** GovTech — procurement subtype (KTPP Act 2000 compliance)
- **Complexity:** High — OCR reliability on low-quality multilingual scans; LLM reasoning correctness (extraction errors cascade); regulatory compliance embedded in every design decision; audit trail as primary business object
- **Project Context:** Greenfield codebase, established domain (existing institutional workflows, compliance frameworks, and stakeholder expectations)
- **Primary Success Metric:** Procurement officer trust — officer confidently signs off on AI-generated recommendation

## Success Criteria

### User Success

- Procurement officer completes full bid evaluation cycle using NEETHI within 24 hours (vs. current 5–14 days)
- Officer can explain and defend every AI verdict to a contractor or auditor without needing to re-examine source documents — verdict reports are self-contained
- Zero silent disqualifications: every Auto-Flagged Ineligible verdict includes at least one document-and-page citation per failed criterion
- Manual review escalation rate <15% — indicating the system handles the majority of bids with high confidence, routing only genuinely ambiguous cases to officers
- Officer satisfaction ≥4/5 after first 10 evaluations — trust benchmark, not just usability

### Business Success

- Pilot agency completes first full tender cycle within 90 days of deployment
- Measurable reduction in RTI filings related to evaluation outcomes within pilot agency within 6 months
- Government legal team successfully produces NEETHI audit trail in at least one High Court proceeding within 12 months of deployment
- Evaluation time reduction ≥80% (target; validated against pilot data, not assumed)

### Technical Success

- KTPP Act Sections 13 and 14 compliance verified by legal review before pilot go-live
- Append-only audit log survives data migration, backup, and disaster recovery scenarios without data loss or alteration
- LLM criteria extraction produces structured, evaluable output for ≥95% of submitted tender documents
- OCR pipeline routes to Manual Review (rather than producing incorrect verdicts) when document confidence is below threshold — failure mode is escalation, not wrong answer
- System handles concurrent evaluation of multiple tenders without performance degradation

### Measurable Outcomes

| Metric | Baseline | Target | Timeframe |
|--------|----------|--------|-----------|
| Evaluation cycle time | 5–14 days | <24 hours | Per tender, from pilot start |
| Manual review rate | 100% (all manual) | <15% | Pilot steady state |
| Silent disqualifications | Unknown (untracked) | 0 | Pilot duration |
| RTI filings (evaluation) | Baseline TBD at pilot agency | Measurable reduction | 6 months post-deployment |
| Officer satisfaction | N/A | ≥4/5 | After first 10 evaluations |
| High Court audit trail use | N/A | ≥1 case | 12 months post-deployment |

## Product Scope

### MVP — Minimum Viable Product

Everything needed to run a real, legally defensible evaluation end-to-end:

- English tender document ingestion and LLM-based criteria extraction (Mandatory/Optional classification)
- Kannada and English bidder document parsing — typed PDFs and scanned images (not handwritten, deferred to growth)
- Three-verdict engine: Auto-Confirmed Eligible / Auto-Flagged Ineligible / Manual Review with specific flag
- Per-criterion confidence scoring with document-and-page citations
- KTPP Act-compliant PDF report generation (Sections 13 and 14)
- Append-only audit log (immutable, queryable by case)
- Web UI: upload tender + bidder docs, view verdicts, sign off, download report
- Role-based access: procurement officer (primary), audit viewer (read-only)

### Growth Features (Post-MVP)

Features that make the system competitive and scalable beyond the pilot:

- Handwritten Kannada document parsing
- Direct API integration with Karnataka e-Procurement portal
- Batch processing — multiple tenders queued simultaneously
- Dashboard for agency-level analytics (evaluation volume, manual review rates, time savings)
- Notification workflows (email/SMS for manual review escalations)
- Multi-agency tenant support with isolated audit logs per agency

### Vision (Future)

- Tulu and Kodava regional dialect support (Phase 3)
- Hindi, Tamil, Telugu language packs for national scale (Phase 4)
- GeM (Government e-Marketplace) portal integration
- CRPF central procurement module
- Predictive analytics — flag tenders likely to generate disputes based on historical patterns
- Contractor-facing transparency portal (view evaluation status and citations)

## User Journeys

### Journey 1: Procurement Officer — Happy Path (Ravi, Senior Evaluation Officer, PWD Karnataka)

Ravi has been a procurement officer for 11 years. Last quarter, a contractor filed an RTI challenge against his committee's evaluation. He couldn't produce documentation of why the bid was rejected — it was a judgment call on a document he half-read. The case is still pending.

Today, he has 14 bids for a road construction tender. He opens NEETHI, uploads the tender PDF and all 14 bidder folders. The system asks him to confirm the tender name and agency — two clicks. He goes for lunch.

When he returns, the dashboard shows 11 green (Auto-Confirmed), 2 red (Auto-Flagged), 1 yellow (Manual Review). He clicks the first red bid. NEETHI shows: "Mandatory criterion failed — Minimum turnover ₹5 Crore not met. Bidder's audited statement (Page 3) shows ₹3.2 Crore." He sees the exact page, the exact number. He clicks approve on the 11 greens, reviews the 1 yellow (blurry stamp on experience certificate — he calls the contractor for a clearer copy), and signs off on the 2 reds with the citations already filled in.

Total time: 45 minutes active, 2 hours elapsed. The KTPP-compliant PDF is generated. If anyone challenges any decision, the evidence chain is already in the database, immutable.

**Requirements revealed:** Dashboard with verdict summary; per-bid verdict detail view; document viewer with page citation highlighting; bulk approve for high-confidence verdicts; sign-off workflow; report download.

---

### Journey 2: Procurement Officer — Edge Case (Lakshmi, District-Level Officer, Bidar)

Lakshmi works in a district office. The bids she receives are often photographs taken on a phone — contractors who don't have scanners. One bid contains a Kannada GP resolution that's slightly blurry, and an experience letter with a bilingual stamp that's partially cut off.

NEETHI processes these and routes both documents to Manual Review with specific flags: "OCR confidence 61% on Page 2 — possible date conflict in experience letter" and "Stamp partially occluded — Kannada text unverifiable." NEETHI does not reject the bid. It tells Lakshmi exactly what it couldn't read and why.

Lakshmi contacts the contractor, who submits a clearer photograph. She uploads the replacement document to the flagged bid. NEETHI re-processes only that document and returns a new verdict: Auto-Confirmed Eligible. The original flag, the replacement upload, and the new verdict are all logged in the audit trail with timestamps.

**Requirements revealed:** Re-upload flow for flagged documents; partial re-processing (not full re-evaluation); audit log captures replacement events; officer can add notes to manual review flags; contractor contact information visible on bid detail.

---

### Journey 3: Government Legal/Audit Team — Audit Trail Use (Priya, Legal Officer, Karnataka AG's Office)

Six months after NEETHI's pilot launch, a contractor files a writ petition in the Karnataka High Court challenging rejection of their bid for a BBMP drainage project. They claim the evaluation was arbitrary and discriminatory.

Priya receives the case file and opens NEETHI's audit interface. She searches by tender ID. Within seconds: full evaluation timeline, every criterion assessed, the bidder's exact documents parsed, confidence scores, the specific rule failed (ISO 9001 certification not found in submitted documents), and the page reference. She exports the KTPP Section 14 report generated at evaluation time — timestamped, immutable.

The court submission takes two hours instead of two weeks of file-hunting. The evidence chain is complete, unaltered, and traceable to the exact AI inference that produced the verdict.

**Requirements revealed:** Audit search by tender ID, bidder name, agency, date range; read-only audit viewer role; export KTPP-compliant report by case; immutable log with timestamp provenance; no edit/delete capability on any audit record.

---

### Journey 4: System Administrator — Agency Onboarding (Suresh, IT Officer, BBMP)

BBMP is the second agency to onboard NEETHI after the pilot. Suresh needs to configure BBMP's instance: add 8 procurement officers as users, set up the agency's tender categories, and verify that NEETHI's output format meets BBMP's internal record-keeping template.

He logs into the admin panel, creates the agency workspace, adds users by email with officer vs. audit-viewer roles, and runs a test evaluation with a sample tender and dummy bids. The test report generates correctly. He downloads it, checks it against BBMP's filing template, notes one field label mismatch, and submits a configuration request.

**Requirements revealed:** Admin panel with user management (add/remove/role assignment); agency workspace isolation; test evaluation mode (non-production); report template configuration or field mapping; admin audit log separate from evaluation audit log.

---

### Journey Requirements Summary

| Capability Area | Revealed By |
|----------------|-------------|
| Verdict dashboard (summary + drill-down) | Journey 1 |
| Document viewer with page citation highlighting | Journey 1 |
| Bulk approve for high-confidence verdicts | Journey 1 |
| Sign-off workflow + KTPP report download | Journey 1 |
| Re-upload flow for flagged documents | Journey 2 |
| Partial re-processing of single document | Journey 2 |
| Officer notes on manual review flags | Journey 2 |
| Audit search (tender ID, bidder, agency, date) | Journey 3 |
| Read-only audit viewer role | Journey 3 |
| Immutable log with timestamp provenance | Journey 3 |
| Admin panel: user management + role assignment | Journey 4 |
| Agency workspace isolation | Journey 4 |
| Test evaluation mode | Journey 4 |

## Domain-Specific Requirements

### Compliance & Regulatory

- **KTPP Act 2000** — Karnataka Transparency in Public Procurements Act is the primary legal constraint. All evaluation decisions must produce reports structured to Sections 13 (Acceptance) and 14 (Rejection). Compliance must be verified by legal review before pilot go-live — cannot be assumed from design intent alone.
- **DPDP Act (Digital Personal Data Protection Act, India)** — Tender submissions contain vendor financials, PAN/GST data, and proprietor details. Data residency must remain within India. Retention periods, access controls, and data subject rights must be defined before launch.
- **RTI Act** — Any evaluation record may be subject to a Right to Information request. The audit trail must be structured to produce RTI-responsive outputs (specific bid, specific criterion, specific decision) within the statutory 30-day window.
- **Government IT Security Policy** — Karnataka state systems operate under NIC (National Informatics Centre) hosting and security frameworks. Deployment architecture must clear state IT security review. Third-party cloud hosting requires explicit government approval.

### Technical Constraints

- **Audit immutability** — Append-only database for all evaluation decisions. No update or delete operations permitted on evaluation records. Schema must enforce this at the database level, not just application level.
- **Data residency** — All data (tender documents, bidder submissions, evaluation records) must be stored on servers physically located in India. No data may transit through foreign-hosted infrastructure.
- **Role-based access control** — Minimum roles: Procurement Officer (evaluate + sign off), Audit Viewer (read-only on completed evaluations), System Administrator (user management only, no evaluation access). Separation of duties: administrators cannot view evaluation content; evaluators cannot modify audit logs.
- **Session security** — Government users require session timeout, audit logging of login/logout events, and no persistent browser storage of evaluation data.
- **Availability** — Target 99.5% uptime during business hours. Degraded-mode behavior: if LLM is unavailable, system routes all bids to manual review rather than blocking the workflow.

### Integration Requirements

- **Phase 1 (Pilot):** Standalone — no integration with Karnataka e-Procurement portal. Officers upload documents manually.
- **Phase 2:** API integration with Karnataka e-Procurement portal for automated document ingestion. Integration design must account for NIC API standards and government API security requirements.
- **PDF generation** — KTPP-compliant reports must be generated in PDF/A format for archival compliance with Karnataka government record-keeping systems.

### Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| OCR produces wrong verdict on low-quality scan | Confidence threshold routing — below threshold escalates to manual review, never auto-decides |
| LLM criteria extraction misses a criterion | Human officer reviews extracted criteria list before evaluation begins (confirmation step) |
| Audit log tampered with | Append-only DB constraint + cryptographic hash chain on audit records |
| Government data breach | Data residency enforcement + encryption at rest and in transit + access audit logging |
| Officer over-relies on AI, stops verifying | UI design: Auto-Confirmed verdicts require explicit officer sign-off, not passive acceptance |
| KTPP compliance gap discovered post-launch | Legal review gate before pilot go-live; reports reviewed by Karnataka procurement legal team |

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Confidence-Gated Multilingual Verdict Engine**
No existing procurement evaluation tool treats Kannada as a first-class input language with a dedicated OCR + NLP pipeline. The novel pattern here is the confidence-gated verdict architecture: instead of forcing a binary pass/fail under uncertainty, NEETHI routes low-confidence cases to human review with a structured flag. This creates a graceful degradation path that is architecturally incapable of producing a silent disqualification — a failure mode that currently affects 68% of Kannada-submitting contractors. The combination of MuRIL/IndicBERT for regional language understanding with a confidence threshold routing system is not seen in any current GovTech procurement tool.

**2. Explainability-as-Legal-Infrastructure**
Most AI decision systems produce explainability as a UX feature — a human-readable summary alongside a verdict. NEETHI inverts this: the explainability output (criterion-by-criterion evidence chain with document-and-page citations) *is* the primary product artifact, and it is structured to meet a specific legal standard (KTPP Act Sections 13 and 14) rather than a general readability goal. The audit trail is the deliverable; the verdict is a summary of it. This framing — AI explainability as a court-ready legal instrument rather than a user interface element — is a novel approach in the GovTech evaluation space.

**3. Human-in-the-Loop as a Correctness Guarantee, Not a Safety Net**
Conventional human-in-the-loop AI design treats human review as a fallback for when the AI fails. NEETHI's three-verdict engine treats human review as a first-class verdict path for cases where AI *should not decide* — not because the AI broke, but because the input quality (blurry scan, ambiguous translation) makes any automated decision epistemically unjustified. This is a philosophical distinction with real architectural consequences: the system must detect and communicate its own epistemic limits, not just its errors.

### Market Context & Competitive Landscape

- No known competitor offers Kannada-first document parsing for Karnataka government procurement
- NIC-built state tools are English-only and produce no AI-driven evaluation logic
- GeM portal evaluation modules handle supplier registration, not bid document assessment
- CRPF Hackathon context indicates government appetite for AI-assisted procurement but no existing deployment at state level
- Web research unavailable in this session — competitive landscape should be validated against current GovTech market before pilot launch

### Validation Approach

| Innovation | Validation Method | Success Signal |
|-----------|-------------------|----------------|
| Kannada OCR accuracy | Benchmarked against labeled dataset of real Karnataka procurement docs | ≥85% field extraction accuracy on typed Kannada; ≥70% on scanned |
| Confidence threshold routing | Manual review of routed cases — what % were correctly flagged vs. could have been auto-decided? | <15% false escalation rate |
| KTPP compliance of generated reports | Legal review by Karnataka procurement law expert before pilot | Zero compliance findings from legal review |
| Three-verdict trust | Procurement officer signs off without overriding AI verdict | Officer override rate <20% on Auto-Confirmed verdicts |

### Risk Mitigation

| Innovation Risk | Mitigation |
|----------------|-----------|
| OCR accuracy insufficient on real government document corpus | Pilot with shadow evaluation (NEETHI runs parallel to manual process, results compared) before going live |
| LLM criteria extraction non-deterministic across runs | Pin model version; regression test extraction output against labeled tender set on every deployment |
| Legal review rejects KTPP report format | Engage Karnataka procurement legal team during design phase, not post-build |
| Government officers distrust AI verdicts and override everything | Start with Auto-Confirmed-only workflow; introduce Auto-Flagged only after officer trust is established |

## Hackathon Demo Deployment Notes

**Demo mode decisions (national hackathon submission):**
- No login/auth screen — judges enter directly to pre-loaded Officer Dashboard
- No database — all data is hardcoded JSON mock (realistic Karnataka tender + bids sample)
- No real OCR/LLM API calls — all verdicts pre-computed in mock data
- Stack: Pure static React + Tailwind SPA deployed to Vercel (free tier)
- No FastAPI backend for demo — all "API responses" are client-side mock JSON
- Landing page added: pitches NEETHI problem stats → "Open Demo" CTA → Officer Dashboard
- If judges ask about backend: "Core AI pipeline architected; demo uses representative data"

**Production architecture (post-hackathon):**
- FastAPI + PostgreSQL + NIC-hosted infrastructure (as specified below)

## Web Application Specific Requirements

### Project-Type Overview

NEETHI AI is a web application serving government procurement officers. Architecture: FastAPI backend + React frontend + PostgreSQL. Deployment model: government-hosted on NIC infrastructure (no cloud). Users: procurement officers at state and district agencies, typically with standard enterprise workstations running modern browsers.

### Browser Support Matrix

- Target: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No IE 11 or legacy browser support required
- Minimum screen resolution: 1024x768 (desktop workstations, no mobile-first design)
- Implication: Can use modern JavaScript features (ES2020+, fetch API, async/await without polyfills)

### Responsive Design

- Desktop-first design (procurement officers work on standard office workstations)
- Responsive layout for different screen sizes within desktop range (1024px—2560px)
- No mobile optimization required (government procurement work is office-based)
- Single-page forms can be split across multiple pages if needed for clarity

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Release Approach:** Phased delivery (Phase 1: Karnataka pilot → Phase 2: Karnataka scale-out → Phase 3/4: National expansion)
**MVP Approach:** Problem-solving MVP — prove NEETHI evaluates tenders legally defensibly and saves time in a real government agency before scaling
**MVP Team Requirements:** 6–8: 1 PM, 2 full-stack engineers, 1 frontend engineer, 1 QA, 1 procurement domain expert (pilot agency liaison), 1 legal/compliance reviewer

### MVP Feature Set (Phase 1 — Karnataka Pilot)

**Core user journeys supported:** Happy path (Ravi), edge case/re-upload (Lakshmi), audit trail retrieval (Priya)

**Must-have capabilities:**
- English tender PDF upload + LLM criteria extraction (Mandatory/Optional)
- Kannada and English bidder document parsing (typed PDFs + scanned images)
- Three-verdict engine with per-criterion citations (Auto-Confirmed / Auto-Flagged / Manual Review)
- KTPP Sections 13/14-compliant PDF report generation
- Append-only audit log (immutable)
- Web UI: upload → verdict dashboard → manual review handling → sign-off → report download
- Role-based access: Procurement Officer + Audit Viewer
- Confidence threshold routing (low confidence → Manual Review, not auto-reject)
- Document re-upload flow for flagged bids + partial re-processing

### Phase 2 (Post-Pilot — Karnataka Scale-Out)

- Multi-agency tenant isolation
- API integration with Karnataka e-Procurement portal
- Batch processing (multiple tenders queued)
- Agency-level analytics dashboard
- Notification workflows (email/SMS for manual review escalations)

### Phase 3 (Regional Expansion)

- Tulu and Kodava language packs
- Deeper e-Procurement portal integration

### Phase 4 (National Scale)

- Hindi, Tamil, Telugu language packs
- GeM portal integration
- CRPF central procurement module

### Risk Mitigation Strategy

| Risk | Mitigation | Gate |
|------|-----------|------|
| OCR accuracy insufficient | Shadow evaluation (parallel to manual) before go-live | ≥85% typed Kannada, ≥70% scanned before Phase 2 |
| LLM extraction non-deterministic | Pin API version; regression test on labeled tender set | Zero discrepancies on test set before Phase 2 |
| KTPP compliance gap | Legal review during design, not post-build | Legal sign-off required before pilot launch |
| Officer distrust of AI | Phase 1: Auto-Confirmed only; Auto-Flagged added Phase 2 | Officer override rate <20% before Phase 2 |
| Resource shortfall | Defer Phase 3 (dialects) to Year 2 | Phase 1-2 scope preserved |

## Functional Requirements

### Document Ingestion & Management

- FR1: Procurement Officer can upload an English tender PDF to initiate an evaluation session
- FR2: Procurement Officer can upload multiple bidder document packages (PDF, scanned image, photograph) for a single tender
- FR3: Procurement Officer can re-upload a replacement document for a specific flagged bid without re-uploading the entire submission
- FR4: System can parse and extract text from typed Kannada and English PDF documents
- FR5: System can parse and extract text from scanned Kannada and English document images
- FR6: System can assign a confidence score to each extracted field or document section

### Criteria Extraction & Matching

- FR7: System can extract all eligibility criteria from an English tender document and classify each as Mandatory or Optional
- FR8: Procurement Officer can review and confirm the extracted criteria list before evaluation begins
- FR9: System can match extracted bidder data against extracted tender criteria on a per-criterion basis
- FR10: System can generate a confidence score per criterion match

### Verdict Engine

- FR11: System can assign one of three verdicts to each bid: Auto-Confirmed Eligible, Auto-Flagged Ineligible, or Routed to Manual Review
- FR12: System can cite the exact document and page number for every criterion that produced an Ineligible verdict
- FR13: System can generate a specific flag describing why a bid was routed to Manual Review (e.g., "OCR confidence 61% on Page 2 — possible date conflict")
- FR14: System routes bids to Manual Review when document confidence falls below threshold — never auto-rejects on low confidence
- FR15: System can re-process a single re-uploaded document and update the verdict for that bid only

### Evaluation Workflow & Sign-Off

- FR16: Procurement Officer can view a verdict dashboard showing all bids for a tender with their verdict status
- FR17: Procurement Officer can drill into any bid to view per-criterion evaluation details and document citations
- FR18: Procurement Officer can bulk-approve all Auto-Confirmed Eligible bids in a single action
- FR19: Procurement Officer can add notes to a Manual Review flag before escalating or resolving
- FR20: Procurement Officer can sign off on an evaluation, producing a final locked verdict record
- FR21: Procurement Officer can download a KTPP Act-compliant PDF report (Sections 13 and 14) for any completed evaluation

### Audit Trail & Compliance

- FR22: System records every evaluation decision (verdict, confidence score, citations, timestamp) in an immutable append-only log
- FR23: System records document re-upload events with timestamps in the audit log
- FR24: Audit Viewer can search audit records by tender ID, bidder name, agency, and date range
- FR25: Audit Viewer can export the KTPP-compliant report for any completed evaluation by case ID
- FR26: System prevents any modification or deletion of audit log records
- FR27: System logs all login, logout, and sign-off events per user session

### User & Access Management

- FR28: System Administrator can create and manage user accounts within an agency workspace
- FR29: System Administrator can assign users to roles: Procurement Officer or Audit Viewer
- FR30: System Administrator can run a test evaluation with sample documents in a non-production mode
- FR31: System enforces role-based access: Procurement Officers cannot access audit admin; Audit Viewers cannot initiate or modify evaluations; Administrators cannot view evaluation content
- FR32: System enforces session timeout and clears evaluation data from browser on session end

### Agency & Multi-Tenancy (Phase 2)

- FR33: System Administrator can create isolated agency workspaces with separate audit logs
- FR34: System supports concurrent evaluation sessions across multiple agencies without data crossover
- FR35: Agency Administrator can configure tender category defaults for their workspace

---

## Non-Functional Requirements

### Performance

- Page load time ≤3 seconds on 10 Mbps government network connection
- Verdict dashboard (up to 20 bids) loads within 2 seconds of navigation
- Document upload supports files up to 100 MB; upload resumes on connection interruption
- Evaluation pipeline completes within 24 hours for a tender with up to 50 bidder packages
- System supports at least 10 concurrent officer sessions without performance degradation

### Security

- All data encrypted in transit (TLS 1.2+) and at rest (AES-256)
- All tender documents and bidder submissions stored on India-hosted servers only (data residency)
- Audit log enforced as append-only at database level — no application-layer bypass possible
- Cryptographic hash chain on audit records to detect tampering
- No evaluation data persisted in browser storage (sessionStorage/localStorage)
- All file uploads scanned for malware before ingestion into pipeline

### Reliability

- System availability ≥99.5% during government business hours (Mon–Sat, 9am–6pm IST)
- Degraded-mode behavior defined: if LLM API unavailable, all bids route to Manual Review — evaluation workflow does not block
- Degraded-mode behavior defined: if OCR pipeline unavailable, officer is notified and upload is queued for retry

### Scalability

- Phase 1 (pilot): Support 1 agency, up to 50 concurrent tenders, up to 500 bidder documents/month
- Phase 2 (Karnataka): Support 50+ agencies, up to 3,000 tenders/year, up to 50,000 bidder documents/year
- Evaluation pipeline scales horizontally — adding processing nodes does not require application changes

### Integration (Phase 2)

- REST API for Karnataka e-Procurement portal document ingestion — follows NIC API security standards
- API authentication: OAuth 2.0 or API key per NIC government standards
- Report export available in PDF/A format for archival compliance

### Performance Targets

- Page load time: <3 seconds on government network (typical 10 Mbps broadband)
- Verdict dashboard load (14 bids): <2 seconds
- Document upload: Resume-capable for large PDFs (tender can be 50+ MB)
- Backend evaluation pipeline: Complete within 24 hours (not real-time constraint; officers batch-process daily)

### Application Architecture

- **Deployment model**: Multi-Page App (MPA) — each major workflow (upload, review, sign-off, audit) is a separate page
- **Rationale**: Government IT security often prefers stateless page loads for auditability; session state is logged per page transition
- **Navigation**: Traditional links + form submissions; no client-side SPA routing
- **State management**: Server-side session; minimal client-side state (form inputs only)
- **API style**: RESTful endpoints per workflow step; each page POSTs back to server and reloads

### Accessibility

- **Current requirement: None specified** — No WCAG or Section 508 compliance mandate for pilot
- **Risk flag**: Government procurement is a public function; absent formal accessibility requirement, consider whether WCAG 2.1 Level AA should be a future add (Phase 2)
- **Note for later**: If contractor community challenges system for accessibility discrimination, this decision becomes a liability

### SEO

- Not applicable — internal government tool, no public web presence
- Robots.txt: Disallow all
