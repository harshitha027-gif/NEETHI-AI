import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Scale, Bell, HelpCircle, LayoutDashboard, Gavel, FileText,
  BarChart2, ShieldCheck, Settings, LogOut, Plus,
  CheckCircle2, XCircle, AlertTriangle, ChevronRight,
  ChevronLeft as ChLeft, ChevronRight as ChRight,
  CheckCheck, ZoomIn, ZoomOut, Printer, Download,
} from 'lucide-react'
import { BIDS, CRITERIA, CURRENT_USER } from '../data/mockData.ts'
import TopNavActions from '../components/TopNavActions'

// ── Simulated document viewer data per criterion ──────────────────────────────
type DocData = {
  docName: string
  pages: number
  aiExtract: string
  rows: { label: string; value: string }[]
  sealLabel: string
}

const CRITERION_DOCS: Record<string, DocData> = {
  C1: {
    docName: 'AUDITED FINANCIAL STATEMENT FY2023-24',
    pages: 18,
    aiExtract: 'AI EXTRACTED: Annual Turnover verified across FY21–FY23',
    rows: [
      { label: 'Total Revenue FY23',  value: '₹ 12,40,00,000.00' },
      { label: 'Total Revenue FY22',  value: '₹ 10,10,00,000.00' },
      { label: 'Total Revenue FY21',  value: '₹  8,90,00,000.00' },
      { label: 'Net Profit FY23',     value: '₹  2,30,00,000.00' },
    ],
    sealLabel: 'Chartered Accountant Seal & Digital Signature Verified',
  },
  C2: {
    docName: 'ISO 9001:2015 QUALITY MANAGEMENT CERTIFICATE',
    pages: 3,
    aiExtract: 'AI EXTRACTED: Cert #IN-9001-2022-04471 · Valid till 2025-06',
    rows: [
      { label: 'Certificate No.',  value: 'IN-9001-2022-04471' },
      { label: 'Issued Date',      value: '2022-06-15' },
      { label: 'Valid Until',      value: '2025-06-14' },
      { label: 'Scope',            value: 'Road Construction & Civil Works' },
    ],
    sealLabel: 'Bureau Veritas Certification — Seal Verified',
  },
  C3: {
    docName: 'KARNATAKA PWD CLASS I CONTRACTOR REGISTRATION',
    pages: 5,
    aiExtract: 'AI EXTRACTED: Reg #KA-PWD-I-2019-0034 · Renewed 2024-01',
    rows: [
      { label: 'Registration No.', value: 'KA-PWD-I-2019-0034' },
      { label: 'Category',         value: 'Class I — Road Works' },
      { label: 'Issue Date',       value: '2019-03-12' },
      { label: 'Renewal Date',     value: '2024-01-10' },
    ],
    sealLabel: 'Dept. of Public Works Karnataka — Official Seal Verified',
  },
  C4: {
    docName: 'PRIOR EXPERIENCE CERTIFICATE',
    pages: 12,
    aiExtract: 'AI EXTRACTED: 7 Projects cited — avg. 9.2 Yrs experience',
    rows: [
      { label: 'Project Count (>₹10Cr)', value: '7 Projects' },
      { label: 'Avg Project Value',       value: '₹ 18.4 Crore' },
      { label: 'Years of Experience',     value: '9.2 Years' },
      { label: 'Latest Completion',       value: 'Feb 2024 · NH-206 Widening' },
    ],
    sealLabel: 'Client Certificates — Digital Signature Verified',
  },
  C5: {
    docName: 'GST REGISTRATION CERTIFICATE',
    pages: 2,
    aiExtract: 'AI EXTRACTED: GSTIN 29AACFR1234A1Z5 · Active Status',
    rows: [
      { label: 'GSTIN',           value: '29AACFR1234A1Z5' },
      { label: 'Registration Dt', value: '2018-07-01' },
      { label: 'Status',          value: 'ACTIVE' },
      { label: 'State',           value: 'Karnataka (29)' },
    ],
    sealLabel: 'GST Portal — Government of India — Verified',
  },
  C6: {
    docName: 'BONDED LABOUR COMPLIANCE CERTIFICATE',
    pages: 2,
    aiExtract: 'AI EXTRACTED: Cert #BLS-KA-2023-0891 · Valid',
    rows: [
      { label: 'Certificate No.',  value: 'BLS-KA-2023-0891' },
      { label: 'Issuing Authority', value: 'Dept. of Labour, Karnataka' },
      { label: 'Issue Date',       value: '2023-09-01' },
      { label: 'Valid Until',      value: '2026-08-31' },
    ],
    sealLabel: 'Labour Department Karnataka — Official Seal Verified',
  },
}

const CRITERION_LABELS: Record<string, string> = {
  C1: 'Annual Turnover',
  C2: 'ISO 9001:2015 Certification',
  C3: 'PWD Registration',
  C4: 'Prior Experience',
  C5: 'GST Registration',
  C6: 'Bonded Labour Compliance',
}

const CRITERION_TYPE: Record<string, string> = {
  C1: 'Mandatory', C2: 'Mandatory', C3: 'Mandatory', C4: 'Mandatory',
  C5: 'Optional',  C6: 'Optional',
}

type CritStatus = 'pass' | 'fail' | 'review'

const STATUS_ICON: Record<CritStatus, { icon: typeof CheckCircle2; color: string }> = {
  pass:   { icon: CheckCircle2, color: 'text-green-600' },
  fail:   { icon: XCircle,      color: 'text-[#ba1a1a]' },
  review: { icon: AlertTriangle, color: 'text-amber-500' },
}

const VERDICT_BADGE: Record<string, { bg: string; label: string }> = {
  eligible:   { bg: 'bg-green-600 text-white',      label: 'AUTO-CONFIRMED ELIGIBLE'   },
  ineligible: { bg: 'bg-[#ba1a1a] text-white',      label: 'AUTO-FLAGGED INELIGIBLE'   },
  review:     { bg: 'bg-amber-500 text-white',       label: 'MANUAL REVIEW REQUIRED'    },
}

const DOC_TABS: Record<string, string> = {
  C1: 'Balance Sheet', C2: 'ISO Certificate', C3: 'PWD Registration',
  C4: 'Experience Cert.', C5: 'GST Certificate', C6: 'BLS Compliance',
}

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: 'Overview',              active: false },
  { icon: Gavel,           label: 'Bid Evaluation',        active: true  },
  { icon: FileText,        label: 'Technical Review',      active: false },
  { icon: BarChart2,       label: 'Financial Assessment',  active: false },
  { icon: BarChart2,       label: 'Comparative Statement', active: false },
  { icon: ShieldCheck,     label: 'Award Decision',        active: false },
]

export default function BidDetails() {
  const { bidId } = useParams()
  const navigate  = useNavigate()
  const bid = BIDS.find(b => b.id === bidId) ?? BIDS[0]

  const criteriaKeys = Object.keys(bid.criteria)
  const [selectedKey, setSelectedKey] = useState(criteriaKeys[0])
  const [docPage, setDocPage]         = useState(1)
  const [approved, setApproved]       = useState(false)
  const [flagged, setFlagged]         = useState(false)

  const vb   = VERDICT_BADGE[bid.verdict]
  const doc  = CRITERION_DOCS[selectedKey] ?? CRITERION_DOCS['C1']
  const crit = bid.criteria[selectedKey as keyof typeof bid.criteria]

  const passCount = Object.values(bid.criteria).filter(c => c.status === 'pass').length
  const totalCount = Object.keys(bid.criteria).length

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] text-[#1b1b1e] flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Scale className="w-5 h-5 text-[#021934]" />
          NEETHI AI
        </div>

        <div className="flex items-center gap-6 h-full">
          <nav className="hidden md:flex gap-6 h-full items-center">
            {['Dashboard', 'Tenders', 'Analytics', 'Audit Log'].map((item, i) => (
              <a
                key={item}
                href="#"
                onClick={e => { e.preventDefault(); if (item === 'Dashboard') navigate('/dashboard'); else if (item === 'Tenders') navigate('/dashboard'); else if (item === 'Analytics') navigate('/analytics'); else if (item === 'Audit Log') navigate('/audit-log/search') }}
                className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  item === 'Tenders'
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <TopNavActions></TopNavActions>
        </div>
      </header>

      <div className="flex flex-1">

        {/* ── SIDEBAR ── */}
        <aside className="w-[260px] bg-slate-50 border-r border-slate-200 flex flex-col py-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          <div className="px-4 mb-6">
            <button className="w-full bg-[#1A2E4A] text-white py-2.5 px-4 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 hover:bg-[#021934] transition-all duration-150 rounded">
              <Plus className="w-4 h-4" /> New Evaluation
            </button>
          </div>
          <nav className="flex-1 px-3 space-y-0.5">
            {SIDEBAR_NAV.map(item => (
              <a key={item.label} href="#"
                onClick={e => { e.preventDefault(); if (item.label === 'Overview') navigate('/dashboard') }}
                className={`flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 ${
                  item.active
                    ? 'bg-slate-200 text-slate-900 border-l-4 border-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-l-4 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-3 pt-4 border-t border-slate-200 space-y-0.5">
            {[{ icon: Settings, label: 'Settings' }, { icon: LogOut, label: 'Logout' }].map(item => (
              <a key={item.label} href="#"
                onClick={e => { e.preventDefault(); if (item.label === 'Settings') navigate('/settings'); if (item.label === 'Logout') navigate('/') }}
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors border-l-4 border-transparent"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 p-8 pb-16 overflow-x-hidden">

          {/* Header banner */}
          <div className="mb-6 flex justify-between items-end bg-white p-6 border border-slate-200 rounded-sm">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">
                <button onClick={() => navigate('/dashboard')} className="hover:text-slate-900 transition-colors">Dashboard</button>
                <ChevronRight className="w-3 h-3" />
                <button onClick={() => navigate('/evaluation/EVAL-2024-001')} className="hover:text-slate-900 transition-colors">Verdict Dashboard</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900">{bid.vendorName}</span>
              </nav>

              <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-[#1b1b1e] mb-1">
                {bid.vendorName}
              </h1>
              {bid.vendorNameKannada && (
                <p className="text-slate-500 text-sm mb-3">{bid.vendorNameKannada}</p>
              )}

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 text-[12px] font-bold flex items-center gap-1.5 rounded-sm ${vb.bg}`}>
                  {bid.verdict === 'eligible'   && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {bid.verdict === 'ineligible' && <XCircle className="w-3.5 h-3.5" />}
                  {bid.verdict === 'review'     && <AlertTriangle className="w-3.5 h-3.5" />}
                  {vb.label}
                </span>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">AI Confidence Score</span>
                  <span className={`text-xl font-bold ${
                    bid.confidence >= 90 ? 'text-green-700' :
                    bid.confidence >= 70 ? 'text-amber-600' : 'text-[#ba1a1a]'
                  }`}>{bid.confidence}%</span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Bid Amount</span>
                  <span className="text-xl font-bold text-[#021934]">{bid.bidAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => navigate(`/audit/EVAL-2024-001`)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 transition-colors rounded-sm"
              >
                View Audit Log
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 transition-colors rounded-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> PDF Summary
              </button>
            </div>
          </div>

          {/* Split panel */}
          <div className="grid grid-cols-12 gap-5" style={{ height: '780px' }}>

            {/* ── LEFT: Criteria list ── */}
            <div className="col-span-5 flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-semibold text-slate-900">Criteria Evaluation</h3>
                <span className="text-xs font-bold text-slate-500 uppercase">
                  {passCount} OF {totalCount} PASSED
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {criteriaKeys.map(key => {
                  const c      = bid.criteria[key as keyof typeof bid.criteria]
                  const status = c.status as CritStatus
                  const si     = STATUS_ICON[status]
                  const Icon   = si.icon
                  const isSelected = key === selectedKey

                  return (
                    <div
                      key={key}
                      onClick={() => { setSelectedKey(key); setDocPage(1) }}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-slate-50 border-l-4 border-l-[#021934]'
                          : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${si.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-slate-900 truncate pr-2">
                              {CRITERION_LABELS[key]}
                            </span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold shrink-0 tabular-nums">
                              {c.confidence}% CONF.
                            </span>
                          </div>
                          <p className={`text-xs font-semibold mb-1.5 ${
                            status === 'pass'   ? 'text-green-700' :
                            status === 'fail'   ? 'text-[#ba1a1a]' : 'text-amber-700'
                          }`}>
                            {c.note}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {DOC_TABS[key]}
                            </span>
                            <span className={`font-bold ${
                              CRITERION_TYPE[key] === 'Mandatory'
                                ? 'text-[#ba1a1a]'
                                : 'text-slate-400'
                            }`}>
                              {CRITERION_TYPE[key]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Left panel actions */}
              <div className="p-4 border-t border-slate-200 bg-white flex gap-3 shrink-0">
                {bid.verdict === 'ineligible' ? (
                  <button
                    onClick={() => navigate(`/report/EVAL-2024-001`)}
                    className="flex-1 bg-[#1A2E4A] text-white font-bold py-3 px-4 rounded hover:bg-[#021934] transition-colors text-sm"
                  >
                    View Ineligible Evidence
                  </button>
                ) : bid.verdict === 'review' ? (
                  <>
                    <button
                      onClick={() => setApproved(true)}
                      className={`flex-1 font-bold py-3 px-4 rounded text-sm transition-colors ${
                        approved ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      {approved ? 'Marked Eligible ✓' : 'Resolve — Mark Eligible'}
                    </button>
                    <button
                      onClick={() => setFlagged(true)}
                      className={`flex-1 font-bold py-3 px-4 rounded border text-sm transition-colors ${
                        flagged ? 'border-red-300 bg-red-50 text-[#ba1a1a]' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {flagged ? 'Flagged Ineligible ✓' : 'Resolve — Mark Ineligible'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setApproved(true)}
                      className={`flex-1 font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm ${
                        approved ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-green-700 text-white hover:bg-green-800'
                      }`}
                    >
                      <CheckCheck className="w-4 h-4" />
                      {approved ? 'Approved ✓' : 'Approve This Bid'}
                    </button>
                    <button
                      onClick={() => setFlagged(true)}
                      className={`flex-1 font-bold py-3 px-4 rounded border text-sm transition-colors ${
                        flagged ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {flagged ? 'Flagged ✓' : 'Flag for Review'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── RIGHT: Document viewer ── */}
            <div className="col-span-7 flex flex-col bg-slate-200 border border-slate-300 rounded-sm overflow-hidden relative">

              {/* Document tabs */}
              <div className="flex bg-slate-200 border-b border-slate-300 overflow-x-auto shrink-0">
                {criteriaKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => { setSelectedKey(key); setDocPage(1) }}
                    className={`px-4 py-3 text-xs font-bold border-r border-slate-300 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                      key === selectedKey
                        ? 'bg-white text-[#021934]'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {DOC_TABS[key]}
                  </button>
                ))}
                <div className="flex-1" />
                <div className="flex items-center px-3 gap-3 border-l border-slate-300 shrink-0">
                  <span className="text-xs font-bold text-slate-600">
                    PAGE {docPage} / {doc.pages}
                  </span>
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => setDocPage(p => Math.max(1, p - 1))}
                      className="p-1 text-slate-600 hover:bg-slate-100 transition-colors rounded"
                    >
                      <ChLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDocPage(p => Math.min(doc.pages, p + 1))}
                      className="p-1 text-slate-600 hover:bg-slate-100 transition-colors rounded"
                    >
                      <ChRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Document canvas */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-500 flex justify-center">
                <div className="w-full max-w-xl bg-white shadow-2xl relative min-h-[680px] p-10">

                  {/* Doc header */}
                  <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Document — {bid.vendorName}</p>
                      <h4 className="text-base font-bold text-slate-900">{doc.docName}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Verification Hash</p>
                      <p className="text-[10px] font-mono text-slate-400">SHA256: 4f8e…9a1c</p>
                    </div>
                  </div>

                  {/* AI highlight box */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-100/40 border-2 border-blue-500 border-dashed rounded-sm pointer-events-none z-10" />
                    <div className="relative z-20 p-4">
                      <div className="space-y-2 text-slate-800 text-sm">
                        {doc.rows.map(row => (
                          <div key={row.label} className="grid grid-cols-2 border-b border-slate-100 pb-1.5">
                            <span className="font-bold text-slate-700">{row.label}</span>
                            <span className="text-right font-mono">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute -bottom-3 right-2 z-20">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {doc.aiExtract}
                      </span>
                    </div>
                  </div>

                  {/* Signature block */}
                  <div className="mt-10 pt-4">
                    <h5 className="text-xs font-bold border-b-2 border-slate-200 mb-4 uppercase text-slate-700 pb-1">
                      Authority Certification
                    </h5>
                    <div className="h-20 bg-slate-50 border border-slate-200 flex items-center justify-center border-dashed rounded-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">
                        {doc.sealLabel}
                      </span>
                    </div>
                  </div>

                  {/* Placeholder text lines */}
                  <div className="space-y-3 pt-8 mt-6">
                    {[1, 0.9, 1, 0.75, 0.85, 1].map((w, i) => (
                      <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${w * 100}%` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating toolbar */}
              <div className="absolute right-4 top-16 flex flex-col gap-2 z-10">
                {[
                  { icon: ZoomIn,  label: 'Zoom In'  },
                  { icon: ZoomOut, label: 'Zoom Out' },
                  { icon: Printer, label: 'Print'    },
                ].map(btn => (
                  <button
                    key={btn.label}
                    title={btn.label}
                    className="bg-white p-2.5 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <btn.icon className="w-4 h-4 text-slate-700" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="fixed bottom-0 left-0 w-full h-10 flex items-center justify-between px-6 z-40 bg-slate-100 border-t border-slate-200">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          NEETHI AI · Karnataka GovTech · CRPF Hackathon 2024
        </p>
        <p className="text-[10px] text-slate-400 font-mono">{bid.id}</p>
      </footer>
    </div>
  )
}
