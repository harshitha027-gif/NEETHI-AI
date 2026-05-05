import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Scale, Bell, HelpCircle, Plus, LayoutDashboard, Gavel, FileText,
  BarChart2, ShieldCheck, Settings, LogOut, Download, PenLine,
  CheckCircle, XCircle, AlertTriangle, ChevronLeft, CheckSquare,
} from 'lucide-react'
import { BIDS, TENDER, CURRENT_USER } from '../data/mockData.ts'
import { useEvaluationState } from '../context/EvaluationStateContext'
import TopNavActions from '../components/TopNavActions'

type FilterKey = 'all' | 'eligible' | 'ineligible' | 'review'

const VERDICT_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  eligible:   { bg: 'bg-green-600',  text: 'text-white',      label: 'Eligible'       },
  ineligible: { bg: 'bg-[#ba1a1a]', text: 'text-white',      label: 'Ineligible'     },
  review:     { bg: 'bg-amber-500',  text: 'text-white',      label: 'Manual Review'  },
}

const VERDICT_ROW_BG: Record<string, string> = {
  eligible:   'hover:bg-slate-50',
  ineligible: 'bg-red-50/20 hover:bg-red-50',
  review:     'bg-amber-50/30 hover:bg-amber-50',
}

const CONFIDENCE_COLOR: Record<string, string> = {
  eligible:   'bg-green-500',
  ineligible: 'bg-[#ba1a1a]',
  review:     'bg-amber-500',
}

function keyFinding(bid: typeof BIDS[0]): { text: string; color: string } {
  if (bid.verdict === 'ineligible' && bid.failReasons && bid.failReasons.length > 0) {
    const f = bid.failReasons[0]
    return {
      text:  `${f.criterion}: ${f.finding.slice(0, 90)}…`,
      color: 'text-[#ba1a1a]',
    }
  }
  if (bid.verdict === 'review' && bid.reviewFlags && bid.reviewFlags.length > 0) {
    const f = bid.reviewFlags[0]
    return {
      text:  `${f.criterion}: ${f.flag.slice(0, 90)}…`,
      color: 'text-amber-700 font-medium',
    }
  }
  const passList = Object.entries(bid.criteria)
    .filter(([, c]) => c.status === 'pass')
  if (passList.length > 0) {
    const [key, c] = passList[0]
    return { text: `${key}: ${c.note}`, color: 'text-slate-600 italic' }
  }
  return { text: 'All mandatory criteria verified.', color: 'text-slate-600 italic' }
}

// Animated confidence bar
function ConfBar({ pct, verdict }: { pct: number; verdict: string }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setWidth(pct), 80)
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [pct])

  return (
    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden" ref={ref}>
      <div
        className={`h-full ${CONFIDENCE_COLOR[verdict] || 'bg-slate-400'} transition-all duration-700 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',        label: 'All'          },
  { key: 'eligible',   label: 'Eligible'     },
  { key: 'ineligible', label: 'Ineligible'   },
  { key: 'review',     label: 'Manual Review' },
]

const SIDEBAR_NAV = [
  { icon: LayoutDashboard, label: 'Overview',       active: false },
  { icon: Gavel,           label: 'Bid Evaluation', active: true },
  { icon: FileText,        label: 'Technical',      active: false },
  { icon: BarChart2,       label: 'Financial',      active: false },
  { icon: ShieldCheck,     label: 'Verdict',        active: false },
]

export default function VerdictDashboard() {
  const navigate = useNavigate()
  const { resolvedBids, realBids } = useEvaluationState()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [bulkApplied, setBulkApplied] = useState(false)

  const activeBids = (realBids && realBids.length > 0 ? realBids : BIDS) as typeof BIDS
  const filtered = activeBids.filter(b => filter === 'all' || b.verdict === filter)
  const counts = {
    eligible:   activeBids.filter(b => b.verdict === 'eligible').length,
    ineligible: activeBids.filter(b => b.verdict === 'ineligible').length,
    review:     activeBids.filter(b => b.verdict === 'review').length,
  }
  const pendingReview = activeBids.filter(b => b.verdict === 'review' && !resolvedBids.includes(b.id)).length

  return (
    <div className="min-h-screen bg-[#fbf9fb] font-['Inter'] text-[#1b1b1e] flex flex-col">
      {/* ── TOP BAR ── */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Scale className="w-5 h-5 text-[#021934]" />
          NEETHI AI
        </div>
        <nav className="hidden md:flex gap-6 h-full items-center">
          {['Dashboard', 'Tenders', 'Analytics', 'Audit Log'].map((item, i) => (
            <a
              key={item}
              href="#"
              onClick={e => { e.preventDefault(); if (i === 0) navigate('/dashboard'); else if (i === 1) navigate('/dashboard'); else if (i === 2) navigate('/analytics'); else if (i === 3) navigate('/audit-log/search') }}
              className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                i === 1
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <TopNavActions />
      </header>

      <div className="flex flex-1">

        {/* ── SIDEBAR ── */}
        <aside className="w-[260px] bg-slate-50 border-r border-slate-200 flex flex-col py-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          <div className="px-4 mb-6">
            <button onClick={() => navigate('/evaluation/new/step1')} className="w-full bg-[#1A2E4A] text-white py-2.5 px-4 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 hover:bg-[#021934] transition-all duration-150 rounded">
              <Plus className="w-4 h-4" /> New Evaluation
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {SIDEBAR_NAV.map(item => (
              <a
                key={item.label}
                href="#"
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
              <a
                key={item.label}
                href="#"
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
        <main className="flex-1 p-8 pb-24 overflow-x-hidden">

          {/* Page header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-widest">{TENDER.id}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest">{TENDER.evaluationDate}</span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="ml-2 flex items-center gap-1 text-[11px] font-bold text-[#1A2E4A] hover:underline uppercase tracking-widest"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
              </div>
              <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-slate-900 mt-1">
                {TENDER.title}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Status: <span className="font-bold">{TENDER.totalBids} Bids Evaluated</span> ·{' '}
                {TENDER.department}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => navigate(`/report/${TENDER.evaluationId}`)}
                className="px-4 py-2 bg-white border border-[#74777e] text-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors rounded"
              >
                <Download className="w-4 h-4" /> Download KTPP Report
              </button>
              <button
                disabled={pendingReview > 0}
                onClick={() => navigate(`/evaluation/${TENDER.evaluationId}/signoff`)}
                className={`px-4 py-2 bg-[#1A2E4A] text-white font-semibold text-sm flex items-center gap-2 rounded transition-all ${
                  pendingReview > 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#021934] active:scale-95'
                }`}
                title={pendingReview > 0 ? `Resolve ${pendingReview} manual review(s) before signing off` : 'Sign off evaluation'}
              >
                <PenLine className="w-4 h-4" /> Sign Off Evaluation
              </button>
            </div>
          </div>

          {/* Summary bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Eligible */}
            <div
              className="bg-white border border-slate-200 border-l-4 border-l-green-600 p-5 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setFilter('eligible')}
            >
              <div className="w-12 h-12 bg-green-50 rounded flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{String(counts.eligible).padStart(2, '0')}</h3>
                <p className="text-sm text-slate-600">Auto-Confirmed Eligible</p>
                <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest mt-2 block">System Validated</span>
              </div>
            </div>
            {/* Ineligible */}
            <div
              className="bg-white border border-slate-200 border-l-4 border-l-[#ba1a1a] p-5 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setFilter('ineligible')}
            >
              <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center text-[#ba1a1a] shrink-0">
                <XCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{String(counts.ineligible).padStart(2, '0')}</h3>
                <p className="text-sm text-slate-600">Auto-Flagged Ineligible</p>
                <span className="text-[10px] text-[#ba1a1a] font-bold uppercase tracking-widest mt-2 block">KTPP Violations Detected</span>
              </div>
            </div>
            {/* Review */}
            <div
              className="bg-white border border-slate-200 border-l-4 border-l-amber-500 p-5 flex items-start gap-4 cursor-pointer hover:shadow-sm transition-shadow"
              onClick={() => setFilter('review')}
            >
              <div className="w-12 h-12 bg-amber-50 rounded flex items-center justify-center text-amber-500 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900">{String(counts.review).padStart(2, '0')}</h3>
                <p className="text-sm text-slate-600">Manual Review Required</p>
                <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mt-2 block">
                  {pendingReview === 0 ? 'All Resolved ✓' : `${pendingReview} Pending`}
                </span>
              </div>
            </div>
          </div>

          {/* Table area */}
          <div className="bg-white border border-slate-200 rounded-sm">

            {/* Filters + bulk action */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 bg-slate-50/50">
              {/* Filter tabs */}
              <div className="flex border border-slate-200 p-1 bg-white rounded">
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-1.5 text-sm font-bold rounded-sm transition-all duration-150 ${
                      filter === f.key
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setBulkApplied(true)}
                className={`px-5 py-2 font-bold text-sm flex items-center gap-2 transition-all duration-200 rounded ${
                  bulkApplied
                    ? 'bg-green-50 border border-green-300 text-green-700 cursor-default'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                {bulkApplied ? 'All Eligible Approved ✓' : 'Bulk Approve All Eligible'}
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    {['Bidder Name', 'Verdict', 'Confidence', 'Key Finding', 'Action'].map(col => (
                      <th
                        key={col}
                        className={`p-4 text-[11px] font-bold uppercase tracking-widest text-slate-600 ${
                          col === 'Action' ? 'text-right' : ''
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filtered.map(bid => {
                    const vb = VERDICT_BADGE[bid.verdict]
                    const rowBg = VERDICT_ROW_BG[bid.verdict]
                    const finding = keyFinding(bid)
                    return (
                      <tr
                        key={bid.id}
                        className={`transition-colors ${rowBg}`}
                      >
                        <td className="p-4 font-bold text-slate-900">
                          <div>{bid.vendorName}</div>
                          {bid.vendorNameKannada && (
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">{bid.vendorNameKannada}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${vb.bg} ${vb.text}`}>
                            {vb.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <ConfBar pct={bid.confidence} verdict={bid.verdict} />
                        </td>
                        <td className={`p-4 text-xs max-w-xs ${finding.color}`}>
                          {finding.text}
                        </td>
                        <td className="p-4 text-right">
                          {bid.verdict === 'review' ? (
                            resolvedBids.includes(bid.id) ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-sm">
                                <CheckCircle className="w-3.5 h-3.5" /> Resolved
                              </span>
                            ) : (
                              <button
                                onClick={() => navigate(`/bid/${bid.id}/manual-review`)}
                                className="bg-[#1A2E4A] text-white px-3 py-1 text-xs font-bold rounded-sm hover:bg-[#021934] transition-colors"
                              >
                                Resolve
                              </button>
                            )
                          ) : bid.verdict === 'eligible' ? (
                            <button
                              onClick={() => navigate(`/bid/${bid.id}/eligible`)}
                              className="text-[#021934] font-bold text-sm hover:underline transition-colors"
                            >
                              View Details
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/bid/${bid.id}/ineligible`)}
                              className="text-[#021934] font-bold text-sm hover:underline transition-colors"
                            >
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">
                Showing {filtered.length} of {activeBids.length} bidders
              </span>
              <button
                onClick={() => navigate(`/audit/${TENDER.evaluationId}`)}
                className="text-xs font-bold text-[#021934] hover:underline"
              >
                View Full Audit Trail →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="fixed bottom-0 left-0 w-full h-10 flex items-center justify-between px-6 z-40 bg-slate-100 border-t border-slate-200">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          NEETHI AI · Karnataka GovTech · CRPF Hackathon 2024
        </p>
        <p className="text-[10px] text-slate-400">{TENDER.evaluationId}</p>
      </footer>
    </div>
  )
}
