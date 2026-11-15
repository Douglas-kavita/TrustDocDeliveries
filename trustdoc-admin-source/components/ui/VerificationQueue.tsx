'use client'
import { useState } from 'react'
import { RIDERS } from '../../lib/mockData'
import { fmtTimeAgo } from '../../lib/utils'
import { CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'
import type { Rider } from '../../types'

export default function VerificationQueue() {
  const pending = RIDERS.filter(r => r.verificationStatus === 'pending')
  const [acted, setActed] = useState<Record<string, 'approved' | 'rejected'>>({})

  const approve = (id: string) => setActed(p => ({ ...p, [id]: 'approved' }))
  const reject  = (id: string) => setActed(p => ({ ...p, [id]: 'rejected' }))

  const hasMissingDocs = (r: Rider) =>
    !r.documents.idFrontUrl || !r.documents.idBackUrl || !r.documents.selfieUrl

  return (
    <div className="card p-0 overflow-hidden col-span-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="section-title">Verification Queue</h2>
        <span className="pill pill-open">{pending.length} PENDING</span>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {pending.map((rider) => {
          const decision    = acted[rider.id]
          const missingDocs = hasMissingDocs(rider)

          return (
            <div key={rider.id} className="px-4 py-3">
              <div className="flex items-start gap-2.5">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-maroon-pale border border-maroon/30
                                flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-maroon">
                    {rider.fullName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold text-gray-900">{rider.fullName}</p>
                    <span className="font-mono text-[9px] text-gray-400">{rider.id}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {fmtTimeAgo(rider.documents.submittedAt)}
                  </p>

                  {/* Missing docs warning */}
                  {missingDocs && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle size={11} className="text-yellow-500 flex-shrink-0" />
                      <span className="text-[10px] text-yellow-600">
                        {rider.documents.notes ?? 'Incomplete documents'}
                      </span>
                    </div>
                  )}

                  {/* Decision result */}
                  {decision && (
                    <span className={clsx(
                      'pill mt-1.5 inline-flex',
                      decision === 'approved' ? 'pill-approved' : 'pill-rejected'
                    )}>
                      {decision === 'approved' ? '✓ Approved' : '✗ Rejected'}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {!decision && (
                <div className="flex gap-2 mt-2.5">
                  <Link
                    href={`/riders/${rider.id}`}
                    className="flex items-center gap-1 text-[10px] font-semibold text-gray-500
                               bg-surface border border-border rounded-lg px-2.5 py-1.5
                               hover:border-maroon/30 transition-colors"
                  >
                    <Eye size={11} /> View
                  </Link>
                  <button
                    onClick={() => approve(rider.id)}
                    disabled={missingDocs}
                    className={clsx(
                      'flex items-center gap-1 text-[10px] font-semibold rounded-lg px-2.5 py-1.5 transition-colors',
                      missingDocs
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-maroon text-white hover:bg-maroon-dark'
                    )}
                  >
                    <CheckCircle size={11} /> Approve
                  </button>
                  <button
                    onClick={() => reject(rider.id)}
                    className="flex items-center gap-1 text-[10px] font-semibold
                               bg-red-50 text-red-600 border border-red-200
                               rounded-lg px-2.5 py-1.5 hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={11} /> Reject
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="bg-surface border-t border-border px-4 py-2 flex justify-between items-center">
        <span className="text-[10px] text-gray-400">Showing {pending.length} pending</span>
        <Link href="/riders/verify" className="section-action">View all →</Link>
      </div>
    </div>
  )
}
