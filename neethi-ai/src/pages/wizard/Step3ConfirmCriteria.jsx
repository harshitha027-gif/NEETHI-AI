import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TENDER } from '../../data/mockData'
import { useEvaluationWizard } from '../../context/EvaluationWizardContext'
import {
  ArrowLeft, Clock, Rocket, Edit, ExternalLink, LayoutDashboard, Gavel, FileText,
  CreditCard, BarChart2, ShieldCheck, Settings, LogOut, Bell, HelpCircle, User, Scale,
} from 'lucide-react'
import { CRITERIA } from '../../data/mockData'
import TopNavActions from '../../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Gavel, label: 'Bid Evaluation' },
  { icon: FileText, label: 'Technical Review' },
  { icon: CreditCard, label: 'Financial Assessment' },
  { icon: BarChart2, label: 'Comparative Statement' },
  { icon: ShieldCheck, label: 'Award Decision' },
]

export default function Step3ConfirmCriteria() {
  const navigate = useNavigate()
  const { tenderName, tenderRef, bidders } = useEvaluationWizard()
  const [startDisabled, setStartDisabled] = useState(false)

  const handleStart = () => {
    setStartDisabled(true)
    setTimeout(() => {
      navigate(`/evaluation/${TENDER.evaluationId}/processing`)
    }, 300)
  }

  const totalCriteria = CRITERIA.length

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
              const active = label === 'Bid Evaluation'
              return (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('/dashboard') }}
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
          <div className="max-w-4xl mx-auto">
            {/* Header with Progress */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => navigate('/evaluation/new/step2')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Criteria Definition
              </button>

              {/* Progress Circles */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#021934] text-white flex items-center justify-center text-xs font-bold">1</div>
                  <div className="w-16 h-0.5 bg-[#021934]" />
                  <div className="w-8 h-8 rounded-full bg-[#021934] text-white flex items-center justify-center text-xs font-bold">2</div>
                  <div className="w-16 h-0.5 bg-[#021934]" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#021934] bg-white text-[#021934] flex items-center justify-center text-xs font-bold">3</div>
                </div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Step 3 of 3: Final Confirmation</span>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left: Summary + Disclaimer */}
              <div className="col-span-1 space-y-6">
                {/* Summary Card */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="h-1 bg-[#021934]" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-bold text-[#021934] uppercase tracking-widest">Evaluation Summary</h2>
                      <button className="text-slate-500 hover:text-[#021934] transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tender Name</p>
                        <p className="text-sm font-semibold text-slate-900">{tenderName || '—'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ref Number</p>
                          <p className="text-sm font-semibold text-slate-900">{tenderRef || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Agency</p>
                          <p className="text-sm font-semibold text-slate-900">Karnataka Rural Infrastructure Development Limited (KRIDL)</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Submission Date</p>
                          <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Bidder Count</p>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-slate-900">{bidders.length} Bidder{bidders.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Disclaimer */}
                <div className="bg-slate-100 border border-slate-300 p-6 rounded-lg flex gap-4">
                  <Clock className="w-5 h-5 text-[#021934] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#021934]">AI Evaluation Window</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      NEETHI AI requires approximately <strong>2-4 hours</strong> to cross-reference {bidders.length} bid{bidders.length !== 1 ? 's' : ''} against {totalCriteria} extracted criteria. You will receive an official notification via e-mail once the comparative statement is ready for review.
                    </p>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStart}
                  disabled={startDisabled}
                  className={`w-full py-4 font-bold text-lg rounded flex items-center justify-center gap-2 transition-all ${
                    startDisabled
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#021934] text-white hover:bg-[#1A2E4A] active:scale-95'
                  }`}
                >
                  START SYSTEM EVALUATION
                  <Rocket className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-slate-600">This action will be logged in the permanent Audit Trail.</p>
              </div>

              {/* Right: Criteria Preview */}
              <div className="col-span-2">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-[#021934] uppercase tracking-widest">Criteria Preview</h2>
                      <p className="text-xs text-slate-600 mt-1">NEETHI will evaluate against these core parameters:</p>
                    </div>
                    <span className="text-xs font-bold bg-[#021934] text-white px-3 py-1 rounded uppercase tracking-widest">
                      {totalCriteria} TOTAL CRITERIA
                    </span>
                  </div>

                  {/* Table */}
                  <div className="flex-grow overflow-y-auto max-h-96">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-slate-100 z-10">
                        <tr className="border-b border-slate-200">
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest">Criterion</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest">Type</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CRITERIA.map((crit, idx) => (
                          <tr
                            key={crit.id}
                            className={`border-b border-slate-200 hover:bg-slate-50 ${
                              idx % 2 === 0 ? '' : 'bg-slate-50'
                            }`}
                          >
                            <td className="px-4 py-4">
                              <p className="text-sm font-semibold text-slate-900">{crit.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{crit.description}</p>
                            </td>
                            <td className="px-4 py-4 text-xs font-bold text-[#021934] uppercase">
                              {crit.type}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span
                                className={`inline-block text-[10px] px-2 py-1 font-bold rounded uppercase tracking-tight ${
                                  crit.mandatory
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {crit.mandatory ? 'Mandatory' : 'Optional'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                    <button className="text-[#021934] font-bold text-xs flex items-center justify-center gap-1 mx-auto hover:underline">
                      VIEW ALL EXTRACTED PARAMETERS ({totalCriteria})
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
