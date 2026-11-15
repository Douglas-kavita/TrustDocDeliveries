'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'
import { CLIENTS } from '../../../lib/mockData'
import { fmtDate, fmtKsh } from '../../../lib/utils'

// ─────────────────────────────────────────────
// MOCK JOB HISTORY per client
// ─────────────────────────────────────────────
const CLIENT_JOBS: Record<string, any[]> = {
  'MCT-CLT-00001': [
    { id:'MCT-JOB-00001', docType:'Passport',        status:'Completed',  amount:1000, date:'16 May 2026', time:'11:34 AM' },
    { id:'MCT-JOB-00003', docType:'National ID',     status:'In Transit', amount:1000, date:'16 May 2026', time:'09:12 AM' },
    { id:'MCT-JOB-00008', docType:'Logbook',         status:'Failed',     amount:1000, date:'14 May 2026', time:'02:10 PM' },
  ],
  'MCT-CLT-00002': [
    { id:'MCT-JOB-00002', docType:'Birth Certificate', status:'Completed', amount:350, date:'16 May 2026', time:'10:18 AM' },
  ],
  'MCT-CLT-00003': [
    { id:'MCT-JOB-00003', docType:'National ID', status:'In Transit', amount:1000, date:'16 May 2026', time:'09:12 AM' },
  ],
  'MCT-CLT-00004': [
    { id:'MCT-JOB-00004', docType:'KRA PIN', status:'Awaiting Pickup', amount:350, date:'16 May 2026', time:'08:45 AM' },
  ],
  'MCT-CLT-00005': [
    { id:'MCT-JOB-00005', docType:'Driving Licence', status:'Awaiting Payment', amount:1000, date:'15 May 2026', time:'04:30 PM' },
  ],
}

const JOB_STATUS_COLOR: Record<string, string> = {
  'Completed':       'text-green-600',
  'In Transit':      'text-blue-500',
  'Failed':          'text-red-500',
  'Awaiting Pickup': 'text-purple-500',
  'Awaiting Payment':'text-yellow-600',
}

type Tab = 'overview' | 'documents' | 'jobs'

export default function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [tab, setTab] = useState<Tab>('overview')

  // Find client from mock data
  const client = CLIENTS.find(c => c.id === id)

  if (!client) {
    return (
      <div className="flex h-screen bg-[#f5f3ee]">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar title="Citizen Profile" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[32px] mb-2">🔍</p>
              <p className="text-[15px] font-semibold text-gray-600">Client not found</p>
              <p className="text-[12px] text-gray-400 mt-1">{id}</p>
              <button onClick={() => router.back()} className="mt-4 px-4 py-2 rounded-lg bg-[#8b1a2f] text-white text-[12px]">← Back</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const jobs = CLIENT_JOBS[id] ?? []
  const initials = client.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)

  const TABS: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: 'overview',  label: 'Overview',  icon: '○' },
    { key: 'documents', label: 'Documents', icon: '📄' },
    { key: 'jobs',      label: 'Jobs',      icon: '📋', count: jobs.length },
  ]

  return (
    <div className="flex h-screen bg-[#f5f3ee] text-[#1a1c14] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Citizen Profile" />
        <main className="flex-1 overflow-y-auto">

          {/* Top breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#1a1c14]">{client.fullName}</p>
              <p className="text-[11px] text-gray-400">{client.id} · {client.location}</p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Maroon hero banner */}
          <div className="bg-[#8b1a2f] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-[22px] font-bold border-2 border-white/30">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-white font-bold text-[20px]">{client.fullName}</h1>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    client.accountStatus === 'active'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-600 border border-red-200'
                  }`}>
                    {client.accountStatus}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/70 text-[12px] flex-wrap">
                  <span className="text-[#f5c842] font-mono font-semibold">{client.id}</span>
                  <span>📞 {client.phone}</span>
                  <span>📍 {client.location}</span>
                  {client.nationalId && <span>National ID: {client.nationalId}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => alert(`Suspending client ${client.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium border border-white/20 transition-colors"
            >
              🚫 Suspend
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-8">
            <div className="flex gap-0">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-medium border-b-2 transition-all ${
                    tab === t.key
                      ? 'border-[#8b1a2f] text-[#8b1a2f]'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t.icon} {t.label}
                  {t.count !== undefined && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-mono">{t.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="px-8 py-6 space-y-6">

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: '📋', label: 'Total Orders',  value: client.totalOrders,          sub: 'All time'       },
                    { icon: '💰', label: 'Total Spent',   value: fmtKsh(client.totalSpent),   sub: 'Across all jobs' },
                    { icon: '📅', label: 'Member Since',  value: fmtDate(client.joinedAt),    sub: 'Registration date' },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px]" style={{ background: 'rgba(139,26,47,0.08)' }}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                        <p className="text-[20px] font-bold text-[#1a1c14] mt-0.5">{s.value}</p>
                        <p className="text-[11px] text-gray-400">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal info */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                  <h2 className="text-[15px] font-bold text-[#1a1c14] mb-5">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-y-5">
                    {[
                      ['Full Name',   client.fullName],
                      ['Client ID',  client.id],
                      ['National ID', client.nationalId ?? '—'],
                      ['Phone',       client.phone],
                      ['Email',       client.email ?? '—'],
                      ['Location',    client.location],
                      ['Status',      client.accountStatus],
                      ['Joined',      fmtDate(client.joinedAt)],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-[11px] text-gray-400">{label}</p>
                        <p className="text-[13px] font-semibold text-[#1a1c14] mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── DOCUMENTS ── */}
            {tab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-[#1a1c14]">Identity Documents</h2>
                  <span className="text-[11px] text-gray-400">Submitted for verification · {fmtDate(client.joinedAt)}</span>
                </div>

                {/* Only National ID — no selfie required for clients */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'National ID — Front', status: client.nationalId ? 'uploaded' : 'missing' },
                    { label: 'National ID — Back',  status: client.nationalId ? 'uploaded' : 'missing' },
                  ].map(doc => (
                    <div key={doc.label} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <div className={`h-48 flex flex-col items-center justify-center border-b border-gray-100 ${
                        doc.status === 'missing' ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        {doc.status === 'missing' ? (
                          <>
                            <div className="text-red-400 text-[32px] mb-2">⚠</div>
                            <p className="text-[13px] font-semibold text-red-400">Missing</p>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-300 text-[40px] mb-2">📄</div>
                            <p className="text-[12px] text-gray-400">Document on file</p>
                            <p className="text-[10px] text-gray-300 mt-1">(Firebase URL in production)</p>
                          </>
                        )}
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-[#1a1c14]">{doc.label}</p>
                          <p className={`text-[11px] mt-0.5 ${doc.status === 'missing' ? 'text-red-400' : 'text-gray-400'}`}>
                            {doc.status === 'missing' ? 'Not uploaded' : 'Uploaded'}
                          </p>
                        </div>
                        {doc.status === 'uploaded' ? (
                          <button
                            onClick={() => alert(`Viewing ${doc.label} for ${client.id}`)}
                            className="text-[11px] px-3 py-1 rounded-lg font-medium border border-[#8b1a2f]/20 transition-colors"
                            style={{ background: 'rgba(139,26,47,0.08)', color: '#8b1a2f' }}
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Requesting upload from ${client.fullName}`)}
                            className="text-[11px] px-3 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors font-medium"
                          >
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Verification decision */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#1a1c14]">Verification Decision</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Review National ID before approving this client account.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Rejecting client ${client.id}`)}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      ✗ Reject
                    </button>
                    <button
                      onClick={() => alert(`Approving client ${client.id}`)}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      ✓ Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── JOBS ── */}
            {tab === 'jobs' && (
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-[#1a1c14]">Job History</h2>
                  <span className="text-[11px] text-gray-400 font-mono">{jobs.length} records</span>
                </div>
                {jobs.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-[32px] mb-2">📭</p>
                    <p className="text-[13px] font-semibold text-gray-500">No jobs yet</p>
                    <p className="text-[11px] text-gray-400 mt-1">This client has not placed any orders.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {['Job ID', 'Document', 'Status', 'Amount', 'Date', ''].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j: any) => (
                        <tr
                          key={j.id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => router.push(`/payments/${j.id}`)}
                        >
                          <td className="px-4 py-3 font-mono text-[11px] text-[#8b1a2f] font-semibold">{j.id}</td>
                          <td className="px-4 py-3 text-[12px] text-gray-700">{j.docType}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[12px] font-medium ${JOB_STATUS_COLOR[j.status] ?? 'text-gray-500'}`}>{j.status}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#1a1c14]">KSh {j.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[12px] text-gray-400">{j.date} · {j.time}</td>
                          <td className="px-4 py-3">
                            <button className="px-2 py-1 rounded text-[10.5px] font-medium" style={{ background: 'rgba(139,26,47,0.10)', color: '#8b1a2f', border: '1px solid rgba(139,26,47,0.2)' }}>
                              Open →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
