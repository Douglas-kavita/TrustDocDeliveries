import { Briefcase, Bike, TrendingUp, Lock, BadgeAlert, MessageSquare } from 'lucide-react'
import { DASHBOARD_STATS } from '../../lib/mockData'
import { fmtKsh } from '../../lib/utils'
import clsx from 'clsx'

const CARDS = [
  {
    label:     'Active Jobs',
    value:     () => String(DASHBOARD_STATS.activeJobs),
    sub:       '+12 from yesterday',
    icon:      Briefcase,
    iconBg:    'bg-maroon-pale',
    iconColor: 'text-maroon',
    subColor:  'text-green-600',
  },
  {
    label:     'Riders Online',
    value:     () => String(DASHBOARD_STATS.ridersOnline),
    sub:       '8 on delivery now',
    icon:      Bike,
    iconBg:    'bg-gold-pale',
    iconColor: 'text-gold',
    subColor:  'text-green-600',
  },
  {
    label:     "Today's Revenue",
    value:     () => fmtKsh(DASHBOARD_STATS.todayRevenue),
    sub:       () => `Platform cut: ${fmtKsh(DASHBOARD_STATS.todayPlatformCut)}`,
    icon:      TrendingUp,
    iconBg:    'bg-green-50',
    iconColor: 'text-green-700',
    subColor:  'text-green-600',
  },
  {
    label:     'Escrow Held',
    value:     () => fmtKsh(DASHBOARD_STATS.escrowHeld),
    sub:       'Auto-releases on OTP',
    icon:      Lock,
    iconBg:    'bg-gold-pale',
    iconColor: 'text-gold',
    subColor:  'text-gray-400',
  },
  {
    label:     'Pending Verification',
    value:     () => String(DASHBOARD_STATS.pendingVerification),
    sub:       'Awaiting review',
    icon:      BadgeAlert,
    iconBg:    'bg-red-50',
    iconColor: 'text-red-600',
    subColor:  'text-red-500',
  },
  {
    label:     'Open Tickets',
    value:     () => String(DASHBOARD_STATS.openTickets),
    sub:       'Support queue',
    icon:      MessageSquare,
    iconBg:    'bg-maroon-pale',
    iconColor: 'text-maroon',
    subColor:  'text-red-500',
  },
]

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {CARDS.map((c) => {
        const Icon  = c.icon
        const value = typeof c.value === 'function' ? c.value() : c.value
        const sub   = typeof c.sub   === 'function' ? c.sub()   : c.sub
        return (
          <div key={c.label} className="card flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide leading-tight">
                {c.label}
              </p>
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', c.iconBg)}>
                <Icon size={15} className={c.iconColor} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
            <p className={clsx('text-[10px] leading-tight', c.subColor)}>{sub}</p>
          </div>
        )
      })}
    </div>
  )
}
