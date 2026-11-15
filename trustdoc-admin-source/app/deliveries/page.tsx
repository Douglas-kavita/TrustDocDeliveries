'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type DeliveryStatus = 'Completed' | 'In Transit' | 'Awaiting Payment' | 'Awaiting Pickup' | 'Failed' | 'Cancelled'
type TabFilter = 'all' | 'active' | 'completed' | 'failed'

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

interface Delivery {
  id: string
  docType: string
  client: Client
  rider: Rider | null
  status: DeliveryStatus
  escrow: 'Released' | 'Held' | 'Pending'
  amount: number
  pickup: string
  dropoff: string
  date: string
  time: string
  mpesa: string
  eta: string
  notes: string
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const CLIENTS: Record<string, Client> = {
  'MCT-CLT-00001': { id:'MCT-CLT-00001', name:'Aisha Wanjiku',  phone:'+254 712 345 678', email:'aisha.wanjiku@gmail.com',   location:'Westlands, Nairobi',    joined:'12 Jan 2025', totalJobs:8,  verified:true  },
  'MCT-CLT-00002': { id:'MCT-CLT-00002', name:'James Omondi',   phone:'+254 723 456 789', email:'james.omondi@gmail.com',    location:'Kilimani, Nairobi',     joined:'03 Mar 2025', totalJobs:5,  verified:true  },
  'MCT-CLT-00003': { id:'MCT-CLT-00003', name:'Grace Achieng',  phone:'+254 734 567 890', email:'grace.achieng@yahoo.com',   location:'South B, Nairobi',      joined:'22 Feb 2025', totalJobs:3,  verified:true  },
  'MCT-CLT-00004': { id:'MCT-CLT-00004', name:'Peter Njoroge',  phone:'+254 745 678 901', email:'peter.njoroge@gmail.com',   location:'Kasarani, Nairobi',     joined:'15 Apr 2025', totalJobs:2,  verified:false },
  'MCT-CLT-00005': { id:'MCT-CLT-00005', name:'Fatuma Khalid',  phone:'+254 756 789 012', email:'fatuma.khalid@gmail.com',   location:'Parklands, Nairobi',    joined:'01 May 2025', totalJobs:1,  verified:true  },
  'MCT-CLT-00006': { id:'MCT-CLT-00006', name:'David Ochieng',  phone:'+254 767 890 123', email:'david.ochieng@outlook.com', location:'Lavington, Nairobi',    joined:'18 Dec 2024', totalJobs:12, verified:true  },
}

const RIDERS: Record<string, Rider> = {
  'MCT-RDR-00001': { id:'MCT-RDR-00001', name:'Samuel Kamau',  phone:'+254 700 111 222', email:'samuel.kamau@gmail.com',  plate:'KDG 123A', zone:'Westlands / CBD',   rating:4.8, totalDeliveries:142, verified:true },
  'MCT-RDR-00002': { id:'MCT-RDR-00002', name:'Peter Njoroge', phone:'+254 700 333 444', email:'peter.njoroge2@gmail.com', plate:'KDA 321D', zone:'Kilimani / Hurlingham', rating:4.6, totalDeliveries:98,  verified:true },
}

const DELIVERIES: Delivery[] = [
  {
    id: 'MCT-JOB-00001', docType: 'Passport',
    client: CLIENTS['MCT-CLT-00001'], rider: RIDERS['MCT-RDR-00001'],
    status: 'Completed', escrow: 'Released', amount: 1000,
    pickup: 'Huduma Centre, CBD', dropoff: 'Westlands Mall, Westlands',
    date: '16 May 2026', time: '11:34 AM', mpesa: 'PYT9X2K1Q3', eta: '—',
    notes: 'Client confirmed via OTP #8821. Delivered on time.',
  },
  {
    id: 'MCT-JOB-00002', docType: 'Birth Certificate',
    client: CLIENTS['MCT-CLT-00002'], rider: RIDERS['MCT-RDR-00002'],
    status: 'Completed', escrow: 'Released', amount: 350,
    pickup: 'City Hall Annex, CBD', dropoff: 'Kilimani, Nairobi',
    date: '16 May 2026', time: '10:18 AM', mpesa: 'BRT4N7X2Q1', eta: '—',
    notes: 'Smooth delivery. Client happy.',
  },
  {
    id: 'MCT-JOB-00003', docType: 'National ID',
    client: CLIENTS['MCT-CLT-00003'], rider: RIDERS['MCT-RDR-00001'],
    status: 'In Transit', escrow: 'Held', amount: 1000,
    pickup: 'Huduma Centre, CBD', dropoff: 'South B, Nairobi',
    date: '16 May 2026', time: '09:12 AM', mpesa: 'NID7K3M2X9', eta: '~25 min',
    notes: 'QR scanned at pickup. Rider en route.',
  },
  {
    id: 'MCT-JOB-00004', docType: 'KRA PIN Certificate',
    client: CLIENTS['MCT-CLT-00004'], rider: null,
    status: 'Awaiting Pickup', escrow: 'Held', amount: 350,
    pickup: 'Times Tower, CBD', dropoff: 'Kasarani, Nairobi',
    date: '16 May 2026', time: '08:45 AM', mpesa: 'KRA2P8X1N4', eta: 'Unassigned',
    notes: 'Awaiting rider assignment.',
  },
  {
    id: 'MCT-JOB-00005', docType: 'Driving Licence',
    client: CLIENTS['MCT-CLT-00005'], rider: null,
    status: 'Awaiting Payment', escrow: 'Pending', amount: 1000,
    pickup: 'NTSA Upperhill', dropoff: 'Parklands, Nairobi',
    date: '15 May 2026', time: '04:30 PM', mpesa: '—', eta: '—',
    notes: 'STK Push not yet confirmed by client.',
  },
  {
    id: 'MCT-JOB-00006', docType: 'Passport',
    client: CLIENTS['MCT-CLT-00006'], rider: RIDERS['MCT-RDR-00002'],
    status: 'Completed', escrow: 'Released', amount: 1000,
    pickup: 'Huduma Centre, CBD', dropoff: 'Lavington, Nairobi',
    date: '15 May 2026', time: '14:25 PM', mpesa: 'PRT6X1K9N3', eta: '—',
    notes: 'Client OTP confirmed. Delivered.',
  },
  {
    id: 'MCT-JOB-00008', docType: 'Logbook',
    client: CLIENTS['MCT-CLT-00001'], rider: RIDERS['MCT-RDR-00001'],
    status: 'Failed', escrow: 'Held', amount: 1000,
    pickup: 'NTSA Upperhill', dropoff: 'Westlands, Nairobi',
    date: '14 May 2026', time: '02:10 PM', mpesa: 'LOG8X4K2N1', eta: '—',
    notes: 'Rider could not locate client. Delivery failed after 3 attempts.',
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const STATUS_STYLE: Record<DeliveryStatus, string> = {
  'Completed':       'bg-green-500/10 text-green-400 border border-green-500/20',
  'In Transit':      'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Awaiting Payment':'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  'Awaiting Pickup': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Failed':          'bg-red-500/10 text-red-400 border border-red-500/20',
  'Cancelled':       'bg-gray-500/10 text-gray-400 border border-gray-500/20',
}
const ESCROW_STYLE = {
  Released: 'bg-green-500/10 text-green-400 border border-green-500/20',
  Held:     'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Pending:  'bg-purple-500/10 text-purple-400 border border-purple-500/20',
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
// PERSON MODAL (shared for client & rider)
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
      <div className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[460px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
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

        {/* Body */}
        <div className="px-6 py-5 space-y-0">
          {[
            ['ID',           data.id,                           'text-yellow-400 font-mono'],
            ['Phone',        data.phone,                        'text-[#e8e4d8]'],
            ['Email',        data.email,                        'text-blue-400'],
            ...(client ? [
              ['Location',   client.location,                   'text-[#e8e4d8]'],
              ['Joined',     client.joined,                     'text-[#e8e4d8]'],
              ['Total Jobs', String(client.totalJobs),          'text-[#e8e4d8] font-mono'],
              ['Verified',   client.verified ? '✓ Verified' : '✗ Unverified', client.verified ? 'text-green-400' : 'text-red-400'],
            ] : []),
            ...(rider ? [
              ['Plate',          rider.plate,                                 'text-[#e8e4d8] font-mono'],
              ['Zone',           rider.zone,                                  'text-[#e8e4d8]'],
              ['Rating',         `${rider.rating} / 5.0`,                    'text-yellow-400'],
              ['Total Deliveries', String(rider.totalDeliveries),             'text-[#e8e4d8] font-mono'],
              ['Verified',       rider.verified ? '✓ Verified' : '✗ Unverified', rider.verified ? 'text-green-400' : 'text-red-400'],
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
// DELIVERY DETAIL MODAL
// ─────────────────────────────────────────────
function DeliveryModal({ delivery, onClose, onViewClient, onViewRider }: {
  delivery: Delivery
  onClose: () => void
  onViewClient: (c: Client) => void
  onViewRider: (r: Rider) => void
}) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[540px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#8b1a2f] px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-[16px] font-mono">{delivery.id}</p>
              <p className="text-white/60 text-[11px] mt-0.5">{delivery.docType} · {delivery.date} at {delivery.time}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={delivery.status} className="bg-white/15 text-white border border-white/20" />
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors">✕</button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Route */}
          <div className="bg-[#2a2e20] border border-white/[0.07] rounded-xl p-4">
            <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-3">Delivery Route</p>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center mt-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8b1a2f]" />
                <div className="w-px h-8 bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] text-[#6b6856]">PICKUP</p>
                  <p className="text-[13px] text-[#e8e4d8] font-medium">{delivery.pickup}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#6b6856]">DROPOFF</p>
                  <p className="text-[13px] text-[#e8e4d8] font-medium">{delivery.dropoff}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#6b6856]">ETA</p>
                <p className="text-[13px] text-blue-400 font-mono">{delivery.eta}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div>
            {[
              ['M-Pesa Code',    delivery.mpesa,                       'text-blue-400 font-mono'],
              ['Amount',         `KSh ${delivery.amount.toLocaleString()}`, 'text-[#e8e4d8] font-mono font-semibold'],
              ['Escrow',         delivery.escrow,                      ESCROW_STYLE[delivery.escrow].split(' ').filter(c => c.startsWith('text-')).join(' ')],
              ['Date & Time',    `${delivery.date} · ${delivery.time}`,'text-[#e8e4d8]'],
              ['Notes',          delivery.notes,                       'text-[#9c9882]'],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex justify-between items-start py-[7px] border-b border-white/[0.07] last:border-0 gap-4">
                <span className="text-[11px] text-[#6b6856] flex-shrink-0">{label}</span>
                <span className={`text-[12px] font-medium text-right ${cls}`}>{val}</span>
              </div>
            ))}
          </div>

          {/* People */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onViewClient(delivery.client)}
              className="bg-[#2a2e20] border border-white/[0.07] hover:border-[#8b1a2f]/40 rounded-xl p-3.5 text-left transition-all group"
            >
              <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-2">Client</p>
              <p className="text-[13px] font-medium text-[#e8e4d8] group-hover:text-white">{delivery.client.name}</p>
              <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{delivery.client.id}</p>
              <p className="text-[10px] text-[#8b1a2f] mt-2 group-hover:underline">View profile →</p>
            </button>
            <button
              onClick={() => delivery.rider ? onViewRider(delivery.rider) : null}
              className={`bg-[#2a2e20] border border-white/[0.07] rounded-xl p-3.5 text-left transition-all ${delivery.rider ? 'hover:border-[#8b1a2f]/40 group cursor-pointer' : 'opacity-50 cursor-default'}`}
            >
              <p className="text-[10px] text-[#6b6856] uppercase tracking-wider mb-2">Rider</p>
              <p className="text-[13px] font-medium text-[#e8e4d8]">{delivery.rider?.name ?? 'Unassigned'}</p>
              <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{delivery.rider?.id ?? '—'}</p>
              {delivery.rider && <p className="text-[10px] text-[#8b1a2f] mt-2 group-hover:underline">View profile →</p>}
            </button>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function DeliveriesPage() {
  const router = useRouter()
  const [tab, setTab]               = useState<TabFilter>('all')
  const [search, setSearch]         = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [personModal, setPersonModal] = useState<{ type: 'client' | 'rider'; data: Client | Rider } | null>(null)

  const filtered = DELIVERIES.filter(d => {
    if (tab === 'active')    return ['In Transit','Awaiting Pickup','Awaiting Payment'].includes(d.status)
    if (tab === 'completed') return d.status === 'Completed'
    if (tab === 'failed')    return ['Failed','Cancelled'].includes(d.status)
    return true
  }).filter(d => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      d.id.toLowerCase().includes(q) ||
      d.client.name.toLowerCase().includes(q) ||
      (d.rider?.name ?? '').toLowerCase().includes(q) ||
      d.docType.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    )
  })

  const TABS = [
    { key: 'all' as TabFilter,       label: 'All Deliveries' },
    { key: 'active' as TabFilter,    label: 'Active' },
    { key: 'completed' as TabFilter, label: 'Completed' },
    { key: 'failed' as TabFilter,    label: 'Failed' },
  ]

  const stats = [
    { label: 'Total Deliveries', value: String(DELIVERIES.length),                                           sub: 'All time',                  accent: '#8b1a2f' },
    { label: 'Active Now',       value: String(DELIVERIES.filter(d => d.status === 'In Transit').length),    sub: 'Currently in transit',      accent: '#5599e0' },
    { label: 'Completed Today',  value: String(DELIVERIES.filter(d => d.status === 'Completed').length),     sub: '16 May 2026',               accent: '#4caf82' },
    { label: 'Awaiting Rider',   value: String(DELIVERIES.filter(d => d.status === 'Awaiting Pickup').length), sub: 'Need assignment',          accent: '#e09345' },
    { label: 'Failed',           value: String(DELIVERIES.filter(d => d.status === 'Failed').length),        sub: 'Requires follow-up',        accent: '#e05757' },
  ]

  return (
    <div className="flex h-screen bg-[#1a1c14] text-[#e8e4d8] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Deliveries" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">Deliveries</h1>
              <p className="text-[11px] text-[#6b6856] mt-0.5">Saturday, 16 May 2026 · Nairobi, Kenya</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] hover:bg-white/5 transition-colors">
                ⬇ Export
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors">
                + New Delivery
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
              <h2 className="text-[13.5px] font-semibold">Delivery Log</h2>
              <span className="bg-[#2a2e20] border border-white/[0.07] text-[#9c9882] text-[10px] px-2 py-0.5 rounded-full font-mono">
                {filtered.length} records
              </span>
              <div className="ml-auto">
                <input
                  type="text"
                  placeholder="Search job, client, rider…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-[#22251a] border border-white/[0.07] focus:border-white/[0.14] rounded-lg px-3 py-1.5 text-[12px] text-[#e8e4d8] placeholder:text-[#6b6856] outline-none w-52 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#2a2e20]">
                    {['Job', 'Document', 'Client', 'Rider', 'Route', 'Status', 'Escrow', 'Amount', 'Date & Time', 'Actions'].map(h => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-semibold text-[#6b6856] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr
                      key={d.id}
                      className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedDelivery(d)}
                    >
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[11.5px] text-yellow-400 font-medium">{d.id}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="text-[12px] text-[#e8e4d8]">{d.docType}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <button
                          onClick={e => { e.stopPropagation(); setPersonModal({ type: 'client', data: d.client }) }}
                          className="text-left hover:opacity-80 transition-opacity"
                        >
                          <p className="text-[12.5px] font-medium text-[#e8e4d8] hover:text-white">{d.client.name}</p>
                          <p className="text-[10px] font-mono text-[#8b1a2f] mt-0.5 hover:underline">{d.client.id}</p>
                        </button>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        {d.rider ? (
                          <button
                            onClick={e => { e.stopPropagation(); setPersonModal({ type: 'rider', data: d.rider! }) }}
                            className="text-left hover:opacity-80 transition-opacity"
                          >
                            <p className="text-[12.5px] font-medium text-[#e8e4d8] hover:text-white">{d.rider.name}</p>
                            <p className="text-[10px] font-mono text-[#8b1a2f] mt-0.5 hover:underline">{d.rider.id}</p>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#6b6856] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3 align-middle max-w-[160px]">
                        <p className="text-[10.5px] text-[#9c9882] truncate">📍 {d.pickup}</p>
                        <p className="text-[10.5px] text-[#6b6856] truncate mt-0.5">→ {d.dropoff}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <Badge label={d.status} className={STATUS_STYLE[d.status]} />
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <Badge label={d.escrow} className={ESCROW_STYLE[d.escrow]} />
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono font-semibold text-[13px] text-[#e8e4d8]">KSh {d.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle whitespace-nowrap">
                        <p className="text-[12px] text-[#9c9882]">{d.time}</p>
                        <p className="text-[10px] text-[#6b6856] mt-0.5">{d.date}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedDelivery(d)}
                            className="px-2 py-1 rounded text-[10.5px] font-medium transition-colors"
                            style={{ background: 'rgba(139,26,47,0.12)', color: '#c45070', border: '1px solid rgba(139,26,47,0.25)' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/payments/${d.id}`)}
                            className="px-2 py-1 rounded text-[10.5px] font-medium transition-colors"
                            style={{ background: 'rgba(85,153,224,0.10)', color: '#5599e0', border: '1px solid rgba(85,153,224,0.2)' }}
                          >
                            Payment
                          </button>
                        </div>
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
      {selectedDelivery && (
        <DeliveryModal
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onViewClient={c => { setSelectedDelivery(null); setPersonModal({ type: 'client', data: c }) }}
          onViewRider={r => { setSelectedDelivery(null); setPersonModal({ type: 'rider', data: r }) }}
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
