'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'

interface PlatformEarning {
  txCode: string
  jobId: string
  date: string
  time: string
  jobType: 'Delivery' | 'Check'
  totalPaid: number
  platformCut: number
  cutPercent: number
  status: 'Released' | 'Held' | 'Pending'
}

const EARNINGS: PlatformEarning[] = [
  { txCode:'MCT-PAY-00001', jobId:'MCT-JOB-00001', date:'16 May 2026', time:'11:34 AM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Released' },
  { txCode:'MCT-PAY-00002', jobId:'MCT-JOB-00002', date:'16 May 2026', time:'10:18 AM', jobType:'Check',    totalPaid:350,  platformCut:52,  cutPercent:15, status:'Released' },
  { txCode:'MCT-PAY-00003', jobId:'MCT-JOB-00003', date:'16 May 2026', time:'09:12 AM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Held'     },
  { txCode:'MCT-PAY-00004', jobId:'MCT-JOB-00004', date:'16 May 2026', time:'08:45 AM', jobType:'Check',    totalPaid:350,  platformCut:52,  cutPercent:15, status:'Held'     },
  { txCode:'MCT-PAY-00005', jobId:'MCT-JOB-00005', date:'15 May 2026', time:'04:30 PM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Pending'  },
  { txCode:'MCT-PAY-00006', jobId:'MCT-JOB-00006', date:'15 May 2026', time:'02:25 PM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Released' },
  { txCode:'MCT-PAY-00007', jobId:'MCT-JOB-00007', date:'15 May 2026', time:'11:10 AM', jobType:'Check',    totalPaid:350,  platformCut:52,  cutPercent:15, status:'Pending'  },
  { txCode:'MCT-PAY-00008', jobId:'MCT-JOB-00008', date:'14 May 2026', time:'03:15 PM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Released' },
  { txCode:'MCT-PAY-00009', jobId:'MCT-JOB-00009', date:'14 May 2026', time:'10:40 AM', jobType:'Check',    totalPaid:350,  platformCut:52,  cutPercent:15, status:'Released' },
  { txCode:'MCT-PAY-00010', jobId:'MCT-JOB-00010', date:'13 May 2026', time:'02:00 PM', jobType:'Delivery', totalPaid:1000, platformCut:150, cutPercent:15, status:'Released' },
]

const STATUS_STYLE: Record<string, string> = {
  Released: 'bg-green-500/10 text-green-700 border border-green-500/25',
  Held:     'bg-yellow-500/10 text-yellow-700 border border-yellow-500/25',
  Pending:  'bg-gray-100 text-gray-500 border border-gray-200',
}

type FilterStatus = 'all' | 'Released' | 'Held' | 'Pending'

export default function PlatformEarnedPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered = EARNINGS.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return e.txCode.toLowerCase().includes(q) || e.jobId.toLowerCase().includes(q) || e.jobType.toLowerCase().includes(q)
    }
    return true
  })

  const totalEarned = filtered.reduce((s, e) => s + e.platformCut, 0)
  const totalVolume = filtered.reduce((s, e) => s + e.totalPaid, 0)
  const releasedAmt = filtered.filter(e => e.status === 'Released').reduce((s, e) => s + e.platformCut, 0)

  function exportCSV() {
    const headers = ['TX Code','Job ID','Date','Time','Job Type','Total Paid','Platform Cut','Cut %','Status']
    const rows = filtered.map(e => [e.txCode,e.jobId,e.date,e.time,e.jobType,e.totalPaid,e.platformCut,e.cutPercent+'%',e.status])
    const csv = [headers,...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `platform-earned-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Platform Reports" />
        <main className="flex-1 overflow-y-auto">

          {/* Maroon header */}
          <div className="relative bg-[#8b1a2f] px-8 py-6" style={{ borderBottom: '3px solid #6b1224' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20" />
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-4 transition-colors">
              ← Back to Reports
            </button>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Platform Earnings</h1>
                <p className="text-white/55 text-sm mt-1">TrustDoc cut per transaction — click TX code for full transaction details</p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Total Earned</p>
                    <p className="text-white font-bold text-xl font-mono">KSh {totalEarned.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Confirmed In</p>
                    <p className="text-green-300 font-bold text-xl font-mono">KSh {releasedAmt.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Total Volume</p>
                    <p className="text-white font-bold text-xl font-mono">KSh {totalVolume.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">Transactions</p>
                    <p className="text-white font-bold text-xl font-mono">{filtered.length}</p>
                  </div>
                </div>
              </div>
              <button onClick={exportCSV} className="mt-2 px-4 py-2 rounded-lg text-sm font-bold bg-white text-[#8b1a2f] hover:bg-white/90 transition-colors self-start">
                ⬇ Export CSV
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="px-8 py-3 bg-white border-b border-gray-200 flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search TX code or job ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#8b1a2f]/40 w-56 transition-colors"
            />
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(['all','Released','Held','Pending'] as FilterStatus[]).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filter===f ? 'bg-[#8b1a2f] text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-400 font-mono">{filtered.length} records</span>
          </div>

          {/* Table */}
          <div className="px-8 py-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#8b1a2f]/5 border-b border-gray-200">
                      {['TX Code','Date','Time','Job Type','Total Paid','Platform Cut','Cut %','Status',''].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-[#8b1a2f] uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e, i) => (
                      <tr key={e.txCode} className={`border-b border-gray-100 hover:bg-[#8b1a2f]/[0.03] transition-colors ${i%2===0?'bg-white':'bg-gray-50/40'}`}>

                        <td className="px-5 py-4 align-middle">
                          <Link href={`/payments/${e.jobId}`}
                            className="font-mono text-[12px] font-bold text-[#8b1a2f] hover:text-[#a82038] hover:underline transition-colors">
                            {e.txCode}
                          </Link>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className="text-xs text-gray-600">{e.date}</span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className="text-xs font-semibold text-gray-700">{e.time}</span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${e.jobType==='Delivery' ? 'bg-[#8b1a2f]/10 text-[#8b1a2f]' : 'bg-amber-100 text-amber-700'}`}>
                            {e.jobType}
                          </span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className="font-mono text-xs text-gray-400">KSh {e.totalPaid.toLocaleString()}</span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className="font-mono text-sm font-bold text-[#b8922a]">KSh {e.platformCut.toLocaleString()}</span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className="text-xs text-gray-400 font-mono">{e.cutPercent}%</span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[e.status]}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {e.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 align-middle">
                          <Link href={`/payments/${e.jobId}`}
                            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-white bg-[#8b1a2f] hover:bg-[#a82038] px-3 py-1 rounded-lg transition-colors">
                            Open →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#8b1a2f]/5 border-t-2 border-[#8b1a2f]/15">
                      <td colSpan={4} className="px-5 py-3 text-xs font-bold text-[#8b1a2f] uppercase tracking-wider">
                        Total · {filtered.length} transactions
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs text-gray-400 font-semibold">KSh {totalVolume.toLocaleString()}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-sm font-bold text-[#b8922a]">KSh {totalEarned.toLocaleString()}</span>
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Click <span className="font-mono text-[#8b1a2f] font-semibold">MCT-PAY-XXXXX</span> or <strong>Open →</strong> to see client, rider, M-Pesa codes, receipt and full audit trail for that transaction.
            </p>
          </div>

        </main>
      </div>
    </div>
  )
}
