import { PAYMENTS } from '../../lib/mockData'
import { fmtKsh, fmtTimeAgo, PAYMENT_STATUS_CLASS } from '../../lib/utils'
import { Lock, Unlock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

export default function EscrowPanel() {
  const held     = PAYMENTS.filter(p => p.status === 'held')
  const released = PAYMENTS.filter(p => p.status === 'released')

  const totalHeld     = held.reduce((s, p) => s + p.totalAmount, 0)
  const totalReleased = released.reduce((s, p) => s + p.totalAmount, 0)
  const platformToday = released.reduce((s, p) => s + p.platformCut, 0)

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="section-title">Payments & Escrow</h2>
        <Link href="/payments" className="section-action">View all →</Link>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Held</p>
          <p className="text-base font-bold text-gold">{fmtKsh(totalHeld)}</p>
          <p className="text-[10px] text-gray-400">{held.length} jobs</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Released</p>
          <p className="text-base font-bold text-green-600">{fmtKsh(totalReleased)}</p>
          <p className="text-[10px] text-gray-400">today</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Platform Cut</p>
          <p className="text-base font-bold text-maroon">{fmtKsh(platformToday)}</p>
          <p className="text-[10px] text-gray-400">today</p>
        </div>
      </div>

      {/* Escrow flow explanation */}
      <div className="px-4 py-3 border-b border-border bg-gold-pale/40">
        <div className="flex items-center justify-between text-[10px] font-semibold text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-maroon-pale border border-maroon/30 flex items-center justify-center">
              <span className="text-[8px] text-maroon font-bold">1</span>
            </div>
            Client Pays
          </div>
          <ArrowRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gold-pale border border-gold/30 flex items-center justify-center">
              <Lock size={9} className="text-gold" />
            </div>
            Escrow
          </div>
          <ArrowRight size={12} className="text-gray-400" />
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-green-50 border border-green-300 flex items-center justify-center">
              <Unlock size={9} className="text-green-600" />
            </div>
            OTP → Release
          </div>
        </div>
      </div>

      {/* Recent payments */}
      <div className="divide-y divide-border">
        {PAYMENTS.slice(0, 4).map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
            <div className={clsx(
              'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
              p.status === 'held' ? 'bg-gold-pale' : 'bg-green-50'
            )}>
              {p.status === 'held'
                ? <Lock size={13} className="text-gold" />
                : <Unlock size={13} className="text-green-600" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{p.jobId}</p>
              <p className="text-[10px] text-gray-400 font-mono">{p.mpesaRef}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-maroon">{fmtKsh(p.totalAmount)}</p>
              <span className={clsx('pill', PAYMENT_STATUS_CLASS[p.status])}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
