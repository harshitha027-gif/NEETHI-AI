import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileDown, Scale, History,
  Search, ChevronLeft, ChevronRight, Eye,
} from 'lucide-react'
import TopNavActions from '../components/TopNavActions'
import AppSidebar from '../components/AppSidebar'
import { useI18n } from '../context/I18nContext'

const AUDIT_RECORDS = [
  {
    id: 1,
    tenderId: 'KPP/2024/089',
    bidderName: 'Infrastructure Builders Ltd.',
    evaluationDate: 'Oct 24, 2024',
    officer: 'Arun Kumar S.',
    verdict: 'eligible',
  },
  {
    id: 2,
    tenderId: 'WRD/SEC/772',
    bidderName: 'Nandi Pipes Global',
    evaluationDate: 'Oct 22, 2024',
    officer: 'Priyanka Rao',
    verdict: 'ineligible',
  },
  {
    id: 3,
    tenderId: 'PWD/BLR/102',
    bidderName: 'Mysore Civil Works',
    evaluationDate: 'Oct 21, 2024',
    officer: 'System AI Auto-Pass',
    verdict: 'eligible',
  },
  {
    id: 4,
    tenderId: 'HFW/EQUIP/05',
    bidderName: 'Apex Medical Systems',
    evaluationDate: 'Oct 20, 2024',
    officer: 'Venkatesh Murthy',
    verdict: 'manual',
  },
  {
    id: 5,
    tenderId: 'EDN/LAB/233',
    bidderName: 'Tech Solutions Hub',
    evaluationDate: 'Oct 18, 2024',
    officer: 'Arun Kumar S.',
    verdict: 'eligible',
  },
]

export default function AuditLogSearch() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const [filters, setFilters] = useState({
    tenderId: '',
    bidderName: '',
    agency: 'all',
    verdict: 'all',
    dateFrom: '',
    dateTo: '',
  })
  const [selectedRecords, setSelectedRecords] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const handleSelectRecord = (id) => {
    const newSelected = new Set(selectedRecords)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRecords(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRecords.size === AUDIT_RECORDS.length) {
      setSelectedRecords(new Set())
    } else {
      setSelectedRecords(new Set(AUDIT_RECORDS.map((r) => r.id)))
    }
  }

  const verdictConfig = {
    eligible: { color: 'bg-green-600', label: 'Eligible' },
    ineligible: { color: 'bg-red-600', label: 'Ineligible' },
    manual: { color: 'bg-amber-600', label: 'Manual' },
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
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">{t('topnav.dashboard')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/analytics') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">{t('topnav.analytics')}</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/audit-log/search') }} className="border-b-2 border-slate-900 text-slate-900 font-bold text-xs uppercase tracking-widest py-2 px-3">{t('topnav.auditLog')}</a>
        </nav>
        <TopNavActions>
          <div className="px-3 py-1 bg-blue-100 text-blue-900 rounded text-xs font-bold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Audit Viewer — Read Only
          </div>
        </TopNavActions>
      </header>

      <div className="flex flex-1">
        <AppSidebar active="auditLog" />

        {/* Main */}
        <main className="flex-1 p-8 pb-20">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end border-b-4 border-[#021934] pb-4">
              <div>
                <h1 className="text-4xl font-bold text-[#021934] mb-2">Audit Log Search</h1>
                <p className="text-sm text-slate-600">Review historical evaluation trials and permanent procurement records.</p>
              </div>
              <button
                disabled={selectedRecords.size === 0}
                className={`px-6 py-2 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                  selectedRecords.size > 0
                    ? 'bg-[#021934] text-white hover:opacity-90 active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                <FileDown className="w-4 h-4" />
                Export Selected (PDF/A)
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tender ID</label>
                  <input
                    type="text"
                    placeholder="e.g. KPP/2024/089"
                    value={filters.tenderId}
                    onChange={(e) => handleFilterChange('tenderId', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bidder Name</label>
                  <input
                    type="text"
                    placeholder="Search entity name..."
                    value={filters.bidderName}
                    onChange={(e) => handleFilterChange('bidderName', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Agency</label>
                  <select
                    value={filters.agency}
                    onChange={(e) => handleFilterChange('agency', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none bg-white"
                  >
                    <option value="all">All Agencies</option>
                    <option value="pwd">Public Works Department</option>
                    <option value="health">Health & Family Welfare</option>
                    <option value="rural">Rural Development</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Verdict Type</label>
                  <select
                    value={filters.verdict}
                    onChange={(e) => handleFilterChange('verdict', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none bg-white"
                  >
                    <option value="all">All</option>
                    <option value="eligible">Eligible</option>
                    <option value="ineligible">Ineligible</option>
                    <option value="manual">Manual Review</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-[#021934] focus:ring-1 focus:ring-[#021934] outline-none"
                  />
                </div>
                <div className="col-span-6 flex items-end justify-end">
                  <button className="px-8 py-2 bg-slate-100 text-slate-900 border border-slate-300 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors">
                    <Search className="w-4 h-4" />
                    Search Audit Trail
                  </button>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="p-4 w-12">
                      <input
                        type="checkbox"
                        checked={selectedRecords.size === AUDIT_RECORDS.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-[#021934]"
                      />
                    </th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Tender ID</th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Bidder Name</th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Evaluation Date</th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Officer Name</th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Verdict</th>
                    <th className="p-4 text-left font-bold uppercase tracking-widest text-xs text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {AUDIT_RECORDS.map((record, idx) => (
                    <tr key={record.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50' : ''}`}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#021934]"
                        />
                      </td>
                      <td className="p-4 font-bold text-sm text-slate-900">{record.tenderId}</td>
                      <td className="p-4 text-sm text-slate-900">{record.bidderName}</td>
                      <td className="p-4 text-sm text-slate-600">{record.evaluationDate}</td>
                      <td className="p-4 text-sm text-slate-600">{record.officer}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block ${verdictConfig[record.verdict].color} text-white px-2 py-1 rounded text-[11px] font-bold uppercase`}
                        >
                          {verdictConfig[record.verdict].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-[#021934] font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                          <History className="w-4 h-4" />
                          View Full
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm text-slate-500">Showing 1 to 5 of 1,248 records</span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 bg-[#021934] text-white font-bold text-xs rounded">1</button>
                  <button className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded transition-colors text-xs font-bold">
                    2
                  </button>
                  <button className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 rounded transition-colors text-xs font-bold">
                    3
                  </button>
                  <button className="p-2 border border-slate-300 bg-white hover:bg-slate-50 rounded transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 border-t-4 border-t-[#021934] rounded">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Evaluated Bids</div>
                <div className="text-3xl font-black text-[#021934]">2,481</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 border-t-4 border-t-green-600 rounded">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Eligibility Rate</div>
                <div className="text-3xl font-black text-green-600">68.4%</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 border-t-4 border-t-red-600 rounded">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rejection Rate</div>
                <div className="text-3xl font-black text-red-600">22.1%</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 border-t-4 border-t-amber-600 rounded">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Manual Overrides</div>
                <div className="text-3xl font-black text-amber-600">9.5%</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
