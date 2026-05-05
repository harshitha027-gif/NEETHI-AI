import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle, Download, ChevronRight, CheckCircle2, AlertCircle, Clock,
  LayoutDashboard, Gavel, FileText, CreditCard, BarChart2, ShieldCheck,
  Settings, LogOut, Bell, HelpCircle, User, Scale, ZoomIn, ZoomOut,
  Mail, CloudUpload, List, Printer, Send,
} from 'lucide-react'
import { BIDS, CRITERIA, TENDER } from '../data/mockData'
import { useEvaluationState } from '../context/EvaluationStateContext'
import TopNavActions from '../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Gavel, label: 'Bid Evaluation' },
  { icon: FileText, label: 'Technical Review' },
  { icon: CreditCard, label: 'Financial Assessment' },
  { icon: BarChart2, label: 'Comparative Statement' },
  { icon: ShieldCheck, label: 'Award Decision' },
]

export default function BidDetailsManualReview() {
  const navigate = useNavigate()
  const { bidId } = useParams()
  const { resolveReview } = useEvaluationState()
  const [decision, setDecision] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const bid = BIDS.find(b => b.id === bidId) || BIDS.find(b => b.verdict === 'review')
  const reviewFlags = bid?.reviewFlags || []
  const passedCriteria = CRITERIA.filter(c => bid?.criteria[c.id]?.status === 'pass')

  const handleSubmitDecision = () => {
    if (!decision || !notes.trim()) return
    setSubmitting(true)
    resolveReview(bid?.id || bidId)
    setTimeout(() => {
      navigate(`/evaluation/${TENDER.evaluationId}`)
    }, 300)
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
              const active = label === 'Bid Evaluation'
              return (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (label === 'Overview') navigate('/dashboard'); else navigate(`/evaluation/${TENDER.evaluationId}`) }}
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings') }} className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 text-sm font-semibold hover:bg-slate-100">
              <Settings className="w-4 h-4" />
              Settings
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }} className="flex items-center gap-3 px-3 py-2 rounded text-slate-600 text-sm font-semibold hover:bg-slate-100">
              <LogOut className="w-4 h-4" />
              Logout
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col pb-16">
          {/* Alert Banner */}
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              AI confidence below threshold. Specific issues flagged below — please review manually.
            </p>
          </div>

          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <nav className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/evaluation/${TENDER.evaluationId}`) }} className="hover:text-[#021934]">Bids</a>
                <ChevronRight className="w-4 h-4" />
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/evaluation/${TENDER.evaluationId}`) }} className="hover:text-[#021934]">Tender #{TENDER.id}</a>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-700">Manual Review</span>
              </nav>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">{bid?.vendorName}</h1>
                {bid?.vendorNameKannada && (
                  <p className="text-slate-400 text-sm">{bid.vendorNameKannada}</p>
                )}
                <p className="text-sm text-slate-500">Bid ID: {bid?.id} | AI Confidence: {bid?.confidence}%</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-300 rounded font-bold text-xs uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4" />
                  Manual Review Required
                </div>
                <button className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Dossier
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 grid grid-cols-12 gap-0">
            {/* Left Panel */}
            <div className="col-span-5 border-r border-slate-200 bg-white p-8 overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <List className="w-5 h-5" />
                Technical Eligibility Criteria
              </h3>

              <div className="space-y-4 mb-12">
                {reviewFlags.map((flag) => (
                  <div
                    key={flag.criterionId}
                    className="border-2 border-amber-500 bg-amber-50 p-4 rounded"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                      <p className="font-bold text-slate-900">{flag.criterion}</p>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{flag.flag}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 border border-amber-300 rounded uppercase">
                        OCR Confidence: {flag.confidence}%
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 bg-amber-600 text-white px-3 py-2 text-xs font-bold uppercase tracking-wide rounded hover:bg-amber-700 transition-colors">
                        View Document
                      </button>
                      <button className="flex-1 border border-amber-600 text-amber-700 px-3 py-2 text-xs font-bold uppercase tracking-wide rounded hover:bg-amber-100 transition-colors">
                        Add Memo
                      </button>
                    </div>
                  </div>
                ))}
                {passedCriteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="border border-slate-100 bg-slate-50 p-4 rounded opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{criterion.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{bid?.criteria[criterion.id]?.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decision Section */}
              <div className="border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Officer Decision</h3>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded space-y-4">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="decision"
                        value="approve"
                        checked={decision === 'approve'}
                        onChange={(e) => setDecision(e.target.value)}
                        className="w-4 h-4 text-[#021934] border-slate-300"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#021934]">Approve Bid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="decision"
                        value="reject"
                        checked={decision === 'reject'}
                        onChange={(e) => setDecision(e.target.value)}
                        className="w-4 h-4 text-red-600 border-slate-300"
                      />
                      <span className="text-sm font-bold text-slate-700 group-hover:text-red-600">Reject Bid</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-widest text-slate-600 mb-2">
                      Internal Decision Notes (Mandatory for Audit)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Provide legal and technical justification for your decision..."
                      className="w-full h-32 border border-slate-300 bg-white px-3 py-2 text-sm rounded focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitDecision}
                      disabled={!decision || !notes.trim() || submitting}
                      className={`flex-1 py-3 font-bold text-sm uppercase tracking-widest rounded transition-all ${
                        decision && notes.trim() && !submitting
                          ? 'bg-[#021934] text-white hover:bg-[#1A2E4A] active:scale-95'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Decision
                    </button>
                    <button className="p-3 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Document Viewer */}
            <div className="col-span-7 bg-slate-100 p-6 flex flex-col">
              <div className="bg-slate-300 flex items-center justify-between px-4 py-2 border border-slate-400 rounded-t-lg">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Exp_Certificate_2024.pdf</span>
                  <span className="text-xs text-slate-500">Page 2 of 4</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-white rounded transition-colors">
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-1 hover:bg-white rounded transition-colors">
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-1 hover:bg-white rounded transition-colors">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Document Canvas */}
              <div className="flex-1 bg-white border border-slate-400 border-t-0 rounded-b-lg overflow-auto flex justify-center p-12">
                <div className="w-[595px] bg-white relative">
                  <div className="border-b-2 border-slate-900 pb-4 mb-8 text-center">
                    <h4 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Experience Certificate</h4>
                    <p className="text-xs text-slate-500 uppercase mt-2 tracking-widest">Office of the Superintending Engineer</p>
                  </div>

                  <div className="space-y-6 text-slate-800 text-sm leading-relaxed">
                    <div className="flex justify-between font-bold">
                      <span>No: PWD/EXP/2024/091</span>
                      <span>Date: 12 Jan 2021</span>
                    </div>

                    <p className="mt-8">
                      This is to certify that M/s Cauvery Construction Group has successfully completed the project "River Front Development Phase II" under our supervision. The project execution period was recorded as being between Jan 2017 and Dec 2020.
                    </p>

                    {/* Flagged Section with Highlight */}
                    <div className="relative py-4 group">
                      <div className="absolute -inset-2 bg-amber-400/20 border-2 border-amber-400 pointer-events-none rounded" />
                      <div className="absolute -right-8 top-0 bg-amber-500 text-white px-2 py-1 text-[10px] font-bold uppercase z-10 rounded">
                        AI Flag: Conflicting Data
                      </div>
                      <p className="font-medium italic border-l-4 border-amber-400 pl-4 relative z-10">
                        "The contractor demonstrated exceptional technical prowess during the fiscal year{' '}
                        <span className="bg-amber-300 font-bold">2021</span> despite the challenges posed by local terrain. The final inspection and certification were finalized as per the schedule."
                      </p>
                    </div>

                    <p>
                      The total value of the work executed was INR 12.45 Crores. This certificate is issued for the purpose of participating in Karnataka State Procurement Tenders.
                    </p>

                    <div className="mt-24 flex justify-end">
                      <div className="text-center w-48 relative">
                        <div className="absolute -top-16 -left-8 w-32 h-32 border-2 border-blue-400/30 rounded-full flex flex-col items-center justify-center -rotate-12 pointer-events-none">
                          <span className="text-[10px] font-bold text-blue-500/40 uppercase leading-tight">Officially</span>
                          <span className="text-3xl font-black text-blue-500/40">2019</span>
                          <span className="text-[8px] font-bold text-blue-500/40 uppercase">KA PWD</span>
                        </div>
                        <div className="border-t border-slate-900 pt-2 mt-16 relative z-10">
                          <p className="font-bold text-xs">Superintending Engineer</p>
                          <p className="text-[10px] text-slate-500 uppercase">PWD Circle, Mandya</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Actions */}
              <div className="mt-4 flex gap-4">
                <button className="flex-1 border border-slate-300 bg-white py-3 font-bold text-xs uppercase tracking-widest text-slate-600 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Request Resubmission
                </button>
                <button className="flex-1 border border-slate-300 bg-white py-3 font-bold text-xs uppercase tracking-widest text-slate-600 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <CloudUpload className="w-4 h-4" />
                  Upload Replacement
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
