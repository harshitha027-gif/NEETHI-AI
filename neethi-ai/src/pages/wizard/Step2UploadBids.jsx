import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvaluationWizard } from '../../context/EvaluationWizardContext'
import {
  Upload, ArrowLeft, ArrowRight, Info, Scale,
  ChevronRight, UserPlus, Trash2, Check, CheckCircle2, Cloud,
} from 'lucide-react'
import TopNavActions from '../../components/TopNavActions'
import AppSidebar from '../../components/AppSidebar'

export default function Step2UploadBids() {
  const navigate = useNavigate()
  const { tenderName, tenderRef, bidders: ctxBidders, setBidders: saveToContext, setBidFiles } = useEvaluationWizard()
  const [bidders, setBidders] = useState(
    ctxBidders.map(b => ({ ...b, fileNames: b.fileNames || [], isDragging: false }))
  )
  const [nextId, setNextId] = useState(ctxBidders.length + 1)
  const [fileMap, setFileMap] = useState({})

  const totalFiles = bidders.reduce((sum, b) => sum + b.files, 0)
  const targetFiles = Math.max(bidders.length * 10, 1)
  const progress = Math.min((totalFiles / targetFiles) * 100, 100)

  const addBidder = () => {
    setBidders([...bidders, { id: nextId, name: '', files: 0, fileNames: [], isDragging: false }])
    setNextId(nextId + 1)
  }

  const updateBidder = (id, name) => {
    setBidders(bidders.map(b => (b.id === id ? { ...b, name } : b)))
  }

  const updateBidderFiles = (id, fileList) => {
    const files = Array.from(fileList)
    const names = files.map(f => f.name)
    setBidders(bidders.map(b => b.id === id ? { ...b, files: files.length, fileNames: names } : b))
    setFileMap(prev => ({ ...prev, [id]: files }))
  }

  const setDragging = (id, val) => {
    setBidders(bidders.map(b => b.id === id ? { ...b, isDragging: val } : b))
  }

  const removeBidder = (id) => {
    setBidders(bidders.filter(b => b.id !== id))
  }

  const triggerFileInput = (id) => {
    document.getElementById(`file-input-${id}`)?.click()
  }

  const canProceed = bidders.length > 0 && bidders.every(b => b.name && b.files > 0)

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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
                <span>Evaluation ID: KPN/2024/7742</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#021934] font-bold">Step 2 of 3</span>
              </div>
              <h1 className="text-4xl font-bold text-[#021934] mb-2">New Evaluation: Upload Bids</h1>
              <div className="border-l-4 border-[#021934] pl-4 bg-slate-50 py-2 border border-l-0 border-slate-200">
                <p className="text-sm text-slate-600 italic">
                  Tender: {tenderName || 'Untitled Tender'}{tenderRef ? ` (${tenderRef})` : ''}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                <div className="h-full bg-[#021934] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-[#021934] uppercase tracking-widest">
                {Math.round(progress)}% Complete
              </span>
            </div>

            {/* Section: Add Bidders */}
            <section className="space-y-6">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Add Bidder Packages</h2>
                  <p className="text-sm text-slate-600">Upload all relevant bid documents for each participating entity.</p>
                </div>
                <button
                  onClick={addBidder}
                  className="flex items-center gap-2 px-4 py-2 border border-[#021934] text-[#021934] font-bold text-sm hover:bg-slate-50 transition-all rounded uppercase tracking-widest"
                >
                  <UserPlus className="w-4 h-4" />
                  + Add Another Bidder
                </button>
              </div>

              {/* Bidders Table */}
              <div className="bg-white border border-slate-200 overflow-hidden rounded-lg">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest">Bidder Name</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest">Upload Zone (PDF, JPG, PNG)</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest text-center">Files</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bidders.map((bidder, idx) => (
                      <tr key={bidder.id} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                        <td className="px-6 py-4 align-top">
                          <input
                            type="text"
                            value={bidder.name}
                            onChange={(e) => updateBidder(bidder.id, e.target.value)}
                            placeholder={bidder.name === '' ? 'Enter Bidder Name' : ''}
                            className="w-full border-b border-slate-300 focus:border-[#021934] focus:ring-0 px-0 py-1 text-sm bg-transparent"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            id={`file-input-${bidder.id}`}
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => updateBidderFiles(bidder.id, e.target.files)}
                          />
                          <div
                            onClick={() => triggerFileInput(bidder.id)}
                            onDragOver={(e) => { e.preventDefault(); setDragging(bidder.id, true) }}
                            onDragLeave={() => setDragging(bidder.id, false)}
                            onDrop={(e) => {
                              e.preventDefault()
                              setDragging(bidder.id, false)
                              if (e.dataTransfer.files.length) updateBidderFiles(bidder.id, e.dataTransfer.files)
                            }}
                            className={`border-2 border-dashed rounded p-4 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
                              bidder.isDragging
                                ? 'border-[#021934] bg-blue-50'
                                : bidder.files > 0
                                ? 'border-green-400 bg-green-50'
                                : 'border-slate-300 bg-slate-50 hover:border-[#021934] hover:bg-slate-100'
                            }`}
                          >
                            {bidder.files > 0 ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-600 mb-1" />
                                <p className="text-[11px] font-bold text-green-700 uppercase tracking-tight">{bidder.files} File{bidder.files !== 1 ? 's' : ''} Ready</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[160px]">
                                  {bidder.fileNames[0]}{bidder.fileNames.length > 1 ? ` +${bidder.fileNames.length - 1} more` : ''}
                                </p>
                              </>
                            ) : (
                              <>
                                <Cloud className="w-5 h-5 text-slate-400 group-hover:text-[#021934] mb-1" />
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Drop files or Browse</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG</p>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {bidder.files > 0 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#021934] text-white rounded-full text-xs font-bold">
                              {bidder.files}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-bold text-xs">--</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeBidder(bidder.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Info + AI Callout */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-slate-50 border border-slate-200 p-6 flex items-start gap-4 rounded-lg">
                  <Info className="w-5 h-5 text-[#021934] shrink-0 mt-0.5" />
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#021934] uppercase tracking-widest">Mandatory Documentation Requirements</h3>
                    <p className="text-xs text-slate-600">
                      NEETHI AI supports processing of documents in both <strong>Kannada and English</strong>. Ensure all bidder packages include high-quality scans of the following:
                    </p>
                    <ul className="grid grid-cols-2 gap-y-2 text-xs text-slate-600 list-disc pl-5">
                      <li>Technical Experience Certificates</li>
                      <li>Financial Audit Statements (Last 3 Years)</li>
                      <li>Caste/Category Certificates (if applicable)</li>
                      <li>Equipment Ownership Proofs</li>
                      <li>Staff Qualification Records</li>
                      <li>GSTR-3B &amp; PAN Documentation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#021934] text-white p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    <Check className="w-4 h-4" />
                    AI Pre-Processing
                  </div>
                  <p className="text-xs leading-relaxed">
                    Documents will be instantly indexed and prepared for cross-verification against Karnataka Transparency in Public Procurements Act (KTPPA) norms in the next step.
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      OCR Active
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Kannada NLP
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Actions */}
            <div className="mt-12 flex justify-between pt-6 border-t border-slate-300">
              <button
                onClick={() => navigate('/evaluation/new/step1')}
                className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-bold rounded hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" />
                Back: Tender Details
              </button>
              <div className="flex gap-4">
                <button className="px-6 py-3 border border-[#021934] text-[#021934] font-bold rounded hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">
                  Save Draft
                </button>
                <button
                  onClick={() => {
  saveToContext(bidders)
  bidders.forEach(b => { if (fileMap[b.id]) setBidFiles(b.id, fileMap[b.id]) })
  navigate('/evaluation/new/step3')
}}
                  disabled={!canProceed}
                  className={`flex items-center gap-2 px-8 py-3 font-bold rounded uppercase text-xs tracking-widest transition-all ${
                    canProceed
                      ? 'bg-[#021934] text-white hover:bg-[#1A2E4A] active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Continue: Process Bids
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
