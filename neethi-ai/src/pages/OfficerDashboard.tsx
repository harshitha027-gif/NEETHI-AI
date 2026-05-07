import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import {
  Scale, LogOut, LayoutDashboard, Gavel,
  History, Settings, Plus, Search,
  RefreshCw, ClipboardCheck, CheckCircle2, Info, TrendingUp,
  Timer, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { CURRENT_USER } from '../data/mockData.ts'
import TopNavActions from '../components/TopNavActions'
import { useI18n } from '../context/I18nContext'
import OnboardingTour from '../components/OnboardingTour'

const EVALUATIONS = [
  {
    id:       'EVAL-2024-001',
    tenderId: '#TND-2024-NH75-MYS',
    title:    'Road Construction — NH-75 Bypass, Mysuru District',
    date:     'Mar 10, 2024',
    bids:     14,
    status:   'review',
  },
  {
    id:       'EVAL-2024-002',
    tenderId: '#TND-2024-BBMP-002',
    title:    'Footpath Renovation — Rajajinagar, Bengaluru',
    date:     'Mar 09, 2024',
    bids:     8,
    status:   'processing',
  },
  {
    id:       'EVAL-2024-003',
    tenderId: '#TND-2024-PWD-015',
    title:    'Bridge Repair — Cauvery River, Mandya',
    date:     'Mar 05, 2024',
    bids:     6,
    status:   'completed',
  },
  {
    id:       'EVAL-2024-004',
    tenderId: '#TND-2024-SOL-NH48',
    title:    'Solar Lighting Installation — NH-48 Stretch, Tumkur',
    date:     'Feb 28, 2024',
    bids:     5,
    status:   'review',
  },
]

type StatusKey = 'review' | 'processing' | 'completed'

const STATUS_CONFIG: Record<StatusKey, {
  label: string
  bg: string
  text: string
  border: string
  icon: React.ElementType
}> = {
  review:     { label: 'Ready for Review', bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-200',  icon: ClipboardCheck },
  processing: { label: 'Processing',       bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-200',  icon: RefreshCw      },
  completed:  { label: 'Completed',        bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-200',  icon: CheckCircle2   },
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, key: 'sidebar.dashboard', path: '/dashboard',            active: true  },
  { icon: Gavel,           key: 'sidebar.newEval',   path: '/evaluation/new/step1', active: false },
  { icon: History,         key: 'sidebar.auditLog',  path: '/audit-log/search',     active: false },
]

const TOP_NAV = [
  { key: 'topnav.dashboard', path: '/dashboard',        match: 'dashboard' },
  { key: 'topnav.analytics', path: '/analytics',        match: 'analytics' },
  { key: 'topnav.auditLog',  path: '/audit-log/search', match: 'audit'     },
]

export default function OfficerDashboard() {
  const navigate  = useNavigate()
  const [search, setSearch] = useState('')
  const { t } = useI18n()

  const filtered = EVALUATIONS.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.tenderId.toLowerCase().includes(search.toLowerCase())
  )

  function handleAction(ev: typeof EVALUATIONS[0]) {
    if (ev.status === 'review')     navigate(`/evaluation/${ev.id}`)
    else if (ev.status === 'processing') navigate(`/evaluation/${ev.id}/processing`)
    else navigate(`/report/${ev.id}`)
  }

  function actionLabel(status: string) {
    if (status === 'review')     return t('dash.startReview')
    if (status === 'processing') return t('dash.viewLogs')
    return t('dash.downloadReport')
  }

  const TOUR_STEPS = [
    { titleKey: 'tour.welcome.title', bodyKey: 'tour.welcome.body', placement: 'center' },
    { selector: '[data-tour="new-evaluation"]', titleKey: 'tour.newEval.title', bodyKey: 'tour.newEval.body', placement: 'right' },
    { selector: '[data-tour="evaluations-table"]', titleKey: 'tour.evals.title', bodyKey: 'tour.evals.body', placement: 'top' },
    { selector: '[data-tour="lang-toggle"]', titleKey: 'tour.lang.title', bodyKey: 'tour.lang.body', placement: 'bottom' },
    { selector: '[data-tour="notifications"]', titleKey: 'tour.help.title', bodyKey: 'tour.help.body', placement: 'bottom' },
  ]

  return (
    <div className="min-h-screen bg-[#fbf9fb] font-['Inter'] text-[#1b1b1e] flex flex-col">
      <OnboardingTour steps={TOUR_STEPS} storageKey="neethi-tour-dashboard-v1" />

      {/* ── TOP BAR ── */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
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
                className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  item.match === 'dashboard'
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
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

        {/* ── SIDEBAR ── */}
        <aside className="w-[260px] bg-slate-50 border-r border-slate-200 flex flex-col py-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0">
          {/* New Evaluation button */}
          <div className="px-4 mb-6">
            <button
              data-tour="new-evaluation"
              onClick={() => navigate('/evaluation/new/step1')}
              className="w-full bg-[#1A2E4A] text-white py-3 px-4 rounded flex items-center justify-center gap-2 font-bold text-sm active:scale-95 hover:bg-[#021934] transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              {t('sidebar.newEval')}
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-3 space-y-0.5" data-tour="sidebar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  item.active
                    ? 'bg-slate-200 text-slate-900 border-l-4 border-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-l-4 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {t(item.key)}
              </button>
            ))}
          </nav>

          {/* bottom links */}
          <div className="px-3 space-y-0.5 pt-4 border-t border-slate-200">
            {[
              { icon: Settings, key: 'sidebar.settings', path: '/settings' },
              { icon: LogOut,   key: 'sidebar.logout',   path: '/'         },
            ].map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:pl-5 font-semibold text-sm transition-all duration-200 border-l-4 border-transparent cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
                {t(item.key)}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 p-6 overflow-x-hidden pb-20">

          {/* Page header */}
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-slate-900">
                {t('dash.title')}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{t('dash.subtitle')}</p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{t('dash.attentionReq')}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">2</span>
                <span className="text-sm font-semibold text-amber-600">{t('dash.readyForReview')}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {t('dash.aiPassDone')}
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-600" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{t('dash.monthlyPerf')}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">12</span>
                <span className="text-sm font-semibold text-green-600">{t('dash.completedThisMonth')}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                14% increase from previous billing cycle.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-400" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{t('dash.queueStatus')}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-black text-slate-900">1</span>
                <span className="text-sm font-semibold text-slate-500">{t('dash.processing')}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Tender #TND-2024-BBMP-002 extraction active.
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200" data-tour="evaluations-table">
            {/* Table header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">{t('dash.activeEvals')}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  className="pl-9 pr-4 py-1.5 border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#1A2E4A] w-64 rounded"
                  placeholder={t('dash.searchTenders')}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    {[t('dash.col.tenderId'), t('dash.col.tenderName'), t('dash.col.uploadDate'), t('dash.col.totalBids'), t('dash.col.status'), t('dash.col.action')].map((col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-600 border-b border-slate-200 ${
                          i < 5 ? 'border-r' : ''
                        } ${i === 2 || i === 3 ? 'text-center' : ''}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-800">
                  {filtered.map((ev, idx) => {
                    const sc = STATUS_CONFIG[ev.status as StatusKey]
                    const Icon = sc.icon
                    return (
                      <tr
                        key={ev.id}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        <td className="px-6 py-4 font-bold border-r border-slate-200 font-mono text-xs text-slate-700">
                          {ev.tenderId}
                        </td>
                        <td className="px-6 py-4 border-r border-slate-200">{ev.title}</td>
                        <td className="px-6 py-4 text-center border-r border-slate-200 text-slate-500">{ev.date}</td>
                        <td className="px-6 py-4 text-center border-r border-slate-200 font-bold">
                          {String(ev.bids).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 border-r border-slate-200">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase rounded border ${sc.bg} ${sc.text} ${sc.border}`}>
                            <Icon className={`w-3 h-3 ${ev.status === 'processing' ? 'animate-spin' : ''}`} />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleAction(ev)}
                            className="text-[#021934] font-bold text-sm hover:underline transition-colors"
                          >
                            {actionLabel(ev.status)}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                        No evaluations match "{search}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex justify-between items-center border-t border-slate-200">
              <p className="text-[11px] text-slate-500 font-medium">
                Showing 1–{filtered.length} of {filtered.length} evaluations
              </p>
              <div className="flex gap-1">
                <button className="p-1 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded">
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <button className="p-1 border border-slate-200 bg-white hover:bg-slate-50 transition-colors rounded">
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── FIXED BOTTOM BAR ── */}
      <footer className="fixed bottom-0 left-0 w-full h-10 flex items-center justify-between px-6 bg-slate-100 border-t border-slate-200 z-40">
        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
          NEETHI AI · Neural Evaluation Engine for Transparent &amp; Honest Inquiry · CRPF Hackathon 2024
        </p>
        <p className="text-[10px] text-slate-400">Karnataka GovTech</p>
      </footer>
    </div>
  )
}
