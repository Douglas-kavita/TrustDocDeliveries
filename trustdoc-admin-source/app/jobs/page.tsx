'use client'
import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { JOBS } from '../../lib/mockData'
import { OFFICES, OFFICE_DOCUMENTS, MOCK_AVAILABILITY, PRICING, type AvailabilityStatus } from '../../constants/pricing'
import { JOB_STATUS_CLASS, JOB_STATUS_LABEL, fmtKsh, fmtTimeAgo } from '../../lib/utils'
import { Search, CheckCircle, Clock, XCircle, HelpCircle, ExternalLink, FilePlus } from 'lucide-react'
import clsx from 'clsx'
import type { JobStatus, JobType } from '../../types'

// ── Availability checker component ───────────────────────
function AvailabilityChecker() {
  const [officeId, setOfficeId] = useState('')
  const [docType,  setDocType]  = useState('')
  const [checked,  setChecked]  = useState(false)

  const officeDocs = officeId ? OFFICE_DOCUMENTS[officeId] ?? [] : []
  const key        = `${officeId}|${docType}`
  const status: AvailabilityStatus = checked
    ? (MOCK_AVAILABILITY[key] ?? 'unknown')
    : 'unknown'

  const STATUS_UI: Record<AvailabilityStatus, { icon: any; label: string; color: string; bg: string }> = {
    available: { icon: CheckCircle, label: 'Available',  color: 'text-green-700', bg: 'bg-green-50 border-green-300' },
    not_ready: { icon: Clock,       label: 'Not Ready',  color: 'text-yellow-700',bg: 'bg-yellow-50 border-yellow-300' },
    not_found: { icon: XCircle,     label: 'Not Found',  color: 'text-red-700',   bg: 'bg-red-50 border-red-300' },
    unknown:   { icon: HelpCircle,  label: 'Unknown — send rider to check', color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
  }

  const ui = STATUS_UI[status]
  const Icon = ui.icon

  return (
    <div className="card border-l-4 border-l-gold mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gold-pale border border-gold/30 flex items-center justify-center">
          <Search size={14} className="text-gold" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Document Availability Checker</h3>
          <p className="text-[10px] text-gray-400">Check if a document is ready at a Huduma / government office</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 items-end">
        {/* Office selector */}
        <div>
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Office
          </label>
          <select
            className="input text-sm"
            value={officeId}
            onChange={e => { setOfficeId(e.target.value); setDocType(''); setChecked(false) }}
          >
            <option value="">Select office…</option>
            {OFFICES.map(o => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </div>

        {/* Document selector */}
        <div>
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
            Document Type
          </label>
          <select
            className="input text-sm"
            value={docType}
            onChange={e => { setDocType(e.target.value); setChecked(false) }}
            disabled={!officeId}
          >
            <option value="">Select document…</option>
            {officeDocs.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Check button */}
        <button
          className={clsx(
            'btn-primary py-2 text-sm',
            (!officeId || !docType) && 'opacity-40 cursor-not-allowed'
          )}
          disabled={!officeId || !docType}
          onClick={() => setChecked(true)}
        >
          Check Availability
        </button>
      </div>

      {/* Result */}
      {checked && officeId && docType && (
        <div className={clsx('mt-3 flex items-center gap-3 rounded-lg border px-4 py-3', ui.bg)}>
          <Icon size={18} className={ui.color} />
          <div>
            <p className={clsx('text-sm font-bold', ui.color)}>{ui.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {docType} at {OFFICES.find(o => o.id === officeId)?.name}
              {status === 'unknown' && ' — No recent check report. Assign a rider to verify.'}
            </p>
          </div>
          {(status === 'available') && (
            <Link
              href="/jobs/new"
              className="ml-auto btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <FilePlus size={12} /> Create Job
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Jobs page ────────────────────────────────────────
const STATUS_FILTERS: { label: string; value: JobStatus | 'all' }[] = [
  { label: 'All',         value: 'all'            },
  { label: 'Pending Pay', value: 'pending_payment' },
  { label: 'Escrow',      value: 'paid'            },
  { label: 'Active',      value: 'in_transit'      },
  { label: 'Completed',   value: 'completed'       },
]

export default function JobsPage() {
  const [search,      setSearch]      = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const [typeFilter,   setTypeFilter]   = useState<JobType | 'all'>('all')
  const [tierFilter,   setTierFilter]   = useState<'all' | 'standard' | 'premium'>('all')

  const filtered = JOBS.filter(j => {
    const matchSearch =
      j.id.includes(search) ||
      j.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (j.riderName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      j.docType.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || j.status === statusFilter
    const matchType   = typeFilter   === 'all' || j.type   === typeFilter

    // Premium jobs cost more — check by totalAmount
    const isStandard = j.totalAmount <= 1000
    const matchTier  = tierFilter === 'all'
      || (tierFilter === 'standard' && isStandard)
      || (tierFilter === 'premium'  && !isStandard)

    return matchSearch && matchStatus && matchType && matchTier
  })

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="All Jobs"
          subtitle={`${JOBS.length} total jobs`}
          actions={
            <Link href="/jobs/new" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <FilePlus size={13} /> New Job
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto p-5">

          {/* Availability checker */}
          <AvailabilityChecker />

          {/* Pricing tier info cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(['standard', 'premium'] as const).map(tier => {
              const p = PRICING[tier]
              return (
                <div key={tier} className={clsx(
                  'card border-l-4 flex items-center gap-4',
                  tier === 'standard' ? 'border-l-gold' : 'border-l-maroon'
                )}>
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    tier === 'standard' ? 'bg-gold-pale' : 'bg-maroon-pale'
                  )}>
                    <span className={clsx(
                      'text-xs font-black',
                      tier === 'standard' ? 'text-gold' : 'text-maroon'
                    )}>
                      {tier === 'standard' ? 'STD' : 'PRE'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{p.label}</p>
                    <p className="text-[10px] text-gray-400">{p.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Check: <span className="font-bold text-gray-900">{fmtKsh(p.check)}</span></p>
                    <p className="text-xs text-gray-500">Delivery: <span className="font-bold text-gray-900">{fmtKsh(p.delivery)}</span></p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 flex-1 min-w-48">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                className="text-sm outline-none flex-1 bg-transparent"
                placeholder="Search jobs, clients, riders…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Type filter */}
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              {[{ label: 'All Types', value: 'all' }, { label: 'Check', value: 'check' }, { label: 'Delivery', value: 'delivery' }].map(f => (
                <button
                  key={f.value}
                  onClick={() => setTypeFilter(f.value as any)}
                  className={clsx(
                    'px-3 py-2 text-xs font-semibold border-r border-border last:border-r-0',
                    typeFilter === f.value ? 'bg-maroon text-white' : 'text-gray-500 hover:bg-surface'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tier filter */}
            <div className="flex bg-white border border-border rounded-lg overflow-hidden">
              {[{ label: 'All Tiers', value: 'all' }, { label: 'Standard', value: 'standard' }, { label: 'Premium', value: 'premium' }].map(f => (
                <button
                  key={f.value}
                  onClick={() => setTierFilter(f.value as any)}
                  className={clsx(
                    'px-3 py-2 text-xs font-semibold border-r border-border last:border-r-0',
                    tierFilter === f.value
                      ? f.value === 'premium' ? 'bg-maroon text-white' : 'bg-gold text-maroon-dark'
                      : 'text-gray-500 hover:bg-surface'
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs table */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Job ID</th>
                  <th className="table-head">Tier</th>
                  <th className="table-head">Type</th>
                  <th className="table-head">Client</th>
                  <th className="table-head">Rider</th>
                  <th className="table-head">Document</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Escrow</th>
                  <th className="table-head">Total</th>
                  <th className="table-head">Rider Cut</th>
                  <th className="table-head">Platform</th>
                  <th className="table-head">Time</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(job => {
                  const isPremium = job.totalAmount > 1000
                  return (
                    <tr key={job.id} className="table-row-hover">
                      <td className="table-cell">
                        <span className="font-mono text-xs font-bold text-maroon">{job.id}</span>
                      </td>
                      <td className="table-cell">
                        <span className={clsx('pill', isPremium ? 'pill-delivery' : 'pill-check')}>
                          {isPremium ? 'PREMIUM' : 'STD'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={clsx('pill', job.type === 'check' ? 'pill-check' : 'pill-delivery')}>
                          {job.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell">
                        <p className="text-xs font-medium">{job.clientName}</p>
                        <p className="text-[10px] text-gray-400">{job.clientId}</p>
                      </td>
                      <td className="table-cell">
                        {job.riderName
                          ? <><p className="text-xs font-medium">{job.riderName}</p><p className="text-[10px] text-gray-400">{job.riderId}</p></>
                          : <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                        }
                      </td>
                      <td className="table-cell text-xs">{job.docType}</td>
                      <td className="table-cell">
                        <span className={clsx('pill', JOB_STATUS_CLASS[job.status])}>
                          {JOB_STATUS_LABEL[job.status]}
                        </span>
                      </td>
                      <td className="table-cell">
                        {job.escrowReleased
                          ? <span className="pill pill-released">Released</span>
                          : job.status !== 'pending_payment'
                            ? <span className="pill pill-held">Held</span>
                            : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                      <td className="table-cell text-sm font-bold text-maroon">{fmtKsh(job.totalAmount)}</td>
                      <td className="table-cell text-sm font-bold text-green-600">{fmtKsh(job.riderCut)}</td>
                      <td className="table-cell text-sm font-bold text-gold">{fmtKsh(job.platformCut)}</td>
                      <td className="table-cell text-[10px] text-gray-400 whitespace-nowrap">
                        {fmtTimeAgo(job.createdAt)}
                      </td>
                      <td className="table-cell">
                        <Link href={`/jobs/${job.id}`} className="text-gray-300 hover:text-maroon transition-colors">
                          <ExternalLink size={13} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No jobs match your filters.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
