import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, Download, Lock, AlertTriangle, LayoutDashboard, Gavel, FileText,
  CreditCard, BarChart2, ShieldCheck, Settings, LogOut, Bell, HelpCircle, User, Scale,
  FileText as FileIcon,
} from 'lucide-react'
import { CURRENT_USER } from '../../data/mockData'
import TopNavActions from '../../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Gavel, label: 'Bid Evaluation' },
  { icon: FileText, label: 'Technical Review' },
  { icon: CreditCard, label: 'Financial Assessment' },
  { icon: BarChart2, label: 'Comparative Statement' },
  { icon: ShieldCheck, label: 'Award Decision' },
]

export default function EvaluationSignOff() {
  const navigate = useNavigate()
  const { evaluationId } = useParams()
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [isLocking, setIsLocking] = useState(false)

  const handleSignOff = () => {
    if (!confirmChecked) return
    setIsLocking(true)
    setTimeout(() => {
      navigate(`/evaluation/${evaluationId}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Nav */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center gap-2 select-none">
          <Scale className="w-6 h-6 text-[#021934]" />
          <span className="text-xl font-black text-slate-900 tracking-tighter">NEETHI AI</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Dashboard</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }} className="border-b-2 border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-widest py-2 px-3">Tenders</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/analytics') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Analytics</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/audit-log/search') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Audit Log</a>
        </nav>
        <TopNavActions />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[280px] flex flex-col py-6 bg-slate-50 border-r border-slate-200 shrink-0">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6 text-[#021934]" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Government of Karnataka</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Procurement Department</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label }) => {
              const active = label === 'Award Decision'
              return (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (label === 'Overview') navigate('/dashboard'); else navigate(`/evaluation/${evaluationId}`) }}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-semibold transition-all ${
                    active
                      ? 'bg-slate-200 text-slate-900 border-l-4 border-slate-900'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              )
            })}
          </nav>

          <div className="mt-auto px-4 border-t border-slate-200 pt-4 space-y-1">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings') }} className="flex items-center gap-3 px-4 py-2 rounded text-slate-600 text-sm font-semibold hover:bg-slate-100">
              <Settings className="w-4 h-4" />
              Settings
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} className="flex items-center gap-3 px-4 py-2 rounded text-slate-600 text-sm font-semibold hover:bg-slate-100">
              <LogOut className="w-4 h-4" />
              Logout
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 pb-24 bg-slate-100">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b-4 border-[#021934] pb-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tender ID: KTPP-2024-INF-8842</p>
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-bold text-[#021934]">Construction of Smart City Infrastructure - Phase IV</h1>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Status</p>
                  <span className="inline-block px-3 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-widest">Pending Sign-Off</span>
                </div>
              </div>
            </div>

            {/* Completion Message */}
            <div className="bg-white border border-slate-200 p-6 flex items-center gap-4 rounded-lg">
              <div className="w-12 h-12 bg-[#021934] rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#021934] mb-1">All bids have been reviewed.</h2>
                <p className="text-sm text-slate-600">Evaluation process is complete and verified. Ready for final sign-off and official locking.</p>
              </div>
            </div>

            {/* Grid: Breakdown + Report */}
            <div className="grid grid-cols-12 gap-6">
              {/* Breakdown */}
              <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-[#021934]">Evaluation Breakdown</h3>
                </div>
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-sm font-semibold text-slate-900">Total Bids Received</span>
                    <span className="text-2xl font-black text-[#021934]">14</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      <span className="text-xs text-slate-600">Eligible</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">11</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span className="text-xs text-slate-600">Ineligible</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">02</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs text-slate-600">Manual Resolved</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">01</span>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 p-6 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileIcon className="w-8 h-8 text-[#021934]" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Draft Evaluation Report (KTPP Standard)</p>
                    <p className="text-xs text-slate-500">Generated on 24 Oct 2024, 14:30 IST</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/report/${evaluationId}`)} className="flex items-center gap-2 text-[#021934] font-bold text-xs uppercase tracking-widest hover:underline transition-colors">
                  <Download className="w-4 h-4" />
                  Download Preview
                </button>
              </div>
            </div>

            {/* Certification Block */}
            <div className="bg-blue-50 border-2 border-blue-100 p-8 space-y-6 rounded-lg">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#021934] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#021934] mb-4">Officer Certification Statement</h3>
                  <div className="bg-white p-6 border-l-4 border-[#021934] italic text-slate-900 text-sm leading-relaxed">
                    "I, {CURRENT_USER.name}, {CURRENT_USER.role}, {CURRENT_USER.department}, certify that this evaluation was conducted in accordance with KTPP Act 2000 and that the AI-assisted verdicts have been reviewed and verified."
                  </div>
                </div>
              </div>

              {/* Sign-Off Form */}
              <div className="grid grid-cols-12 gap-6 pt-6 border-t border-blue-200">
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Full Name & Designation (Official Signature)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${CURRENT_USER.name}, ${CURRENT_USER.role}`}
                    className="w-full border border-slate-300 rounded px-4 py-2 text-sm bg-slate-50 text-slate-900 font-semibold"
                  />
                  <p className="text-[10px] text-slate-500 italic mt-2">Typing your name above constitutes a binding digital signature.</p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Date of Completion
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    className="w-full border border-slate-300 rounded px-4 py-2 text-sm bg-slate-100 text-slate-600 font-semibold"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-6 border-t border-blue-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#021934] mt-0.5 cursor-pointer"
                  />
                  <span className="text-sm text-slate-900 leading-relaxed">
                    I confirm that I have reviewed all evaluation verdicts, and I hereby sign off on this tender evaluation. This action will lock the evaluation and prevent any further modifications.
                  </span>
                </label>
              </div>

              {/* Warning + CTA */}
              <div className="pt-6 flex flex-col items-center text-center space-y-4">
                <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 px-4 py-3 rounded-lg w-full">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-bold text-xs text-red-900 uppercase tracking-wide">Warning: Once signed off, this evaluation is locked. No further changes can be made.</span>
                </div>

                <button
                  onClick={handleSignOff}
                  disabled={!confirmChecked || isLocking}
                  className={`w-full md:w-auto px-8 py-4 rounded font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    confirmChecked && !isLocking
                      ? 'bg-[#021934] text-white hover:bg-[#1A2E4A] active:scale-95'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Sign Off & Lock Evaluation
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
