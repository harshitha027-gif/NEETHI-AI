import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Bell, HelpCircle, User, Settings, LogOut, LayoutDashboard, Gavel,
  FileText, CreditCard, BarChart2, ShieldCheck, UserX, Edit2, Search,
  Lock, X, ArrowRight, Scale
} from 'lucide-react'
import TopNavActions from '../components/TopNavActions'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview' },
  { icon: Gavel, label: 'Bid Evaluation' },
  { icon: FileText, label: 'Technical Review' },
  { icon: CreditCard, label: 'Financial Assessment' },
  { icon: BarChart2, label: 'Comparative Statement' },
  { icon: ShieldCheck, label: 'Award Decision' },
]

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Arjun Swamy',
    email: 'arjun.swamy@karnataka.gov.in',
    role: 'Procurement Officer',
    agency: 'PWD, Bengaluru',
    status: 'active',
    lastLogin: '12 Oct 2024, 09:45 AM'
  },
  {
    id: 2,
    name: 'Kavita Patil',
    email: 'kavita.patil@nic.in',
    role: 'Audit Viewer',
    agency: 'State Audit Office',
    status: 'active',
    lastLogin: '11 Oct 2024, 04:12 PM'
  },
  {
    id: 3,
    name: 'Rajesh Mehra',
    email: 'r.mehra@karnataka.gov.in',
    role: 'Admin',
    agency: 'e-Governance Dept.',
    status: 'inactive',
    lastLogin: '05 Oct 2024, 11:30 AM'
  },
  {
    id: 4,
    name: 'Suresh L.',
    email: 'suresh.l@pwd.kar.nic.in',
    role: 'Procurement Officer',
    agency: 'PWD, Mysuru',
    status: 'active',
    lastLogin: '12 Oct 2024, 08:05 AM'
  }
]

const PERMISSIONS = [
  { capability: 'User Mgmt', admin: true, po: false, audit: false },
  { capability: 'Eval Actions', admin: false, po: true, audit: false },
  { capability: 'Data Export', admin: true, po: true, audit: true },
  { capability: 'System Logs', admin: true, po: false, audit: true }
]

const ROLE_COLORS = {
  'Procurement Officer': 'bg-blue-50 text-blue-700 border-blue-100',
  'Audit Viewer': 'bg-amber-50 text-amber-700 border-amber-100',
  'Admin': 'bg-slate-900 text-white'
}

export default function UserManagement() {
  const navigate = useNavigate()
  const [users, setUsers] = useState(INITIAL_USERS)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Procurement Officer',
    agency: 'PWD, Bengaluru'
  })

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ))
  }

  const handleAddUser = () => {
    if (formData.name && formData.email) {
      setUsers([...users, {
        id: users.length + 1,
        ...formData,
        status: 'active',
        lastLogin: 'Never'
      }])
      setFormData({ name: '', email: '', role: 'Procurement Officer', agency: 'PWD, Bengaluru' })
      setShowModal(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center w-full h-16 px-6 sticky top-0 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center gap-2 select-none">
          <Scale className="w-6 h-6 text-[#021934]" />
          <span className="text-xl font-black text-slate-900 tracking-tighter">NEETHI AI</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Dashboard</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Tenders</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/analytics') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Analytics</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/audit-log/search') }} className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 py-2 px-3">Audit Log</a>
        </nav>
        <TopNavActions>
          <div className="bg-[#021934] text-white px-3 py-1 rounded-lg flex items-center gap-2">
            <span className="text-xs font-bold uppercase">System Administrator</span>
          </div>
        </TopNavActions>
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

          <div className="px-4 mb-6">
            <button onClick={() => navigate('/evaluation/new/step1')} className="w-full bg-[#021934] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm hover:bg-slate-800 transition-colors">
              <Plus className="w-5 h-5" />
              New Evaluation
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-2">
            {NAV_ITEMS.map(({ icon: Icon, label }) => {
              const active = label === 'Award Decision'
              return (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (label === 'Overview') navigate('/dashboard'); else navigate('/evaluation/EVAL-2024-001') }}
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

          <div className="mt-auto px-2 pt-6 border-t border-slate-200 space-y-1">
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
        <main className="flex-1 p-8 pb-20 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
                <p className="text-slate-500 text-sm">Configure access levels and manage administrative credentials for the procurement portal.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded text-sm w-72 focus:outline-none focus:ring-1 focus:ring-[#021934]"
                  />
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-[#021934] text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* User Table */}
              <div className="col-span-8 bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase">User Identity</th>
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase">Role</th>
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase">Agency</th>
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase">Status</th>
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase">Last Login</th>
                        <th className="px-4 py-3 font-bold text-xs text-slate-600 uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user, idx) => (
                        <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-slate-200 rounded flex items-center justify-center font-bold text-slate-600 text-xs">
                                {getInitials(user.name)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider border ${ROLE_COLORS[user.role]}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">{user.agency}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                              <span className="text-xs font-medium text-slate-700 capitalize">{user.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-500">{user.lastLogin}</td>
                          <td className="px-4 py-4 text-right">
                            <button className="text-slate-400 hover:text-[#021934] mr-2 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              {user.status === 'active' ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="text-xs text-slate-500 font-medium">Showing {filteredUsers.length} of {users.length} registered users</span>
                  <div className="flex gap-1">
                    <button disabled className="px-3 py-1 border border-slate-200 text-xs font-bold rounded bg-white disabled:opacity-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-slate-200 text-xs font-bold rounded bg-[#021934] text-white">1</button>
                    <button className="px-3 py-1 border border-slate-200 text-xs font-bold rounded bg-white hover:bg-slate-50">2</button>
                    <button className="px-3 py-1 border border-slate-200 text-xs font-bold rounded bg-white hover:bg-slate-50">3</button>
                    <button className="px-3 py-1 border border-slate-200 text-xs font-bold rounded bg-white hover:bg-slate-50">Next</button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 space-y-6">
                {/* Permissions Matrix */}
                <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-[#021934]" />
                    <h3 className="font-bold text-slate-900">Role Permissions Summary</h3>
                  </div>
                  <div className="border border-slate-100 rounded p-4 bg-slate-50/50 space-y-2">
                    <div className="grid grid-cols-5 items-center text-[10px] font-bold uppercase text-slate-400">
                      <div className="col-span-2">Capability</div>
                      <div className="text-center">Admin</div>
                      <div className="text-center">PO</div>
                      <div className="text-center">Aud</div>
                    </div>
                    {PERMISSIONS.map((perm, idx) => (
                      <div key={idx} className="grid grid-cols-5 items-center py-2 border-t border-slate-200/50">
                        <div className="col-span-2 text-xs font-medium text-slate-700">{perm.capability}</div>
                        <div className="flex justify-center">
                          {perm.admin ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-200" />}
                        </div>
                        <div className="flex justify-center">
                          {perm.po ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-200" />}
                        </div>
                        <div className="flex justify-center">
                          {perm.audit ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-slate-200" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Notes */}
                <div className="bg-white border border-slate-200 rounded shadow-sm p-6">
                  <h4 className="text-xs font-bold text-slate-900 mb-4 uppercase">Policy Notes</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 shrink-0"></span>
                      <span>Admins cannot view or participate in active tender evaluations to ensure impartiality.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 shrink-0"></span>
                      <span>All administrative actions are logged in the immutable Audit Log for periodic state review.</span>
                    </li>
                  </ul>
                </div>

                {/* System Integrity */}
                <div className="bg-[#1a2e4a] p-6 rounded shadow-sm border border-slate-800">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="w-5 h-5 text-white" />
                    <h3 className="font-bold text-white">System Integrity</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This panel is restricted to High-Level Administrative Personnel only. Any modifications to user roles will trigger an immediate notification to the Departmental Head.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#021934]" />
                Register New User
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter employee name"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-[#021934] outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="official.email@nic.in"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-[#021934] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Assigned Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-[#021934] outline-none"
                  >
                    <option>Procurement Officer</option>
                    <option>Audit Viewer</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Agency / Dept</label>
                  <select
                    value={formData.agency}
                    onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-[#021934] outline-none"
                  >
                    <option>PWD, Bengaluru</option>
                    <option>State Audit Office</option>
                    <option>NIC Hub</option>
                    <option>e-Governance Dept</option>
                  </select>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-[#021934] p-3 mt-4">
                <p className="text-[10px] text-blue-800 leading-tight">
                  <strong>Note:</strong> An invitation link will be sent to the registered email. Users must complete e-KYC verification upon first login.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-[#021934] text-white px-6 py-2 rounded text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Check(props) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}
