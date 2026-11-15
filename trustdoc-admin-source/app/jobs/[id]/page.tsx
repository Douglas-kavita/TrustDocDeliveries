'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'
import { JOBS, PAYMENTS } from '../../../lib/mockData'
import { fmtDateTime, fmtKsh, JOB_STATUS_CLASS, JOB_STATUS_LABEL } from '../../../lib/utils'
import { ArrowLeft, MapPin, User, Bike, FileText, CreditCard, QrCode, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const job     = JOBS.find(j => j.id === id)
  const payment = PAYMENTS.find(p => p.jobId === id)

  if (!job) return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-bold text-maroon mb-2">Job not found</p>
        <Link href="/jobs" className="btn-ghost text-sm">← Back to Jobs</Link>
      </div>
    </div>
  )

  const isPremium = job.totalAmount > 1000

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={`Job ${job.id}`}
          subtitle={`${job.docType} · ${job.office}`}
          actions={
            <Link href="/jobs" className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
              <ArrowLeft size={13} /> Back
            </Link>
          }
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Status banner */}
          <div className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={clsx('pill text-sm px-3 py-1', JOB_STATUS_CLASS[job.status])}>
                {JOB_STATUS_LABEL[job.status]}
              </span>
              <span className={clsx('pill', isPremium ? 'pill-delivery' : 'pill-check')}>
                {isPremium ? 'PREMIUM' : 'STANDARD'}
              </span>
              <span className={clsx('pill', job.type === 'check' ? 'pill-check' : 'pill-delivery')}>
                {job.type.toUpperCase()}
              </span>
              {job.qrScanned && (
                <span className="pill pill-approved flex items-center gap-1">
                  <QrCode size={10} /> QR Verified
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">
              Created: {fmtDateTime(job.createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">

            {/* Client info */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gold-pale flex items-center justify-center">
                  <User size={14} className="text-gold" />
                </div>
                <h3 className="section-title">Client</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400 text-xs">Name</span><p className="font-semibold">{job.clientName}</p></div>
                <div><span className="text-gray-400 text-xs">Client ID</span><p className="font-mono text-xs text-maroon font-bold">{job.clientId}</p></div>
                <div><span className="text-gray-400 text-xs">Phone</span><p className="font-medium">{job.clientPhone}</p></div>
                <div><span className="text-gray-400 text-xs">Delivery Address</span><p className="text-xs">{job.clientLocation.address}</p></div>
              </div>
              <Link href={`/clients/${job.clientId}`} className="mt-3 text-xs text-maroon hover:underline block">
                View client profile →
              </Link>
            </div>

            {/* Rider info */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-maroon-pale flex items-center justify-center">
                  <Bike size={14} className="text-maroon" />
                </div>
                <h3 className="section-title">Rider</h3>
              </div>
              {job.riderName
                ? (
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400 text-xs">Name</span><p className="font-semibold">{job.riderName}</p></div>
                    <div><span className="text-gray-400 text-xs">Rider ID</span><p className="font-mono text-xs text-maroon font-bold">{job.riderId}</p></div>
                    <div><span className="text-gray-400 text-xs">Phone</span><p className="font-medium">{job.riderPhone}</p></div>
                    <div>
                      <span className="text-gray-400 text-xs">Rider's Cut</span>
                      <p className="text-lg font-black text-green-600">{fmtKsh(job.riderCut)}</p>
                    </div>
                    {job.completedAt && (
                      <div><span className="text-gray-400 text-xs">Completed</span><p className="text-xs">{fmtDateTime(job.completedAt)}</p></div>
                    )}
                  </div>
                )
                : (
                  <div className="py-6 text-center text-gray-400">
                    <Bike size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No rider assigned yet</p>
                  </div>
                )
              }
              {job.riderId && (
                <Link href={`/riders/${job.riderId}`} className="mt-3 text-xs text-maroon hover:underline block">
                  View rider profile →
                </Link>
              )}
            </div>

            {/* Document + office info */}
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-surface flex items-center justify-center border border-border">
                  <FileText size={14} className="text-gray-500" />
                </div>
                <h3 className="section-title">Document & Office</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400 text-xs">Document Type</span><p className="font-semibold">{job.docType}</p></div>
                <div><span className="text-gray-400 text-xs">Office</span><p className="font-medium text-xs">{job.office}</p></div>
                <div><span className="text-gray-400 text-xs">Office Address</span><p className="text-xs">{job.officeLocation.address}</p></div>
                {job.checkResult && (
                  <div>
                    <span className="text-gray-400 text-xs">Check Result</span>
                    <span className={clsx('pill mt-1 block w-fit',
                      job.checkResult === 'available' ? 'pill-approved'
                      : job.checkResult === 'not_ready' ? 'pill-pending' : 'pill-rejected'
                    )}>
                      {job.checkResult.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment & Escrow */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gold-pale flex items-center justify-center">
                <CreditCard size={14} className="text-gold" />
              </div>
              <h3 className="section-title">Payment & Escrow</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Total Paid by Client', value: fmtKsh(job.totalAmount),   color: 'text-gray-900' },
                { label: 'Rider Receives (85%)', value: fmtKsh(job.riderCut),      color: 'text-green-600' },
                { label: 'Platform Cut (15%)',   value: fmtKsh(job.platformCut),    color: 'text-maroon' },
                { label: 'M-Pesa Ref',           value: job.paymentRef ?? '—',      color: 'text-gray-600' },
                { label: 'Escrow Status',        value: job.escrowReleased ? 'Released ✓' : job.status !== 'pending_payment' ? 'Held' : 'Awaiting payment',
                  color: job.escrowReleased ? 'text-green-600' : 'text-gold' },
              ].map(f => (
                <div key={f.label} className="bg-surface rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{f.label}</p>
                  <p className={clsx('text-sm font-bold font-mono', f.color)}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Job timeline */}
          <div className="card">
            <h3 className="section-title mb-4">Job Timeline</h3>
            <div className="space-y-3">
              {[
                { label: 'Job created',    time: job.createdAt,    done: true },
                { label: 'Payment received & escrow held', time: job.createdAt, done: job.status !== 'pending_payment' },
                { label: 'Rider accepted', time: job.acceptedAt,   done: !!job.acceptedAt },
                { label: 'Document packaged + QR scanned', time: job.packagedAt, done: !!job.packagedAt },
                { label: 'In transit to client', time: null,       done: job.status === 'in_transit' || !!job.deliveredAt },
                { label: 'OTP confirmed — delivered', time: job.deliveredAt, done: !!job.deliveredAt },
                { label: 'Escrow released to rider', time: job.completedAt, done: !!job.completedAt },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={clsx(
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    step.done ? 'bg-green-600' : 'bg-gray-200'
                  )}>
                    {step.done && <ShieldCheck size={11} className="text-white" />}
                  </div>
                  <p className={clsx('text-xs flex-1', step.done ? 'text-gray-900 font-medium' : 'text-gray-400')}>
                    {step.label}
                  </p>
                  {step.time && step.done && (
                    <p className="text-[10px] text-gray-400">{fmtDateTime(step.time)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
