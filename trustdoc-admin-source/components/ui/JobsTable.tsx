import Link from 'next/link'
import { JOBS } from '../../lib/mockData'
import { JOB_STATUS_LABEL, JOB_STATUS_CLASS, fmtKsh, fmtTimeAgo } from '../../lib/utils'
import { ExternalLink } from 'lucide-react'
import clsx from 'clsx'

export default function JobsTable() {
  return (
    <div className="card p-0 overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="section-title">Recent Jobs</h2>
        <Link href="/jobs" className="section-action">View all →</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-head">Job</th>
              <th className="table-head">Client</th>
              <th className="table-head">Rider</th>
              <th className="table-head">Type</th>
              <th className="table-head">Status</th>
              <th className="table-head">Escrow</th>
              <th className="table-head">Amount</th>
              <th className="table-head">Time</th>
              <th className="table-head"></th>
            </tr>
          </thead>
          <tbody>
            {JOBS.map((job) => (
              <tr key={job.id} className="table-row-hover">
                <td className="table-cell">
                  <p className="font-mono text-xs font-bold text-maroon">{job.id}</p>
                  <p className="text-[10px] text-gray-400">{job.docType}</p>
                </td>
                <td className="table-cell">
                  <p className="text-xs font-medium">{job.clientName}</p>
                  <p className="text-[10px] text-gray-400">{job.clientId}</p>
                </td>
                <td className="table-cell">
                  {job.riderName
                    ? <>
                        <p className="text-xs font-medium">{job.riderName}</p>
                        <p className="text-[10px] text-gray-400">{job.riderId}</p>
                      </>
                    : <span className="text-[10px] text-gray-400 italic">Unassigned</span>
                  }
                </td>
                <td className="table-cell">
                  <span className={clsx('pill', job.type === 'check' ? 'pill-check' : 'pill-delivery')}>
                    {job.type.toUpperCase()}
                  </span>
                </td>
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
                <td className="table-cell">
                  <p className="text-sm font-bold text-maroon">{fmtKsh(job.totalAmount)}</p>
                  <p className="text-[10px] text-gray-400">
                    R:{job.riderCut} · P:{job.platformCut}
                  </p>
                </td>
                <td className="table-cell">
                  <p className="text-[10px] text-gray-400 whitespace-nowrap">
                    {fmtTimeAgo(job.createdAt)}
                  </p>
                </td>
                <td className="table-cell">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-gray-300 hover:text-maroon transition-colors"
                  >
                    <ExternalLink size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
