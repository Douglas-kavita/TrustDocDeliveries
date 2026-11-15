'use client'
import { UserPlus, FilePlus, Send, BarChart2, Bell, CreditCard, MessageSquare, Ban } from 'lucide-react'
import Link from 'next/link'
import { DASHBOARD_STATS } from '../../lib/mockData'
import { fmtKsh } from '../../lib/utils'

const ACTIONS = [
  { label: 'Add Rider',   icon: UserPlus,    href: '/riders/new',    color: 'text-maroon', bg: 'bg-maroon-pale hover:bg-maroon hover:text-white' },
  { label: 'New Job',     icon: FilePlus,    href: '/jobs/new',      color: 'text-gold',   bg: 'bg-gold-pale   hover:bg-gold   hover:text-maroon-dark' },
  { label: 'Send OTP',    icon: Send,        href: '/jobs',          color: 'text-maroon', bg: 'bg-maroon-pale hover:bg-maroon hover:text-white' },
  { label: 'Reports',     icon: BarChart2,   href: '/reports',       color: 'text-gold',   bg: 'bg-gold-pale   hover:bg-gold   hover:text-maroon-dark' },
  { label: 'Broadcast',   icon: Bell,        href: '/settings',      color: 'text-maroon', bg: 'bg-maroon-pale hover:bg-maroon hover:text-white' },
  { label: 'Payout',      icon: CreditCard,  href: '/payments',      color: 'text-gold',   bg: 'bg-gold-pale   hover:bg-gold   hover:text-maroon-dark' },
  { label: 'Support',     icon: MessageSquare,href: '/complaints',   color: 'text-maroon', bg: 'bg-maroon-pale hover:bg-maroon hover:text-white' },
  { label: 'Blacklist',   icon: Ban,         href: '/riders',        color: 'text-red-600',bg: 'bg-red-50      hover:bg-red-600 hover:text-white' },
]

export default function QuickActions() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="section-title">Quick Actions</h2>
      </div>

      {/* 2×4 grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          return (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center gap-2 p-2.5 rounded-lg border border-border
                         text-xs font-semibold transition-all group ${a.bg}`}
            >
              <Icon size={14} className={`flex-shrink-0 group-hover:text-current ${a.color}`} />
              <span className="group-hover:text-current">{a.label}</span>
            </Link>
          )
        })}
      </div>

      {/* M-Pesa mini summary */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mb-2">
          M-Pesa Today
        </p>
        <div className="flex justify-between items-center mb-1.5">
          <div>
            <p className="text-xs font-semibold text-gray-800">Received</p>
            <p className="text-[10px] text-gray-400">
              {DASHBOARD_STATS.activeJobs + 4} transactions
            </p>
          </div>
          <p className="text-sm font-bold text-maroon">
            {fmtKsh(DASHBOARD_STATS.todayRevenue)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-gray-800">Payouts sent</p>
            <p className="text-[10px] text-gray-400">to riders</p>
          </div>
          <p className="text-sm font-bold text-green-600">
            {fmtKsh(DASHBOARD_STATS.todayRevenue - DASHBOARD_STATS.todayPlatformCut)}
          </p>
        </div>
      </div>
    </div>
  )
}
