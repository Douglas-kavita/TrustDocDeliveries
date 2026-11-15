'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type ComplaintStatus = 'Open' | 'Under Review' | 'Resolved' | 'Escalated' | 'Closed'
type ComplaintCategory = 'Rider Conduct' | 'Late Delivery' | 'Payment Issue' | 'Wrong Document' | 'App Issue' | 'Other'
type TabFilter = 'all' | 'open' | 'review' | 'resolved'
type ComplainantType = 'Client' | 'Rider'

interface Client {
  id: string
  name: string
  phone: string
  email: string
  location: string
  joined: string
  totalJobs: number
  verified: boolean
}

interface Rider {
  id: string
  name: string
  phone: string
  email: string
  plate: string
  zone: string
  rating: number
  totalDeliveries: number
  verified: boolean
}

interface Complaint {
  id: string
  jobId: string
  status: ComplaintStatus
  category: ComplaintCategory
  complainantType: ComplainantType
  client: Client
  rider: Rider | null
  subject: string
  description: string
  date: string
  time: string
  resolvedDate?: string
  adminNote?: string
  priority: 'High' | 'Medium' | 'Low'
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const CLIENTS: Record<string, Client> = {
  'MCT-CLT-00003': { id:'MCT-CLT-00003', name:'Grace Achieng',  phone:'+254 734 567 890', email:'grace.achieng@yahoo.com',   location:'South B, Nairobi',   joined:'22 Feb 2025', totalJobs:3,  verified:true  },
  'MCT-CLT-00005': { id:'MCT-CLT-00005', name:'Fatuma Khalid',  phone:'+254 756 789 012', email:'fatuma.khalid@gmail.com',   location:'Parklands, Nairobi', joined:'01 May 2025', totalJobs:1,  verified:true  },
  'MCT-CLT-00006': { id:'MCT-CLT-00006', name:'David Ochieng',  phone:'+254 767 890 123', email:'david.ochieng@outlook.com', location:'Lavington, Nairobi', joined:'18 Dec 2024', totalJobs:12, verified:true  },
  'MCT-CLT-00002': { id:'MCT-CLT-00002', name:'James Omondi',   phone:'+254 723 456 789', email:'james.omondi@gmail.com',    location:'Kilimani, Nairobi',  joined:'03 Mar 2025', totalJobs:5,  verified:true  },
  'MCT-CLT-00007': { id:'MCT-CLT-00007', name:'Mary Kamau',     phone:'+254 778 901 234', email:'mary.kamau@gmail.com',      location:'Ruaraka, Nairobi',   joined:'10 Jun 2025', totalJobs:1,  verified:false },
}

const RIDERS: Record<string, Rider> = {
  'MCT-RDR-00001': { id:'MCT-RDR-00001', name:'Samuel Kamau',  phone:'+254 700 111 222', email:'samuel.kamau@gmail.com',   plate:'KDG 123A', zone:'Westlands / CBD',      rating:4.8, totalDeliveries:142, verified:true },
  'MCT-RDR-00002': { id:'MCT-RDR-00002', name:'Peter Njoroge', phone:'+254 700 333 444', email:'peter.njoroge2@gmail.com', plate:'KDA 321D', zone:'Kilimani / Hurlingham', rating:4.6, totalDeliveries:98,  verified:true },
}

const COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-00001', jobId: 'MCT-JOB-00003',
    status: 'Open', category: 'Rider Conduct', complainantType: 'Client',
    client: CLIENTS['MCT-CLT-00003'], rider: RIDERS['MCT-RDR-00001'],
    subject: 'Rider not responding to calls',
    description: 'I have been trying to reach the rider for over 30 minutes. He picked up my National ID from Huduma Centre but is not responding to calls or messages. Very concerned about my document.',
    date: '16 May 2026', time: '10:45 AM', priority: 'High',
    adminNote: 'Escalated to operations team. Rider location pinged via app.',
  },
  {
    id: 'CMP-00002', jobId: 'MCT-JOB-00005',
    status: 'Open', category: 'Late Delivery', complainantType: 'Client',
    client: CLIENTS['MCT-CLT-00005'], rider: null,
    subject: 'No rider assigned after 2 hours',
    description: 'I paid for a driving licence delivery over 2 hours ago but no rider has been assigned. I need this document urgently for a job interview tomorrow morning.',
    date: '15 May 2026', time: '06:30 PM', priority: 'High',
  },
  {
    id: 'CMP-00003', jobId: 'MCT-JOB-00006',
    status: 'Resolved', category: 'Payment Issue', complainantType: 'Client',
    client: CLIENTS['MCT-CLT-00006'], rider: RIDERS['MCT-RDR-00002'],
    subject: 'Charged twice via M-Pesa',
    description: 'I received two STK push prompts and accidentally confirmed both. I was charged KSh 1,000 twice for the same delivery. Please refund the second charge.',
    date: '15 May 2026', time: '02:15 PM', priority: 'Medium',
    resolvedDate: '15 May 2026 · 04:30 PM',
    adminNote: 'Second charge refunded via M-Pesa. Ref: REF9X2K1P3. Client notified.',
  },
  {
    id: 'CMP-00004', jobId: 'MCT-JOB-00002',
    status: 'Under Review', category: 'Wrong Document', complainantType: 'Client',
    client: CLIENTS['MCT-CLT-00002'], rider: RIDERS['MCT-RDR-00002'],
    subject: 'Received wrong document',
    description: 'The rider delivered a Birth Certificate but it belongs to someone else. My Birth Certificate was not delivered. This is a serious privacy issue and I need it resolved immediately.',
    date: '16 May 2026', time: '11:20 AM', priority: 'High',
    adminNote: 'Investigating with rider. Second delivery flagged.',
  },
  {
    id: 'CMP-00005', jobId: 'MCT-JOB-00001',
    status: 'Closed', category: 'Other', complainantType: 'Rider',
    client: CLIENTS['MCT-CLT-00003'], rider: RIDERS['MCT-RDR-00001'],
    subject: 'Client refused to confirm delivery OTP',
    description: 'I delivered the passport successfully but the client refused to provide the OTP for 45 minutes. This held up my next job. I need compensation for the waiting time.',
    date: '16 May 2026', time: '12:05 PM', priority: 'Low',
    resolvedDate: '16 May 2026 · 01:15 PM',
    adminNote: 'OTP delay logged. No compensation applicable per current policy. Rider informed.',
  },
  {
    id: 'CMP-00006', jobId: 'MCT-JOB-00007',
    status: 'Escalated', category: 'App Issue', complainantType: 'Client',
    client: CLIENTS['MCT-CLT-00007'], rider: null,
    subject: 'App crashed after M-Pesa payment — no job created',
    description: 'I paid KSh 350 via M-Pesa and the app crashed before the job was created. The money left my account but I have no job reference number and no document has been picked up.',
    date: '15 May 2026', time: '11:30 AM', priority: 'High',
    adminNote: 'Engineering team alerted. Payment trace running. Possible refund pending.',
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const STATUS_STYLE: Record<ComplaintStatus, string> = {
  'Open':         'bg-red-500/10 text-red-400 border border-red-500/20',
  'Under Review': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  'Resolved':     'bg-green-500/10 text-green-400 border border-green-500/20',
  'Escalated':    'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  'Closed':       'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}
const PRIORITY_STYLE = {
  High:   'text-red-400 bg-red-500/10 border border-red-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
  Low:    'text-green-400 bg-green-500/10 border border-green-500/20',
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-medium ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────
// PERSON MODAL
// ─────────────────────────────────────────────
function PersonModal({ type, data, onClose }: {
  type: 'client' | 'rider'
  data: Client | Rider
  onClose: () => void
}) {
  const router = useRouter()
  const isRider = type === 'rider'
  const rider = isRider ? data as Rider : null
  const client = !isRider ? data as Client : null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[440px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-[#8b1a2f] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              {data.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold text-[15px]">{data.name}</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mt-0.5">
                {isRider ? 'Rider Profile' : 'Client Profile'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 space-y-0">
          {[
            ['ID',    data.id,    'text-yellow-400 font-mono'],
            ['Phone', data.phone, 'text-[#e8e4d8]'],
            ['Email', data.email, 'text-blue-400'],
            ...(client ? [
              ['Location',   client.location,                          'text-[#e8e4d8]'],
              ['Joined',     client.joined,                            'text-[#e8e4d8]'],
              ['Total Jobs', String(client.totalJobs),                 'text-[#e8e4d8] font-mono'],
              ['Verified',   client.verified ? '✓ Verified' : '✗ Unverified', client.verified ? 'text-green-400' : 'text-red-400'],
            ] : []),
            ...(rider ? [
              ['Plate',             rider.plate,                               'text-[#e8e4d8] font-mono'],
              ['Zone',              rider.zone,                                'text-[#e8e4d8]'],
              ['Rating',            `${rider.rating} / 5.0`,                  'text-yellow-400'],
              ['Total Deliveries',  String(rider.totalDeliveries),             'text-[#e8e4d8] font-mono'],
              ['Verified',          rider.verified ? '✓ Verified' : '✗ Unverified', rider.verified ? 'text-green-400' : 'text-red-400'],
            ] : []),
          ].map(([label, val, cls]) => (
            <div key={label} className="flex justify-between items-center py-[7px] border-b border-white/[0.07] last:border-0">
              <span className="text-[11px] text-[#6b6856]">{label}</span>
              <span className={`text-[12px] font-medium ${cls}`}>{val}</span>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] transition-colors">Close</button>
          <button
            onClick={() => {
              onClose()
              router.push(isRider ? `/riders/${data.id}` : `/clients/${data.id}`)
            }}
            className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors"
          >
            View Full Profile →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// COMPLAINT DETAIL MODAL
// ─────────────────────────────────────────────
function ComplaintModal({ complaint, onClose, onViewClient, onViewRider }: {
  complaint: Complaint
  onClose: () => void
  onViewClient: (c: Client) => void
  onViewRider: (r: Rider) => void
}) {
  const [note, setNote] = useState(complaint.adminNote ?? '')

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[580px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#8b1a2f] px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-bold text-[15px] font-mono">{complaint.id}</p>
                <Badge label={complaint.priority + ' Priority'} className="bg-white/15 text-white border border-white/20 text-[9px]" />
              </div>
              <p className="text-white font-semibold text-[14px]">{complaint.subject}</p>
              <p className="text-white/60 text-[11px] mt-1">
                {complaint.complainantType} Complaint · {complaint.category} · {complaint.date} at {complaint.time}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge label={complaint.status} className={STATUS_STYLE[complaint.status]} />
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors">✕</button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Description */}
          <div className="bg-[#2a2e20] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-2">Complaint Description</p>
            <p className="text-[13px] text-[#e8e4d8] leading-relaxed">{complaint.description}</p>
          </div>

          {/* Job reference */}
          <div className="flex justify-between items-center py-[7px] border-b border-white/[0.07]">
            <span className="text-[11px] text-[#6b6856]">Job Reference</span>
            <span className="text-[12px] font-mono text-yellow-400 font-medium">{complaint.jobId}</span>
          </div>
          {complaint.resolvedDate && (
            <div className="flex justify-between items-center py-[7px] border-b border-white/[0.07]">
              <span className="text-[11px] text-[#6b6856]">Resolved On</span>
              <span className="text-[12px] text-green-400">{complaint.resolvedDate}</span>
            </div>
          )}

          {/* People */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onViewClient(complaint.client)}
              className="bg-[#2a2e20] border border-white/[0.07] hover:border-[#8b1a2f]/40 rounded-xl p-3.5 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[10px] text-[#6b6856] uppercase tracking-wider">Client</p>
                {complaint.complainantType === 'Client' && (
                  <span className="text-[9px] bg-[#8b1a2f]/20 text-[#c45070] border border-[#8b1a2f]/30 px-1.5 py-0.5 rounded">Complainant</span>
                )}
              </div>
              <p className="text-[13px] font-medium text-[#e8e4d8] group-hover:text-white">{complaint.client.name}</p>
              <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{complaint.client.id}</p>
              <p className="text-[10px] text-[#6b6856] mt-0.5">{complaint.client.phone}</p>
              <p className="text-[10px] text-[#8b1a2f] mt-2 group-hover:underline">View profile →</p>
            </button>
            <button
              onClick={() => complaint.rider ? onViewRider(complaint.rider) : null}
              disabled={!complaint.rider}
              className={`bg-[#2a2e20] border border-white/[0.07] rounded-xl p-3.5 text-left transition-all ${complaint.rider ? 'hover:border-[#8b1a2f]/40 group cursor-pointer' : 'opacity-50 cursor-default'}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <p className="text-[10px] text-[#6b6856] uppercase tracking-wider">Rider</p>
                {complaint.complainantType === 'Rider' && (
                  <span className="text-[9px] bg-[#8b1a2f]/20 text-[#c45070] border border-[#8b1a2f]/30 px-1.5 py-0.5 rounded">Complainant</span>
                )}
              </div>
              <p className="text-[13px] font-medium text-[#e8e4d8]">{complaint.rider?.name ?? 'Unassigned'}</p>
              <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{complaint.rider?.id ?? '—'}</p>
              <p className="text-[10px] text-[#6b6856] mt-0.5">{complaint.rider?.phone ?? '—'}</p>
              {complaint.rider && <p className="text-[10px] text-[#8b1a2f] mt-2 group-hover:underline">View profile →</p>}
            </button>
          </div>

          {/* Admin note */}
          <div>
            <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-2">Admin Note</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add an admin note…"
              className="w-full bg-[#2a2e20] border border-white/[0.07] focus:border-[#8b1a2f]/40 rounded-xl px-4 py-3 text-[12px] text-[#e8e4d8] placeholder:text-[#6b6856] outline-none resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex items-center justify-between flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => alert(`Marking ${complaint.id} as Resolved`)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
            >
              ✓ Mark Resolved
            </button>
            <button
              onClick={() => alert(`Escalating ${complaint.id}`)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-orange-500/15 text-orange-400 border border-orange-500/25 hover:bg-orange-500/25 transition-colors"
            >
              ↑ Escalate
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] transition-colors">Close</button>
            <button
              onClick={() => alert(`Saving note for ${complaint.id}`)}
              className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function ComplaintsPage() {
  const [tab, setTab]     = useState<TabFilter>('all')
  const [search, setSearch] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [personModal, setPersonModal] = useState<{ type: 'client' | 'rider'; data: Client | Rider } | null>(null)

  const filtered = COMPLAINTS.filter(c => {
    if (tab === 'open')     return c.status === 'Open' || c.status === 'Escalated'
    if (tab === 'review')   return c.status === 'Under Review'
    if (tab === 'resolved') return c.status === 'Resolved' || c.status === 'Closed'
    return true
  }).filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      c.id.toLowerCase().includes(q) ||
      c.jobId.toLowerCase().includes(q) ||
      c.client.name.toLowerCase().includes(q) ||
      (c.rider?.name ?? '').toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  })

  const TABS = [
    { key: 'all' as TabFilter,      label: 'All Complaints' },
    { key: 'open' as TabFilter,     label: 'Open / Escalated' },
    { key: 'review' as TabFilter,   label: 'Under Review' },
    { key: 'resolved' as TabFilter, label: 'Resolved' },
  ]

  const stats = [
    { label: 'Total',        value: String(COMPLAINTS.length),                                                     sub: 'All complaints',         accent: '#8b1a2f' },
    { label: 'Open',         value: String(COMPLAINTS.filter(c => c.status === 'Open').length),                    sub: 'Needs attention',        accent: '#e05757' },
    { label: 'Escalated',    value: String(COMPLAINTS.filter(c => c.status === 'Escalated').length),               sub: 'High priority',          accent: '#e09345' },
    { label: 'Under Review', value: String(COMPLAINTS.filter(c => c.status === 'Under Review').length),            sub: 'Being investigated',     accent: '#5599e0' },
    { label: 'Resolved',     value: String(COMPLAINTS.filter(c => ['Resolved','Closed'].includes(c.status)).length), sub: 'Closed out',           accent: '#4caf82' },
  ]

  return (
    <div className="flex h-screen bg-[#1a1c14] text-[#e8e4d8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Complaints" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">Complaints</h1>
              <p className="text-[11px] text-[#6b6856] mt-0.5">Saturday, 16 May 2026 · Nairobi, Kenya</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] hover:bg-white/5 transition-colors">
                ⬇ Export
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors">
                + Log Complaint
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {stats.map(s => (
              <div key={s.label} className="relative bg-[#252820] border border-white/[0.07] rounded-xl p-4 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: s.accent }} />
                <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-2">{s.label}</p>
                <p className="text-[20px] font-semibold font-mono">{s.value}</p>
                <p className="text-[10.5px] text-[#6b6856] mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#22251a] border border-white/[0.07] rounded-xl p-1 w-fit">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                  tab === t.key ? 'bg-[#2a2e20] text-[#e8e4d8]' : 'text-[#6b6856] hover:text-[#9c9882]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#252820] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-3">
              <h2 className="text-[13.5px] font-semibold">Complaints Log</h2>
              <span className="bg-[#2a2e20] border border-white/[0.07] text-[#9c9882] text-[10px] px-2 py-0.5 rounded-full font-mono">
                {filtered.length} records
              </span>
              <div className="ml-auto">
                <input
                  type="text"
                  placeholder="Search complaint, client, rider…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#22251a] border border-white/[0.07] focus:border-white/[0.14] rounded-lg px-3 py-1.5 text-[12px] text-[#e8e4d8] placeholder:text-[#6b6856] outline-none w-56 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2a2e20]">
                    {['ID', 'Job', 'By', 'Client', 'Rider', 'Category', 'Subject', 'Priority', 'Status', 'Date & Time', 'Actions'].map(h => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-semibold text-[#6b6856] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr
                      key={c.id}
                      className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedComplaint(c)}
                    >
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[11px] text-yellow-400 font-medium">{c.id}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[11px] text-[#9c9882]">{c.jobId}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <span className={`text-[10.5px] px-2 py-0.5 rounded font-medium ${
                          c.complainantType === 'Client'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {c.complainantType}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <button
                          onClick={e => { e.stopPropagation(); setPersonModal({ type: 'client', data: c.client }) }}
                          className="text-left hover:opacity-80 transition-opacity"
                        >
                          <p className="text-[12px] font-medium text-[#e8e4d8] hover:text-white">{c.client.name}</p>
                          <p className="text-[10px] font-mono text-[#8b1a2f] mt-0.5 hover:underline">{c.client.id}</p>
                        </button>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        {c.rider ? (
                          <button
                            onClick={e => { e.stopPropagation(); setPersonModal({ type: 'rider', data: c.rider! }) }}
                            className="text-left hover:opacity-80 transition-opacity"
                          >
                            <p className="text-[12px] font-medium text-[#e8e4d8] hover:text-white">{c.rider.name}</p>
                            <p className="text-[10px] font-mono text-[#8b1a2f] mt-0.5 hover:underline">{c.rider.id}</p>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#6b6856] italic">—</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="text-[11px] text-[#9c9882]">{c.category}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle max-w-[200px]">
                        <p className="text-[12px] text-[#e8e4d8] truncate">{c.subject}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <span className={`text-[10.5px] px-2 py-0.5 rounded font-medium ${PRIORITY_STYLE[c.priority]}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <Badge label={c.status} className={STATUS_STYLE[c.status]} />
                      </td>
                      <td className="px-3.5 py-3 align-middle whitespace-nowrap">
                        <p className="text-[12px] text-[#9c9882]">{c.time}</p>
                        <p className="text-[10px] text-[#6b6856] mt-0.5">{c.date}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="px-2 py-1 rounded text-[10.5px] font-medium transition-colors whitespace-nowrap"
                          style={{ background: 'rgba(139,26,47,0.12)', color: '#c45070', border: '1px solid rgba(139,26,47,0.25)' }}
                        >
                          Open →
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

      {/* Modals */}
      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onViewClient={cl => { setSelectedComplaint(null); setPersonModal({ type: 'client', data: cl }) }}
          onViewRider={r => { setSelectedComplaint(null); setPersonModal({ type: 'rider', data: r }) }}
        />
      )}
      {personModal && (
        <PersonModal
          type={personModal.type}
          data={personModal.data}
          onClose={() => setPersonModal(null)}
        />
      )}
    </div>
  )
}
