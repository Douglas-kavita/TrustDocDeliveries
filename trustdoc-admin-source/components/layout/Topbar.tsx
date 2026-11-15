'use client'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

interface Props {
  title:     string
  subtitle?: string
  actions?:  React.ReactNode
}

export default function Topbar({ title, subtitle, actions }: Props) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border px-6 py-3 flex items-center gap-3 flex-shrink-0 h-14">

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-bold text-maroon truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[10px] text-gray-400 truncate">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface border border-border rounded-lg
                      px-3 py-1.5 text-xs text-gray-400 w-52 flex-shrink-0">
        <Search size={13} />
        <span>Search anything…</span>
      </div>

      {/* Extra actions passed from page */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="text-gray-400 hover:text-gray-700 transition-colors relative"
        >
          <Bell size={19} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-8 w-72 bg-white border border-border rounded-xl
                          shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="text-xs font-bold text-gray-900">Notifications</span>
              <span className="pill pill-active">3 new</span>
            </div>
            {[
              { text: 'New rider application — David Omondi', time: '18m ago', dot: 'bg-maroon' },
              { text: 'Support ticket opened — Grace Achieng', time: '32m ago', dot: 'bg-red-500' },
              { text: 'Escrow released — Job MCT-JOB-00001', time: '1h ago', dot: 'bg-green-600' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-border
                                      hover:bg-surface transition-colors cursor-pointer">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                <p className="flex-1 text-xs text-gray-700 leading-relaxed">{n.text}</p>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{n.time}</span>
              </div>
            ))}
            <div className="px-4 py-2.5 text-center">
              <span className="text-xs text-maroon cursor-pointer hover:underline">View all →</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
