import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, RotateCw, Info, Scale,
  CheckCircle2, Clock, AlertCircle,
} from 'lucide-react'
import TopNavActions from '../../components/TopNavActions'
import AppSidebar from '../../components/AppSidebar'
import { useEvaluationWizard } from '../../context/EvaluationWizardContext'
import { useEvaluationState } from '../../context/EvaluationStateContext'
import { evaluateBid } from '../../lib/geminiEvaluator'

export default function EvaluationInProgress() {
  const navigate = useNavigate()
  const { evaluationId } = useParams()
  const { bidders, bidFiles } = useEvaluationWizard()
  const { setRealBids } = useEvaluationState()

  const hasFiles = Object.keys(bidFiles).length > 0
  const totalBids = hasFiles ? bidders.length : 14

  const [queueItems, setQueueItems] = useState(() =>
    hasFiles
      ? bidders.map((b, i) => ({ id: `BID-LIVE-${String(i + 1).padStart(3, '0')}`, name: b.name, status: 'queue', duration: 'Waiting' }))
      : [
          { id: 'BID-2024-001', name: 'Infrastructure Corp India Ltd.', status: 'evaluated', duration: '12m 45s' },
          { id: 'BID-2024-002', name: 'Sterling Projects Pvt Ltd.', status: 'evaluated', duration: '08m 12s' },
          { id: 'BID-2024-009', name: 'Karnataka Smart Builds', status: 'processing', duration: '02m 30s' },
          { id: 'BID-2024-010', name: 'Skyline Infrastructure', status: 'queue', duration: 'Waiting' },
          { id: 'BID-2024-011', name: 'Apex Construction Hub', status: 'queue', duration: 'Waiting' },
          { id: 'BID-2024-012', name: 'Global Civil Engineering', status: 'queue', duration: 'Waiting' },
        ]
  )

  const [evaluatedCount, setEvaluatedCount] = useState(hasFiles ? 0 : 8)
  const [progress, setProgress] = useState(hasFiles ? 0 : 57)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const started = useRef(false)

  useEffect(() => {
    if (!hasFiles || started.current) return
    started.current = true
    runEvaluation()
  }, [])

  // Fake progress ticker for mock mode
  useEffect(() => {
    if (hasFiles) return
    const interval = setInterval(() => {
      setProgress(prev => prev >= 95 ? 95 : prev + Math.random() * 5)
      setEvaluatedCount(prev => prev >= 13 ? 13 : prev + (Math.random() > 0.7 ? 1 : 0))
    }, 3000)
    return () => clearInterval(interval)
  }, [hasFiles])

  async function runEvaluation() {
    const results = []
    const startTimes = {}

    for (let i = 0; i < bidders.length; i++) {
      const bidder = bidders[i]
      const files = bidFiles[bidder.id]
      const bidId = `BID-LIVE-${String(i + 1).padStart(3, '0')}`

      // Mark as processing
      startTimes[bidId] = Date.now()
      setQueueItems(prev => prev.map(q => q.id === bidId ? { ...q, status: 'processing' } : q))

      try {
        const file = files?.[0]
        if (!file) throw new Error('No file uploaded')

        const result = await evaluateBid(bidId, bidder.name, file)
        results.push(result)

        const elapsed = ((Date.now() - startTimes[bidId]) / 1000).toFixed(0)
        setQueueItems(prev => prev.map(q => q.id === bidId ? { ...q, status: 'evaluated', duration: `${elapsed}s` } : q))
      } catch (err) {
        console.error(`Error evaluating ${bidder.name}:`, err)
        results.push({
          id: bidId,
          vendorName: bidder.name,
          vendorNameKannada: null,
          language: 'english',
          bidAmount: 'N/A',
          verdict: 'review',
          confidence: 0,
          criteria: {},
          failReasons: [`Evaluation error: ${err.message}`],
        })
        setQueueItems(prev => prev.map(q => q.id === bidId ? { ...q, status: 'error', duration: 'Error' } : q))
      }

      const newEval = i + 1
      setEvaluatedCount(newEval)
      setProgress(Math.round((newEval / bidders.length) * 100))
    }

    setRealBids(results)
    setDone(true)
  }

  const canViewResults = done || !hasFiles

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
        <AppSidebar active="newEval" />

        {/* Main */}
        <main className="flex-1 p-8 pb-24 bg-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 border-l-4 border-[#021934] pl-6">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 hover:text-[#021934]">
                <ArrowLeft className="w-4 h-4" />Back to Dashboard
              </button>
              <h1 className="text-4xl font-bold text-[#021934] uppercase mb-2">
                {hasFiles ? 'AI Bid Evaluation — Gemini Engine' : 'Construction of Smart City Infrastructure - Phase IV'}
              </h1>
              <p className="text-slate-500 font-mono text-sm tracking-tight">
                {hasFiles ? `Evaluating ${totalBids} bid(s) against KTPP Act 2000 criteria` : 'Ref No: PWD-BLR-2024-09 | Evaluation Instance: #88219'}
              </p>
            </div>

            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Progress Block */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 p-10 flex flex-col items-center justify-center relative overflow-hidden rounded-lg">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-12 -mt-12" />

                  <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                      <circle cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100" />
                      <circle
                        cx="128" cy="128" r="110" fill="transparent" stroke="currentColor" strokeWidth="12"
                        strokeDasharray="691"
                        strokeDashoffset={691 - (progress / 100) * 691}
                        className={`${done ? 'text-green-600' : 'text-[#021934]'} transition-all duration-500`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-black ${done ? 'text-green-600' : 'text-[#021934]'}`}>{Math.round(progress)}%</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{done ? 'Complete' : 'Processing'}</span>
                    </div>
                  </div>

                  <div className="text-center relative z-10 w-full">
                    <h2 className="text-2xl font-bold text-[#021934] mb-3">
                      {done ? 'Evaluation Complete' : `Processing — ${evaluatedCount} of ${totalBids} bids`}
                    </h2>
                    {!done && (
                      <div className="flex items-center justify-center gap-3 py-3 px-6 bg-slate-100 border border-slate-200 rounded">
                        <RotateCw className="w-4 h-4 text-[#021934] animate-spin" />
                        <p className="font-semibold text-slate-900 text-sm">
                          {hasFiles ? 'Gemini AI evaluating bids...' : 'Estimated completion: 3:45 PM Today'}
                        </p>
                      </div>
                    )}
                    {error && (
                      <div className="flex items-center gap-2 py-2 px-4 bg-red-50 border border-red-200 rounded mt-3">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-700 font-medium">{error}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/evaluation/${evaluationId}`)}
                    disabled={!canViewResults}
                    className={`w-full mt-8 py-4 font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center justify-center gap-2 ${
                      canViewResults
                        ? 'bg-[#021934] text-white hover:bg-slate-800 active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {done ? 'View Results' : canViewResults ? 'View Results' : 'Evaluating...'}
                  </button>
                </div>

                <div className="bg-[#021934] text-white p-6 border-l-4 border-[#ffdea9] flex gap-4 rounded-lg">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-xs mb-2">
                      {hasFiles ? 'Live AI Evaluation' : 'Attention Required'}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-200">
                      {hasFiles
                        ? 'Gemini 2.0 Flash is evaluating each bid document against KTPP Act 2000 criteria. Results update in real time.'
                        : 'Do not close this window. The AI-driven evaluation engine continues to process complex technical parameters in the background.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Bid Queue */}
              <div className="col-span-12 lg:col-span-7">
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold uppercase tracking-widest text-xs text-slate-900">Live Evaluation Queue</h3>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${hasFiles ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                      {hasFiles ? 'Gemini API' : 'Real-time Feed'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Bidder Name</th>
                          <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">ID</th>
                          <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Status</th>
                          <th className="p-4 text-right font-bold uppercase tracking-widest text-xs text-slate-600">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {queueItems.map((bid) => (
                          <tr key={bid.id} className={`border-b border-slate-100 hover:bg-slate-50 ${
                            bid.status === 'processing' ? 'bg-blue-50' : bid.status === 'queue' ? 'opacity-60' : ''
                          }`}>
                            <td className={`p-4 font-semibold ${bid.status === 'processing' ? 'text-[#021934]' : 'text-slate-900'}`}>
                              {bid.name}
                            </td>
                            <td className="p-4 font-mono text-xs text-slate-500">{bid.id}</td>
                            <td className="p-4">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${
                                bid.status === 'evaluated' ? 'bg-green-50 text-green-700 border-green-200'
                                : bid.status === 'processing' ? 'bg-blue-100 text-[#021934] border-blue-200'
                                : bid.status === 'error' ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {bid.status === 'evaluated' && <CheckCircle2 className="w-4 h-4" />}
                                {bid.status === 'processing' && <RotateCw className="w-4 h-4 animate-spin" />}
                                {bid.status === 'queue' && <Clock className="w-4 h-4" />}
                                {bid.status === 'error' && <AlertCircle className="w-4 h-4" />}
                                <span>{bid.status === 'evaluated' ? 'Evaluated' : bid.status === 'processing' ? 'In Progress' : bid.status === 'error' ? 'Error' : 'In Queue'}</span>
                              </div>
                            </td>
                            <td className={`p-4 text-right text-xs font-medium ${bid.status === 'processing' ? 'text-[#021934] font-bold' : 'text-slate-400'}`}>
                              {bid.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded">
                    <span className="font-bold uppercase tracking-widest text-xs text-slate-500 block mb-2">Bids Total</span>
                    <span className="text-2xl font-bold text-slate-900">{totalBids}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded">
                    <span className="font-bold uppercase tracking-widest text-xs text-slate-500 block mb-2">Evaluated</span>
                    <span className="text-2xl font-bold text-green-600">{evaluatedCount}</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded">
                    <span className="font-bold uppercase tracking-widest text-xs text-slate-500 block mb-2">Engine</span>
                    <span className={`text-sm font-bold ${hasFiles ? 'text-green-600' : 'text-slate-900'}`}>{hasFiles ? 'Gemini 2.0' : 'Mock'}</span>
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
