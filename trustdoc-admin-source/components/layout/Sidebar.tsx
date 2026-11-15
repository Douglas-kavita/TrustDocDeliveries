'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Activity, BadgeCheck, Users, Bike,
  Briefcase, Package, MapPin, CreditCard, BarChart2,
  MessageSquare, Settings, FileText, LogOut, ShieldCheck,
  UserCog,
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard',     href: '/dashboard',     icon: LayoutDashboard, badge: null,  badgeRed: false },
      { label: 'Live Activity', href: '/activity',      icon: Activity,        badge: '12',  badgeRed: false },
    ],
  },
  {
    section: 'Users',
    items: [
      { label: 'Verification Queue', href: '/riders/verify', icon: BadgeCheck, badge: '3',  badgeRed: true  },
      { label: 'Citizens',           href: '/clients',        icon: Users,      badge: null, badgeRed: false },
      { label: 'Riders',             href: '/riders',         icon: Bike,       badge: null, badgeRed: false },
      { label: 'Agents',             href: '/agents',         icon: UserCog,    badge: null, badgeRed: false },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'All Jobs',   href: '/jobs',       icon: Briefcase, badge: null, badgeRed: false },
      { label: 'Deliveries', href: '/deliveries', icon: Package,   badge: null, badgeRed: false },
      { label: 'Live Map',   href: '/map',         icon: MapPin,   badge: null, badgeRed: false },
    ],
  },
  {
    section: 'Finance',
    items: [
      { label: 'Payments & Escrow', href: '/payments', icon: CreditCard, badge: null, badgeRed: false },
      { label: 'Reports',           href: '/reports',  icon: BarChart2,  badge: null, badgeRed: false },
    ],
  },
  {
    section: 'Support',
    items: [
      { label: 'Complaints', href: '/complaints', icon: MessageSquare, badge: '2', badgeRed: true  },
      { label: 'Audit Log',  href: '/audit',      icon: FileText,      badge: null, badgeRed: false },
      { label: 'Settings',   href: '/settings',   icon: Settings,      badge: null, badgeRed: false },
    ],
  },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-52 min-w-[208px] h-screen bg-maroon-dark flex flex-col flex-shrink-0 overflow-hidden">

      {/* ── Logo ── */}
      <div className="px-4 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-0.5">
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={15} className="text-maroon-dark" />
          </div>
          <span className="text-white text-sm font-bold tracking-wide leading-tight">
            TrustDoc
          </span>
        </div>
        <p className="text-white/35 text-[9px] font-bold tracking-widest pl-[38px]">
          TrustDoc Admin
        </p>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map((group) => (
          <div key={group.section} className="mb-2">
            <p className="text-white/30 text-[9px] font-bold tracking-widest px-4 py-1.5 uppercase">
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = path === item.href || path.startsWith(item.href + '/')
              const Icon   = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2.5 px-4 py-[7px] text-xs border-l-2 transition-all',
                    active
                      ? 'bg-white/10 text-white border-gold'
                      : 'text-white/55 border-transparent hover:bg-white/5 hover:text-white/85'
                  )}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {item.badge && (
                    <span className={clsx(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0',
                      item.badgeRed
                        ? 'bg-red-500 text-white'
                        : 'bg-gold text-maroon-dark'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── Admin footer ── */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-maroon-pale border border-gold/50 flex items-center justify-center flex-shrink-0">
          <Users size={13} className="text-maroon" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-[11px] font-semibold truncate">Admin User</p>
          <p className="text-white/35 text-[9px]">Super Admin</p>
        </div>
        <Link
          href="/auth/login"
          className="text-white/35 hover:text-white/70 transition-colors"
          title="Logout"
        >
          <LogOut size={14} />
        </Link>
      </div>
    </aside>
  )
}
