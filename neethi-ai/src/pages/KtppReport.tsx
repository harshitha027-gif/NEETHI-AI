import { useNavigate } from 'react-router-dom'
import {
  Scale, ArrowLeft, Download, Pencil,
  CheckCircle2, XCircle, AlertTriangle,
} from 'lucide-react'
import { TENDER, BIDS, CRITERIA, CURRENT_USER, AUDIT_TRAIL } from '../data/mockData'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'
import { useI18n } from '../context/I18nContext'

const REQUIRED_MAP: Record<string, string> = {
  C1: '₹5 Crore/year (3 consecutive years)',
  C2: 'Valid ISO 9001:2015 certificate',
  C3: 'Valid Karnataka PWD Class I registration',
  C4: '≥5 years, ≥₹10 Crore road projects',
  C5: 'Valid GSTIN (active)',
  C6: 'BLS Abolition Act compliance certificate',
}

const KTPP_RULE: Record<string, string> = {
  C1: 'KTPP Rule 17(3)(a)',
  C2: 'KTPP Rule 17(3)(b)',
  C3: 'KTPP Section 14(2)(c)',
  C4: 'KTPP Rule 17(3)(d)',
  C5: 'KTPP Rule 17(4)(a)',
  C6: 'KTPP Rule 17(4)(b)',
}

function OfficialSeal() {
  return (
    <div className="w-24 h-24 rounded-full border-4 border-double border-[#1A2E4A] flex flex-col items-center justify-center gap-0.5 select-none">
      <span className="text-[5.5px] font-black text-[#1A2E4A] uppercase tracking-widest text-center leading-tight">NEETHI AI</span>
      <Scale className="w-5 h-5 text-[#1A2E4A]" />
      <span className="text-[5px] font-bold text-[#1A2E4A] uppercase tracking-widest text-center leading-tight">KTPP COMPLIANT</span>
      <span className="text-[5px] font-bold text-[#1A2E4A] uppercase tracking-widest text-center leading-tight">SECTIONS 13 &amp; 14</span>
    </div>
  )
}

const TOP_NAV = [
  { key: 'topnav.dashboard', path: '/dashboard',        match: 'dashboard' },
  { key: 'topnav.analytics', path: '/analytics',        match: 'analytics' },
  { key: 'topnav.auditLog',  path: '/audit-log/search', match: 'audit'     },
]

const NUM_WORDS = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen']

export default function KtppReport() {
  const navigate = useNavigate()
  const { t } = useI18n()

  const eligible   = BIDS.filter(b => b.verdict === 'eligible')
  const ineligible = BIDS.filter(b => b.verdict === 'ineligible')
  const review     = BIDS.filter(b => b.verdict === 'review')

  const lastEvent   = AUDIT_TRAIL[AUDIT_TRAIL.length - 1]
  const signerEvent = AUDIT_TRAIL.find(e => e.action.includes('Signed')) ?? lastEvent
  const reportRef   = `KTPP/AI/2024/REP-${TENDER.evaluationId.replace('EVAL-', '')}`
  const systemHash  = `${lastEvent.hash.toUpperCase()}-NEETHI-AI`

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter']">

      {/* ── NAV ── */}
      <header className="print:hidden flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Scale className="w-5 h-5 text-[#021934]" />
          NEETHI AI
        </div>

        <div className="flex items-center gap-6 h-full">
          <nav className="hidden md:flex gap-6 h-full items-center">
            {TOP_NAV.map(item => (
              <a
                key={item.key}
                href="#"
                onClick={e => { e.preventDefault(); navigate(item.path) }}
                className="h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <TopNavActions>
          <div className="text-right hidden sm:block mr-2">
            <p className="text-sm font-bold text-slate-900 leading-none">{CURRENT_USER.name}</p>
            <p className="text-[10px] uppercase text-slate-500 tracking-tight mt-0.5">
              {CURRENT_USER.department} · {CURRENT_USER.role}
            </p>
          </div></TopNavActions>
        </div>
      </header>

      <div className="flex flex-1">

        <div className="print:hidden">
          <AppSidebar />
        </div>

        {/* ── MAIN ── */}
        <main className="flex-1 px-10 py-8 pb-20 print:p-0 print:bg-white">

          {/* Controls Bar */}
          <div className="print:hidden flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/evaluation/${TENDER.evaluationId}`)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Evaluation
              </button>
              <div className="h-5 w-px bg-slate-300" />
              <span className="text-slate-500 text-xs italic">
                KTPP-compliant report · {TENDER.id}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all rounded">
                <Pencil className="w-3.5 h-3.5" /> Edit Content
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#021934] text-white px-6 py-2 font-bold text-sm hover:bg-[#1A2E4A] active:scale-95 transition-all rounded"
              >
                <Download className="w-3.5 h-3.5" /> Download as PDF
              </button>
            </div>
          </div>

          {/* ── REPORT CANVAS ── */}
          <div className="max-w-[850px] mx-auto bg-white border border-slate-200 p-14 print:border-0 print:p-10 print:max-w-none">

            {/* LETTERHEAD */}
            <div className="flex flex-col items-center text-center mb-10 border-b-2 border-slate-900 pb-8">
              <div className="w-16 h-16 mb-3 rounded-full bg-[#1A2E4A] flex items-center justify-center">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none mb-0.5">
                Government of Karnataka
              </h2>
              <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider mb-3">
                Karnataka Road Infrastructure Development Corporation
              </h3>
              <div className="flex flex-col text-[10px] text-slate-600 uppercase font-bold tracking-tight gap-0.5">
                <span>Room No. 402, 4th Floor, Vikasa Soudha, Bengaluru – 560 001</span>
                <span>Tel: 080-2203-XXXX · Email: procurement@kridcl.karnataka.gov.in</span>
              </div>
            </div>

            {/* REPORT HEADING */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-0.5 uppercase tracking-tight">
                  Technical Evaluation Report
                </h4>
                <p className="text-xs text-slate-600">
                  Pursuant to Sections 13 &amp; 14 of the KTPP Act, 1999 (as amended 2000)
                </p>
              </div>
              <div className="text-right text-xs space-y-1">
                <div className="flex justify-end gap-2">
                  <span className="font-bold text-slate-500 uppercase">Report Ref:</span>
                  <span className="font-mono font-bold text-slate-900">{reportRef}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="font-bold text-slate-500 uppercase">Evaluation:</span>
                  <span className="font-mono text-slate-900">{TENDER.evaluationId}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="font-bold text-slate-500 uppercase">Date:</span>
                  <span className="text-slate-900">March 11, 2024</span>
                </div>
              </div>
            </div>

            {/* SECTION I */}
            <section className="mb-10">
              <h5 className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#1A2E4A] mb-4">
                I. Tender Identification
              </h5>
              <div className="grid grid-cols-2 gap-y-4 border border-slate-200 p-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Tender ID</span>
                  <span className="font-semibold font-mono">{TENDER.id}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Description</span>
                  <span className="font-semibold">{TENDER.title}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Procuring Entity</span>
                  <span className="font-semibold">{TENDER.department}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Estimated Value</span>
                  <span className="font-semibold">{TENDER.estimatedValue}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Evaluation Officer</span>
                  <span className="font-semibold">{CURRENT_USER.name}, {CURRENT_USER.role}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Total Bids Received</span>
                  <span className="font-semibold">
                    {TENDER.totalBids} ({NUM_WORDS[TENDER.totalBids]}) Bids
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION II */}
            <section className="mb-10">
              <h5 className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#1A2E4A] mb-4">
                II. Summary of Evaluation Verdicts
              </h5>

              <div className="grid grid-cols-3 border border-slate-200 mb-4">
                <div className="flex flex-col items-center py-3 border-r border-slate-200">
                  <span className="text-2xl font-black text-green-700">{eligible.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Auto-Eligible</span>
                </div>
                <div className="flex flex-col items-center py-3 border-r border-slate-200">
                  <span className="text-2xl font-black text-red-700">{ineligible.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Ineligible</span>
                </div>
                <div className="flex flex-col items-center py-3">
                  <span className="text-2xl font-black text-amber-600">{review.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Manual Review</span>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-200 text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px] w-10">#</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">Bidder Name</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">Bid Amount</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">AI Confidence</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">KTPP Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {BIDS.map((bid, i) => (
                    <tr key={bid.id} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                      <td className="border border-slate-200 p-2.5 text-slate-500 font-mono text-xs">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="border border-slate-200 p-2.5">
                        <span className="font-semibold">{bid.vendorName}</span>
                        {bid.vendorNameKannada && (
                          <span className="block text-[10px] text-slate-400">{bid.vendorNameKannada}</span>
                        )}
                      </td>
                      <td className="border border-slate-200 p-2.5 font-mono text-xs">{bid.bidAmount}</td>
                      <td className="border border-slate-200 p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                bid.verdict === 'eligible'   ? 'bg-green-500' :
                                bid.verdict === 'ineligible' ? 'bg-red-500'   : 'bg-amber-400'
                              }`}
                              style={{ width: `${bid.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono tabular-nums">{bid.confidence}%</span>
                        </div>
                      </td>
                      <td className="border border-slate-200 p-2.5">
                        {bid.verdict === 'eligible' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-700 text-white text-[10px] font-bold rounded-sm">
                            <CheckCircle2 className="w-2.5 h-2.5" /> AUTO-ELIGIBLE
                          </span>
                        )}
                        {bid.verdict === 'ineligible' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-700 text-white text-[10px] font-bold rounded-sm">
                            <XCircle className="w-2.5 h-2.5" /> INELIGIBLE
                          </span>
                        )}
                        {bid.verdict === 'review' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-sm">
                            <AlertTriangle className="w-2.5 h-2.5" /> MANUAL REVIEW
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* SECTION III */}
            <section className="mb-10">
              <h5 className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#1A2E4A] mb-4">
                III. Ineligibility Citations (Non-Compliance)
              </h5>
              <div className="space-y-6">
                {ineligible.map(bid => {
                  const reasons = (bid as { failReasons?: { criterionId: string; criterion: string; finding: string; confidence: number }[] }).failReasons ?? []
                  return (
                    <div key={bid.id} className="border border-slate-200 overflow-hidden">
                      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold flex justify-between items-center">
                        <span>Bidder: {bid.vendorName.toUpperCase()}</span>
                        <span className="text-red-300">Disqualified · KTPP Section 14(2)</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {reasons.map(fr => (
                          <div key={fr.criterionId} className="p-4">
                            <div className="grid grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Criterion</p>
                                <p className="text-xs font-semibold">{fr.criterion}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5">{fr.criterionId}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">Required</p>
                                <p className="text-xs font-semibold">{REQUIRED_MAP[fr.criterionId]}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">AI Confidence</p>
                                <p className="text-xs font-bold text-red-700">{fr.confidence}%</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">KTPP Rule</p>
                                <p className="text-xs font-semibold">{KTPP_RULE[fr.criterionId]}</p>
                              </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-l-2 border-red-400 text-[11px] text-slate-700 italic leading-relaxed">
                              "AI Finding: {fr.finding}"
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* SECTION IV */}
            <section className="mb-10">
              <h5 className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#1A2E4A] mb-4">
                IV. Manual Review Resolutions
              </h5>
              <div className="border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-left font-bold uppercase text-[10px] border-r border-slate-200 w-1/4">Bidder</th>
                      <th className="p-3 text-left font-bold uppercase text-[10px] border-r border-slate-200">Flag / Issue</th>
                      <th className="p-3 text-left font-bold uppercase text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {review.map(bid => {
                      const flags = (bid as { reviewFlags?: { criterionId: string; criterion: string; flag: string; confidence: number }[] }).reviewFlags ?? []
                      return flags.map((rf, idx) => (
                        <tr key={`${bid.id}-${rf.criterionId}`} className={idx % 2 === 0 ? '' : 'bg-slate-50'}>
                          {idx === 0 && (
                            <td className="p-3 border-r border-slate-200 font-semibold align-top" rowSpan={flags.length}>
                              {bid.vendorName}
                              {bid.vendorNameKannada && (
                                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{bid.vendorNameKannada}</span>
                              )}
                              <span className="block text-[10px] font-mono text-slate-400 mt-1">{bid.id}</span>
                            </td>
                          )}
                          <td className="p-3 border-r border-slate-200 align-top">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                              {rf.criterion} ({rf.criterionId}) · OCR {rf.confidence}%
                            </p>
                            <p className="text-xs text-slate-700 italic leading-relaxed">"{rf.flag}"</p>
                          </td>
                          <td className="p-3 align-top">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-sm border border-amber-300">
                              <AlertTriangle className="w-2.5 h-2.5" /> PENDING OFFICER REVIEW
                            </span>
                          </td>
                        </tr>
                      ))
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION V */}
            <section className="mb-10">
              <h5 className="bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-900 uppercase tracking-widest border-l-4 border-[#1A2E4A] mb-4">
                V. Evaluation Criteria Applied
              </h5>
              <table className="w-full border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px] w-10">ID</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">Criterion</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">Type</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px]">Requirement</th>
                    <th className="border border-slate-200 p-2.5 text-left font-bold uppercase text-[10px] w-14">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((c, i) => (
                    <tr key={c.id} className={i % 2 === 1 ? 'bg-slate-50' : ''}>
                      <td className="border border-slate-200 p-2.5 font-mono text-slate-500">{c.id}</td>
                      <td className="border border-slate-200 p-2.5 font-semibold">{c.title}</td>
                      <td className="border border-slate-200 p-2.5">
                        <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-sm ${
                          c.type === 'Mandatory'
                            ? 'bg-[#1A2E4A] text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}>{c.type.toUpperCase()}</span>
                      </td>
                      <td className="border border-slate-200 p-2.5 text-slate-700">{c.description}</td>
                      <td className="border border-slate-200 p-2.5 text-center font-mono">{c.weight}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* SIGNATURE BLOCK */}
            <div className="mt-16 flex justify-between items-end border-t border-slate-200 pt-10">
              <div className="flex flex-col gap-1">
                <div className="w-40 h-px bg-slate-900 mb-2" />
                <p className="font-bold text-sm">System-Generated Timestamp</p>
                <p className="text-[10px] text-slate-500 font-mono">
                  {signerEvent.timestamp.replace('T', ' ')} IST
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Hash: {systemHash}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Audit Log: {TENDER.evaluationId} · {AUDIT_TRAIL.length} events
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <OfficialSeal />
                <div className="text-center">
                  <div className="w-36 h-px bg-slate-900 mb-2 mx-auto" />
                  <p className="font-bold text-sm">Digital Signature — Senior Officer</p>
                  <p className="text-xs text-slate-500">
                    {signerEvent.actor.replace(/\s*\(.*?\)/, '').trim()} (E-Sign verified)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(signerEvent.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="mt-10 text-[10px] text-slate-400 leading-relaxed text-justify italic border-t border-slate-100 pt-6">
              Disclaimer: This report has been generated with the assistance of NEETHI AI for the Karnataka Road
              Infrastructure Development Corporation. While data extraction is AI-assisted (MuRIL/IndicBERT +
              Tesseract v5 OCR), all final verdicts have been reviewed and electronically signed by the designated
              Procurement Officer in accordance with the Karnataka Transparency in Public Procurements (KTPP) Act,
              1999 and Rules, 2000. This document is legally admissible under Section 65B of the Indian Evidence Act.
            </div>
          </div>

          {/* Screen-only page footer */}
          <div className="print:hidden max-w-[850px] mx-auto mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Technical Evaluation Phase · {TENDER.evaluationId}</span>
            <span>NEETHI AI Security Protocol v4.2</span>
          </div>

        </main>
      </div>
    </div>
  )
}
