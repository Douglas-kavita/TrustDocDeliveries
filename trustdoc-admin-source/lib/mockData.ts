import type {
  Rider, Client, Job, Ticket, Payment,
  AuditLog, DashboardStats, ActivityItem,
} from '../types'

// ══════════════════════════════════════════════════════════
//  RIDERS  (numberPlate added)
// ══════════════════════════════════════════════════════════
export const RIDERS: Rider[] = [
  {
    id: 'MCT-RDR-00001', fullName: 'Samuel Kamau',
    phone: '+254712345678', email: 'samuel.kamau@email.com',
    nationalId: '12345678', numberPlate: 'KDG 123A',
    location: 'Westlands, Nairobi', mpesaPhone: '+254712345678',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: '/mock/id-back.jpg', selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-04-10T08:00:00Z', reviewedAt: '2026-04-11T10:00:00Z', reviewedBy: 'admin-001' },
    verificationStatus: 'approved', accountStatus: 'active',
    rating: 4.8, totalJobs: 147, totalEarnings: 42300,
    joinedAt: '2026-04-10T08:00:00Z', lastActiveAt: '2026-05-13T09:22:00Z',
  },
  {
    id: 'MCT-RDR-00002', fullName: 'Peter Njoroge',
    phone: '+254723456789', nationalId: '23456789', numberPlate: 'KBZ 456B',
    location: 'Kilimani, Nairobi', mpesaPhone: '+254723456789',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: '/mock/id-back.jpg', selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-04-12T09:00:00Z', reviewedAt: '2026-04-13T11:00:00Z', reviewedBy: 'admin-001' },
    verificationStatus: 'approved', accountStatus: 'active',
    rating: 4.7, totalJobs: 98, totalEarnings: 28400,
    joinedAt: '2026-04-12T09:00:00Z', lastActiveAt: '2026-05-13T08:55:00Z',
  },
  {
    id: 'MCT-RDR-00003', fullName: 'Mary Wangari',
    phone: '+254734567890', nationalId: '34567890', numberPlate: 'KCJ 789C',
    location: 'South B, Nairobi', mpesaPhone: '+254734567890',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: '/mock/id-back.jpg', selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-05-13T07:00:00Z' },
    verificationStatus: 'pending', accountStatus: 'active',
    rating: 0, totalJobs: 0, totalEarnings: 0, joinedAt: '2026-05-13T07:00:00Z',
  },
  {
    id: 'MCT-RDR-00004', fullName: 'David Omondi',
    phone: '+254745678901', nationalId: '45678901', numberPlate: 'KDA 321D',
    location: 'Eastleigh, Nairobi', mpesaPhone: '+254745678901',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: '/mock/id-back.jpg', selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-05-13T08:30:00Z' },
    verificationStatus: 'pending', accountStatus: 'active',
    rating: 0, totalJobs: 0, totalEarnings: 0, joinedAt: '2026-05-13T08:30:00Z',
  },
  {
    id: 'MCT-RDR-00005', fullName: 'Brian Mwenda',
    phone: '+254756789012', nationalId: '56789012', numberPlate: 'KDB 654E',
    location: 'Ruaraka, Nairobi', mpesaPhone: '+254756789012',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: null, selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-05-12T14:00:00Z', notes: 'Missing ID back and selfie' },
    verificationStatus: 'pending', accountStatus: 'active',
    rating: 0, totalJobs: 0, totalEarnings: 0, joinedAt: '2026-05-12T14:00:00Z',
  },
  {
    id: 'MCT-RDR-00006', fullName: 'Joyce Akinyi',
    phone: '+254767890123', nationalId: '67890123', numberPlate: 'KDC 987F',
    location: 'Langata, Nairobi', mpesaPhone: '+254767890123',
    documents: { idFrontUrl: '/mock/id-front.jpg', idBackUrl: '/mock/id-back.jpg', selfieUrl: null,
      numberPlateUrl: '/mock/plate.jpg',
      exchangePlate: false, submittedAt: '2026-04-20T10:00:00Z', reviewedAt: '2026-04-21T09:00:00Z', reviewedBy: 'admin-001', notes: 'ID photo blurry. Resubmission requested.' },
    verificationStatus: 'rejected', accountStatus: 'active',
    rating: 0, totalJobs: 0, totalEarnings: 0, joinedAt: '2026-04-20T10:00:00Z',
  },
]

// ══════════════════════════════════════════════════════════
//  CLIENTS
// ══════════════════════════════════════════════════════════
export const CLIENTS: Client[] = [
  { id: 'MCT-CLT-00001', fullName: 'Aisha Wanjiku',  phone: '+254700111222', email: 'aisha.w@email.com',   nationalId: '11223344', location: 'Lavington, Nairobi', totalOrders: 7, totalSpent: 5950, accountStatus: 'active', joinedAt: '2026-03-15T10:00:00Z', lastActiveAt: '2026-05-13T08:05:00Z' },
  { id: 'MCT-CLT-00002', fullName: 'James Omondi',   phone: '+254700222333', nationalId: '22334455',       location: 'Umoja, Nairobi',     totalOrders: 3, totalSpent: 2550, accountStatus: 'active', joinedAt: '2026-03-22T11:00:00Z', lastActiveAt: '2026-05-13T07:32:00Z' },
  { id: 'MCT-CLT-00003', fullName: 'Grace Achieng',  phone: '+254700333444', location: 'South B, Nairobi',    totalOrders: 5, totalSpent: 4250, accountStatus: 'active', joinedAt: '2026-04-01T09:00:00Z', lastActiveAt: '2026-05-13T09:01:00Z' },
  { id: 'MCT-CLT-00004', fullName: 'Peter Njoroge',  phone: '+254700444555', location: 'Upperhill, Nairobi',  totalOrders: 2, totalSpent: 1700, accountStatus: 'active', joinedAt: '2026-04-10T12:00:00Z', lastActiveAt: '2026-05-13T10:15:00Z' },
  { id: 'MCT-CLT-00005', fullName: 'Fatuma Khalid',  phone: '+254700555666', email: 'fatuma.k@email.com',  location: 'Parklands, Nairobi',  totalOrders: 9, totalSpent: 7650, accountStatus: 'active', joinedAt: '2026-02-28T08:00:00Z', lastActiveAt: '2026-05-13T11:01:00Z' },
]

// ══════════════════════════════════════════════════════════
//  JOBS
// ══════════════════════════════════════════════════════════
export const JOBS: Job[] = [
  { id: 'MCT-JOB-00001', type: 'delivery', clientId: 'MCT-CLT-00001', clientName: 'Aisha Wanjiku', clientPhone: '+254700111222', riderId: 'MCT-RDR-00001', riderName: 'Samuel Kamau', riderPhone: '+254712345678', docType: 'Passport', office: 'eCitizen Office — CBD', officeLocation: { lat: -1.2864, lng: 36.8222, address: 'Nairobi CBD' }, clientLocation: { lat: -1.3012, lng: 36.7853, address: 'Lavington, Nairobi' }, status: 'completed', checkResult: null, totalAmount: 1000, riderCut: 850, platformCut: 150, paymentRef: 'QHJ3K8X2L1', paymentMethod: 'mpesa', escrowReleased: true, qrScanned: true, createdAt: '2026-05-13T08:00:00Z', acceptedAt: '2026-05-13T08:10:00Z', packagedAt: '2026-05-13T09:22:00Z', deliveredAt: '2026-05-13T11:44:00Z', completedAt: '2026-05-13T11:45:00Z', riderRating: 5 },
  { id: 'MCT-JOB-00002', type: 'check',    clientId: 'MCT-CLT-00002', clientName: 'James Omondi',  clientPhone: '+254700222333', riderId: 'MCT-RDR-00002', riderName: 'Peter Njoroge',  riderPhone: '+254723456789', docType: 'Birth Certificate', office: 'Huduma Centre — Westlands', officeLocation: { lat: -1.2697, lng: 36.8086, address: 'Westlands, Nairobi' }, clientLocation: { lat: -1.2921, lng: 36.8219, address: 'Umoja, Nairobi' }, status: 'completed', checkResult: 'available', totalAmount: 350, riderCut: 250, platformCut: 100, paymentRef: 'RKL9M3N7P4', paymentMethod: 'mpesa', escrowReleased: true, qrScanned: false, createdAt: '2026-05-13T07:30:00Z', acceptedAt: '2026-05-13T07:40:00Z', completedAt: '2026-05-13T10:22:00Z', riderRating: 4 },
  { id: 'MCT-JOB-00003', type: 'delivery', clientId: 'MCT-CLT-00003', clientName: 'Grace Achieng', clientPhone: '+254700333444', riderId: 'MCT-RDR-00001', riderName: 'Samuel Kamau',   riderPhone: '+254712345678', docType: 'National ID', office: 'Registrar of Persons — GPO', officeLocation: { lat: -1.2864, lng: 36.8222, address: 'GPO, Nairobi CBD' }, clientLocation: { lat: -1.3150, lng: 36.8200, address: 'South B, Nairobi' }, status: 'in_transit', checkResult: null, totalAmount: 1000, riderCut: 850, platformCut: 150, paymentRef: 'SMP2Q6W8T5', paymentMethod: 'mpesa', escrowReleased: false, qrScanned: true, createdAt: '2026-05-13T09:00:00Z', acceptedAt: '2026-05-13T09:10:00Z', packagedAt: '2026-05-13T10:40:00Z' },
  { id: 'MCT-JOB-00004', type: 'check',    clientId: 'MCT-CLT-00004', clientName: 'Peter Njoroge', clientPhone: '+254700444555', docType: 'KRA PIN Certificate', office: 'KRA — Times Tower', officeLocation: { lat: -1.2888, lng: 36.8232, address: 'Times Tower, CBD' }, clientLocation: { lat: -1.2995, lng: 36.8108, address: 'Upperhill, Nairobi' }, status: 'paid', checkResult: null, totalAmount: 350, riderCut: 250, platformCut: 100, paymentRef: 'TXV4R1U9Z6', paymentMethod: 'mpesa', escrowReleased: false, qrScanned: false, createdAt: '2026-05-13T10:15:00Z' },
  { id: 'MCT-JOB-00005', type: 'delivery', clientId: 'MCT-CLT-00005', clientName: 'Fatuma Khalid', clientPhone: '+254700555666', docType: 'Logbook', office: 'NTSA — Upper Hill', officeLocation: { lat: -1.2981, lng: 36.8098, address: 'NTSA, Upperhill' }, clientLocation: { lat: -1.2644, lng: 36.8022, address: 'Parklands, Nairobi' }, status: 'pending_payment', checkResult: null, totalAmount: 1000, riderCut: 850, platformCut: 150, paymentMethod: 'mpesa', escrowReleased: false, qrScanned: false, createdAt: '2026-05-13T11:00:00Z' },
]

// ══════════════════════════════════════════════════════════
//  TICKETS
// ══════════════════════════════════════════════════════════
export const TICKETS: Ticket[] = [
  { id: 'MCT-TKT-00001', jobId: 'MCT-JOB-00003', clientId: 'MCT-CLT-00003', raisedBy: 'client', source: 'whatsapp', subject: 'Rider not responding to calls', status: 'open', priority: 'high', messages: [ { id: 'm1', from: 'client', fromName: 'Grace Achieng', text: 'Hi, my rider Samuel is not picking up his phone. My document is supposed to be delivered today.', timestamp: '2026-05-13T11:30:00Z' }, { id: 'm2', from: 'admin', fromName: 'Admin', text: 'Hello Grace, we are sorry to hear this. We have reached out to the rider and will update you within 15 minutes.', timestamp: '2026-05-13T11:35:00Z' } ], createdAt: '2026-05-13T11:30:00Z', updatedAt: '2026-05-13T11:35:00Z' },
  { id: 'MCT-TKT-00002', jobId: 'MCT-JOB-00001', riderId: 'MCT-RDR-00001', raisedBy: 'rider', source: 'in_app', subject: 'Client refused to give OTP', status: 'resolved', priority: 'medium', messages: [ { id: 'm1', from: 'rider', fromName: 'Samuel Kamau', text: "I arrived at the client's location but they are refusing to give me the OTP.", timestamp: '2026-05-12T15:00:00Z' }, { id: 'm2', from: 'admin', fromName: 'Admin', text: 'We have called the client and explained the process. They will give you the OTP now.', timestamp: '2026-05-12T15:10:00Z' } ], resolution: 'Client was called and explained the OTP process. Delivery completed successfully.', resolvedAt: '2026-05-12T16:00:00Z', createdAt: '2026-05-12T15:00:00Z', updatedAt: '2026-05-12T16:00:00Z' },
]

// ══════════════════════════════════════════════════════════
//  PAYMENTS
// ══════════════════════════════════════════════════════════
export const PAYMENTS: Payment[] = [
  { id: 'MCT-PAY-00001', jobId: 'MCT-JOB-00001', clientId: 'MCT-CLT-00001', riderId: 'MCT-RDR-00001', totalAmount: 1000, riderCut: 850, platformCut: 150, status: 'released', mpesaRef: 'QHJ3K8X2L1', payoutRef: 'PYT9X2K1Q3', heldAt: '2026-05-13T08:05:00Z', releasedAt: '2026-05-13T11:46:00Z', method: 'mpesa' },
  { id: 'MCT-PAY-00002', jobId: 'MCT-JOB-00002', clientId: 'MCT-CLT-00002', riderId: 'MCT-RDR-00002', totalAmount: 350,  riderCut: 250, platformCut: 100, status: 'released', mpesaRef: 'RKL9M3N7P4', payoutRef: 'PYT3N4K9L2', heldAt: '2026-05-13T07:32:00Z', releasedAt: '2026-05-13T10:23:00Z', method: 'mpesa' },
  { id: 'MCT-PAY-00003', jobId: 'MCT-JOB-00003', clientId: 'MCT-CLT-00003', riderId: 'MCT-RDR-00001', totalAmount: 1000, riderCut: 850, platformCut: 150, status: 'held', mpesaRef: 'SMP2Q6W8T5', heldAt: '2026-05-13T09:02:00Z', method: 'mpesa' },
  { id: 'MCT-PAY-00004', jobId: 'MCT-JOB-00004', clientId: 'MCT-CLT-00004', totalAmount: 350, riderCut: 250, platformCut: 100, status: 'held', mpesaRef: 'TXV4R1U9Z6', heldAt: '2026-05-13T10:16:00Z', method: 'mpesa' },
]

// ══════════════════════════════════════════════════════════
//  AUDIT LOGS
// ══════════════════════════════════════════════════════════
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'AL001', action: 'JOB_COMPLETED',   actorId: 'system',        actorRole: 'system', targetType: 'job',     targetId: 'MCT-JOB-00001', details: 'OTP confirmed. Escrow KSh 850 released to Samuel Kamau. Platform cut KSh 150 logged.', timestamp: '2026-05-13T11:46:00Z' },
  { id: 'AL002', action: 'QR_SCANNED',      actorId: 'MCT-RDR-00001', actorRole: 'rider',  targetType: 'job',     targetId: 'MCT-JOB-00003', details: 'Package QR scanned by Samuel Kamau (KDG 123A). Chain of custody updated.', timestamp: '2026-05-13T10:40:00Z' },
  { id: 'AL003', action: 'PAYMENT_HELD',    actorId: 'system',        actorRole: 'system', targetType: 'payment', targetId: 'MCT-PAY-00003', details: 'Escrow held KSh 1,000 for Job MCT-JOB-00003. M-Pesa ref: SMP2Q6W8T5.', timestamp: '2026-05-13T09:02:00Z' },
  { id: 'AL004', action: 'TICKET_OPENED',   actorId: 'MCT-CLT-00003', actorRole: 'client', targetType: 'ticket',  targetId: 'MCT-TKT-00001', details: 'Client Grace Achieng opened support ticket via WhatsApp.', timestamp: '2026-05-13T11:30:00Z' },
  { id: 'AL005', action: 'RIDER_APPROVED',  actorId: 'admin-001',     actorRole: 'admin',  targetType: 'rider',   targetId: 'MCT-RDR-00001', details: 'Rider Samuel Kamau (KDG 123A) approved after ID and selfie verification.', timestamp: '2026-04-11T10:00:00Z' },
  { id: 'AL006', action: 'ESCROW_RELEASED', actorId: 'system',        actorRole: 'system', targetType: 'payment', targetId: 'MCT-PAY-00001', details: 'KSh 850 sent to Samuel Kamau (+254712345678) via M-Pesa. Ref: PYT9X2K1Q3.', timestamp: '2026-05-13T11:46:00Z' },
  { id: 'AL007', action: 'ADMIN_LOGIN',     actorId: 'admin-001',     actorRole: 'admin',  details: 'Admin logged in. IP: 41.90.64.12. 2FA verified.', timestamp: '2026-05-13T08:00:00Z', ip: '41.90.64.12' },
  { id: 'AL008', action: 'PAYMENT_HELD',    actorId: 'system',        actorRole: 'system', targetType: 'payment', targetId: 'MCT-PAY-00004', details: 'Escrow held KSh 350 for Job MCT-JOB-00004. M-Pesa ref: TXV4R1U9Z6.', timestamp: '2026-05-13T10:16:00Z' },
]

// ══════════════════════════════════════════════════════════
//  ACTIVITY FEED
// ══════════════════════════════════════════════════════════
export const ACTIVITY: ActivityItem[] = [
  { id: 'A1', type: 'otp_confirmed',    text: 'Delivery confirmed — Job MCT-JOB-00001',      subText: 'Samuel Kamau → Aisha Wanjiku',    timestamp: '2026-05-13T11:46:00Z', linkType: 'job',    linkId: 'MCT-JOB-00001' },
  { id: 'A2', type: 'escrow_released',  text: 'Escrow KSh 850 released to Samuel Kamau',     subText: 'M-Pesa ref: PYT9X2K1Q3',          timestamp: '2026-05-13T11:46:00Z', linkType: 'rider',  linkId: 'MCT-RDR-00001' },
  { id: 'A3', type: 'ticket_opened',    text: 'Support ticket opened — Grace Achieng',       subText: 'Rider not responding to calls',    timestamp: '2026-05-13T11:30:00Z', linkType: 'ticket', linkId: 'MCT-TKT-00001' },
  { id: 'A4', type: 'qr_scanned',       text: 'QR scanned — Job MCT-JOB-00003 packaged',     subText: 'Samuel Kamau · KDG 123A',          timestamp: '2026-05-13T10:40:00Z', linkType: 'job',    linkId: 'MCT-JOB-00003' },
  { id: 'A5', type: 'payment_received', text: 'M-Pesa KSh 350 received — Job MCT-JOB-00004', subText: 'Peter Njoroge — KRA PIN',          timestamp: '2026-05-13T10:16:00Z', linkType: 'job',    linkId: 'MCT-JOB-00004' },
  { id: 'A6', type: 'rider_applied',    text: 'New rider application — David Omondi',        subText: 'MCT-RDR-00004 · Plate: KDA 321D', timestamp: '2026-05-13T08:30:00Z', linkType: 'rider',  linkId: 'MCT-RDR-00004' },
  { id: 'A7', type: 'client_registered',text: 'New client registered — Fatuma Khalid',       subText: 'Parklands, Nairobi',              timestamp: '2026-05-13T07:55:00Z', linkType: 'client', linkId: 'MCT-CLT-00005' },
]

// ══════════════════════════════════════════════════════════
//  DASHBOARD STATS
// ══════════════════════════════════════════════════════════
export const DASHBOARD_STATS: DashboardStats = {
  activeJobs: 12, ridersOnline: 23, todayRevenue: 38450, todayPlatformCut: 5768,
  pendingVerification: 3, openTickets: 2, escrowHeld: 14200,
  weekRevenue:     [18000, 22000, 15000, 29000, 38450, 21000, 9000],
  weekPlatformCut: [2700,  3300,  2250,  4350,  5768,  3150,  1350],
}

export const genRiderId   = (n: number) => `MCT-RDR-${String(n).padStart(5,'0')}`
export const genClientId  = (n: number) => `MCT-CLT-${String(n).padStart(5,'0')}`
export const genJobId     = (n: number) => `MCT-JOB-${String(n).padStart(5,'0')}`
export const genTicketId  = (n: number) => `MCT-TKT-${String(n).padStart(5,'0')}`
export const genPaymentId = (n: number) => `MCT-PAY-${String(n).padStart(5,'0')}`
