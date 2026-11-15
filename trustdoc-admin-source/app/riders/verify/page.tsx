'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type ApplicantType = 'Rider' | 'Agent' | 'Client'
type AppStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected'

interface Applicant {
  id: string
  type: ApplicantType
  name: string
  phone: string
  email: string
  location: string
  status: AppStatus
  submittedAt: string
  pendingHours: number
  // Rider specific
  plate?: string
  // Agent specific
  businessType?: string
  serviceArea?: string
  kraPin?: string
  // Client specific
  firstJobId?: string
  firstJobDoc?: string
  // Documents
  hasNationalIdFront: boolean
  hasNationalIdBack: boolean
  hasSelfie: boolean
  hasPlatePhoto?: boolean
  hasKraPin?: boolean
}

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────
const APPLICANTS: Applicant[] = [
  // Riders pending
  {
    id: 'MCT-RDR-00003', type: 'Rider', name: 'David Omondi', phone: '+254711334455',
    email: 'david.omondi@gmail.com', location: 'Eastleigh, Nairobi',
    status: 'Pending', submittedAt: '17 May 2026, 07:30 AM', pendingHours: 3,
    plate: 'KCC 456B',
    hasNationalIdFront: true, hasNationalIdBack: true, hasSelfie: false, hasPlatePhoto: true,
  },
  {
    id: 'MCT-RDR-00004', type: 'Rider', name: 'Faith Muthoni', phone: '+254722445566',
    email: 'faith.muthoni@gmail.com', location: 'Kasarani, Nairobi',
    status: 'Under Review', submittedAt: '16 May 2026, 04:15 PM', pendingHours: 18,
    plate: 'KBZ 789C',
    hasNationalIdFront: true, hasNationalIdBack: true, hasSelfie: true, hasPlatePhoto: true,
  },
  {
    id: 'MCT-RDR-00005', type: 'Rider', name: 'George Waweru', phone: '+254733556677',
    email: 'george.waweru@gmail.com', location: 'Ruaraka, Nairobi',
    status: 'Pending', submittedAt: '16 May 2026, 09:00 AM', pendingHours: 27,
    plate: 'KDH 321E',
    hasNationalIdFront: true, hasNationalIdBack: false, hasSelfie: false, hasPlatePhoto: false,
  },
  // Agents pending
  {
    id: 'MCT-AGT-00004', type: 'Agent', name: 'Mercy Njeri', phone: '+254744556677',
    email: 'mercy.njeri@gmail.com', location: 'Kasarani, Nairobi',
    status: 'Pending', submittedAt: '10 May 2026, 08:00 AM', pendingHours: 168,
    businessType: 'Document Runner', serviceArea: 'Kasarani / Roysambu', kraPin: 'A012345678B',
    hasNationalIdFront: true, hasNationalIdBack: true, hasSelfie: true, hasKraPin: true,
  },
  {
    id: 'MCT-AGT-00005', type: 'Agent', name: 'Dennis Mutua', phone: '+254755667788',
    email: 'dennis.mutua@outlook.com', location: 'South C, Nairobi',
    status: 'Under Review', submittedAt: '15 May 2026, 02:00 PM', pendingHours: 42,
    businessType: 'Freelance Agent', serviceArea: "South C / Lang'ata", kraPin: 'B098765432A',
    hasNationalIdFront: true, hasNationalIdBack: true, hasSelfie: false, hasKraPin: true,
  },
  // Clients — auto-onboarded on first payment
  {
    id: 'MCT-CLT-00006', type: 'Client', name: 'Amina Hassan', phone: '+254766778899',
    email: 'amina.hassan@gmail.com', location: 'Eastleigh, Nairobi',
    status: 'Approved', submittedAt: '17 May 2026, 06:45 AM', pendingHours: 0,
    firstJobId: 'MCT-JOB-00011', firstJobDoc: 'Passport',
    hasNationalIdFront: false, hasNationalIdBack: false, hasSelfie: false,
  },
  {
    id: 'MCT-CLT-00007', type: 'Client', name: 'Brian Otieno', phone: '+254777889900',
    email: 'brian.otieno@gmail.com', location: 'Umoja, Nairobi',
    status: 'Approved', submittedAt: '16 May 2026, 11:20 AM', pendingHours: 0,
    firstJobId: 'MCT-JOB-00012', firstJobDoc: 'KRA PIN',
    hasNationalIdFront: false, hasNationalIdBack: false, hasSelfie: false,
  },
]

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const STATUS_STYLE: Record<AppStatus, string> = {
  'Pending':      'bg-yellow-50 text-yellow-700 border border-yellow-200',
  'Under Review': 'bg-blue-50 text-blue-600 border border-blue-200',
  'Approved':     'bg-green-50 text-green-700 border border-green-200',
  'Rejected':     'bg-red-50 text-red-600 border border-red-200',
}
const TYPE_STYLE: Record<ApplicantType, string> = {
  Rider:  'bg-[#8b1a2f]/8 text-[#8b1a2f] border border-[#8b1a2f]/20',
  Agent:  'bg-blue-50 text-blue-600 border border-blue-200',
  Client: 'bg-green-50 text-green-700 border border-green-200',
}

function DocCheck({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium ${
      ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'
    }`}>
      <span>{ok ? '✓' : '✗'}</span>
      <span>{label}</span>
    </div>
  )
}

// ─────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────
function DetailModal({ applicant, onClose, onApprove, onReject }: {
  applicant: Applicant
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const router = useRouter()
  const isClient = applicant.type === 'Client'
  const isRider  = applicant.type === 'Rider'
  const isAgent  = applicant.type === 'Agent'

  const allDocsOk = isRider
    ? applicant.hasNationalIdFront && applicant.hasNationalIdBack && applicant.hasSelfie && applicant.hasPlatePhoto
    : isAgent
    ? applicant.hasNationalIdFront && applicant.hasNationalIdBack && applicant.hasSelfie && applicant.hasKraPin
    : true

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[560px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-[#8b1a2f] px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[16px]">
                {applicant.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <p className="text-white font-bold text-[16px]">{applicant.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[applicant.type]}`}>{applicant.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[applicant.status]}`}>{applicant.status}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors">✕</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Personal info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['ID',         applicant.id],
              ['Phone',      applicant.phone],
              ['Email',      applicant.email],
              ['Location',   applicant.location],
              ['Submitted',  applicant.submittedAt],
              ['Pending',    applicant.pendingHours === 0 ? 'Auto-approved' : `${applicant.pendingHours}h`],
              ...(isRider ? [['Number Plate', applicant.plate ?? '—']] : []),
              ...(isAgent ? [
                ['Business Type', applicant.businessType ?? '—'],
                ['Service Area',  applicant.serviceArea ?? '—'],
                ['KRA PIN',       applicant.kraPin ?? '—'],
              ] : []),
              ...(isClient ? [
                ['First Job',     applicant.firstJobId ?? '—'],
                ['Document',      applicant.firstJobDoc ?? '—'],
              ] : []),
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-[12px] font-semibold text-[#1a1c14] mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          {/* Documents required */}
          {!isClient && (
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Documents Submitted</p>
              <div className="grid grid-cols-2 gap-2">
                <DocCheck label="National ID — Front" ok={applicant.hasNationalIdFront} />
                <DocCheck label="National ID — Back"  ok={applicant.hasNationalIdBack} />
                <DocCheck label="Selfie / Face Photo" ok={applicant.hasSelfie} />
                {isRider && <DocCheck label="Number Plate Photo" ok={!!applicant.hasPlatePhoto} />}
                {isAgent && <DocCheck label="KRA PIN Certificate" ok={!!applicant.hasKraPin} />}
              </div>
              {!allDocsOk && (
                <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[11px] text-red-600">
                  <span>⚠</span>
                  <span>Some required documents are missing. Request them before approving.</span>
                </div>
              )}
            </div>
          )}

          {/* Client auto-onboard notice */}
          {isClient && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-[24px]">✅</span>
              <div>
                <p className="text-[13px] font-bold text-green-700">Successfully Onboarded</p>
                <p className="text-[12px] text-green-600 mt-1">
                  This client was automatically onboarded when they paid for their first delivery ({applicant.firstJobDoc} — {applicant.firstJobId}).
                  No manual verification required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              onClose()
              router.push(
                applicant.type === 'Rider' ? `/riders/${applicant.id}` :
                applicant.type === 'Agent' ? `/agents/${applicant.id}` :
                `/clients/${applicant.id}`
              )
            }}
            className="text-[12px] text-[#8b1a2f] hover:underline font-medium"
          >
            View Full Profile →
          </button>
          {!isClient && (
            <div className="flex gap-2">
              <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
              <button
                onClick={onReject}
                disabled={applicant.status === 'Approved'}
                className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-40"
              >
                ✗ Reject
              </button>
              <button
                onClick={onApprove}
                disabled={!allDocsOk || applicant.status === 'Approved'}
                className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title={!allDocsOk ? 'Complete all documents first' : ''}
              >
                ✓ Approve
              </button>
            </div>
          )}
          {isClient && (
            <button onClick={onClose} className="px-4 py-1.5 rounded-lg text-[12px] font-medium border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function VerificationQueuePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Applicant | null>(null)
  const [applicants, setApplicants] = useState(APPLICANTS)
  const [typeFilter, setTypeFilter] = useState<ApplicantType | 'all'>('all')

  const pending   = applicants.filter(a => a.status === 'Pending' || a.status === 'Under Review')
  const riders    = applicants.filter(a => a.type === 'Rider' && (a.status === 'Pending' || a.status === 'Under Review'))
  const agents    = applicants.filter(a => a.type === 'Agent' && (a.status === 'Pending' || a.status === 'Under Review'))
  const clients   = applicants.filter(a => a.type === 'Client')

  const filtered = typeFilter === 'all' ? applicants : applicants.filter(a => a.type === typeFilter)

  function handleApprove() {
    if (!selected) return
    setApplicants(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'Approved' as AppStatus } : a))
    alert(`✅ ${selected.name} (${selected.id}) has been approved. They will be notified via SMS.`)
    setSelected(null)
  }

  function handleReject() {
    if (!selected) return
    setApplicants(prev => prev.map(a => a.id === selected.id ? { ...a, status: 'Rejected' as AppStatus } : a))
    alert(`❌ ${selected.name} (${selected.id}) has been rejected. They will be notified via SMS.`)
    setSelected(null)
  }

  return (
    <div className="flex h-screen bg-[#f5f3ee] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Rider Verification" />
        <main className="flex-1 overflow-y-auto">

          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-[#1a1c14]">Verification Queue</h1>
              <p className="text-[12px] text-gray-400 mt-0.5">{pending.length} pending · {clients.length} auto-onboarded today</p>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Pending Riders', value: riders.length, sub: 'Need ID, selfie & plate', accent: '#8b1a2f', icon: '🏍' },
                { label: 'Pending Agents', value: agents.length, sub: 'Need ID, selfie & KRA PIN', accent: '#5599e0', icon: '👤' },
                { label: 'Auto-onboarded', value: clients.length, sub: 'Clients via first payment', accent: '#4caf82', icon: '✅' },
                { label: 'Total Queue',    value: applicants.length, sub: 'All submissions',       accent: '#e09345', icon: '📋' },
              ].map(s => (
                <div key={s.label} className="relative bg-white border border-gray-100 rounded-xl p-4 overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: s.accent }} />
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <span className="text-[18px]">{s.icon}</span>
                  </div>
                  <p className="text-[24px] font-bold text-[#1a1c14]">{s.value}</p>
                  <p className="text-[10.5px] text-gray-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Requirements info boxes */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  title: '🏍 Rider Requirements',
                  color: '#8b1a2f',
                  items: ['National ID — Front', 'National ID — Back', 'Selfie / Face Photo', 'Number Plate Photo'],
                },
                {
                  title: '👤 Agent Requirements',
                  color: '#5599e0',
                  items: ['National ID — Front', 'National ID — Back', 'Selfie / Face Photo', 'KRA PIN Certificate'],
                },
                {
                  title: '✅ Client Onboarding',
                  color: '#4caf82',
                  items: ['Pays for first delivery', 'Profile auto-created', 'No manual review needed', 'National ID collected optionally'],
                },
              ].map(box => (
                <div key={box.title} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <p className="text-[13px] font-bold text-[#1a1c14] mb-3">{box.title}</p>
                  <div className="space-y-1.5">
                    {box.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-[11px] text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: box.color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit">
              {(['all', 'Rider', 'Agent', 'Client'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`px-4 py-1.5 rounded text-[12px] font-medium transition-all capitalize ${
                    typeFilter === f ? 'bg-[#8b1a2f] text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f === 'all' ? 'All' : `${f}s`}
                </button>
              ))}
            </div>

            {/* Queue list */}
            <div className="space-y-3">
              {filtered.map(a => {
                const docsTotal = a.type === 'Rider' ? 4 : a.type === 'Agent' ? 4 : 0
                const docsOk = a.type === 'Rider'
                  ? [a.hasNationalIdFront, a.hasNationalIdBack, a.hasSelfie, a.hasPlatePhoto].filter(Boolean).length
                  : a.type === 'Agent'
                  ? [a.hasNationalIdFront, a.hasNationalIdBack, a.hasSelfie, a.hasKraPin].filter(Boolean).length
                  : 0

                return (
                  <div
                    key={a.id}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-[#8b1a2f]/30 transition-all cursor-pointer"
                    onClick={() => setSelected(a)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[13px] flex-shrink-0"
                          style={{ background: a.type === 'Rider' ? '#8b1a2f' : a.type === 'Agent' ? '#5599e0' : '#4caf82' }}>
                          {a.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-bold text-[#1a1c14]">{a.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_STYLE[a.type]}`}>{a.type}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                            <span className="font-mono text-[#8b1a2f] font-semibold">{a.id}</span>
                            <span>📞 {a.phone}</span>
                            <span>📍 {a.location}</span>
                            <span>🕐 Submitted {a.submittedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Pending time */}
                        {a.pendingHours > 0 && (
                          <div className={`text-center px-3 py-1.5 rounded-lg border ${
                            a.pendingHours > 24 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <p className={`text-[14px] font-bold ${a.pendingHours > 24 ? 'text-red-500' : 'text-yellow-600'}`}>
                              {a.pendingHours}h
                            </p>
                            <p className={`text-[9px] ${a.pendingHours > 24 ? 'text-red-400' : 'text-yellow-500'}`}>pending</p>
                          </div>
                        )}
                        {a.pendingHours === 0 && (
                          <div className="text-center px-3 py-1.5 rounded-lg border bg-green-50 border-green-200">
                            <p className="text-[11px] font-bold text-green-600">Auto</p>
                            <p className="text-[9px] text-green-400">onboarded</p>
                          </div>
                        )}

                        {/* Doc progress — only for riders and agents */}
                        {a.type !== 'Client' && (
                          <div className="text-center">
                            <p className="text-[14px] font-bold text-[#1a1c14]">{docsOk}/{docsTotal}</p>
                            <p className="text-[9px] text-gray-400">docs</p>
                            <div className="flex gap-0.5 mt-1">
                              {Array.from({ length: docsTotal }).map((_, i) => (
                                <div key={i} className={`w-4 h-1 rounded-full ${i < docsOk ? 'bg-green-400' : 'bg-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Client — first job info */}
                        {a.type === 'Client' && (
                          <div className="text-right">
                            <p className="text-[11px] text-gray-400">First job</p>
                            <p className="text-[11px] font-mono font-semibold text-[#8b1a2f]">{a.firstJobId}</p>
                            <p className="text-[10px] text-gray-400">{a.firstJobDoc}</p>
                          </div>
                        )}

                        <span className="text-gray-300 text-[16px]">→</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </main>
      </div>

      {/* Modal */}
      {selected && (
        <DetailModal
          applicant={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  )
}
