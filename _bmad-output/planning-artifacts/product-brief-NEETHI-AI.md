---
title: "Product Brief: NEETHI AI"
status: "complete"
created: "2026-05-04"
updated: "2026-05-04"
inputs: ["user-provided project description and presentation slides"]
---

# Product Brief: NEETHI AI

*Neural Evaluation Engine for Transparent & Honest Inquiry*
*"Justice Assured. Decision Clear."*

---

## Executive Summary

Karnataka processes over 3,000 government tenders annually — yet the evaluation of every bid remains entirely manual. Procurement officers spend 5 to 14 days per tender sorting through stacks of documents in two languages, applying criteria inconsistently, and leaving no auditable trail. The result: 2,983 active legal disputes in the Karnataka High Court, Kannada-speaking small contractors systematically disqualified not because they failed criteria but because their documents were never read, and a delay-driven vacuum that creates conditions for procurement fraud.

NEETHI AI is an AI-powered tender evaluation platform that replaces this broken process with one that is fast, multilingual, and legally defensible. Procurement officers upload the tender and bidder documents; NEETHI extracts every eligibility criterion, reads every submitted document — including handwritten Kannada submissions — and returns a structured, evidence-linked verdict on each bid within 24 hours. Every decision is criterion-by-criterion, document-cited, and compliant with the KTPP Act 2000.

The platform is built for Karnataka's procurement landscape, with an immediate pilot targeting ₹500+ Crore in procurement value and a roadmap to national scale across central agencies and the GeM portal.

---

## The Problem

Karnataka has digitized tender *publishing* — but evaluation remains trapped in the past. Four compounding failures define the status quo:

**The Language Gap.** 68% of small and micro contractors submit supporting documents in Kannada — experience letters, GP resolutions, caste certificates. Evaluators who cannot read Kannada, or legacy software that ignores non-English documents, quietly skip them. Qualified contractors get disqualified not because they failed the criteria, but because their documents were never read. This is not a minor edge case — it is a structural bias against the contractors the system is meant to serve.

**Evaluator Inconsistency.** The same bid can be approved by one officer and rejected by another. Without a standardized, documented evaluation process, every decision is an individual judgment call. The consequence is 2,983 active legal disputes in the Karnataka High Court, most challenging evaluation outcomes — each representing legal cost, delayed procurement, and eroded public trust.

**The Audit Black Hole.** Current practice produces no criterion-by-criterion record of why a bid succeeded or failed. When a contractor files an RTI request or challenges a decision in court, the government cannot produce a coherent evidence chain. Officers bear personal exposure for decisions they made months earlier with no documentation.

**Delay-Driven Corruption.** A 14-day evaluation cycle is not just slow — it creates opportunity. Extended timelines under low-transparency conditions are historically correlated with informal pressure and procurement fraud.

---

## The Solution

NEETHI AI processes evaluations in five automated stages:

1. **Upload & Ingest** — Officer uploads the English tender PDF and all bidder submissions (typed PDFs, scanned images, or photographs).

2. **Criteria Extraction** — Claude LLM reads the tender document and extracts every eligibility rule, categorized as Mandatory or Optional (e.g., "₹5 Crore minimum turnover," "ISO certification required").

3. **Bid Parsing** — Multilingual OCR (Tesseract v5 + Google Vision API, customized for Kannada/English) reads bidder documents. MuRIL and IndicBERT models handle Kannada context and translation, including bilingual stamps and handwritten content.

4. **AI Matching** — The system compares extracted bidder data against extracted criteria, generating per-criterion confidence scores.

5. **Report & Audit Trail** — A legally compliant PDF report is generated with criterion-by-criterion findings, exact document-and-page citations, and full decision logging in an append-only database.

### The Three-Verdict Engine

Every bid receives one of three verdicts — not a generic pass/fail:

- ✅ **Auto-Confirmed Eligible** — All mandatory criteria met with >90% AI confidence. Officer reviews and signs.
- ❌ **Auto-Flagged Ineligible** — Clear evidence of mandatory criterion failure, with exact document and page citation.
- ⚠️ **Routed to Manual Review** — Ambiguous cases (blurry scan, conflicting dates, uncertain Kannada translation) are escalated to a human officer with the specific flag described. The AI never silently rejects on low confidence.

This design eliminates the silent disqualifications that currently harm Kannada-speaking contractors — the system is incapable of ignoring a document.

---

## What Makes This Different

**Multilingual by design, not by patch.** Existing procurement tools treat documents as English-first. NEETHI treats Kannada as a first-class input language, with a dedicated OCR pipeline and NLP models trained on Indian language corpora. This is not a translation add-on — it is the core capability.

**Explainability as a legal asset.** Most AI tools produce a verdict; NEETHI produces a court-ready evidence chain. Every AI decision is logged immutably, citations are document-linked, and reports are structured to comply with KTPP Act Sections 13 (Acceptance) and 14 (Rejection). When a contractor challenges an evaluation, NEETHI provides the government's defense.

**Human-in-the-loop where it counts.** The three-verdict system keeps human officers in control of genuinely ambiguous cases. Officer accountability is preserved; routine cases are automated; edge cases get human attention. This is a deliberate design choice, not a limitation.

**Training data moat.** Every tender processed adds to a Karnataka-specific evaluation corpus. The OCR models, confidence thresholds, and Kannada NLP fine-tuning improve with usage. After three years of Karnataka procurement history, this corpus cannot be replicated by any new entrant — it is the long-term defensible advantage.

---

## Who This Serves

**Primary: Karnataka Government Procurement Officers**
Evaluation committee members at agencies including BBMP, PWD, and district-level bodies. They process high volumes of tenders under time pressure, often without Kannada reading support. Success for them: evaluations that complete in hours, not days; decisions they can defend if challenged; reduced personal legal exposure from undocumented judgment calls.

**Secondary: Small and Micro Contractors**
Local contractors who submit bids in Kannada and are currently disadvantaged by language-blind evaluation. Success for them: bids evaluated on merit. No silent disqualifications due to document language.

**Tertiary: Government Legal and Audit Teams**
Teams handling RTI responses, High Court challenges, and procurement audits. Success for them: an immutable, retrievable evidence chain for every evaluation decision, reducing litigation exposure and audit preparation time.

---

## Success Criteria

**Operational**
- Evaluation cycle time: 14 days → under 24 hours (target: 80% reduction; to be validated against pilot data)
- Manual review rate: <15% of bids routed for human review
- Zero silent disqualifications in pilot — all ineligible verdicts include document-linked citations

**Legal / Compliance**
- All reports pass KTPP Act compliance review before pilot go-live
- Government legal team can produce NEETHI audit trail in High Court proceedings within 12 months of deployment

**Adoption**
- Pilot agency completes first full tender cycle using NEETHI within 90 days of deployment
- Procurement officer satisfaction score ≥4/5 after first 10 evaluations
- Measurable reduction in RTI filings related to evaluation outcomes within pilot agency

---

## Scope

**In for Version 1 (Pilot)**
- English tender document ingestion and criteria extraction via LLM
- Kannada and English bidder document parsing (typed PDFs and scanned images)
- Three-verdict evaluation engine with per-criterion confidence scoring
- KTPP-compliant PDF report generation with document citations
- Append-only audit log
- Web UI for procurement officer workflow (upload, review, sign-off)

**Out for Version 1**
- Direct API integration with Karnataka e-Procurement portal (Phase 2)
- Tulu, Kodava, and other regional dialect support (Phase 3)
- Hindi, Tamil, Telugu language packs (Phase 4)
- Automated notification workflows
- Contractor-facing portal or self-service
- Liability framework and formal government MOU (pre-requisite, not a product feature)

---

## Vision

NEETHI AI begins as Karnataka's procurement evaluation layer. In three years, it becomes India's standard for transparent public procurement.

**Phase 1–2 (Karnataka):** Pilot with one state agency, expand to all Karnataka agencies. Cover ₹500+ Crore in procurement value annually. Demonstrate measurable reduction in High Court procurement disputes and RTI volume.

**Phase 3 (Karnataka + dialects):** Tulu and Kodava language packs. Deeper integration with Karnataka e-Procurement portal API.

**Phase 4 (National):** Hindi, Tamil, Telugu language packs. Integration with GeM (Government e-Marketplace) and CRPF central procurement. Position as the evaluation intelligence layer for Digital India's procurement infrastructure.

The competitive moat compounds over time: the evaluation corpus, language-specific training data, and KTPP compliance logic accumulated through Karnataka operations make NEETHI progressively harder to displace — and progressively more valuable as a national standard.
