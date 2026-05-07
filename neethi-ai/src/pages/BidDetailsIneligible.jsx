import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, X, Download, Share2, ChevronDown, AlertTriangle,
  Scale, ZoomIn, ZoomOut, Printer, Info, Check, Send,
} from 'lucide-react'
import { BIDS, CRITERIA, TENDER } from '../data/mockData'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'

export default function BidDetailsIneligible() {
  const navigate = useNavigate()
  const { bidId } = useParams()
  const [rejecting, setRejecting] = useState(false)
  const [manualOverride, setManualOverride] = useState(false)

  const bid = BIDS.find(b => b.id === bidId) || BIDS.find(b => b.verdict === 'ineligible')
  const failReasons = bid?.failReasons || []
  const passedCriteria = CRITERIA.filter(c => bid?.criteria[c.id]?.status === 'pass')

  const handleConfirmRejection = () => {
    setRejecting(true)
    setTimeout(() => {
      navigate(`/evaluation/${TENDER.evaluationId}`)
    }, 300)
  }

  const handleManualReview = () => {
    setManualOverride(true)
    setTimeout(() => {
      navigate(`/bid/${bidId}/manual-review`)
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
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          {/* Header */}
          <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mb-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Tender: KPP/2024/BLR/942
              </div>
              <h1 className="text-4xl font-bold text-slate-900 uppercase mb-3">{bid?.vendorName}</h1>
              {bid?.vendorNameKannada && (
                <p className="text-slate-400 text-sm mb-2">{bid.vendorNameKannada}</p>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded font-bold text-xs uppercase tracking-wide">
                  <X className="w-4 h-4" />
                  Auto-Flagged Ineligible
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-sm font-medium">Confidence:</span>
                  <span className="text-slate-900 font-bold text-sm">{bid?.confidence}%</span>
                  <div className="w-24 h-2 bg-slate-200 rounded">
                    <div className="h-full bg-red-600 rounded" style={{ width: `${bid?.confidence}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm border border-slate-300 hover:bg-slate-200 rounded transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm border border-slate-300 hover:bg-slate-200 rounded transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Findings
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Criteria */}
            <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
              <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-xs uppercase tracking-widest text-slate-600 flex justify-between items-center">
                <span>Evaluation Criteria ({failReasons.length}/{CRITERIA.length} Failed)</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Failed Criteria from mockData */}
              {failReasons.map((reason) => (
                <div key={reason.criterionId} className="p-4 border-b-4 border-red-600 bg-red-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-sm text-red-700">{reason.criterion}</h3>
                    </div>
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 font-bold uppercase rounded">
                      {reason.confidence}% CONF.
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-red-200 rounded space-y-2">
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 border-l-2 border-red-300 italic">
                      {reason.finding}
                    </div>
                  </div>
                </div>
              ))}

              {/* Passed Criteria */}
              {passedCriteria.map((criterion) => (
                <div key={criterion.id} className="p-4 border-b border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">{criterion.title}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Document Viewer */}
            <div className="flex-1 bg-slate-200 p-6 flex flex-col">
              <div className="bg-white flex-1 border border-slate-300 shadow-sm rounded-lg overflow-hidden flex flex-col">
                <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Financial_Statement_FY23.pdf</span>
                    <span className="text-xs text-slate-400">Page 3 of 12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <ZoomOut className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-xs font-medium">100%</span>
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <ZoomIn className="w-4 h-4 text-slate-600" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-2" />
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Printer className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50 p-12 overflow-auto flex justify-center">
                  <div className="w-[600px] bg-white border border-slate-200 p-10 relative">
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase">Audited Financial Statement</h4>
                        <p className="text-[10px] text-slate-500">Fiscal Year: 2022-2023 | Page 3 of 12</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-900">MYSURU URBAN SOLUTIONS CORP.</p>
                        <p className="text-[8px] text-slate-500">CIN: U45203KA2015PTC081290</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 mb-3">4. PROFIT AND LOSS SUMMARY</h5>

                        {/* Red Highlight Box */}
                        <div className="relative">
                          <div className="absolute inset-0 border-2 border-red-500 border-dashed rounded pointer-events-none" />
                          <div className="absolute -right-12 top-0 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            FLAGGED
                          </div>

                          <table className="w-full text-[11px] border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-y border-slate-300 text-left">
                                <th className="p-2 font-bold">Particulars</th>
                                <th className="p-2 font-bold text-right">FY 2022-23 (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-200">
                                <td className="p-2">A. Revenue from Operations</td>
                                <td className="p-2 text-right">2,85,00,000</td>
                              </tr>
                              <tr className="border-b border-slate-200">
                                <td className="p-2">B. Other Income</td>
                                <td className="p-2 text-right">35,00,000</td>
                              </tr>
                              <tr className="border-b-2 border-slate-900 bg-red-100">
                                <td className="p-2 font-bold">Total Annual Turnover (A+B)</td>
                                <td className="p-2 text-right font-bold text-red-700">3,20,00,000</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-2 opacity-30">
                        <div className="h-2 w-full bg-slate-200 rounded" />
                        <div className="h-2 w-3/4 bg-slate-200 rounded" />
                        <div className="h-2 w-full bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Toolbar */}
          <div className="mt-6 px-8 py-4 flex justify-between items-center bg-white border-t border-slate-200">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-xs text-slate-600 font-medium">
                This decision will be logged as an AI-driven rejection. It can be audited by the state procurement committee.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleManualReview}
                disabled={manualOverride}
                className={`px-6 py-2 border-2 border-slate-900 font-bold text-sm uppercase tracking-widest rounded transition-all flex items-center gap-2 ${
                  manualOverride
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'text-slate-900 hover:bg-slate-50 active:scale-95'
                }`}
              >
                <Send className="w-4 h-4" />
                Override — Send to Manual Review
              </button>
              <button
                onClick={handleConfirmRejection}
                disabled={rejecting}
                className={`px-8 py-2 font-bold text-sm uppercase tracking-widest rounded transition-all flex items-center gap-2 ${
                  rejecting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                }`}
              >
                <Check className="w-4 h-4" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
