import { useNavigate } from 'react-router-dom'
import {
  Scale, Bell, HelpCircle, LogOut, LayoutDashboard, Gavel, FileText,
  History, Settings as SettingsIcon, Plus, Save, Shield
} from 'lucide-react'
import { CURRENT_USER } from '../data/mockData.ts'
import TopNavActions from '../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/dashboard', active: false, disabled: false },
  { icon: Gavel,           label: 'New Evaluation',  path: '/evaluation/new/step1', active: false, disabled: false },
  { icon: FileText,        label: 'My Evaluations',  path: '#',          active: false, disabled: true },
  { icon: History,         label: 'Audit Log',       path: '/audit-log/search', active: false, disabled: false },
]

export default function Settings() {
  const navigate = useNavigate()

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
            {['Dashboard', 'Tenders', 'Analytics', 'Audit Log'].map((item, i) => (
              <a
                key={item}
                href="#"
                onClick={e => { e.preventDefault(); if (item === 'Dashboard') navigate('/dashboard'); else if (item === 'Tenders') navigate('/dashboard'); else if (item === 'Analytics') navigate('/analytics'); else if (item === 'Audit Log') navigate('/audit-log/search') }}
                className={`h-full flex items-center px-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  item === ''
                    ? 'border-b-2 border-slate-900 text-slate-900'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {item}
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
              <Plus className="w-4 h-4" /> New Evaluation
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (!item.disabled && item.path !== '#') navigate(item.path)
                }}
                disabled={item.disabled}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all ${
                  item.disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : item.active
                    ? 'bg-slate-200 text-slate-900 border-l-4 border-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-l-4 border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${item.disabled ? 'opacity-40' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-3 space-y-0.5 pt-4 border-t border-slate-200">
            {[
              { icon: SettingsIcon, label: 'Settings', path: '/settings', active: true },
              { icon: LogOut,   label: 'Logout', path: '/' },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all border-l-4 ${
                  item.active 
                    ? 'bg-slate-200 text-slate-900 border-slate-900' 
                    : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 p-6 overflow-x-hidden pb-20">
          <div className="mb-8">
            <h1 className="text-[30px] leading-[36px] font-bold tracking-tight text-slate-900">Account Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your profile, preferences, and security settings.</p>
          </div>

          <div className="max-w-3xl bg-white border border-slate-200 rounded shadow-sm">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]" defaultValue={CURRENT_USER.name} readOnly />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none bg-slate-50" defaultValue={CURRENT_USER.department} disabled />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none bg-slate-50" defaultValue={CURRENT_USER.role} disabled />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none bg-slate-50" defaultValue={`${CURRENT_USER.name.split(' ')[0].toLowerCase()}@karnataka.gov.in`} disabled />
                </div>
              </div>
            </div>

            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-400" /> Security
              </h3>
              <p className="text-sm text-slate-600 mb-4">Update your password and enable two-factor authentication.</p>
              <button className="px-4 py-2 border border-slate-300 rounded text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Change Password
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-b flex justify-end">
              <button className="px-6 py-2 bg-[#1A2E4A] text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-[#021934] transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
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
