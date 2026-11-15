'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/layout/Sidebar'
import Topbar from '../../../components/layout/Topbar'

// ─────────────────────────────────────────────
// MOCK DATA (keyed by agent ID)
// ─────────────────────────────────────────────
const AGENTS_DATA: Record<string, any> = {
  'MCT-AGT-00001': {
    id: 'MCT-AGT-00001', name: 'Boniface Mwangi', initials: 'BM',
    status: 'active', verified: true,
    phone: '+254712345678', mpesaPhone: '+254712345678', email: 'boniface.mwangi@email.com',
    nationalId: '23456789', location: 'CBD, Nairobi', joined: '15 Jan 2026, 09:00',
    lastActive: '2 days ago', businessType: 'Document Runner',
    serviceArea: 'CBD / Upperhill', commissionRate: 12,
    totalJobs: 89, totalEarned: 34200, rating: 4.7, complaintCount: 0,
    bio: 'Experienced document runner based in Nairobi CBD. Specialises in government document collection from Huduma Centres and ministry offices.',
    verificationHistory: [
      { icon: '📄', label: 'Documents submitted', time: '15 Jan 2026, 09:00', color: 'bg-gray-400' },
      { icon: '✅', label: 'Approved by admin-001', time: '16 Jan 2026, 11:30', color: 'bg-green-500' },
      { icon: '📱', label: 'M-Pesa number verified', time: '16 Jan 2026, 12:00', color: 'bg-green-500' },
    ],
    jobs: [
      { id: 'MCT-JOB-00001', type: 'Delivery', doc: 'Passport',         client: 'Aisha Wanjiku',  date: '16 May 2026', status: 'Completed', earned: 850  },
      { id: 'MCT-JOB-00003', type: 'Delivery', doc: 'National ID',       client: 'Grace Achieng',  date: '16 May 2026', status: 'In Transit', earned: 850 },
      { id: 'MCT-JOB-00008', type: 'Delivery', doc: 'Logbook',           client: 'Aisha Wanjiku',  date: '14 May 2026', status: 'Failed',     earned: 0   },
    ],
    earnings: [
      { month: 'Jan 2026', jobs: 10, gross: 9500,  commission: 1140, net: 8360  },
      { month: 'Feb 2026', jobs: 18, gross: 17200, commission: 2064, net: 15136 },
      { month: 'Mar 2026', jobs: 22, gross: 20100, commission: 2412, net: 17688 },
      { month: 'Apr 2026', jobs: 19, gross: 18400, commission: 2208, net: 16192 },
      { month: 'May 2026', jobs: 20, gross: 19300, commission: 2316, net: 16984 },
    ],
    complaints: [],
  },
  'MCT-AGT-00002': {
    id: 'MCT-AGT-00002', name: 'Esther Wairimu', initials: 'EW',
    status: 'active', verified: true,
    phone: '+254722334455', mpesaPhone: '+254722334455', email: 'esther.wairimu@gmail.com',
    nationalId: '34567890', location: 'Westlands, Nairobi', joined: '02 Feb 2026, 10:30',
    lastActive: '1 day ago', businessType: 'Freelance Agent',
    serviceArea: 'Westlands / Parklands', commissionRate: 10,
    totalJobs: 54, totalEarned: 19800, rating: 4.9, complaintCount: 1,
    bio: 'Top-rated freelance agent covering Westlands and Parklands. Known for fast turnaround and excellent client communication.',
    verificationHistory: [
      { icon: '📄', label: 'Documents submitted', time: '02 Feb 2026, 10:30', color: 'bg-gray-400' },
      { icon: '✅', label: 'Approved by admin-002', time: '03 Feb 2026, 09:00', color: 'bg-green-500' },
    ],
    jobs: [
      { id: 'MCT-JOB-00002', type: 'Check', doc: 'Birth Certificate', client: 'James Omondi', date: '16 May 2026', status: 'Completed', earned: 250 },
      { id: 'MCT-JOB-00006', type: 'Delivery', doc: 'Passport',       client: 'David Ochieng', date: '15 May 2026', status: 'Completed', earned: 850 },
    ],
    earnings: [
      { month: 'Feb 2026', jobs: 8,  gross: 7200,  commission: 720,  net: 6480  },
      { month: 'Mar 2026', jobs: 15, gross: 13500, commission: 1350, net: 12150 },
      { month: 'Apr 2026', jobs: 16, gross: 14800, commission: 1480, net: 13320 },
      { month: 'May 2026', jobs: 15, gross: 13600, commission: 1360, net: 12240 },
    ],
    complaints: [
      { id: 'CMP-00003', subject: 'Client charged twice', status: 'Resolved', date: '15 May 2026' },
    ],
  },
}

// Fallback for unknown IDs
const DEFAULT_AGENT = AGENTS_DATA['MCT-AGT-00001']

type Tab = 'overview' | 'documents' | 'jobs' | 'earnings' | 'complaints'

const STATUS_COLOR: Record<string, string> = {
  active:    'bg-green-100 text-green-700 border border-green-200',
  pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  suspended: 'bg-red-100 text-red-600 border border-red-200',
  inactive:  'bg-gray-100 text-gray-500 border border-gray-200',
}
const JOB_STATUS_COLOR: Record<string, string> = {
  Completed:  'text-green-600',
  'In Transit':'text-blue-500',
  Failed:      'text-red-500',
  Pending:     'text-yellow-600',
}

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const agent = AGENTS_DATA[id] ?? { ...DEFAULT_AGENT, id }
  const [tab, setTab] = useState<Tab>('overview')
  const [agentStatus, setAgentStatus] = useState<string>(agent.status)
  const [showConfirm, setShowConfirm] = useState<'approve' | 'reject' | 'suspend' | null>(null)

  function handleApprove() {
    setAgentStatus('active')
    setShowConfirm(null)
    alert(`✅ ${agent.name} approved. They will be notified via SMS.`)
  }
  function handleReject() {
    setAgentStatus('inactive')
    setShowConfirm(null)
    alert(`❌ ${agent.name} rejected. They will be notified via SMS.`)
  }
  function handleSuspend() {
    setAgentStatus('suspended')
    setShowConfirm(null)
    alert(`🚫 ${agent.name} suspended. Access revoked immediately.`)
  }

  const STATUS_COLOR: Record<string, string> = {
    active:    'bg-green-100 text-green-700 border border-green-200',
    pending:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    suspended: 'bg-red-100 text-red-600 border border-red-200',
    inactive:  'bg-gray-100 text-gray-500 border border-gray-200',
  }

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview',   label: 'Overview' },
    { key: 'documents',  label: 'Documents' },
    { key: 'jobs',       label: 'Jobs', count: agent.jobs?.length },
    { key: 'earnings',   label: 'Earnings' },
    { key: 'complaints', label: 'Complaints', count: agent.complaints?.length },
  ]

  return (
    <div className="flex h-screen bg-[#f5f3ee] text-[#1a1c14] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Agent Profile" />
        <main className="flex-1 overflow-y-auto">

          {/* ── Top breadcrumb bar ── */}
          <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#1a1c14]">{agent.name}</p>
              <p className="text-[11px] text-gray-400">{agent.id} · {agent.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-500 hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* ── Maroon hero banner ── */}
          <div className="bg-[#8b1a2f] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-[22px] font-bold border-2 border-white/30">
                {agent.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-white font-bold text-[20px]">{agent.name}</h1>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[agentStatus]}`}>
                    {agentStatus}
                  </span>
                  {agent.verified && agentStatus === 'active' && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 border border-green-200">
                      approved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-white/70 text-[12px] flex-wrap">
                  <span className="text-[#f5c842] font-mono font-semibold">{agent.id}</span>
                  <span>📞 {agent.phone}</span>
                  <span>📍 {agent.location}</span>
                  <span>★ {agent.rating} rating</span>
                  <span>National ID: {agent.nationalId}</span>
                  <span>M-Pesa: {agent.mpesaPhone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {agentStatus === 'pending' && (
                <>
                  <button
                    onClick={() => setShowConfirm('reject')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium border border-white/20 transition-colors"
                  >
                    ✗ Reject
                  </button>
                  <button
                    onClick={() => setShowConfirm('approve')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-white text-[12px] font-medium border border-green-400/40 transition-colors"
                  >
                    ✓ Approve
                  </button>
                </>
              )}
              {agentStatus === 'active' && (
                <button
                  onClick={() => setShowConfirm('suspend')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium border border-white/20 transition-colors"
                >
                  🚫 Suspend
                </button>
              )}
              {agentStatus === 'suspended' && (
                <button
                  onClick={() => setShowConfirm('approve')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-white text-[12px] font-medium border border-green-400/40 transition-colors"
                >
                  ✓ Reinstate
                </button>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
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
                  {t.key === 'overview'   && '○'}
                  {t.key === 'documents'  && '📄'}
                  {t.key === 'jobs'       && '📋'}
                  {t.key === 'earnings'   && '💰'}
                  {t.key === 'complaints' && '💬'}
                  {' '}{t.label}
                  {t.count !== undefined && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-mono">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab content ── */}
          <div className="px-8 py-6 space-y-6">

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: '📋', label: 'Total Jobs',    value: agent.totalJobs,                           sub: 'All time'          },
                    { icon: '💰', label: 'Total Earned',  value: `KSh ${agent.totalEarned.toLocaleString()}`, sub: 'Net after commission' },
                    { icon: '★',  label: 'Rating',         value: `${agent.rating}/5`,                      sub: 'Client rating'     },
                    { icon: '💬', label: 'Complaints',     value: agent.complaints?.length ?? 0,            sub: 'Logged complaints' },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#8b1a2f]/8 flex items-center justify-center text-[18px]" style={{ background: 'rgba(139,26,47,0.08)' }}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                        <p className="text-[22px] font-bold text-[#1a1c14] mt-0.5">{s.value}</p>
                        <p className="text-[11px] text-gray-400">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Personal info + Agent-specific info side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Personal Information */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-[15px] font-bold text-[#1a1c14] mb-5">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-y-5">
                      {[
                        ['Full Name',   agent.name],
                        ['Unique ID',   agent.id],
                        ['National ID', agent.nationalId],
                        ['Phone',       agent.phone],
                        ['M-Pesa Phone',agent.mpesaPhone],
                        ['Email',       agent.email],
                        ['Location',    agent.location],
                        ['Joined',      agent.joined],
                        ['Last Active', agent.lastActive],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-[11px] text-gray-400">{label}</p>
                          <p className="text-[13px] font-semibold text-[#1a1c14] mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                    {agent.bio && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        <p className="text-[11px] text-gray-400 mb-1">Bio</p>
                        <p className="text-[13px] text-gray-600 leading-relaxed">{agent.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Agent-specific details */}
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-[#1a1c14] mb-5">Agent Details</h2>
                      <div className="space-y-4">
                        {[
                          { label: 'Business Type',    value: agent.businessType,          highlight: false },
                          { label: 'Service Area',     value: agent.serviceArea,           highlight: false },
                          { label: 'Commission Rate',  value: `${agent.commissionRate}%`,  highlight: true  },
                          { label: 'Verified',         value: agent.verified ? '✓ Verified' : '✗ Unverified', highlight: false },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                            <span className="text-[12px] text-gray-400">{row.label}</span>
                            <span className={`text-[13px] font-semibold ${row.highlight ? 'text-[#8b1a2f]' : 'text-[#1a1c14]'}`}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verification History */}
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                      <h2 className="text-[15px] font-bold text-[#1a1c14] mb-4">Verification History</h2>
                      <div className="space-y-0">
                        {agent.verificationHistory?.map((v: any, i: number) => (
                          <div key={i} className="flex gap-3 pb-4 last:pb-0">
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full ${v.color} flex items-center justify-center text-white text-[11px] flex-shrink-0`}>
                                {v.icon}
                              </div>
                              {i < agent.verificationHistory.length - 1 && (
                                <div className="w-px flex-1 bg-gray-100 mt-1" />
                              )}
                            </div>
                            <div className="pt-1">
                              <p className="text-[13px] font-medium text-[#1a1c14]">{v.label}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{v.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── DOCUMENTS ── */}
            {tab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-[#1a1c14]">Identity Documents</h2>
                  <span className="text-[11px] text-gray-400">Submitted for verification · {agent.joined}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'National ID — Front', status: 'uploaded', note: 'Document on file' },
                    { label: 'National ID — Back',  status: 'uploaded', note: 'Document on file' },
                    { label: 'Selfie / Face Photo', status: 'missing',  note: 'Not uploaded'     },
                  ].map(doc => (
                    <div key={doc.label} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      {/* Preview area */}
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
                            <p className="text-[12px] text-gray-400">{doc.note}</p>
                            <p className="text-[10px] text-gray-300 mt-1">(Firebase URL in production)</p>
                          </>
                        )}
                      </div>
                      {/* Footer */}
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-[#1a1c14]">{doc.label}</p>
                          <p className={`text-[11px] mt-0.5 ${doc.status === 'missing' ? 'text-red-400' : 'text-gray-400'}`}>
                            {doc.status === 'missing' ? 'Not uploaded' : 'Uploaded'}
                          </p>
                        </div>
                        {doc.status === 'uploaded' && (
                          <button
                            onClick={() => alert(`Viewing ${doc.label} for ${agent.id}`)}
                            className="text-[11px] px-3 py-1 rounded-lg bg-[#8b1a2f]/8 text-[#8b1a2f] border border-[#8b1a2f]/20 hover:bg-[#8b1a2f]/15 transition-colors font-medium"
                            style={{ background: 'rgba(139,26,47,0.08)' }}
                          >
                            View
                          </button>
                        )}
                        {doc.status === 'missing' && (
                          <button
                            onClick={() => alert(`Requesting upload of ${doc.label} from ${agent.name}`)}
                            className="text-[11px] px-3 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors font-medium"
                          >
                            Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Admin actions */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-bold text-[#1a1c14]">Verification Decision</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Review the documents above before approving or rejecting this agent.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm('reject')}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      ✗ Reject
                    </button>
                    <button
                      onClick={() => setShowConfirm('approve')}
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
                  <span className="text-[11px] text-gray-400 font-mono">{agent.jobs?.length} records</span>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {['Job ID', 'Type', 'Document', 'Client', 'Date', 'Status', 'Earned'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agent.jobs?.map((j: any) => (
                      <tr key={j.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/payments/${j.id}`)}>
                        <td className="px-4 py-3 font-mono text-[11px] text-[#8b1a2f] font-semibold">{j.id}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-600">{j.type}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-700">{j.doc}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-700">{j.client}</td>
                        <td className="px-4 py-3 text-[12px] text-gray-400">{j.date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[12px] font-medium ${JOB_STATUS_COLOR[j.status] ?? 'text-gray-500'}`}>{j.status}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#1a1c14]">
                          {j.earned > 0 ? `KSh ${j.earned}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── EARNINGS ── */}
            {tab === 'earnings' && (
              <div className="space-y-4">
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Gross',      value: `KSh ${agent.totalEarned.toLocaleString()}` },
                    { label: 'Commission Paid',  value: `KSh ${Math.round(agent.totalEarned * agent.commissionRate / 100).toLocaleString()}` },
                    { label: 'Net Earnings',     value: `KSh ${Math.round(agent.totalEarned * (1 - agent.commissionRate / 100)).toLocaleString()}` },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                      <p className="text-[20px] font-bold text-[#8b1a2f] mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Monthly breakdown */}
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-[15px] font-bold text-[#1a1c14]">Monthly Breakdown</h2>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {['Month', 'Jobs', 'Gross Earnings', `Commission (${agent.commissionRate}%)`, 'Net Payout'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {agent.earnings?.map((e: any) => (
                        <tr key={e.month} className="border-b border-gray-50">
                          <td className="px-4 py-3 text-[13px] font-medium text-[#1a1c14]">{e.month}</td>
                          <td className="px-4 py-3 text-[12px] font-mono text-gray-600">{e.jobs}</td>
                          <td className="px-4 py-3 text-[12px] font-mono text-gray-700">KSh {e.gross.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[12px] font-mono text-[#8b1a2f]">KSh {e.commission.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[13px] font-mono font-semibold text-[#1a1c14]">KSh {e.net.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── COMPLAINTS ── */}
            {tab === 'complaints' && (
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-[15px] font-bold text-[#1a1c14]">Complaints</h2>
                </div>
                {agent.complaints?.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-[32px] mb-2">✅</p>
                    <p className="text-[14px] font-semibold text-gray-600">No complaints on record</p>
                    <p className="text-[12px] text-gray-400 mt-1">This agent has a clean complaint history.</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {['Complaint ID', 'Subject', 'Status', 'Date'].map(h => (
                          <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {agent.complaints?.map((c: any) => (
                        <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => router.push('/complaints')}>
                          <td className="px-4 py-3 font-mono text-[11px] text-[#8b1a2f] font-semibold">{c.id}</td>
                          <td className="px-4 py-3 text-[12px] text-gray-700">{c.subject}</td>
                          <td className="px-4 py-3 text-[12px] font-medium text-green-600">{c.status}</td>
                          <td className="px-4 py-3 text-[12px] text-gray-400">{c.date}</td>
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
      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowConfirm(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className={`px-6 py-5 ${showConfirm === 'approve' ? 'bg-green-600' : showConfirm === 'reject' ? 'bg-red-600' : 'bg-[#8b1a2f]'}`}>
              <p className="text-white font-bold text-[16px]">
                {showConfirm === 'approve' && (agentStatus === 'suspended' ? '✓ Reinstate Agent' : '✓ Approve Agent')}
                {showConfirm === 'reject'  && '✗ Reject Agent'}
                {showConfirm === 'suspend' && '🚫 Suspend Agent'}
              </p>
              <p className="text-white/70 text-[12px] mt-1">{agent.name} · {agent.id}</p>
            </div>
            <div className="px-6 py-5">
              <p className="text-[13px] text-gray-600">
                {showConfirm === 'approve' && (agentStatus === 'suspended' ? 'This will reinstate the agent and restore their access to the platform.' : 'This will activate the agent account. They will be notified via SMS.')}
                {showConfirm === 'reject'  && 'This will reject the agent application. They will be notified via SMS and can reapply.'}
                {showConfirm === 'suspend' && 'This will immediately revoke the agent\'s access. They will not be able to accept jobs.'}
              </p>
            </div>
            <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setShowConfirm(null)} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
              <button
                onClick={showConfirm === 'approve' ? handleApprove : showConfirm === 'reject' ? handleReject : handleSuspend}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-medium text-white transition-colors ${
                  showConfirm === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                  showConfirm === 'reject'  ? 'bg-red-600 hover:bg-red-700' :
                  'bg-[#8b1a2f] hover:bg-[#a82038]'
                }`}
              >
                {showConfirm === 'approve' && (agentStatus === 'suspended' ? 'Yes, Reinstate' : 'Yes, Approve')}
                {showConfirm === 'reject'  && 'Yes, Reject'}
                {showConfirm === 'suspend' && 'Yes, Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
