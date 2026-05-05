---
title: "Product Brief Distillate: NEETHI AI"
type: llm-distillate
source: "product-brief-NEETHI-AI.md"
created: "2026-05-04"
purpose: "Token-efficient context for downstream PRD creation"
---

# NEETHI AI — Detail Pack

## Core Identity
- Full name: Neural Evaluation Engine for Transparent & Honest Inquiry
- Tagline: "Justice Assured. Decision Clear."
- Origin: Built for CRPF Hackathon Theme 3 — AI-Based Tender Evaluation and Eligibility Analysis for Government Procurement
- Domain: Karnataka state government procurement / GovTech

## Problem Specifics
- Karnataka issues 3,000+ tenders/year; all bid evaluation is manual
- Evaluation takes 5–14 days per tender; target is <24 hours
- 68% of small/micro contractors submit docs in Kannada — often skipped by evaluators or legacy software → "silent disqualifications"
- 2,983 active procurement-related legal disputes in Karnataka High Court
- No criterion-by-criterion audit trail in current process → officers have personal legal exposure
- Manual delays create corruption opportunity (informal pressure during evaluation window)
- Governed by KTPP Act 2000 (Karnataka Transparency in Public Procurements Act); Sections 13 (Acceptance) and 14 (Rejection) define report requirements

## Solution Architecture
- 5-stage pipeline: Upload → Criteria Extraction → Bid Parsing → AI Matching → Report
- Criteria extraction: Claude (Anthropic) LLM reads English tender PDF, extracts Mandatory/Optional criteria
- OCR: Tesseract v5 (Kannada/English custom) + Google Vision API for tough scans
- NLP: MuRIL + IndicBERT for Kannada context; confidence-gated translation bridge Kannada→English for matching
- Backend: FastAPI (Python), PostgreSQL, React + Tailwind
- Audit: Append-only database (immutable decision log)
- Three-verdict engine: Auto-Confirmed Eligible (>90% confidence) / Auto-Flagged Ineligible (evidence-linked) / Manual Review (ambiguous cases escalated with specific flag)
- Silent disqualification is architecturally impossible — every low-confidence case is flagged for human review, never auto-rejected

## Technical Constraints & Considerations (captured, not yet resolved)
- Real-world Karnataka government scans are often blurry, low-res — OCR accuracy on actual corpus unvalidated; benchmarks needed before pilot
- State IT infrastructure runs on NIC (National Informatics Centre) stack — FastAPI/PostgreSQL/React needs to clear state IT security and hosting policy review before deployment
- DPDP Act (India's data privacy law) applies — tender submissions contain vendor financials, proprietary data; data residency and access control design required
- KTPP compliance review of generated reports must happen pre-pilot (not assumed)

## Open Questions / Unresolved Items
- **Liability framework**: If NEETHI incorrectly evaluates a bid and government loses a court case, who bears liability — officer, vendor, or government? Blocking question for adoption.
- **Government champion**: No internal Karnataka government sponsor named; procurement of NEETHI itself requires IT dept / Finance ministry / KTPP governing body approval — months of lead time
- **Pilot agency**: BBMP and PWD mentioned as targets but no MOU or pilot commitment exists; selection and legal approval is a prerequisite, not a product task
- **80% time reduction claim**: Asserted from projections, not pilot data — should be framed as target until validated
- **Officer change management**: Government adoption requires officer training and trust-building; no onboarding or change management plan defined

## Rejected Ideas / Non-Scope (don't re-propose for v1)
- Direct API integration with Karnataka e-Procurement portal → Phase 2 (requires portal-side cooperation and IT approval)
- Tulu, Kodava dialects → Phase 3
- Hindi, Tamil, Telugu → Phase 4 / national scale
- Contractor-facing portal → explicitly out of v1 scope
- Automated email/notification workflows → v1 out of scope

## Key Differentiators (for PRD positioning)
- Kannada as first-class input (not translation add-on) — core to the value prop
- Training data moat: Karnataka-specific evaluation corpus compounds with usage; long-term defensible advantage
- Court-ready evidence chain, not just a verdict — KTPP Sections 13/14 compliance baked in
- Human-in-the-loop design preserves officer accountability; not a fully autonomous system

## Target Users (detailed)
- **Primary**: Procurement evaluation committee officers at BBMP, PWD, district-level Karnataka agencies — high volume, time-pressured, often without Kannada reading support, personally exposed to legal challenges
- **Secondary**: Kannada-speaking small/micro contractors — currently structurally disadvantaged by language-blind evaluation; success = bids evaluated on merit
- **Tertiary**: Government legal and audit teams handling RTI, High Court challenges, procurement audits — success = retrievable evidence chain on demand

## Success Metrics (full list)
- Evaluation cycle: 14 days → <24 hours (80% target, unvalidated)
- Manual review escalation rate: <15%
- Zero silent disqualifications (all ineligible verdicts have document citations)
- KTPP compliance review passed pre-pilot
- Audit trail used successfully in at least one High Court case within 12 months
- Pilot agency first full cycle within 90 days of deployment
- Officer satisfaction ≥4/5 after 10 evaluations
- Measurable RTI reduction within pilot agency

## Hackathon Demo Decisions (National Level Submission)
- No auth/login for demo — judges go straight to pre-loaded Officer Dashboard
- No real database — hardcoded mock JSON with realistic Karnataka tender sample data
- No live OCR/LLM calls — verdicts pre-computed in mock data
- Deploy: pure static React + Tailwind → Vercel free tier (1-click GitHub deploy)
- Landing page pitches problem stats → "Open Demo" CTA → Officer Dashboard
- Post-hackathon production: FastAPI + PostgreSQL + NIC-hosted infrastructure

## Roadmap Phases
- Phase 1: Single Karnataka agency pilot
- Phase 2: All Karnataka agencies + e-Procurement portal API integration; covers ₹500+ Crore/year, 3,000+ tenders
- Phase 3: Tulu + Kodava language packs; deeper portal integration
- Phase 4: National — Hindi, Tamil, Telugu; GeM portal integration; CRPF central procurement

## Competitive Context (no web research available — user to validate)
- No specific competitor names provided by user
- Adjacent: NIC-built state procurement tools (typically basic, non-AI); KPMG/Deloitte GovTech advisory tools; GeM portal evaluation modules
- Key gap in all alternatives: no multilingual OCR + LLM evaluation pipeline; no three-verdict explainability; no KTPP-specific compliance output
