'use client'
import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { PAYMENTS, JOBS } from '../../lib/mockData'
import { fmtKsh, fmtDateTime, fmtTimeAgo, PAYMENT_STATUS_CLASS } from '../../lib/utils'
import { Lock, Unlock, CreditCard, TrendingUp, Search, ArrowRight } from 'lucide-react'
import clsx from 'clsx'
import type { PaymentStatus } from '../../types'

const STATUS_FILTERS: { label: string; value: PaymentStatus | 'all' }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Held',     value: 'held'     },
  { label: 'Released', value: 'released' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed',   value: 'failed'   },
]

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = PAYMENTS.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter
    const matchSearch =
      p.id.includes(search) ||
      p.jobId.includes(search) ||
      (p.mpesaRef ?? '').includes(search) ||
      (p.payoutRef ?? '').includes(search)
    return matchFilter && matchSearch
  })

  const totalHeld     = PAYMENTS.filter(p => p.status === 'held').reduce((s, p) => s + p.totalAmount, 0)
  const totalReleased = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.totalAmount, 0)
  const totalPlatform = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.platformCut, 0)
  const totalRider    = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.riderCut, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Payments & Escrow"
          subtitle="All transactions — escrow held and released"
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: 'Escrow Held',
                value: fmtKsh(totalHeld),
                sub: `${PAYMENTS.filter(p => p.status === 'held').length} active jobs`,
                icon: Lock, bg: 'bg-gold-pale', color: 'text-gold',
              },
              {
                label: 'Released Today',
                value: fmtKsh(totalReleased),
                sub: `${PAYMENTS.filter(p => p.status === 'released').length} completed jobs`,
                icon: Unlock, bg: 'bg-green-50', color: 'text-green-600',
              },
              {
                label: 'Platform Cut',
                value: fmtKsh(totalPlatform),
                sub: '15% of all released',
                icon: TrendingUp, bg: 'bg-maroon-pale', color: 'text-maroon',
              },
              {
                label: 'Rider Payouts',
                value: fmtKsh(totalRider),
                sub: '85% sent to riders',
                icon: CreditCard, bg: 'bg-blue-50', color: 'text-blue-600',
              },
            ].map(c => {
              const Icon = c.icon
              return (
                <div key={c.label} className="card flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
                    <Icon size={18} className={c.color} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                    <p className="text-[10px] text-gray-400">{c.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Escrow flow diagram ── */}
          <div className="card bg-gradient-to-r from-maroon-pale to-gold-pale border-l-4 border-l-gold">
            <p className="text-xs font-bold text-gray-700 mb-3">HOW ESCROW WORKS</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { step: '1', label: 'Client Pays',        sub: 'M-Pesa / Card',       color: 'bg-maroon text-white' },
                { arrow: true },
                { step: '2', label: 'Escrow Holds',       sub: 'Money locked in system', color: 'bg-gold text-maroon-dark' },
                { arrow: true },
                { step: '3', label: 'Rider Delivers',     sub: 'OTP confirmed',        color: 'bg-maroon text-white' },
                { arrow: true },
                { step: '4', label: 'Auto Release',       sub: 'Rider gets 85%',       color: 'bg-green-600 text-white' },
                { arrow: true },
                { step: '5', label: 'Platform Cut',       sub: '15% stays in account', color: 'bg-maroon-dark text-white' },
              ].map((item, i) => (
                'arrow' in item
                  ? <ArrowRight key={i} size={16} className="text-gray-400 flex-shrink-0" />
                  : (
                    <div key={i} className="flex items-center gap-2">
                      <div className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0', item.color)}>
                        {item.step}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                        <p className="text-[9px] text-gray-500">{item.sub}</p>
                      </div>
                    </div>
                  )
              ))}
            </div>
          </div>

          {/* ── Filter + search ── */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                className="text-sm outline-none flex-1 bg-transparent"
                placeholder="Search by payment ID, job ID, M-Pesa ref…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={clsx(
                    'px-4 py-2 text-xs font-semibold border-r border-border last:border-r-0 transition-colors',
                    filter === f.value ? 'bg-maroon text-white' : 'text-gray-500 hover:bg-surface'
                  )}
                >
                  {f.label}
                  <span className="ml-1 text-[9px] opacity-70">
                    ({f.value === 'all'
                      ? PAYMENTS.length
                      : PAYMENTS.filter(p => p.status === f.value).length
                    })
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Payments table ── */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Payment ID</th>
                  <th className="table-head">Job</th>
                  <th className="table-head">Client</th>
                  <th className="table-head">Rider</th>
                  <th className="table-head">Method</th>
                  <th className="table-head">Total</th>
                  <th className="table-head">Rider Cut (85%)</th>
                  <th className="table-head">Platform (15%)</th>
                  <th className="table-head">M-Pesa Ref</th>
                  <th className="table-head">Payout Ref</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Held At</th>
                  <th className="table-head">Released At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const job = JOBS.find(j => j.id === p.jobId)
                  return (
                    <tr key={p.id} className="table-row-hover">
                      <td className="table-cell">
                        <span className="font-mono text-xs font-bold text-maroon">{p.id}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-mono text-xs text-gray-700">{p.jobId}</span>
                        {job && <p className="text-[10px] text-gray-400">{job.docType}</p>}
                      </td>
                      <td className="table-cell">
                        <p className="text-xs font-medium">{job?.clientName ?? p.clientId}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.clientId}</p>
                      </td>
                      <td className="table-cell">
                        {p.riderId
                          ? <><p className="text-xs font-medium">{job?.riderName}</p><p className="text-[10px] text-gray-400 font-mono">{p.riderId}</p></>
                          : <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                        }
                      </td>
                      <td className="table-cell">
                        <span className="pill pill-check uppercase">{p.method}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-bold text-gray-900">{fmtKsh(p.totalAmount)}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-bold text-green-600">{fmtKsh(p.riderCut)}</span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm font-bold text-maroon">{fmtKsh(p.platformCut)}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-mono text-xs text-gray-600">{p.mpesaRef ?? '—'}</span>
                      </td>
                      <td className="table-cell">
                        <span className="font-mono text-xs text-gray-600">{p.payoutRef ?? '—'}</span>
                      </td>
                      <td className="table-cell">
                        <span className={clsx('pill', PAYMENT_STATUS_CLASS[p.status])}>
                          {p.status}
                        </span>
                      </td>
                      <td className="table-cell text-xs text-gray-400 whitespace-nowrap">
                        {fmtTimeAgo(p.heldAt)}
                      </td>
                      <td className="table-cell text-xs text-gray-400 whitespace-nowrap">
                        {p.releasedAt ? fmtTimeAgo(p.releasedAt) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No payments match your search.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
