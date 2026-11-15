// ══════════════════════════════════════════════════════════
//  TrustDoc — Shared Types  (Batch 8 update)
//  Added: Rider.numberPlate
// ══════════════════════════════════════════════════════════

export type VerificationStatus = 'pending' | 'approved' | 'rejected'
export type AccountStatus      = 'active'  | 'suspended' | 'blacklisted'

export interface RiderDocument {
  idFrontUrl: string | null
  idBackUrl: string | null
  selfieUrl: string | null
  numberPlateUrl?: string | null
  exchangePlate?: boolean
  submittedAt:  string
  reviewedAt?:  string
  reviewedBy?:  string
  notes?:       string
}

export interface Rider {
  id:                   string   // MCT-RDR-00001
  fullName:             string
  phone:                string
  email?:               string
  nationalId:           string
  numberPlate:          string   // ← NEW: vehicle registration e.g. KDG 123A
  location:             string
  mpesaPhone:           string
  documents:            RiderDocument
  verificationStatus:   VerificationStatus
  accountStatus:        AccountStatus
  rating:               number
  totalJobs:            number
  totalEarnings:        number
  joinedAt:             string
  lastActiveAt?:        string
  blacklistReason?:     string
  blacklistedAt?:       string
  blacklistedBy?:       string
}

export interface Client {
  id:            string   // MCT-CLT-00001
  fullName:      string
  phone:         string
  email?:        string
  nationalId?:   string
  location:      string
  totalOrders:   number
  totalSpent:    number
  accountStatus: AccountStatus
  joinedAt:      string
  lastActiveAt?: string
  blacklistReason?: string
}

export type JobType = 'check' | 'delivery'

export type JobStatus =
  | 'pending_payment'
  | 'paid'
  | 'assigned'
  | 'in_progress'
  | 'packaged'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type CheckResult = 'available' | 'not_ready' | 'not_found' | null

export interface GeoPoint {
  lat:     number
  lng:     number
  address: string
}

export interface Job {
  id:              string
  type:            JobType
  clientId:        string
  clientName:      string
  clientPhone:     string
  riderId?:        string
  riderName?:      string
  riderPhone?:     string
  docType:         string
  office:          string
  officeLocation:  GeoPoint
  clientLocation:  GeoPoint
  status:          JobStatus
  checkResult?:    CheckResult
  totalAmount:     number
  riderCut:        number
  platformCut:     number
  paymentRef?:     string
  paymentMethod:   'mpesa' | 'card' | 'unknown'
  escrowReleased:  boolean
  otpCode?:        string
  qrScanned:       boolean
  createdAt:       string
  acceptedAt?:     string
  packagedAt?:     string
  deliveredAt?:    string
  completedAt?:    string
  cancelledAt?:    string
  riderRating?:    number
  clientRating?:   number
  notes?:          string
}

export type TicketStatus   = 'open' | 'in_review' | 'resolved' | 'closed'
export type TicketPriority = 'low'  | 'medium'    | 'high'     | 'urgent'
export type TicketSource   = 'whatsapp' | 'email' | 'in_app' | 'admin'
export type TicketRaisedBy = 'client'   | 'rider'  | 'admin'

export interface TicketMessage {
  id:        string
  from:      'client' | 'rider' | 'admin'
  fromName:  string
  text:      string
  timestamp: string
}

export interface Ticket {
  id:          string
  jobId?:      string
  clientId?:   string
  riderId?:    string
  raisedBy:    TicketRaisedBy
  source:      TicketSource
  subject:     string
  status:      TicketStatus
  priority:    TicketPriority
  messages:    TicketMessage[]
  assignedTo?: string
  resolvedAt?: string
  resolution?: string
  createdAt:   string
  updatedAt:   string
}

export type PaymentStatus = 'held' | 'released' | 'refunded' | 'failed'

export interface Payment {
  id:           string
  jobId:        string
  clientId:     string
  riderId?:     string
  totalAmount:  number
  riderCut:     number
  platformCut:  number
  status:       PaymentStatus
  mpesaRef?:    string
  payoutRef?:   string
  heldAt:       string
  releasedAt?:  string
  method:       'mpesa' | 'card'
}

export interface AuditLog {
  id:          string
  action:      string
  actorId:     string
  actorRole:   'admin' | 'rider' | 'client' | 'system'
  targetType?: 'job' | 'rider' | 'client' | 'ticket' | 'payment'
  targetId?:   string
  details:     string
  timestamp:   string
  ip?:         string
}

export type AdminRole = 'superadmin' | 'admin' | 'support'

export interface AdminUser {
  id:            string
  name:          string
  email:         string
  role:          AdminRole
  createdAt:     string
  lastLoginAt?:  string
  is2FAEnabled:  boolean
}

export interface DashboardStats {
  activeJobs:            number
  ridersOnline:          number
  todayRevenue:          number
  todayPlatformCut:      number
  pendingVerification:   number
  openTickets:           number
  escrowHeld:            number
  weekRevenue:           number[]
  weekPlatformCut:       number[]
}

export type ActivityType =
  | 'job_completed'
  | 'payment_received'
  | 'escrow_released'
  | 'rider_approved'
  | 'rider_applied'
  | 'ticket_opened'
  | 'qr_scanned'
  | 'otp_confirmed'
  | 'client_registered'
  | 'rider_blacklisted'

export interface ActivityItem {
  id:        string
  type:      ActivityType
  text:      string
  subText?:  string
  timestamp: string
  linkType?: 'job' | 'rider' | 'client' | 'ticket'
  linkId?:   string
}
