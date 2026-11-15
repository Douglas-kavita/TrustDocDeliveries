import { ACTIVITY } from '../../lib/mockData'
import { ACTIVITY_DOT, fmtTimeAgo } from '../../lib/utils'
import Link from 'next/link'
import clsx from 'clsx'

export default function ActivityFeed() {
  return (
    <div className="card p-0 overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <h2 className="section-title">Live Activity</h2>
        <span className="pill pill-live">● LIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {ACTIVITY.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors">
            {/* Colour dot */}
            <div className={clsx(
              'w-2 h-2 rounded-full flex-shrink-0 mt-1.5',
              ACTIVITY_DOT[item.type] ?? 'bg-gray-400'
            )} />

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-800 leading-snug">{item.text}</p>
              {item.subText && (
                <p className="text-[10px] text-gray-400 mt-0.5">{item.subText}</p>
              )}
            </div>

            {/* Time + link */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {fmtTimeAgo(item.timestamp)}
              </span>
              {item.linkId && (
                <Link
                  href={`/${item.linkType}s/${item.linkId}`}
                  className="text-[10px] text-maroon hover:underline"
                >
                  View →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
