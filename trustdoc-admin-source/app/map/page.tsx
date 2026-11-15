'use client'
import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { JOBS, RIDERS } from '../../lib/mockData'
import { fmtTimeAgo } from '../../lib/utils'
import { MapPin, Bike, Package, Clock, Navigation } from 'lucide-react'
import clsx from 'clsx'

// Mock rider positions around Nairobi
const RIDER_POSITIONS = [
  { riderId: 'MCT-RDR-00001', name: 'Samuel Kamau',  plate: 'KDG 123A', lat: -1.2741, lng: 36.8100, status: 'delivering', jobId: 'MCT-JOB-00003' },
  { riderId: 'MCT-RDR-00002', name: 'Peter Njoroge', plate: 'KBZ 456B', lat: -1.2697, lng: 36.8086, status: 'idle',       jobId: null            },
]

const STATUS_COLOR: Record<string, string> = {
  delivering: 'bg-maroon text-white',
  idle:       'bg-gold-pale text-gold border border-gold',
  offline:    'bg-gray-100 text-gray-400',
}

const STATUS_DOT: Record<string, string> = {
  delivering: 'bg-maroon',
  idle:       'bg-gold',
  offline:    'bg-gray-300',
}

export default function LiveMapPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const activeJobs = JOBS.filter(j =>
    ['assigned', 'in_progress', 'packaged', 'in_transit'].includes(j.status)
  )

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Live Rider Map"
          subtitle={`${RIDER_POSITIONS.filter(r => r.status !== 'offline').length} riders active · ${activeJobs.length} jobs in progress`}
        />

        <div className="flex-1 overflow-hidden flex">

          {/* ── Left panel: rider list ── */}
          <div className="w-72 flex-shrink-0 border-r border-border bg-white flex flex-col overflow-hidden">

            {/* Legend */}
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Map Legend</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: 'Delivering', color: 'bg-maroon' },
                  { label: 'Idle',       color: 'bg-gold'   },
                  { label: 'Office',     color: 'bg-blue-600' },
                  { label: 'Client',     color: 'bg-green-600' },
                ].map(l => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0', l.color)} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Rider list */}
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {RIDER_POSITIONS.map(r => {
                const job = r.jobId ? JOBS.find(j => j.id === r.jobId) : null
                const isSelected = selected === r.riderId
                return (
                  <button
                    key={r.riderId}
                    onClick={() => setSelected(isSelected ? null : r.riderId)}
                    className={clsx(
                      'w-full text-left px-4 py-3 transition-colors',
                      isSelected ? 'bg-maroon-pale border-l-2 border-l-maroon' : 'hover:bg-surface'
                    )}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', STATUS_DOT[r.status])} />
                      <p className="text-xs font-semibold text-gray-900">{r.name}</p>
                      <span className="font-mono text-[9px] bg-gray-100 px-1.5 py-0.5 rounded ml-auto">
                        {r.plate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1">
                      <span className="font-mono">{r.riderId}</span>
                    </div>
                    <span className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-full', STATUS_COLOR[r.status])}>
                      {r.status.toUpperCase()}
                    </span>
                    {job && (
                      <div className="mt-2 bg-surface rounded-lg p-2">
                        <p className="text-[10px] font-semibold text-gray-700">{job.id}</p>
                        <p className="text-[9px] text-gray-400">{job.docType} → {job.clientName}</p>
                        <p className="text-[9px] text-gray-400">{job.clientLocation.address}</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active jobs summary */}
            <div className="border-t border-border p-4 flex-shrink-0 bg-surface">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Active Jobs</p>
              {activeJobs.length === 0
                ? <p className="text-xs text-gray-400">No active jobs</p>
                : activeJobs.map(job => (
                  <div key={job.id} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0',
                      job.status === 'in_transit' ? 'bg-maroon' : 'bg-gold'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-gray-700 truncate">{job.id}</p>
                      <p className="text-[9px] text-gray-400 truncate">{job.riderName ?? 'Unassigned'}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 flex-shrink-0">
                      {fmtTimeAgo(job.createdAt)}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* ── Map area ── */}
          <div className="flex-1 relative overflow-hidden bg-gray-200">

            {/* Google Maps iframe — replace YOUR_API_KEY with real key */}
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=-1.2864,36.8172&zoom=13&maptype=roadmap`}
            />

            {/* Overlay: no API key message */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
              <div className="text-center bg-white rounded-2xl border border-border p-8 shadow-lg max-w-sm">
                <div className="w-14 h-14 bg-maroon-pale border-2 border-maroon rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin size={26} className="text-maroon" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Google Maps Ready</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  Replace <span className="font-mono bg-gray-100 px-1 rounded">YOUR_GOOGLE_MAPS_API_KEY</span> in{' '}
                  <span className="font-mono bg-gray-100 px-1 rounded">app/map/page.tsx</span> with your real API key to activate live rider tracking.
                </p>
                <div className="bg-surface rounded-lg p-3 text-left space-y-2">
                  {RIDER_POSITIONS.map(r => (
                    <div key={r.riderId} className="flex items-center gap-2">
                      <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', STATUS_DOT[r.status])} />
                      <span className="text-xs text-gray-700 font-semibold">{r.name}</span>
                      <span className="font-mono text-[9px] text-gray-400 ml-auto">{r.plate}</span>
                      <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded-full', STATUS_COLOR[r.status])}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-3">
                  Live coordinates update every 10 seconds via Firebase
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
