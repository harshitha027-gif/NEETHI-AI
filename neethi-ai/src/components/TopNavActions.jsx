import { useState, useRef, useEffect } from 'react'
import { Bell, HelpCircle, User, FileText, Phone, Activity, X } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, text: 'Evaluation complete for KPN/2024/7742', time: '10m ago', unread: true },
  { id: 2, text: 'System maintenance scheduled for tonight 12:00 AM', time: '1h ago', unread: true },
  { id: 3, text: 'New tender KRIDL/2024-25/TEN/442 uploaded', time: '3h ago', unread: false },
]

export default function TopNavActions({ children }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  
  const notifRef = useRef(null)
  const helpRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  return (
    <div className="flex items-center gap-4 relative z-50">
      {children}

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => { setShowNotifications(!showNotifications); setShowHelp(false) }}
          className={`relative p-1.5 rounded-md transition-colors ${showNotifications ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
        >
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
          <Bell className="w-5 h-5 text-slate-600" />
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm ${notif.unread ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                      {notif.text}
                    </p>
                    {notif.unread && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help & Support */}
      <div className="relative" ref={helpRef}>
        <button 
          onClick={() => { setShowHelp(!showHelp); setShowNotifications(false) }}
          className={`p-1.5 rounded-md transition-colors ${showHelp ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
        >
          <HelpCircle className="w-5 h-5 text-slate-600" />
        </button>

        {showHelp && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Help & Support</h3>
            </div>
            <div className="p-2 space-y-1">
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors">
                <FileText className="w-4 h-4 text-slate-400" />
                Documentation
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors">
                <Phone className="w-4 h-4 text-slate-400" />
                Contact NIC-KA
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-50 text-sm text-slate-700 font-medium transition-colors">
                <Activity className="w-4 h-4 text-slate-400" />
                System Status
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-slate-600" />
      </div>
    </div>
  )
}
