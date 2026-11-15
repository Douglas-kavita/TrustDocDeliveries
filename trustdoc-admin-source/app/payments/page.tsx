'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type EscrowStatus = 'Released' | 'Held' | 'Pending'
type DeliveryStatus =
  | 'Completed'
  | 'In Transit'
  | 'Paid — Escrow'
  | 'Awaiting Payment'
  | 'Not Paid'
type TabFilter = 'all' | 'held' | 'released' | 'pending'

interface Payment {
  id: string
  type: string
  docType: string
  client: string
  clientId: string
  rider: string
  riderId: string
  mpesa: string
  riderMpesa: string
  amount: number
  platform: number
  payout: number
  escrow: EscrowStatus
  delivery: DeliveryStatus
  clientConf: string
  date: string
  time: string
}

interface TrailEvent {
  dot: 'g' | 'b' | 'a' | 'r' | 'm'
  title: string
  desc: string
  time: string
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const PAYMENTS: Payment[] = [
  { id:'MCT-JOB-00001', type:'Delivery', docType:'Passport',         client:'Aisha Wanjiku',  clientId:'MCT-CLT-00001', rider:'Samuel Kamau',  riderId:'MCT-RDR-00001', mpesa:'PYT9X2K1Q3', riderMpesa:'RLS8K2M9P4', amount:1000, platform:150, payout:850, escrow:'Released', delivery:'Completed',       clientConf:'Yes · 11:32', date:'16 May 2026', time:'11:34 AM' },
  { id:'MCT-JOB-00002', type:'Check',    docType:'Birth Certificate', client:'James Omondi',   clientId:'MCT-CLT-00002', rider:'Peter Njoroge', riderId:'MCT-RDR-00002', mpesa:'BRT4N7X2Q1', riderMpesa:'RLS3P1K8N2', amount:350,  platform:100, payout:250, escrow:'Released', delivery:'Completed',       clientConf:'Yes · 10:15', date:'16 May 2026', time:'10:18 AM' },
  { id:'MCT-JOB-00003', type:'Delivery', docType:'National ID',      client:'Grace Achieng',  clientId:'MCT-CLT-00003', rider:'Samuel Kamau',  riderId:'MCT-RDR-00001', mpesa:'NID7K3M2X9', riderMpesa:'—',          amount:1000, platform:150, payout:850, escrow:'Held',     delivery:'In Transit',      clientConf:'Pending',     date:'16 May 2026', time:'09:12 AM' },
  { id:'MCT-JOB-00004', type:'Check',    docType:'KRA PIN',          client:'Peter Njoroge',  clientId:'MCT-CLT-00004', rider:'Unassigned',    riderId:'—',             mpesa:'KRA2P8X1N4', riderMpesa:'—',          amount:350,  platform:100, payout:250, escrow:'Held',     delivery:'Paid — Escrow',   clientConf:'Pending',     date:'16 May 2026', time:'08:45 AM' },
  { id:'MCT-JOB-00005', type:'Delivery', docType:'Driving Licence',  client:'Fatuma Khalid',  clientId:'MCT-CLT-00005', rider:'Unassigned',    riderId:'—',             mpesa:'DLC9X3K4P7', riderMpesa:'—',          amount:1000, platform:150, payout:850, escrow:'Held',     delivery:'Awaiting Payment', clientConf:'No',          date:'15 May 2026', time:'04:30 PM' },
  { id:'MCT-JOB-00006', type:'Delivery', docType:'Passport',         client:'David Ochieng',  clientId:'MCT-CLT-00006', rider:'Peter Njoroge', riderId:'MCT-RDR-00002', mpesa:'PRT6X1K9N3', riderMpesa:'RLS7N2K5P1', amount:1000, platform:150, payout:850, escrow:'Released', delivery:'Completed',       clientConf:'Yes · 14:22', date:'15 May 2026', time:'14:25 PM' },
  { id:'MCT-JOB-00007', type:'Check',    docType:'Marriage Cert',    client:'Mary Kamau',     clientId:'MCT-CLT-00007', rider:'Samuel Kamau',  riderId:'MCT-RDR-00001', mpesa:'—',          riderMpesa:'—',          amount:350,  platform:100, payout:250, escrow:'Pending',  delivery:'Not Paid',        clientConf:'No',          date:'15 May 2026', time:'11:10 AM' },
]

const TRAILS: Record<string, TrailEvent[]> = {
  'MCT-JOB-00001': [
    { dot:'g', title:'Escrow released to rider — KSh 850',       desc:'Admin triggered release after client OTP. M-Pesa disbursement ref: RLS8K2M9P4.',        time:'16 May 2026 · 11:34:22 · Admin: admin@TrustDoc.co.ke' },
    { dot:'g', title:'Client confirmed package received',         desc:'Aisha Wanjiku entered OTP #8821 via client app. Delivery → Completed.',                  time:'16 May 2026 · 11:32:07 · Client: MCT-CLT-00001' },
    { dot:'b', title:'Rider arrived at destination',              desc:'Samuel Kamau marked arrival. System issued OTP to client.',                               time:'16 May 2026 · 11:28:44 · Rider: MCT-RDR-00001' },
    { dot:'b', title:'QR scanned at pickup · Parcel in transit',  desc:'Parcel sealed and logged at KDG 123A.',                                                   time:'16 May 2026 · 09:44:11 · Rider: MCT-RDR-00001' },
    { dot:'a', title:'Escrow locked — awaiting delivery',         desc:'KSh 1,000 received. KSh 850 held for rider, KSh 150 platform fee.',                      time:'16 May 2026 · 09:13:05 · System auto-lock' },
    { dot:'a', title:'M-Pesa STK Push confirmed',                 desc:'Aisha Wanjiku paid KSh 1,000. Code: PYT9X2K1Q3 confirmed via API callback.',             time:'16 May 2026 · 09:12:47 · Client: MCT-CLT-00001' },
  ],
  'MCT-JOB-00002': [
    { dot:'g', title:'Escrow released to rider — KSh 250',       desc:'Admin released after client confirmation. M-Pesa ref: RLS3P1K8N2.',                      time:'16 May 2026 · 10:18:09 · Admin' },
    { dot:'g', title:'Client confirmed receipt',                  desc:'James Omondi confirmed via OTP #3342.',                                                   time:'16 May 2026 · 10:15:33 · Client: MCT-CLT-00002' },
    { dot:'b', title:'Rider at destination · OTP issued',         desc:'Peter Njoroge marked arrival.',                                                           time:'16 May 2026 · 10:11:20 · Rider: MCT-RDR-00002' },
    { dot:'a', title:'Payment received & escrow locked',          desc:'KSh 350 received. KSh 250 rider hold, KSh 100 platform.',                                time:'16 May 2026 · 09:55:02 · System' },
    { dot:'a', title:'STK Push confirmed',                        desc:'James Omondi paid KSh 350. Code: BRT4N7X2Q1.',                                           time:'16 May 2026 · 09:54:47 · Client: MCT-CLT-00002' },
  ],
  'MCT-JOB-00003': [
    { dot:'b', title:'QR scanned at pickup · Parcel in transit',  desc:'Samuel Kamau scanned QR at KDG 123A. Package sealed.',                                   time:'16 May 2026 · 09:44:11 · Rider: MCT-RDR-00001' },
    { dot:'a', title:'Escrow locked — awaiting delivery',         desc:'KSh 1,000 received. KSh 850 held for rider.',                                             time:'16 May 2026 · 09:13:05 · System' },
    { dot:'a', title:'STK Push confirmed',                        desc:'Grace Achieng paid KSh 1,000. Code: NID7K3M2X9.',                                        time:'16 May 2026 · 09:12:47 · Client: MCT-CLT-00003' },
  ],
  'MCT-JOB-00004': [
    { dot:'a', title:'Escrow locked — rider unassigned',          desc:'KSh 350 received. Held pending rider assignment.',                                        time:'16 May 2026 · 08:46:00 · System' },
    { dot:'a', title:'STK Push confirmed',                        desc:'Peter Njoroge paid KSh 350. Code: KRA2P8X1N4.',                                          time:'16 May 2026 · 08:45:33 · Client: MCT-CLT-00004' },
  ],
  'MCT-JOB-00005': [
    { dot:'r', title:'Payment not yet received',                  desc:'Job created. STK Push not yet triggered by client.',                                      time:'15 May 2026 · 16:30:00 · System' },
  ],
  'MCT-JOB-00006': [
    { dot:'g', title:'Escrow released to rider — KSh 850',       desc:'Admin released after client OTP. M-Pesa ref: RLS7N2K5P1.',                               time:'15 May 2026 · 14:25:11 · Admin' },
    { dot:'g', title:'Client confirmed receipt',                  desc:'David Ochieng confirmed via OTP #7719.',                                                  time:'15 May 2026 · 14:22:44 · Client: MCT-CLT-00006' },
    { dot:'b', title:'Rider at destination · OTP issued',         desc:'Peter Njoroge marked arrival.',                                                           time:'15 May 2026 · 14:18:03 · Rider: MCT-RDR-00002' },
    { dot:'b', title:'Parcel in transit',                         desc:'QR scanned at pickup.',                                                                   time:'15 May 2026 · 13:50:20 · Rider: MCT-RDR-00002' },
    { dot:'a', title:'Escrow locked',                             desc:'KSh 1,000 received. KSh 850 held for rider.',                                             time:'15 May 2026 · 13:31:05 · System' },
    { dot:'a', title:'STK Push confirmed',                        desc:'David Ochieng paid KSh 1,000. Code: PRT6X1K9N3.',                                        time:'15 May 2026 · 13:30:49 · Client: MCT-CLT-00006' },
  ],
  'MCT-JOB-00007': [
    { dot:'r', title:'Job created — no payment yet',              desc:'Mary Kamau job logged. Awaiting STK Push.',                                               time:'15 May 2026 · 11:10:00 · Admin' },
  ],
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const ESCROW_STYLE: Record<EscrowStatus, string> = {
  Released: 'bg-green-500/10 text-green-400 border border-green-500/20',
  Held:     'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  Pending:  'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}
const DELIVERY_STYLE: Record<string, string> = {
  'Completed':        'bg-green-500/10 text-green-400 border border-green-500/20',
  'In Transit':       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  'Paid — Escrow':    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  'Awaiting Payment': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  'Not Paid':         'bg-red-500/10 text-red-400 border border-red-500/20',
}
const DOT_COLOR: Record<string, string> = {
  g: 'bg-green-400',
  b: 'bg-blue-400',
  a: 'bg-yellow-400',
  r: 'bg-red-400',
  m: 'bg-[#8b1a2f]',
}

function confColor(v: string) {
  if (v === 'Pending') return 'text-yellow-400'
  if (v === 'No')      return 'text-red-400'
  return 'text-green-400'
}

function exportCSV() {
  const headers = ['Job ID','Client','Rider','M-Pesa Code','Amount','Platform Cut','Rider Payout','Escrow Status','Delivery Status','Client Confirmed','Date']
  const rows = PAYMENTS.map(p =>
    [p.id,p.client,p.rider,p.mpesa,p.amount,p.platform,p.payout,p.escrow,p.delivery,p.clientConf,`${p.date} ${p.time}`]
  )
  const csv = [headers,...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = `TrustDoc-payments-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-medium ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

function ReceiptModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const isReleased = payment.escrow === 'Released'
  const rcptNum = `RCPT-${payment.id.replace('MCT-JOB-', 'MCT-')}`

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[480px] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-[#8b1a2f] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#8b1a2f] font-bold text-sm">C</div>
              <div>
                <p className="text-white font-semibold text-sm">TrustDoc</p>
                <p className="text-white/50 text-[9px] uppercase tracking-widest">Official Payment Receipt</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors">✕</button>
          </div>
          <p className="text-white font-semibold text-base mt-3">
            {isReleased ? 'Escrow Release Confirmation' : 'Escrow Hold Receipt'}
          </p>
          <p className="text-white/50 text-[11px] mt-0.5">{rcptNum} · {payment.date}, {payment.time}</p>
        </div>

        <div className="px-6 py-5 space-y-0">
          {[
            ['Job Reference',          payment.id,                                     'text-yellow-400 font-mono'],
            ['Service Type',           `${payment.type} — ${payment.docType}`,         'text-[#e8e4d8]'],
            ['Client Name',            `${payment.client} (${payment.clientId})`,      'text-[#e8e4d8]'],
            ['Client M-Pesa Code',     payment.mpesa !== '—' ? payment.mpesa : 'Not paid', 'text-blue-400 font-mono'],
            ['Rider Assigned',         `${payment.rider} (${payment.riderId})`,        'text-[#e8e4d8]'],
            ['Rider Payout Ref',       payment.riderMpesa !== '—' ? payment.riderMpesa : '— pending —', 'text-green-400 font-mono'],
            ['Delivery Confirmed',     payment.clientConf,                             confColor(payment.clientConf)],
            ['Release Time',           isReleased ? payment.time : '— pending —',      'text-[#e8e4d8]'],
            ['Total Charged (Client)', `KSh ${payment.amount.toLocaleString()}`,        'text-[#e8e4d8] font-mono'],
            ['Platform Fee',           `KSh ${payment.platform}`,                      'text-[#9c9882] font-mono'],
          ].map(([label, val, cls]) => (
            <div key={label} className="flex justify-between items-center py-[7px] border-b border-white/[0.07] last:border-0">
              <span className="text-[11px] text-[#6b6856]">{label}</span>
              <span className={`text-[12px] font-medium text-right ${cls}`}>{val}</span>
            </div>
          ))}

          <div className="mt-4 rounded-lg border border-[#8b1a2f]/25 p-3.5 flex items-center justify-between" style={{ background: 'rgba(139,26,47,0.08)' }}>
            <div>
              <p className="text-[10px] text-[#6b6856] uppercase tracking-wider">{isReleased ? 'Rider Received' : 'Rider Payout (on release)'}</p>
              <p className="text-[10px] text-[#6b6856] mt-1">
                {isReleased
                  ? `Disbursed via M-Pesa · Ref: ${payment.riderMpesa}`
                  : 'Funds held in escrow · releases on delivery confirmation'}
              </p>
            </div>
            <span className={`font-mono font-semibold text-xl ${isReleased ? 'text-green-400' : 'text-yellow-400'}`}>
              KSh {payment.payout}
            </span>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex justify-end gap-2">
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] hover:bg-white/5 transition-colors">
            🖨 Print
          </button>
          <button
            onClick={() => alert(`📄 Downloading receipt PDF for ${payment.id}…`)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors"
          >
            ⬇ Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function TrailModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const events = TRAILS[payment.id] || []
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[520px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-white/[0.07] flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="text-[14px] font-semibold text-[#e8e4d8] flex items-center gap-2">
              <span className="text-[#8b1a2f]">▶</span> Payment Audit Trail
            </h2>
            <p className="text-[11px] text-[#6b6856] mt-1">{payment.id} · {payment.client} · {payment.date}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] hover:bg-white/5 flex items-center justify-center text-xs transition-colors">✕</button>
        </div>

        <div className="px-6 py-5 overflow-y-auto flex-1">
          <div className="flex flex-col">
            {events.map((ev, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center w-4 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${DOT_COLOR[ev.dot]}`} />
                  {i < events.length - 1 && <div className="w-px bg-white/[0.07] flex-1 min-h-[12px]" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-[12px] font-medium text-[#e8e4d8]">{ev.title}</p>
                  <p className="text-[11px] text-[#6b6856] mt-0.5 leading-relaxed">{ev.desc}</p>
                  <p className="text-[10px] text-[#6b6856] font-mono mt-1">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex justify-end gap-2 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] transition-colors">Close</button>
          <button
            onClick={() => alert(`Exporting trail CSV for ${payment.id}…`)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            ⬇ Export Log
          </button>
        </div>
      </div>
    </div>
  )
}

function ReleaseModal({ payment, onClose, onConfirm }: { payment: Payment; onClose: () => void; onConfirm: () => void }) {
  const [checked, setChecked] = useState(false)
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#22251a] border border-white/10 rounded-2xl w-full max-w-[460px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-white/[0.07]">
          <h2 className="text-[15px] font-semibold text-[#e8e4d8] flex items-center gap-2">
            <span className="text-green-400">🔓</span> Release Escrow to Rider
          </h2>
          <p className="text-[12px] text-[#6b6856] mt-1">Confirm the client has received the package before releasing funds.</p>
        </div>
        <div className="px-6 py-5">
          <div className="bg-[#2a2e20] border border-white/[0.07] rounded-xl p-4 mb-4 space-y-2">
            {[
              ['Job ID',             payment.id,           'text-yellow-400 font-mono'],
              ['Client',             payment.client,        'text-[#e8e4d8]'],
              ['Rider',              payment.rider,         'text-[#e8e4d8]'],
              ['Client M-Pesa Code', payment.mpesa,         'text-blue-400 font-mono'],
              ['Amount to Release',  `KSh ${payment.payout}`,'text-green-400 font-mono'],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex justify-between text-[12px]">
                <span className="text-[#6b6856]">{label}</span>
                <span className={`font-medium ${cls}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 mb-4 flex gap-2 items-start text-[11.5px] text-yellow-400">
            <span className="mt-0.5 flex-shrink-0">⚠</span>
            <span>Once released, this cannot be undone. Funds will be sent to the rider&apos;s M-Pesa immediately.</span>
          </div>
          <label className="flex items-center gap-2 text-[12.5px] text-[#9c9882] cursor-pointer">
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="accent-green-500" />
            I confirm the client has received the package and authorise this release.
          </label>
        </div>
        <div className="px-6 py-3.5 border-t border-white/[0.07] bg-[#2a2e20] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] transition-colors">Cancel</button>
          <button
            onClick={() => { if (!checked) { alert('Please confirm delivery first.'); return; } onConfirm(); }}
            className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition-colors"
          >
            ✈ Confirm & Release
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function PaymentsPage() {
  const router = useRouter()
  const [tab, setTab]               = useState<TabFilter>('all')
  const [search, setSearch]         = useState('')
  const [receiptFor, setReceiptFor] = useState<Payment | null>(null)
  const [trailFor, setTrailFor]     = useState<Payment | null>(null)
  const [releaseFor, setReleaseFor] = useState<Payment | null>(null)

  const filtered = PAYMENTS.filter(p => {
    if (tab === 'held')     return p.escrow === 'Held'
    if (tab === 'released') return p.escrow === 'Released'
    if (tab === 'pending')  return p.clientConf === 'Pending'
    return true
  }).filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.id.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.rider.toLowerCase().includes(q) ||
      p.mpesa.toLowerCase().includes(q) ||
      p.docType.toLowerCase().includes(q)
    )
  })

  function handleRelease() {
    setReleaseFor(null)
    alert('✅ Escrow released!\nM-Pesa disbursement initiated.\nReceipt sent to rider app and saved in audit trail.')
  }

  const TABS: { key: TabFilter; label: string }[] = [
    { key: 'all',      label: 'All Payments' },
    { key: 'held',     label: 'Held in Escrow' },
    { key: 'released', label: 'Released' },
    { key: 'pending',  label: 'Awaiting Confirmation' },
  ]

  return (
    <div className="flex h-screen bg-[#1a1c14] text-[#e8e4d8] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Payments & Escrow" />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-white">Payments &amp; Escrow</h1>
              <p className="text-[11px] text-[#6b6856] mt-0.5">Saturday, 16 May 2026 · Nairobi, Kenya</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium border border-white/10 text-[#9c9882] hover:text-[#e8e4d8] hover:bg-white/5 transition-colors">
                ⬇ Export
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-medium bg-[#8b1a2f] text-white hover:bg-[#a82038] transition-colors">
                + New Payment
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: "Today's Revenue",   value: 'KSh 38,450', sub: 'Platform cut: KSh 5,768',        accent: '#8b1a2f' },
              { label: 'Escrow Held',       value: 'KSh 14,200', sub: '4 transactions pending release',  accent: '#e09345' },
              { label: 'Released Today',    value: 'KSh 24,250', sub: '8 to riders · all confirmed',    accent: '#4caf82' },
              { label: 'Pending Conf.',     value: '3',           sub: 'Client must confirm receipt',     accent: '#5599e0' },
              { label: 'Disputed / Failed', value: '1',           sub: 'Open support ticket',             accent: '#e05757' },
            ].map(s => (
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
                  tab === t.key
                    ? 'bg-[#2a2e20] text-[#e8e4d8]'
                    : 'text-[#6b6856] hover:text-[#9c9882]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Transaction table */}
          <div className="bg-[#252820] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-3">
              <h2 className="text-[13.5px] font-semibold">Transaction Ledger</h2>
              <span className="bg-[#2a2e20] border border-white/[0.07] text-[#9c9882] text-[10px] px-2 py-0.5 rounded-full font-mono">
                {filtered.length} records
              </span>
              <div className="ml-auto">
                <input
                  type="text"
                  placeholder="Search job, client, M-Pesa…"
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
                    {['Job', 'Client', 'Rider', 'M-Pesa Code', 'Amount', 'Platform Cut', 'Rider Payout', 'Escrow Status', 'Delivery Status', 'Client Confirmed', 'Date & Time', 'Actions'].map(h => (
                      <th key={h} className="px-3.5 py-2.5 text-left text-[10px] font-semibold text-[#6b6856] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr
                      key={p.id}
                      className="border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => router.push(`/payments/${p.id}`)}
                    >
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[11.5px] text-yellow-400 font-medium">{p.id}</p>
                        <p className="text-[10px] text-[#6b6856] mt-0.5">{p.docType}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="text-[12.5px] font-medium text-[#e8e4d8]">{p.client}</p>
                        <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{p.clientId}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="text-[12.5px] font-medium text-[#e8e4d8]">{p.rider}</p>
                        <p className="text-[10px] font-mono text-[#6b6856] mt-0.5">{p.riderId}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        {p.mpesa !== '—'
                          ? <span className="font-mono text-[11px] text-blue-400 px-1.5 py-0.5 rounded" style={{ background: 'rgba(85,153,224,0.08)' }}>{p.mpesa}</span>
                          : <span className="text-[11px] text-[#6b6856]">—</span>}
                        {p.riderMpesa !== '—' && (
                          <div className="mt-1">
                            <span className="font-mono text-[11px] text-green-400 px-1.5 py-0.5 rounded" style={{ background: 'rgba(76,175,130,0.08)' }}>{p.riderMpesa}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono font-semibold text-[13px] text-[#e8e4d8]">KSh {p.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[10px] text-[#6b6856]">KSh {p.platform}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <p className="font-mono text-[10px] text-green-400">KSh {p.payout}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <Badge label={p.escrow} className={ESCROW_STYLE[p.escrow]} />
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <Badge label={p.delivery} className={DELIVERY_STYLE[p.delivery] ?? DELIVERY_STYLE['Awaiting Payment']} />
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <span className={`text-[11.5px] ${confColor(p.clientConf)}`}>{p.clientConf}</span>
                      </td>
                      <td className="px-3.5 py-3 align-middle whitespace-nowrap">
                        <p className="text-[12px] text-[#9c9882]">{p.time}</p>
                        <p className="text-[10px] text-[#6b6856] mt-0.5">{p.date}</p>
                      </td>
                      <td className="px-3.5 py-3 align-middle">
                        <div className="flex items-center gap-1.5 flex-wrap" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setReceiptFor(p)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-medium transition-colors"
                            style={{ background: 'rgba(139,26,47,0.12)', color: '#c45070', border: '1px solid rgba(139,26,47,0.25)' }}
                          >
                            🧾 Receipt
                          </button>
                          <button
                            onClick={() => setTrailFor(p)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-medium transition-colors"
                            style={{ background: 'rgba(85,153,224,0.10)', color: '#5599e0', border: '1px solid rgba(85,153,224,0.2)' }}
                          >
                            📋 Trail
                          </button>
                          {p.escrow === 'Held' && (
                            <button
                              onClick={() => setReleaseFor(p)}
                              className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-medium transition-colors"
                              style={{ background: 'rgba(76,175,130,0.14)', color: '#6fcfa0', border: '1px solid rgba(76,175,130,0.28)' }}
                            >
                              🔓 Release
                            </button>
                          )}
                          <button
                            onClick={() => alert(`Downloading receipt for ${p.id}…`)}
                            className="px-2 py-1 rounded text-[10.5px] text-[#6b6856] hover:text-[#e8e4d8] transition-colors border border-white/[0.08]"
                          >
                            ⬇
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
      {receiptFor && <ReceiptModal payment={receiptFor} onClose={() => setReceiptFor(null)} />}
      {trailFor   && <TrailModal   payment={trailFor}   onClose={() => setTrailFor(null)} />}
      {releaseFor && <ReleaseModal payment={releaseFor} onClose={() => setReleaseFor(null)} onConfirm={handleRelease} />}
    </div>
  )
}
