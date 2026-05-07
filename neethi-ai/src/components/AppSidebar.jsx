import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Gavel, History, Settings as SettingsIcon, LogOut, Plus } from 'lucide-react'
import { useI18n } from '../context/I18nContext'

/**
 * AppSidebar — single source of truth for sidebar across pages.
 * @param {Object} props
 * @param {'dashboard'|'newEval'|'auditLog'|'settings'|null} [props.active]
 * @param {Object} [props.header] — optional header node (e.g., department title)
 * @param {boolean} [props.showNewEvalButton=true] — primary CTA button
 * @param {string} [props.width='260px']
 */
export default function AppSidebar({ active = null, header = null, showNewEvalButton = true, width = '260px' }) {
  const navigate = useNavigate()
  const { t } = useI18n()

  const NAV_ITEMS = [
    { icon: LayoutDashboard, key: 'sidebar.dashboard', path: '/dashboard',            id: 'dashboard' },
    { icon: Gavel,           key: 'sidebar.newEval',   path: '/evaluation/new/step1', id: 'newEval'   },
    { icon: History,         key: 'sidebar.auditLog',  path: '/audit-log/search',     id: 'auditLog'  },
  ]

  const FOOTER_ITEMS = [
    { icon: SettingsIcon, key: 'sidebar.settings', path: '/settings', id: 'settings' },
    { icon: LogOut,       key: 'sidebar.logout',   path: '/',         id: 'logout'   },
  ]

  return (
    <aside
      className="bg-slate-50 border-r border-slate-200 flex flex-col py-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto shrink-0"
      style={{ width }}
    >
      {header}

      {showNewEvalButton && (
        <div className="px-4 mb-6">
          <button
            onClick={() => navigate('/evaluation/new/step1')}
            className="w-full bg-[#1A2E4A] text-white py-3 px-4 rounded flex items-center justify-center gap-2 font-bold text-sm active:scale-95 hover:bg-[#021934] transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            {t('sidebar.newEval')}
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 cursor-pointer ${
              active === item.id
                ? 'bg-slate-200 text-slate-900 border-l-4 border-slate-900'
                : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-l-4 border-transparent'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {t(item.key)}
          </button>
        ))}
      </nav>

      <div className="px-3 space-y-0.5 pt-4 border-t border-slate-200">
        {FOOTER_ITEMS.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate(item.path)}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 font-semibold text-sm transition-all duration-200 border-l-4 cursor-pointer ${
              active === item.id
                ? 'bg-slate-200 text-slate-900 border-slate-900'
                : 'text-slate-600 hover:bg-slate-100 hover:pl-5 border-transparent'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {t(item.key)}
          </button>
        ))}
      </div>
    </aside>
  )
}
