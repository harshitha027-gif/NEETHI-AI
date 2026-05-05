import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvaluationWizard } from '../../context/EvaluationWizardContext'
import {
  Plus, Upload, ArrowRight, Info, LayoutDashboard, Gavel, FileText,
  CreditCard, BarChart2, ShieldCheck, Settings, LogOut, Bell, HelpCircle, User, Scale,
} from 'lucide-react'
import { TENDER } from '../../data/mockData'
import TopNavActions from '../../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Gavel, label: 'Bid Evaluation' },
  { icon: FileText, label: 'Technical Review' },
  { icon: CreditCard, label: 'Financial Assessment' },
  { icon: BarChart2, label: 'Comparative Statement' },
  { icon: ShieldCheck, label: 'Award Decision' },
]

export default function Step1UploadTender() {
  const navigate = useNavigate()
  const { setTenderDetails } = useEvaluationWizard()
  const [tenderName, setTenderName] = useState('')
  const [tenderRef, setTenderRef] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)

  const canProceed = uploadedFile && tenderName && tenderRef

  const handleDragEnter = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragActive(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file)
      }
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const handleNext = () => {
    if (canProceed) {
      setTenderDetails(tenderName, tenderRef, uploadedFile.name)
      navigate('/evaluation/new/step2')
    }
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
        {/* Sidebar */}
        <aside className="w-[280px] flex flex-col py-6 bg-slate-50 border-r border-slate-200 shrink-0">
          <div className="px-6 mb-8">
            <div className="text-lg font-bold text-slate-900 mb-0.5">Government of Karnataka</div>
            <p className="text-[10px] uppercase tracking-tighter text-slate-500">Procurement Department</p>
          </div>

          <div className="px-4 mb-6">
            <button className="w-full bg-[#021934] text-white py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-[#1A2E4A] active:scale-95 transition-all">
              <Plus className="w-4 h-4" />
              New Evaluation
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label }) => {
              const active = label === 'Bid Evaluation'
              return (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('/dashboard') }}
                  className={`flex items-center gap-3 px-4 py-3 rounded text-sm font-semibold transition-all ${
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

          <div className="mt-auto px-4 pt-4 border-t border-slate-200 space-y-1">
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
        <main className="flex-1 p-8 flex flex-col items-center bg-slate-100">
          <div className="w-full max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#021934] mb-2">New Evaluation Workflow</h1>
              <p className="text-slate-600">Initiate a legal compliance check and automated evaluation for a new procurement tender.</p>
            </div>

            {/* Progress Wizard */}
            <div className="flex items-center w-full mb-8 bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
              <div className="flex-1 flex items-center justify-center py-4 border-b-4 border-[#021934] bg-slate-50">
                <span className="w-6 h-6 rounded-full bg-[#021934] text-white flex items-center justify-center text-xs font-bold mr-3">1</span>
                <span className="font-bold text-[10px] text-[#021934] uppercase tracking-widest">1. Upload Tender</span>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="flex-1 flex items-center justify-center py-4 text-slate-400">
                <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold mr-3">2</span>
                <span className="font-bold text-[10px] uppercase tracking-widest">2. Upload Bids</span>
              </div>
              <div className="w-px h-12 bg-slate-200" />
              <div className="flex-1 flex items-center justify-center py-4 text-slate-400">
                <span className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold mr-3">3</span>
                <span className="font-bold text-[10px] uppercase tracking-widest">3. Confirm &amp; Start</span>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-3 gap-8">
              {/* Left: Metadata */}
              <div className="col-span-1 space-y-4">
                <div className="bg-white p-6 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-[#021934] text-sm uppercase tracking-widest mb-4 pb-3 border-b">Tender Specifications</h3>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tender Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Smart City Infrastructure Phase 4"
                        value={tenderName}
                        onChange={(e) => setTenderName(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Agency</label>
                      <input
                        type="text"
                        disabled
                        value="Karnataka Rural Infrastructure Development Limited (KRIDL)"
                        className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tender Reference Number</label>
                      <input
                        type="text"
                        placeholder="KRIDL/2024-25/TEN/442"
                        value={tenderRef}
                        onChange={(e) => setTenderRef(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934]"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 p-4 border border-blue-200 rounded flex gap-3">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wide mb-1">Language Requirement</p>
                    <p className="text-xs text-blue-800">Primary tender documentation must be in English for AI extraction. Supporting bidder documents may be submitted in either Kannada or English.</p>
                  </div>
                </div>
              </div>

              {/* Right: Upload */}
              <div className="col-span-2">
                <div className="bg-white p-6 border border-slate-200 rounded-lg h-full flex flex-col">
                  <h3 className="font-bold text-[#021934] text-sm uppercase tracking-widest mb-4 pb-3 border-b">Document Repository</h3>

                  {/* Drag Zone */}
                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`flex-1 flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all ${
                      isDragActive
                        ? 'border-[#021934] bg-blue-50'
                        : uploadedFile
                        ? 'border-slate-200 bg-white'
                        : 'border-slate-300 bg-slate-50 hover:border-[#021934] hover:bg-slate-100 cursor-pointer'
                    }`}
                  >
                    {uploadedFile ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="font-bold text-[#021934] mb-1">File Uploaded</p>
                        <p className="text-sm text-slate-600 mb-4 break-words text-center max-w-xs">{uploadedFile.name}</p>
                        <button
                          onClick={() => setUploadedFile(null)}
                          className="text-xs text-blue-600 font-bold uppercase tracking-widest hover:text-blue-800"
                        >
                          Replace File
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                          <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="font-bold text-[#021934] mb-1">Upload Tender PDF (English)</p>
                        <p className="text-sm text-slate-600 text-center max-w-xs mb-4">
                          Drag and drop the official NIT/RFP document here or{' '}
                          <label className="text-[#021934] underline font-bold cursor-pointer">
                            browse files
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </label>
                          .
                        </p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase">PDF Only</span>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 uppercase">Max 50MB</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="px-6 py-2 border border-slate-300 text-slate-700 font-bold rounded hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className={`px-8 py-2 font-bold rounded flex items-center gap-2 uppercase text-xs tracking-widest transition-all ${
                        canProceed
                          ? 'bg-[#021934] text-white hover:bg-[#1A2E4A] active:scale-95'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
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
