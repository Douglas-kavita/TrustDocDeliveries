'use client'


declare module '../../../types' {
  interface Rider {
    exchangePlate?: string | null;
  }
  interface RiderDocument {
    numberPlateUrl?: string | null;
  }
}
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'
import { RIDERS, JOBS, TICKETS, PAYMENTS } from '../../../lib/mockData'
import {
  fmtDate, fmtDateTime, fmtKsh, fmtTimeAgo,
  VERIFY_STATUS_CLASS, JOB_STATUS_LABEL, JOB_STATUS_CLASS,
} from '../../../lib/utils'
import {
  ArrowLeft, Phone, MapPin, Star, Shield, ShieldCheck, ShieldX,
  Briefcase, Wallet, MessageSquare, FileText, Ban, CheckCircle,
  AlertTriangle, Clock, ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

type Tab = 'overview' | 'documents' | 'jobs' | 'earnings' | 'complaints'

export default function RiderProfilePage() {
  const { id }   = useParams<{ id: string }>()
  const [tab, setTab] = useState<Tab>('overview')
  const [actionDone, setActionDone] = useState<string | null>(null)

  const rider        = RIDERS.find(r => r.id === id)
  const riderJobs    = JOBS.filter(j => j.riderId === id)
  const riderTickets = TICKETS.filter(t => t.riderId === id)
  const riderPayments= PAYMENTS.filter(p => p.riderId === id)

  if (!rider) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold text-maroon mb-2">Rider not found</p>
          <Link href="/riders" className="btn-ghost text-sm">← Back to Riders</Link>
        </div>
      </div>
    )
  }

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: 'overview',   label: 'Overview',                          icon: Shield        },
    { key: 'documents',  label: 'Documents',                         icon: FileText      },
    { key: 'jobs',       label: `Jobs (${riderJobs.length})`,        icon: Briefcase     },
    { key: 'earnings',   label: 'Earnings',                          icon: Wallet        },
    { key: 'complaints', label: `Complaints (${riderTickets.length})`,icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={rider.fullName}
          subtitle={`${rider.id} · ${rider.location}`}
          actions={
            <Link href="/riders" className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
              <ArrowLeft size={13} /> Back
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto">

          {/* ── Hero banner ── */}
          <div className="bg-maroon px-6 py-5 flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-gold
                            flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-black text-gold">
                {rider.fullName.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-white text-lg font-bold">{rider.fullName}</h2>
                <span className={clsx('pill', VERIFY_STATUS_CLASS[rider.verificationStatus])}>
                  {rider.verificationStatus}
                </span>
                <span className={clsx('pill',
                  rider.accountStatus === 'active' ? 'pill-approved' : 'pill-rejected'
                )}>
                  {rider.accountStatus}
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap text-white/60 text-xs">
                <span className="font-mono font-bold text-gold">{rider.id}</span>
                <span className="flex items-center gap-1">
                  <Phone size={11} />{rider.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} />{rider.location}
                </span>
                {rider.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-gold fill-gold" />
                    {rider.rating} rating
                  </span>
                )}
                <span>
                  National ID: <span className="font-mono text-white/80">{rider.nationalId}</span>
                </span>
                <span>
                  M-Pesa: <span className="font-mono text-white/80">{rider.mpesaPhone}</span>
                </span>

                {/* ── NUMBER PLATE — hero badge ── */}
                {rider.numberPlate && (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center gap-1.5 bg-gold text-maroon
                                 font-black text-xs px-2.5 py-1 rounded-md
                                 tracking-widest border border-gold/60"
                    >
                      🏍️ {rider.numberPlate}
                    </span>
                    {rider.exchangePlate && (
                      <span className="text-white/40 text-[10px]">
                        (exchange: {rider.exchangePlate})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              {rider.verificationStatus === 'pending' && (
                <>
                  <button
                    onClick={() => setActionDone('approved')}
                    className="flex items-center gap-1.5 bg-green-600 text-white text-xs
                               font-semibold px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={13} /> Approve
                  </button>
                  <button
                    onClick={() => setActionDone('rejected')}
                    className="flex items-center gap-1.5 bg-red-600 text-white text-xs
                               font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ShieldX size={13} /> Reject
                  </button>
                </>
              )}
              {rider.accountStatus === 'active' && (
                <button
                  onClick={() => setActionDone('suspended')}
                  className="flex items-center gap-1.5 bg-white/10 text-white text-xs
                             font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Ban size={13} /> Suspend
                </button>
              )}
            </div>
          </div>

          {/* Action done toast */}
          {actionDone && (
            <div className="bg-green-50 border-b border-green-200 px-6 py-2 flex items-center gap-2">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs text-green-700 font-semibold">
                Rider {actionDone} successfully. Changes saved.
              </span>
            </div>
          )}

          {/* ── Tabs ── */}
          <div className="bg-white border-b border-border px-6 flex gap-1">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors',
                    tab === t.key
                      ? 'text-maroon border-maroon'
                      : 'text-gray-400 border-transparent hover:text-gray-700'
                  )}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="p-6 space-y-4">

            {/* ══ OVERVIEW TAB ══ */}
            {tab === 'overview' && (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Total Jobs',   value: String(rider.totalJobs),     icon: Briefcase,     color: 'text-maroon',   bg: 'bg-maroon-pale' },
                    { label: 'Total Earned', value: fmtKsh(rider.totalEarnings), icon: Wallet,        color: 'text-gold',     bg: 'bg-gold-pale'   },
                    { label: 'Rating',       value: rider.rating > 0 ? `${rider.rating}/5` : 'N/A', icon: Star, color: 'text-gold', bg: 'bg-gold-pale' },
                    { label: 'Complaints',   value: String(riderTickets.length), icon: MessageSquare, color: 'text-red-600',  bg: 'bg-red-50'      },
                  ].map(s => {
                    const Icon = s.icon
                    return (
                      <div key={s.label} className="card flex items-center gap-3">
                        <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>
                          <Icon size={18} className={s.color} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
                          <p className="text-xl font-bold text-gray-900">{s.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Personal info card */}
                <div className="card">
                  <h3 className="section-title mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {[
                      { label: 'Full Name',    value: rider.fullName },
                      { label: 'Unique ID',    value: rider.id },
                      { label: 'National ID',  value: rider.nationalId },
                      { label: 'Phone',        value: rider.phone },
                      { label: 'M-Pesa Phone', value: rider.mpesaPhone },
                      { label: 'Email',        value: rider.email ?? 'Not provided' },
                      { label: 'Location',     value: rider.location },
                      { label: 'Joined',       value: fmtDateTime(rider.joinedAt) },
                      { label: 'Last Active',  value: rider.lastActiveAt ? fmtTimeAgo(rider.lastActiveAt) : 'Never' },
                    ].map(f => (
                      <div key={f.label} className="flex gap-2">
                        <span className="text-gray-400 w-28 flex-shrink-0">{f.label}</span>
                        <span className="font-semibold text-gray-900 font-mono text-xs leading-5">{f.value}</span>
                      </div>
                    ))}

                    {/* ── NUMBER PLATE — personal info ── */}
                    <div className="flex gap-2 items-center col-span-2 pt-2 mt-1 border-t border-border">
                      <span className="text-gray-400 w-28 flex-shrink-0">Number Plate</span>
                      {rider.numberPlate ? (
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-flex items-center gap-2 bg-maroon text-gold
                                       font-black text-sm px-3 py-1.5 rounded-lg
                                       tracking-widest border border-gold/40"
                          >
                            🏍️ {rider.numberPlate}
                          </span>
                          {rider.exchangePlate && (
                            <span className="text-xs text-gray-400">
                              Exchange plate: <span className="font-mono font-semibold text-gray-700">{rider.exchangePlate}</span>
                            </span>
                          )}
                          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                            ✓ Verified
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-semibold flex items-center gap-1">
                          <AlertTriangle size={12} /> Not provided
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification timeline */}
                <div className="card">
                  <h3 className="section-title mb-4">Verification History</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-maroon flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText size={11} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">Documents submitted</p>
                        <p className="text-[10px] text-gray-400">{fmtDateTime(rider.documents.submittedAt)}</p>
                      </div>
                    </div>
                    {rider.documents.reviewedAt && (
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          rider.verificationStatus === 'approved' ? 'bg-green-600' : 'bg-red-600'
                        )}>
                          {rider.verificationStatus === 'approved'
                            ? <CheckCircle size={11} className="text-white" />
                            : <ShieldX size={11} className="text-white" />
                          }
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">
                            {rider.verificationStatus === 'approved' ? 'Approved' : 'Rejected'}
                            {' '}by {rider.documents.reviewedBy}
                          </p>
                          <p className="text-[10px] text-gray-400">{fmtDateTime(rider.documents.reviewedAt)}</p>
                          {rider.documents.notes && (
                            <p className="text-[10px] text-red-500 mt-0.5">{rider.documents.notes}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ══ DOCUMENTS TAB ══ */}
            {tab === 'documents' && (
              <div className="card">
                <h3 className="section-title mb-4">Identity Documents</h3>
                <div className="grid grid-cols-2 gap-4">

                  {/* Existing 3 documents */}
                  {[
                    { label: 'National ID — Front', url: rider.documents.idFrontUrl },
                    { label: 'National ID — Back',  url: rider.documents.idBackUrl  },
                    { label: 'Selfie / Face Photo', url: rider.documents.selfieUrl  },
                  ].map(doc => (
                    <div key={doc.label} className="border border-border rounded-xl overflow-hidden">
                      <div className={clsx(
                        'h-40 flex items-center justify-center',
                        doc.url ? 'bg-gray-100' : 'bg-red-50'
                      )}>
                        {doc.url
                          ? <div className="text-center">
                              <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Document on file</p>
                              <p className="text-[10px] text-gray-400">(Firebase URL in production)</p>
                            </div>
                          : <div className="text-center">
                              <AlertTriangle size={28} className="text-red-400 mx-auto mb-2" />
                              <p className="text-xs text-red-500 font-semibold">Missing</p>
                            </div>
                        }
                      </div>
                      <div className="px-3 py-2 border-t border-border bg-surface">
                        <p className="text-xs font-semibold text-gray-700">{doc.label}</p>
                        <p className="text-[10px] text-gray-400">
                          {doc.url ? 'Uploaded' : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* ── NUMBER PLATE PHOTO — 4th document card ── */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className={clsx(
                      'h-40 flex items-center justify-center',
                      rider.documents.numberPlateUrl ? 'bg-gray-100' : 'bg-yellow-50'
                    )}>
                      {rider.documents.numberPlateUrl
                        ? <div className="text-center">
                            <FileText size={32} className="text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Plate photo on file</p>
                            <p className="text-[10px] text-gray-400">(Firebase URL in production)</p>
                          </div>
                        : <div className="text-center">
                            <AlertTriangle size={28} className="text-yellow-500 mx-auto mb-2" />
                            <p className="text-xs text-yellow-600 font-semibold">Not uploaded</p>
                          </div>
                      }
                    </div>
                    <div className="px-3 py-2 border-t border-border bg-surface">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-gray-700">
                            🏍️ Number Plate Photo
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {rider.documents.numberPlateUrl ? 'Uploaded' : 'Not uploaded'}
                          </p>
                        </div>
                        {/* Show plate number as badge */}
                        {rider.numberPlate && (
                          <span
                            className="inline-flex items-center bg-maroon text-gold
                                       font-black text-xs px-2 py-1 rounded-md
                                       tracking-widest"
                          >
                            {rider.numberPlate}
                          </span>
                        )}
                      </div>
                      {/* Exchange plate note */}
                      {rider.exchangePlate && (
                        <p className="text-[10px] text-yellow-600 mt-1">
                          ⚠ Exchange plate on record: <span className="font-mono font-bold">{rider.exchangePlate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {rider.documents.notes && (
                  <div className="mt-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">{rider.documents.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* ══ JOBS TAB ══ */}
            {tab === 'jobs' && (
              <div className="card p-0 overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="section-title">Job History</h3>
                </div>
                {riderJobs.length === 0
                  ? <p className="py-10 text-center text-sm text-gray-400">No jobs yet</p>
                  : (
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="table-head">Job ID</th>
                          <th className="table-head">Type</th>
                          <th className="table-head">Client</th>
                          <th className="table-head">Document</th>
                          <th className="table-head">Status</th>
                          <th className="table-head">Rider Earned</th>
                          <th className="table-head">Date</th>
                          <th className="table-head">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riderJobs.map(job => (
                          <tr key={job.id} className="table-row-hover">
                            <td className="table-cell">
                              <span className="font-mono text-xs font-bold text-maroon">{job.id}</span>
                            </td>
                            <td className="table-cell">
                              <span className={clsx('pill', job.type === 'check' ? 'pill-check' : 'pill-delivery')}>
                                {job.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="table-cell text-xs">{job.clientName}</td>
                            <td className="table-cell text-xs">{job.docType}</td>
                            <td className="table-cell">
                              <span className={clsx('pill', JOB_STATUS_CLASS[job.status])}>
                                {JOB_STATUS_LABEL[job.status]}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className="text-sm font-bold text-maroon">{fmtKsh(job.riderCut)}</span>
                            </td>
                            <td className="table-cell text-xs text-gray-400">
                              {fmtDate(job.createdAt)}
                            </td>
                            <td className="table-cell">
                              {job.riderRating
                                ? <span className="flex items-center gap-1 text-xs">
                                    <Star size={11} className="text-gold fill-gold" />
                                    {job.riderRating}
                                  </span>
                                : '—'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                }
              </div>
            )}

            {/* ══ EARNINGS TAB ══ */}
            {tab === 'earnings' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="card text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Lifetime Earned</p>
                    <p className="text-2xl font-black text-maroon">{fmtKsh(rider.totalEarnings)}</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Total Payouts</p>
                    <p className="text-2xl font-black text-green-600">
                      {fmtKsh(riderPayments.filter(p => p.status === 'released').reduce((s, p) => s + p.riderCut, 0))}
                    </p>
                  </div>
                  <div className="card text-center">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Pending Release</p>
                    <p className="text-2xl font-black text-gold">
                      {fmtKsh(riderPayments.filter(p => p.status === 'held').reduce((s, p) => s + p.riderCut, 0))}
                    </p>
                  </div>
                </div>

                <div className="card p-0 overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <h3 className="section-title">Payment History</h3>
                  </div>
                  {riderPayments.length === 0
                    ? <p className="py-10 text-center text-sm text-gray-400">No payments yet</p>
                    : (
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="table-head">Payment ID</th>
                            <th className="table-head">Job</th>
                            <th className="table-head">Total</th>
                            <th className="table-head">Rider Cut</th>
                            <th className="table-head">M-Pesa Ref</th>
                            <th className="table-head">Status</th>
                            <th className="table-head">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riderPayments.map(p => (
                            <tr key={p.id} className="table-row-hover">
                              <td className="table-cell font-mono text-xs text-maroon font-bold">{p.id}</td>
                              <td className="table-cell font-mono text-xs">{p.jobId}</td>
                              <td className="table-cell text-sm font-bold">{fmtKsh(p.totalAmount)}</td>
                              <td className="table-cell text-sm font-bold text-green-600">{fmtKsh(p.riderCut)}</td>
                              <td className="table-cell font-mono text-xs">{p.mpesaRef ?? '—'}</td>
                              <td className="table-cell">
                                <span className={clsx('pill', p.status === 'released' ? 'pill-approved' : 'pill-held')}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="table-cell text-xs text-gray-400">{fmtDate(p.heldAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  }
                </div>
              </>
            )}

            {/* ══ COMPLAINTS TAB ══ */}
            {tab === 'complaints' && (
              <div className="space-y-3">
                {riderTickets.length === 0
                  ? <div className="card text-center py-10 text-gray-400 text-sm">No complaints on record</div>
                  : riderTickets.map(ticket => (
                    <div key={ticket.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">{ticket.subject}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {ticket.id} · {fmtDate(ticket.createdAt)} · via {ticket.source}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className={clsx('pill', ticket.status === 'resolved' ? 'pill-resolved' : 'pill-open')}>
                            {ticket.status}
                          </span>
                          <span className={clsx('pill', ticket.priority === 'high'
                            ? 'bg-orange-50 text-orange-700 border-orange-300'
                            : 'pill-pending'
                          )}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {ticket.messages.map((msg: any) => (
                          <div key={msg.id} className={clsx(
                            'rounded-lg p-3 text-xs',
                            msg.from === 'admin'
                              ? 'bg-maroon-pale text-maroon ml-8'
                              : 'bg-surface text-gray-700'
                          )}>
                            <p className="font-semibold mb-1">{msg.fromName}</p>
                            <p className="leading-relaxed">{msg.text}</p>
                            <p className="text-[10px] opacity-60 mt-1">{fmtDateTime(msg.timestamp)}</p>
                          </div>
                        ))}
                      </div>
                      {ticket.resolution && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-[10px] font-bold text-green-700 mb-1">RESOLUTION</p>
                          <p className="text-xs text-green-700">{ticket.resolution}</p>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
