'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'

interface RiderEarning {
  txCode: string
  jobId: string
  riderId: string
  riderName: string
  date: string
  time: string
  jobType: 'Delivery' | 'Check'
  totalPaid: number
  riderPayout: number
  platformCut: number
  platformRate: number
  status: 'Released' | 'Held' | 'Pending'
}

const EARNINGS: RiderEarning[] = [
  { txCode:'RDR-PAY-00001', jobId:'MCT-JOB-00001', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'16 May 2026', time:'11:34 AM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Released' },
  { txCode:'RDR-PAY-00002', jobId:'MCT-JOB-00002', riderId:'MCT-RDR-00002', riderName:'Peter Njoroge', date:'16 May 2026', time:'10:18 AM', jobType:'Check',    totalPaid:350,  riderPayout:250, platformCut:100, platformRate:15, status:'Released' },
  { txCode:'RDR-PAY-00003', jobId:'MCT-JOB-00003', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'16 May 2026', time:'09:12 AM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Held'     },
  { txCode:'RDR-PAY-00004', jobId:'MCT-JOB-00004', riderId:'MCT-RDR-00002', riderName:'Peter Njoroge', date:'16 May 2026', time:'08:45 AM', jobType:'Check',    totalPaid:350,  riderPayout:250, platformCut:100, platformRate:15, status:'Held'     },
  { txCode:'RDR-PAY-00005', jobId:'MCT-JOB-00005', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'15 May 2026', time:'04:30 PM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Pending'  },
  { txCode:'RDR-PAY-00006', jobId:'MCT-JOB-00006', riderId:'MCT-RDR-00002', riderName:'Peter Njoroge', date:'15 May 2026', time:'02:25 PM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Released' },
  { txCode:'RDR-PAY-00007', jobId:'MCT-JOB-00007', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'15 May 2026', time:'11:10 AM', jobType:'Check',    totalPaid:350,  riderPayout:250, platformCut:100, platformRate:15, status:'Pending'  },
  { txCode:'RDR-PAY-00008', jobId:'MCT-JOB-00008', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'14 May 2026', time:'03:15 PM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Released' },
  { txCode:'RDR-PAY-00009', jobId:'MCT-JOB-00009', riderId:'MCT-RDR-00002', riderName:'Peter Njoroge', date:'14 May 2026', time:'10:40 AM', jobType:'Check',    totalPaid:350,  riderPayout:250, platformCut:100, platformRate:15, status:'Released' },
  { txCode:'RDR-PAY-00010', jobId:'MCT-JOB-00010', riderId:'MCT-RDR-00001', riderName:'Samuel Kamau',  date:'13 May 2026', time:'02:00 PM', jobType:'Delivery', totalPaid:1000, riderPayout:850, platformCut:150, platformRate:15, status:'Released' },
]

const STATUS_STYLE: Record<string, string> = {
  Released: 'bg-green-500/10 text-green-700 border border-green-500/25',
  Held:     'bg-yellow-500/10 text-yellow-700 border border-yellow-500/25',
  Pending:  'bg-gray-100 text-gray-500 border border-gray-200',
}

type FilterStatus = 'all' | 'Released' | 'Held' | 'Pending'

function fmtKsh(n: number) {
  return `KSh ${n.toLocaleString()}`
}

export default function RiderEarnedPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered = EARNINGS.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        e.txCode.toLowerCase().includes(q) ||
        e.jobId.toLowerCase().includes(q) ||
        e.riderId.toLowerCase().includes(q) ||
        e.riderName.toLowerCase().includes(q) ||
        e.jobType.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalPayout     = filtered.reduce((s, e) => s + e.riderPayout, 0)
  const totalVolume     = filtered.reduce((s, e) => s + e.totalPaid, 0)
  const totalPlatform   = filtered.reduce((s, e) => s + e.platformCut, 0)
  const releasedAmt     = filtered.filter(e => e.status === 'Released').reduce((s, e) => s + e.riderPayout, 0)

  function exportCSV() {
    const headers = ['TX Code','Job ID','Rider ID','Rider Name','Date','Time','Job Type','Total Paid','Rider Payout','Platform Cut','Platform Rate','Status']
    const rows = filtered.map(e => [e.txCode, e.jobId, e.riderId, e.riderName, e.date, e.time, e.jobType, e.totalPaid, e.riderPayout, e.platformCut, e.platformRate+'%', e.status])
    const csv = [headers,...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `rider-earnings-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Rider Reports" />
        <main className="flex-1 overflow-y-auto">

          {/* Maroon header */}
          <div className="relative bg-[#8b1a2f] px-8 py-6" style={{ borderBottom: '3px solid #6b1224' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20" />
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-4 transition-colors"
            >
              ← Back to Reports
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-white font-bold text-[20px]">Rider Earnings</h1>
                <p className="text-white/60 text-[12px] mt-1">Rider payouts per transaction — click TX code for full transaction details</p>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#f5c842] text-[#8b1a2f] text-[12px] font-bold hover:bg-yellow-300 transition-colors"
              >
                ⬇ Export CSV
              </button>
            </div>

            {/* Summary pills */}
            <div className="flex gap-4 mt-5 flex-wrap">
              {[
                { label: 'TOTAL EARNED',      value: fmtKsh(totalPayout),   highlight: true  },
                { label: 'CONFIRMED IN',       value: fmtKsh(releasedAmt),   highlight: true  },
                { label: 'TOTAL VOLUME',       value: fmtKsh(totalVolume),   highlight: false },
                { label: 'PLATFORM DEDUCTED',  value: fmtKsh(totalPlatform), highlight: false },
                { label: 'TRANSACTIONS',       value: String(filtered.length), highlight: false },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 min-w-[130px]">
                  <p className="text-white/50 text-[9px] font-bold tracking-widest uppercase">{s.label}</p>
                  <p className={`font-bold text-[16px] mt-1 ${s.highlight ? 'text-[#f5c842]' : 'text-white'}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters + search */}
          <div className="px-8 py-4 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search TX code, rider, or job ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#8b1a2f]/40 w-64 transition-colors"
            />
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['all', 'Released', 'Held', 'Pending'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-[11px] font-medium transition-all capitalize ${
                    filter === f ? 'bg-[#8b1a2f] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="ml-auto text-[11px] text-gray-400 font-mono">{filtered.length} records</span>
          </div>

          {/* Table */}
          <div className="px-8 py-6">
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['TX Code', 'Job ID', 'Rider', 'Date', 'Time', 'Job Type', 'Total Paid', 'Rider Payout', 'Platform Cut', 'Rate', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => (
                    <tr key={e.txCode} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-[#8b1a2f] font-semibold">{e.txCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] text-gray-500">{e.jobId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/riders/${e.riderId}`)}
                          className="text-left hover:opacity-75 transition-opacity"
                        >
                          <p className="text-[12px] font-semibold text-gray-800 hover:text-[#8b1a2f]">{e.riderName}</p>
                          <p className="text-[10px] font-mono text-[#8b1a2f]">{e.riderId}</p>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-500">{e.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-500">{e.time}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                          e.jobType === 'Delivery'
                            ? 'border border-[#8b1a2f]/20'
                            : 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20'
                        }`} style={e.jobType === 'Delivery' ? { background: 'rgba(139,26,47,0.08)', color: '#8b1a2f' } : {}}>
                          {e.jobType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-mono text-gray-600">{fmtKsh(e.totalPaid)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-mono font-bold text-[#8b1a2f]">{fmtKsh(e.riderPayout)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-mono text-gray-500">− {fmtKsh(e.platformCut)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono text-gray-500">{e.platformRate}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[e.status]}`}>
                          ● {e.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.push(`/payments/${e.jobId}`)}
                          className="px-3 py-1 rounded-lg text-[11px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td colSpan={6} className="px-4 py-3">
                      <span className="text-[12px] font-bold text-[#1a1c14]">TOTAL — {filtered.length} TRANSACTIONS</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono font-bold text-gray-700">{fmtKsh(totalVolume)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[13px] font-mono font-bold text-[#8b1a2f]">{fmtKsh(totalPayout)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[12px] font-mono font-bold text-gray-500">− {fmtKsh(totalPlatform)}</span>
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
              <p className="px-4 py-3 text-[11px] text-gray-400 border-t border-gray-100">
                Click <strong className="text-[#8b1a2f]">RDR-PAY-XXXXX</strong> or <strong>Open →</strong> to see client, rider, M-Pesa codes, receipt and full audit trail for that transaction.
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
