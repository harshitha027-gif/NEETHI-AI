import { useNavigate } from 'react-router-dom'
import {
  Scale, LogOut, LayoutDashboard, Gavel,
  History, Settings, Plus, BarChart2, TrendingUp, Users, Activity
} from 'lucide-react'
import { CURRENT_USER } from '../data/mockData.ts'
import TopNavActions from '../components/TopNavActions'
import { useI18n } from '../context/I18nContext'

const NAV_ITEMS = [
  { icon: LayoutDashboard, key: 'sidebar.dashboard', path: '/dashboard',            active: false },
  { icon: Gavel,           key: 'sidebar.newEval',   path: '/evaluation/new/step1', active: false },
  { icon: History,         key: 'sidebar.auditLog',  path: '/audit-log/search',     active: false },
]

const TOP_NAV = [
  { key: 'topnav.dashboard', path: '/dashboard',        match: 'dashboard' },
  { key: 'topnav.analytics', path: '/analytics',        match: 'analytics' },
  { key: 'topnav.auditLog',  path: '/audit-log/search', match: 'audit'     },
]

export default function Analytics() {
  const navigate = useNavigate()
  const { t } = useI18n()

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
            {TOP_NAV.map(item => (
              <a
                key={item.key}
                href="#"
                onClick={e => { e.preventDefault(); navigate(item.path) }}
                className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  item.match === 'analytics'
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
          <div className="px-4 mb-6">
            <button
              onClick={() => navigate('/evaluation/new/step1')}
              className="w-full bg-[#1A2E4A] text-white py-3 px-4 rounded flex items-center justify-center gap-2 font-bold text-sm hover:bg-[#021934] transition-all"
            >
              <Plus className="w-4 h-4" /> {t('sidebar.newEval')}
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all ${
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

          <div className="px-3 space-y-0.5 pt-4 border-t border-slate-200">
            {[
              { icon: Settings, key: 'sidebar.settings', path: '/settings' },
              { icon: LogOut,   key: 'sidebar.logout',   path: '/'         },
            ].map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 hover:pl-5 font-semibold text-sm transition-all border-l-4 border-transparent"
              >
                <item.icon className="w-4 h-4" />
                {t(item.key)}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 p-6 overflow-x-hidden pb-20">
          <div className="mb-8">
            <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-slate-900">Analytics Overview</h1>
            <p className="text-sm text-slate-500 mt-1">State-wide tender evaluation statistics and performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: 'Total Evaluations', value: '3,245', icon: BarChart2, trend: '+12% from last month', color: 'bg-blue-500' },
              { title: 'Avg. Processing Time', value: '1.2 mins', icon: Activity, trend: '-30% from last month', color: 'bg-green-500' },
              { title: 'Active Vendors', value: '892', icon: Users, trend: '+5% from last month', color: 'bg-purple-500' },
              { title: 'Manual Reviews', value: '45', icon: TrendingUp, trend: '-2% from last month', color: 'bg-amber-500' },
            ].map(stat => (
              <div key={stat.title} className="bg-white border border-slate-200 p-5 rounded relative overflow-hidden shadow-sm">
                <div className={`absolute top-0 left-0 w-1 h-full ${stat.color}`} />
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.title}</p>
                  <stat.icon className="w-4 h-4 text-slate-400" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">{stat.value}</h2>
                <p className="text-[10px] text-slate-400 font-medium">{stat.trend}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded p-8 flex items-center justify-center min-h-[400px] shadow-sm">
            <div className="text-center">
              <BarChart2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Detailed Analytics Dashboard</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2">
                This is a placeholder for the full analytics dashboard, which will contain interactive charts and data tables for deep insights into the evaluation process.
              </p>
            </div>
          </div>
        </main>
      </div>

      <footer className="fixed bottom-0 left-0 w-full h-10 flex items-center justify-between px-6 bg-slate-100 border-t border-slate-200 z-40">
        <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
          NEETHI AI · Neural Evaluation Engine for Transparent &amp; Honest Inquiry
        </p>
        <p className="text-[10px] text-slate-400">Karnataka GovTech</p>
      </footer>
    </div>
  )
}
