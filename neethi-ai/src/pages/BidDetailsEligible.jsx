import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight, CheckCircle2, Download, Scale, FileText,
  ZoomIn, ZoomOut, Printer, ChevronLeft, Flag, Check, XCircle, AlertTriangle,
} from 'lucide-react'
import { BIDS, CRITERIA, TENDER } from '../data/mockData'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'

const DOCUMENT_TABS = [
  { id: 'audited', label: 'Audited Statement', pages: 18 },
  { id: 'experience', label: 'Experience Certificate', pages: 5 },
  { id: 'solvency', label: 'Bank Solvency', pages: 3 },
]

export default function BidDetailsEligible() {
  const navigate = useNavigate()
  const { bidId } = useParams()
  const [selectedTab, setSelectedTab] = useState('audited')
  const [currentPage, setCurrentPage] = useState(3)
  const [approving, setApproving] = useState(false)

  const bid = BIDS.find(b => b.id === bidId) || BIDS.find(b => b.verdict === 'eligible')
  const criteriaRows = CRITERIA.map(c => ({
    id: c.id,
    name: c.title,
    confidence: bid?.criteria[c.id]?.confidence ?? 0,
    status: bid?.criteria[c.id]?.status ?? 'pass',
    note: bid?.criteria[c.id]?.note ?? '',
    type: c.type,
  }))
  const passCount = criteriaRows.filter(c => c.status === 'pass').length

  const activeTab = DOCUMENT_TABS.find(t => t.id === selectedTab)
  const maxPages = activeTab?.pages || 18

  const handleApprove = () => {
    setApproving(true)
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
        <TopNavActions />
      </header>

      <div className="flex flex-1">
        <AppSidebar />

        {/* Main */}
        <main className="flex-1 p-8 pb-20 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb + Header */}
            <div className="bg-white p-6 border border-slate-200 rounded-lg">
              <nav className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">
                <span>Tenders</span>
                <ChevronRight className="w-4 h-4" />
                <span>Bid Evaluation</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-slate-900">{bid?.vendorName}</span>
              </nav>

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-4">{bid?.vendorName}</h1>
                  {bid?.vendorNameKannada && (
                    <p className="text-slate-400 text-sm mb-3">{bid.vendorNameKannada}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded font-bold text-xs uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4" />
                      Auto-Confirmed Eligible
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                      <span className="text-xs font-bold text-slate-500 uppercase">AI Confidence Score</span>
                      <span className="text-2xl font-black text-[#021934]">{bid?.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate('/audit-log/search')} className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 rounded transition-colors">
                    View Audit Log
                  </button>
                  <button onClick={() => window.print()} className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 rounded transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF Summary
                  </button>
                </div>
              </div>
            </div>

            {/* Split Layout: Criteria + Document */}
            <div className="grid grid-cols-12 gap-6 h-[750px]">
              {/* Left: Criteria Evaluation */}
              <div className="col-span-5 flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Criteria Evaluation</h3>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{passCount} OF {criteriaRows.length} PASSED</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {criteriaRows.map((criterion) => (
                    <div
                      key={criterion.id}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {criterion.status === 'pass'
                          ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                          : criterion.status === 'fail'
                          ? <XCircle className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                          : <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
                        }
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-slate-900">{criterion.name}</span>
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {criterion.confidence}% CONF.
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{criterion.type}</p>
                          <p className="text-sm text-slate-600">{criterion.note}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-slate-200 bg-white flex gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className={`flex-1 font-bold py-3 px-4 rounded flex items-center justify-center gap-2 uppercase text-xs tracking-wide transition-all ${
                      approving
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-green-700 text-white hover:bg-green-800 active:scale-95'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Approve This Bid
                  </button>
                  <button className="flex-1 border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded hover:bg-slate-50 transition-colors uppercase text-xs tracking-wide flex items-center justify-center gap-2">
                    <Flag className="w-4 h-4" />
                    Flag for Review
                  </button>
                </div>
              </div>

              {/* Right: Document Viewer */}
              <div className="col-span-7 flex flex-col bg-slate-300 border border-slate-300 rounded-lg overflow-hidden">
                {/* Document Tabs */}
                <div className="flex bg-slate-400 border-b border-slate-400">
                  {DOCUMENT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`px-6 py-3 text-xs font-bold flex items-center gap-2 border-r border-slate-400 transition-colors ${
                        selectedTab === tab.id
                          ? 'bg-white text-[#021934]'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <div className="flex items-center px-4 gap-4 border-l border-slate-400">
                    <span className="text-xs font-bold text-slate-600 uppercase">PAGE {currentPage} / {maxPages}</span>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(maxPages, currentPage + 1))}
                      disabled={currentPage === maxPages}
                      className="p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document Canvas */}
                <div className="flex-1 p-8 overflow-y-auto bg-slate-500 flex justify-center">
                  <div className="w-full max-w-2xl bg-white shadow-2xl rounded p-12 min-h-[1000px]">
                    <div className="border-b-2 border-slate-900 pb-4 mb-8 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Company Document</p>
                        <h4 className="text-lg font-bold text-slate-900">AUDITED FINANCIAL STATEMENT FY2023-24</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Verification Hash</p>
                        <p className="text-[10px] font-mono text-slate-400">SHA256: 4f8e...9a1c</p>
                      </div>
                    </div>

                    {/* AI Highlight */}
                    <div className="absolute top-[280px] left-[40px] right-[40px] h-[120px] bg-blue-100/40 border-2 border-blue-500 border-dashed rounded pointer-events-none flex items-end justify-end p-2">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        AI EXTRACTED: TURNOVER ₹7,24,50,000
                      </span>
                    </div>

                    <div className="space-y-6 text-slate-800">
                      <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                        <span className="font-bold">Total Revenue</span>
                        <span className="text-right">₹ 7,24,50,000.00</span>
                      </div>
                      <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                        <span className="font-bold">Operational Profit</span>
                        <span className="text-right">₹ 1,12,30,000.00</span>
                      </div>
                      <div className="grid grid-cols-2 border-b border-slate-100 pb-2">
                        <span className="font-bold">Net Assets</span>
                        <span className="text-right">₹ 4,50,00,000.00</span>
                      </div>
                      <div className="pt-8">
                        <h5 className="text-sm font-bold border-b-2 border-slate-200 mb-4 uppercase">Chartered Accountant Certification</h5>
                        <div className="h-32 bg-slate-50 border border-slate-200 flex items-center justify-center border-dashed">
                          <span className="text-slate-400 font-bold uppercase text-xs">Digital Seal & Signature Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Toolbar */}
                <div className="absolute right-6 top-32 flex flex-col gap-2">
                  <button className="bg-white p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <ZoomIn className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="bg-white p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <ZoomOut className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="bg-white p-3 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <Printer className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
