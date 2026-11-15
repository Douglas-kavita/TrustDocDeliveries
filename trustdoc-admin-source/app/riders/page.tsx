'use client'
import { useState } from 'react'
import Link from 'next/link'
import Topbar from '../../components/layout/Topbar'
import Sidebar from '../../components/layout/Sidebar'
import { RIDERS } from '../../lib/mockData'
import { VERIFY_STATUS_CLASS, fmtDate, fmtKsh } from '../../lib/utils'
import { Search, Filter, UserPlus, Star, Phone, MapPin, ExternalLink, Ban } from 'lucide-react'
import clsx from 'clsx'
import type { VerificationStatus, AccountStatus } from '../../types'

const VERIFY_FILTERS: { label: string; value: VerificationStatus | 'all' }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Rejected', value: 'rejected' },
]

export default function RidersPage() {
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<VerificationStatus | 'all'>('all')

  const filtered = RIDERS.filter(r => {
    const matchSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.nationalId.includes(search) ||
      r.phone.includes(search)
    const matchFilter = filter === 'all' || r.verificationStatus === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Riders"
          subtitle={`${RIDERS.length} registered riders`}
          actions={
            <Link href="/riders/new" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <UserPlus size={13} /> Add Rider
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto p-5">

          {/* Search + filter bar */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                className="text-sm outline-none flex-1 bg-transparent"
                placeholder="Search by name, ID, National ID or phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Verification filter tabs */}
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              {VERIFY_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={clsx(
                    'px-4 py-2 text-xs font-semibold transition-colors border-r border-border last:border-r-0',
                    filter === f.value
                      ? 'bg-maroon text-white'
                      : 'text-gray-500 hover:bg-surface'
                  )}
                >
                  {f.label}
                  <span className="ml-1.5 text-[9px] opacity-70">
                    ({f.value === 'all'
                      ? RIDERS.length
                      : RIDERS.filter(r => r.verificationStatus === f.value).length
                    })
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Riders table */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Rider</th>
                  <th className="table-head">Unique ID</th>
                  <th className="table-head">National ID</th>
                  <th className="table-head">Phone</th>
                  <th className="table-head">Location</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Jobs</th>
                  <th className="table-head">Earned</th>
                  <th className="table-head">Verification</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Joined</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rider => (
                  <tr key={rider.id} className="table-row-hover">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-maroon-pale border border-maroon/30
                                        flex items-center justify-content-center flex-shrink-0
                                        items-center justify-center">
                          <span className="text-xs font-bold text-maroon">
                            {rider.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{rider.fullName}</p>
                          <p className="text-[10px] text-gray-400">{rider.email ?? 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs font-bold text-maroon">{rider.id}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs text-gray-600">{rider.nationalId}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={11} className="text-gray-400" />
                        {rider.phone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin size={11} className="text-gray-400" />
                        {rider.location}
                      </div>
                    </td>
                    <td className="table-cell">
                      {rider.rating > 0
                        ? <div className="flex items-center gap-1">
                            <Star size={12} className="text-gold fill-gold" />
                            <span className="text-xs font-semibold">{rider.rating}</span>
                          </div>
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-bold">{rider.totalJobs}</span>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-bold text-maroon">
                        {rider.totalEarnings > 0 ? fmtKsh(rider.totalEarnings) : '—'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('pill', VERIFY_STATUS_CLASS[rider.verificationStatus])}>
                        {rider.verificationStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('pill', rider.accountStatus === 'active'
                        ? 'pill-approved'
                        : rider.accountStatus === 'suspended'
                          ? 'pill-pending'
                          : 'pill-rejected'
                      )}>
                        {rider.accountStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-gray-400">{fmtDate(rider.joinedAt)}</span>
                    </td>
                    <td className="table-cell">
                      <Link
                        href={`/riders/${rider.id}`}
                        className="text-gray-300 hover:text-maroon transition-colors"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No riders match your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
