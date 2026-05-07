import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  AlertTriangle, RefreshCw, ArrowRight, Scale,
} from 'lucide-react'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'

const FAILED_BIDS = [
  {
    id: 'KA-TND-2024-0892',
    bidderName: 'Precision Infra Solutions Ltd.',
    error: 'Document unreadable — file may be corrupt',
    timestamp: '14:22:10 IST'
  },
  {
    id: 'KA-TND-2024-0914',
    bidderName: 'Bharat Tech Systems',
    error: 'LLM service temporarily unavailable',
    timestamp: '14:22:15 IST'
  },
  {
    id: 'KA-TND-2024-0782',
    bidderName: 'Apex Global Consultancy',
    error: 'Incomplete mandatory section extraction',
    timestamp: '14:22:18 IST'
  }
]

export default function ProcessingError() {
  const { evaluationId } = useParams()
  const navigate = useNavigate()
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRouteToManualReview = () => {
    navigate(`/evaluation/${evaluationId}`)
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
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
        <main className="flex-1 p-8 pb-20 overflow-y-auto">
          <div className="max-w-4xl">
            {/* Error Header */}
            <div className="bg-white border border-slate-200 p-8 mb-8 rounded-lg">
              <div className="flex items-start gap-8">
                <div className="w-16 h-16 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Evaluation Processing Error
                  </h1>
                  <p className="text-slate-600 text-base font-medium mb-4">
                    Some bids could not be processed during the automated evaluation pipeline.
                  </p>
                  <div className="p-4 bg-slate-50 border-l-4 border-slate-400">
                    <p className="text-slate-700 text-sm italic">
                      "All successfully processed bids are unaffected. Your evaluation progress is saved."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Failed Bids Table */}
            <div className="bg-white border border-slate-200 mb-8 overflow-hidden rounded-lg">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">
                  Failed Bids Log ({FAILED_BIDS.length})
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 font-semibold text-xs text-slate-600 uppercase">
                      Bid ID
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-xs text-slate-600 uppercase">
                      Bidder Name
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-xs text-slate-600 uppercase">
                      Error Reason
                    </th>
                    <th className="text-right px-6 py-3 font-semibold text-xs text-slate-600 uppercase">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {FAILED_BIDS.map((bid, idx) => (
                    <tr key={bid.id} className={`hover:bg-slate-50 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {bid.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {bid.bidderName}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {bid.error}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right">
                        {bid.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Manual Intervention */}
              <div className="bg-white border-2 border-[#021934] p-6 relative rounded-lg">
                <div className="absolute top-0 right-0 bg-[#021934] text-white text-xs px-3 py-1 font-bold uppercase rounded-bl">
                  Recommended
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2 mt-2">
                  Manual Intervention
                </h4>
                <p className="text-slate-600 text-sm mb-4">
                  Route all failed bids to the expert committee for manual review. This bypasses automated parsing and ensures legal compliance without delaying the entire tender.
                </p>
                <button
                  onClick={handleRouteToManualReview}
                  className="w-full bg-[#021934] text-white py-3 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 active:opacity-80 transition-colors"
                >
                  Route All to Manual Review
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* System Retry */}
              <div className="bg-white border border-slate-200 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  System Retry
                </h4>
                <p className="text-slate-600 text-sm mb-4">
                  Attempt to re-run the evaluation pipeline for the {FAILED_BIDS.length} failed bids. Use this if the errors were likely due to transient network or service timeouts.
                </p>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full border border-slate-300 text-slate-900 py-3 px-4 rounded font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Retry Failed Bids'}
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Technical persistent issue?{' '}
                <a href="#" className="text-[#021934] font-semibold underline hover:text-slate-700">
                  Contact Support Team (NIC-KA)
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
