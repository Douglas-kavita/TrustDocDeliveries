import { RIDERS } from '../../lib/mockData'
import { fmtKsh } from '../../lib/utils'
import Link from 'next/link'

const MOCK_WEEKLY = [
  { jobs: 23, earned: 8150 },
  { jobs: 19, earned: 6800 },
  { jobs: 16, earned: 5750 },
  { jobs: 14, earned: 4900 },
  { jobs: 11, earned: 3850 },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold text-xs tracking-tight">
      {'★'.repeat(Math.round(rating))}
      <span className="text-gray-200">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  )
}

export default function TopRiders() {
  const approved = RIDERS.filter(r => r.verificationStatus === 'approved').slice(0, 5)

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="section-title">Top Riders — This Week</h2>
        <Link href="/riders" className="section-action">All riders →</Link>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <th className="table-head">#</th>
            <th className="table-head">Rider</th>
            <th className="table-head">ID</th>
            <th className="table-head">Jobs</th>
            <th className="table-head">Rating</th>
            <th className="table-head">Earned</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((rider, i) => {
            const weekly = MOCK_WEEKLY[i]
            const rankColor = i === 0 ? 'text-gold font-black' : 'text-gray-400 font-bold'
            return (
              <tr key={rider.id} className="table-row-hover">
                <td className="table-cell">
                  <span className={`text-sm ${rankColor}`}>{i + 1}</span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-maroon-pale border border-maroon/30
                                    flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-maroon">
                        {rider.fullName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <Link
                      href={`/riders/${rider.id}`}
                      className="text-xs font-medium hover:text-maroon hover:underline transition-colors"
                    >
                      {rider.fullName.split(' ')[0]} {rider.fullName.split(' ')[1]?.[0]}.
                    </Link>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="font-mono text-[10px] text-gray-400">{rider.id}</span>
                </td>
                <td className="table-cell">
                  <span className="text-xs font-bold">{weekly.jobs}</span>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-1">
                    <Stars rating={rider.rating} />
                    <span className="text-[10px] text-gray-400">{rider.rating}</span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className="text-sm font-bold text-maroon">
                    {fmtKsh(weekly.earned)}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
