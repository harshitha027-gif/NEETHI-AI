import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  Scale, Search,
  Lock, Download, Share2, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, FileSpreadsheet,
} from 'lucide-react'
import { AUDIT_TRAIL, TENDER, CURRENT_USER } from '../data/mockData.ts'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'

// ── Hash QR: deterministic grid from SHA hash ─────────────────────────────────
function HashQR({ hash }: { hash: string }) {
  const hex = hash.replace(/[^0-9a-f]/gi, '').padEnd(100, '0').slice(0, 100)
  return (
    <div className="w-32 h-32 border-2 border-slate-900 p-1.5 bg-white inline-grid"
      style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '1px' }}>
      {hex.split('').map((c, i) => (
        <div
          key={i}
          className={parseInt(c, 16) > 7 ? 'bg-slate-900' : 'bg-white'}
        />
      ))}
    </div>
  )
}

// ── Event color coding ────────────────────────────────────────────────────────
type EventVariant = 'success' | 'warning' | 'default'

function getVariant(action: string): EventVariant {
  if (action.toLowerCase().includes('signed')) return 'success'
  if (action.toLowerCase().includes('complete') && action.toLowerCase().includes('ocr')) return 'default'
  if (action.toLowerCase().includes('verdict')) return 'success'
  if (action.toLowerCase().includes('re-upload') || action.toLowerCase().includes('reupload')) return 'warning'
  if (action.toLowerCase().includes('re-evaluation')) return 'warning'
  return 'default'
}

const VARIANT_DOT: Record<EventVariant, string> = {
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  default: 'bg-[#1A2E4A]',
}

const VARIANT_CARD: Record<EventVariant, { border: string; bg: string; timeColor: string }> = {
  success: { border: 'border-green-600', bg: 'bg-green-50',   timeColor: 'text-green-700' },
  warning: { border: 'border-amber-400', bg: 'bg-amber-50/60', timeColor: 'text-amber-700' },
  default: { border: 'border-slate-200', bg: 'bg-white',       timeColor: 'text-slate-500' },
}

function formatTs(ts: string) {
  // "2024-03-10T09:15:00" → "09:15 — MAR 10, 2024"
  const d = new Date(ts)
  const time = d.toTimeString().slice(0, 5)
  const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  return `${time} — ${date}`
}

const FULL_HASH = '8f12a9c3e4b5d6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1'

export default function AuditTrail() {
  const navigate     = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [query, setQuery]           = useState('')

  const filtered = AUDIT_TRAIL.filter(e =>
    query === '' ||
    e.action.toLowerCase().includes(query.toLowerCase()) ||
    e.actor.toLowerCase().includes(query.toLowerCase()) ||
    e.id.toLowerCase().includes(query.toLowerCase())
  )

  function toggle(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#fbf9fb] font-['Inter'] text-[#1b1b1e] flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer select-none" onClick={() => navigate('/')}>
          <Scale className="w-5 h-5 text-[#021934]" />
          NEETHI AI
        </div>

        <div className="flex items-center gap-6 h-full">
          <nav className="hidden md:flex gap-6 h-full items-center">
            {[
              { label: 'Dashboard', path: '/dashboard',        match: false },
              { label: 'Analytics', path: '/analytics',        match: false },
              { label: 'Audit Log', path: '/audit-log/search', match: true  },
            ].map(item => (
              <a
                key={item.label}
                href="#"
                onClick={e => { e.preventDefault(); navigate(item.path) }}
                className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  item.match
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <TopNavActions></TopNavActions>
        </div>
      </header>

      <div className="flex flex-1">
        <AppSidebar active="auditLog" />

        {/* ── MAIN ── */}
        <main className="flex-1 px-8 pt-8 pb-20 overflow-x-hidden">

          {/* Page header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#1A2E4A] text-white text-[12px] font-bold px-3 py-1 rounded-sm">
                  {TENDER.id}
                </span>
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                  LOG REF: {TENDER.evaluationId}
                </span>
              </div>
              <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-slate-900 mb-1">
                {TENDER.title}
              </h1>
              <p className="text-[#ba1a1a] font-bold text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                IMMUTABLE RECORD — This record cannot be modified.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors rounded-sm"
              >
                <Download className="w-4 h-4" /> EXPORT AS PDF/A
              </button>
              <button
                className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors rounded-sm"
              >
                <Share2 className="w-4 h-4" /> SHARE ACCESS
              </button>
            </div>
          </div>

          {/* Two-col grid */}
          <div className="grid grid-cols-12 gap-8">

            {/* ── LEFT: Timeline ── */}
            <div className="col-span-8">
              <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-6">
                Historical Chain of Custody
              </h3>

              {filtered.length === 0 && (
                <p className="text-slate-400 text-sm py-8 text-center">No events match "{query}"</p>
              )}

              <div className="relative pl-8 border-l-2 border-[#1A2E4A] ml-4 space-y-6">
                {filtered.map((event, idx) => {
                  const variant  = getVariant(event.action)
                  const dot      = VARIANT_DOT[variant]
                  const card     = VARIANT_CARD[variant]
                  const expanded = expandedId === event.id
                  const isLast   = idx === filtered.length - 1

                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[41px] top-1.5 w-4 h-4 ${dot} border-4 border-[#fbf9fb] rounded-full z-10`} />

                      {/* Card */}
                      <div
                        className={`border ${card.border} ${card.bg} p-4 rounded-sm cursor-pointer transition-colors hover:shadow-sm`}
                        onClick={() => toggle(event.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${card.timeColor}`}>
                              {formatTs(event.timestamp)}
                            </span>
                            <h4 className="font-bold text-slate-900 mt-0.5">{event.action}</h4>
                            <p className="text-slate-600 text-sm mt-1">{event.details}</p>

                            {/* Expanded detail */}
                            {expanded && (
                              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-3">
                                <div className="bg-white/60 p-2 border border-slate-200 rounded-sm">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Actor</span>
                                  <p className="text-sm font-mono text-slate-700 mt-0.5">{event.actor}</p>
                                </div>
                                <div className="bg-white/60 p-2 border border-slate-200 rounded-sm">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Block Hash</span>
                                  <p className="text-[11px] font-mono text-slate-500 mt-0.5 break-all">{event.hash}…{FULL_HASH.slice(-6)}</p>
                                </div>
                                <div className="col-span-2 bg-white/60 p-2 border border-slate-200 rounded-sm">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Event ID</span>
                                  <p className="text-sm font-mono text-slate-700 mt-0.5">{event.id} · Immutable · Append-Only</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="ml-3 shrink-0">
                            {variant === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {variant === 'warning'  && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                            {variant === 'default'  && (
                              expanded
                                ? <ChevronUp className="w-5 h-5 text-slate-400" />
                                : <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* End marker */}
                {filtered.length > 0 && (
                  <div className="relative">
                    <div className="absolute -left-[44px] top-0 w-5 h-5 bg-green-600 border-4 border-[#fbf9fb] rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                    <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest py-2">
                      ─── Chain Complete · KTPP Compliant ───
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Integrity + Artifacts ── */}
            <div className="col-span-4 space-y-5">

              {/* Data Integrity Seal */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">DATA INTEGRITY SEAL</h3>

                {/* CSS Hash QR */}
                <div className="flex justify-center mb-5">
                  <HashQR hash={FULL_HASH} />
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">SHA-256 CHAIN HASH</span>
                    <p className="text-[10px] font-mono break-all bg-slate-50 p-2 border border-slate-200 mt-1 text-slate-600 leading-relaxed">
                      {FULL_HASH}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">TIMESTAMP PROOF</span>
                    <p className="text-sm text-slate-800 mt-0.5">IST 2024-03-11 11:00:00.000</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">VALIDATION STATUS</span>
                    <div className="flex items-center gap-2 text-green-700 text-sm font-bold mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      CRYPTOGRAPHICALLY SECURE
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">KTPP COMPLIANCE</span>
                    <div className="flex items-center gap-2 text-green-700 text-sm font-bold mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      SECTIONS 13 & 14 SATISFIED
                    </div>
                  </div>
                </div>
              </div>

              {/* Referenced Artifacts */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">REFERENCED ARTIFACTS</h3>
                <div className="space-y-2">
                  {[
                    {
                      icon: FileText,
                      name: `KTPP_Report_${TENDER.evaluationId}.pdf`,
                      meta: '14 bids · Generated 2024-03-11',
                      action: () => navigate(`/report/${TENDER.evaluationId}`),
                    },
                    {
                      icon: FileSpreadsheet,
                      name: 'Evaluation_Verdicts_EVAL-2024-001.csv',
                      meta: '14 rows · Exported 2024-03-11',
                      action: () => {},
                    },
                    {
                      icon: FileText,
                      name: 'BID-014_Resubmission_Scan.pdf',
                      meta: '3.1 MB · Uploaded 2024-03-10',
                      action: () => navigate('/bid/BID-014'),
                    },
                  ].map(item => (
                    <div
                      key={item.name}
                      onClick={item.action}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 transition-colors rounded-sm group"
                    >
                      <item.icon className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-[#1A2E4A]" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-700 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event summary */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">EVENT SUMMARY</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Total Events',  value: AUDIT_TRAIL.length,                                        color: 'text-slate-900' },
                    { label: 'AI Actions',    value: AUDIT_TRAIL.filter(e => e.actor.includes('NEETHI')).length, color: 'text-[#1A2E4A]' },
                    { label: 'Officer Actions', value: AUDIT_TRAIL.filter(e => e.actor.includes('Officer')).length, color: 'text-[#1A2E4A]' },
                    { label: 'Status',        value: 'CLOSED',                                                   color: 'text-green-700' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium">{row.label}</span>
                      <span className={`font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
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
        <p className="text-[10px] text-slate-400 font-mono">{TENDER.evaluationId} · Append-Only Log</p>
      </footer>
    </div>
  )
}
