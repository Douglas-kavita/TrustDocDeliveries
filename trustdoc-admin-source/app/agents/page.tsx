'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type AgentStatus = 'active' | 'suspended' | 'pending' | 'inactive'

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  location: string
  businessType: string
  serviceArea: string
  commissionRate: number
  totalJobs: number
  totalEarned: number
  rating: number
  complaints: number
  status: AgentStatus
  verified: boolean
  joined: string
  lastActive: string
  nationalId: string
  mpesaPhone: string
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const AGENTS: Agent[] = [
  {
    id: 'MCT-AGT-00001', name: 'Boniface Mwangi', email: 'boniface.mwangi@email.com',
    phone: '+254711223344', mpesaPhone: '+254711223344', nationalId: '23456789',
    location: 'CBD, Nairobi', businessType: 'Document Runner', serviceArea: 'CBD / Upperhill',
    commissionRate: 12, totalJobs: 89, totalEarned: 34200, rating: 4.7, complaints: 0,
    status: 'active', verified: true, joined: '15 Jan 2026, 09:00', lastActive: '2 days ago',
  },
  {
    id: 'MCT-AGT-00002', name: 'Esther Wairimu', email: 'esther.wairimu@gmail.com',
    phone: '+254722334455', mpesaPhone: '+254722334455', nationalId: '34567890',
    location: 'Westlands, Nairobi', businessType: 'Freelance Agent', serviceArea: 'Westlands / Parklands',
    commissionRate: 10, totalJobs: 54, totalEarned: 19800, rating: 4.9, complaints: 1,
    status: 'active', verified: true, joined: '02 Feb 2026, 10:30', lastActive: '1 day ago',
  },
  {
    id: 'MCT-AGT-00003', name: 'Kevin Odhiambo', email: 'kevin.odhiambo@gmail.com',
    phone: '+254733445566', mpesaPhone: '+254733445566', nationalId: '45678901',
    location: 'Eastleigh, Nairobi', businessType: 'Business Centre', serviceArea: 'Eastleigh / Pangani',
    commissionRate: 15, totalJobs: 120, totalEarned: 58000, rating: 4.5, complaints: 2,
    status: 'active', verified: true, joined: '10 Dec 2025, 11:00', lastActive: '3 hours ago',
  },
  {
    id: 'MCT-AGT-00004', name: 'Mercy Njeri', email: 'mercy.njeri@gmail.com',
    phone: '+254744556677', mpesaPhone: '+254744556677', nationalId: '56789012',
    location: 'Kasarani, Nairobi', businessType: 'Document Runner', serviceArea: 'Kasarani / Roysambu',
    commissionRate: 10, totalJobs: 12, totalEarned: 4100, rating: 4.2, complaints: 0,
    status: 'pending', verified: false, joined: '10 May 2026, 08:00', lastActive: '5 days ago',
  },
  {
    id: 'MCT-AGT-00005', name: 'Dennis Mutua', email: 'dennis.mutua@outlook.com',
    phone: '+254755667788', mpesaPhone: '+254755667788', nationalId: '67890123',
    location: 'South C, Nairobi', businessType: 'Freelance Agent', serviceArea: "South C / Lang'ata",
    commissionRate: 12, totalJobs: 3, totalEarned: 900, rating: 3.8, complaints: 1,
    status: 'suspended', verified: true, joined: '20 Mar 2026, 14:00', lastActive: '12 days ago',
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const STATUS_STYLE: Record<AgentStatus, string> = {
  active:    'bg-green-500/10 text-green-600 border border-green-500/30',
  pending:   'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30',
  suspended: 'bg-red-500/10 text-red-500 border border-red-500/30',
  inactive:  'bg-gray-400/10 text-gray-500 border border-gray-400/30',
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function AgentsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all')

  const filtered = AGENTS.filter(a => {
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !search || (
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.nationalId.includes(q) ||
      a.phone.includes(q) ||
      a.serviceArea.toLowerCase().includes(q) ||
      a.businessType.toLowerCase().includes(q)
    )
    return matchStatus && matchSearch
  })

  const stats = [
    { label: 'Total Agents',    value: String(AGENTS.length),                                       sub: 'All registered',        accent: '#8b1a2f' },
    { label: 'Active',          value: String(AGENTS.filter(a => a.status === 'active').length),     sub: 'Currently operating',   accent: '#4caf82' },
    { label: 'Pending',         value: String(AGENTS.filter(a => a.status === 'pending').length),    sub: 'Awaiting verification', accent: '#e09345' },
    { label: 'Suspended',       value: String(AGENTS.filter(a => a.status === 'suspended').length),  sub: 'Access restricted',     accent: '#e05757' },
    { label: 'Total Jobs Done', value: String(AGENTS.reduce((s, a) => s + a.totalJobs, 0)),          sub: 'Across all agents',     accent: '#5599e0' },
  ]

  return (
    <div className="flex h-screen bg-[#f5f3ee] text-[#1a1c14] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Agents" />
        <main className="flex-1 overflow-y-auto">

          {/* Top bar */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-[#1a1c14]">Agents</h1>
              <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} registered agents</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                ⬇ Export
              </button>
              <button className="px-4 py-2 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors">
                + Add Agent
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.map(s => (
                <div key={s.label} className="relative bg-white border border-gray-100 rounded-xl p-4 overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: s.accent }} />
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="text-[22px] font-bold text-[#1a1c14]">{s.value}</p>
                  <p className="text-[10.5px] text-gray-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Search + filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[13px]">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, agent ID, National ID or phone…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-[13px] text-[#1a1c14] placeholder:text-gray-400 outline-none focus:border-[#8b1a2f]/40 transition-colors"
                />
              </div>
              <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
                {(['all', 'active', 'pending', 'suspended'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded text-[12px] font-medium transition-all capitalize ${
                      statusFilter === s ? 'bg-[#8b1a2f] text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Agent', 'Agent ID', 'National ID', 'Phone', 'Business Type', 'Service Area', 'Commission', 'Jobs', 'Total Earned', 'Rating', 'Status', 'Joined', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr
                      key={a.id}
                      className="border-b border-gray-50 hover:bg-[#fdf9f9] transition-colors cursor-pointer"
                      onClick={() => router.push(`/agents/${a.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#8b1a2f] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                            {a.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-[#1a1c14]">{a.name}</p>
                            <p className="text-[10px] text-gray-400">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono text-[#8b1a2f] font-semibold">{a.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-600">{a.nationalId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-600">{a.phone}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-700">{a.businessType}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-gray-600">{a.serviceArea}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-mono font-semibold text-[#8b1a2f]">{a.commissionRate}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] font-mono text-gray-700">{a.totalJobs}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] font-mono font-semibold text-[#1a1c14]">KSh {a.totalEarned.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-yellow-600 font-medium">★ {a.rating}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLE[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-400">{a.joined.split(',')[0]}</span>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => router.push(`/agents/${a.id}`)}
                          className="text-gray-300 hover:text-[#8b1a2f] transition-colors text-[16px]"
                        >
                          ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
