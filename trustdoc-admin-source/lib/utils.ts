import { format, formatDistanceToNow } from 'date-fns'
import type { JobStatus, TicketStatus, TicketPriority, PaymentStatus, VerificationStatus } from '../types'

// ─── Date helpers ─────────────────────────────────────────
export const fmtDate     = (d: string) => format(new Date(d), 'dd MMM yyyy')
export const fmtDateTime = (d: string) => format(new Date(d), 'dd MMM yyyy, HH:mm')
export const fmtTimeAgo  = (d: string) => formatDistanceToNow(new Date(d), { addSuffix: true })

// ─── Currency ─────────────────────────────────────────────
export const fmtKsh = (n: number) => `KSh ${n.toLocaleString()}`

// ─── Job status label + colour ────────────────────────────
export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  pending_payment: 'Awaiting Payment',
  paid:            'Paid — Escrow',
  assigned:        'Assigned',
  in_progress:     'In Progress',
  packaged:        'Packaged',
  in_transit:      'In Transit',
  delivered:       'Delivered',
  completed:       'Completed',
  cancelled:       'Cancelled',
  disputed:        'Disputed',
}

export const JOB_STATUS_CLASS: Record<JobStatus, string> = {
  pending_payment: 'pill-pending',
  paid:            'pill-held',
  assigned:        'pill-active',
  in_progress:     'pill-active',
  packaged:        'pill-active',
  in_transit:      'pill-active',
  delivered:       'pill-approved',
  completed:       'pill-approved',
  cancelled:       'bg-gray-100 text-gray-500 border-gray-200',
  disputed:        'bg-red-50 text-red-700 border-red-300',
}

// ─── Ticket helpers ───────────────────────────────────────
export const TICKET_STATUS_CLASS: Record<TicketStatus, string> = {
  open:      'pill-open',
  in_review: 'pill-held',
  resolved:  'pill-resolved',
  closed:    'bg-gray-100 text-gray-500 border-gray-200',
}

export const TICKET_PRIORITY_CLASS: Record<TicketPriority, string> = {
  low:    'bg-gray-100 text-gray-500 border-gray-200',
  medium: 'pill-held',
  high:   'bg-orange-50 text-orange-700 border-orange-300',
  urgent: 'bg-red-50 text-red-700 border-red-300',
}

// ─── Payment helpers ──────────────────────────────────────
export const PAYMENT_STATUS_CLASS: Record<PaymentStatus, string> = {
  held:     'pill-held',
  released: 'pill-approved',
  refunded: 'pill-pending',
  failed:   'bg-red-50 text-red-700 border-red-300',
}

// ─── Verification helpers ─────────────────────────────────
export const VERIFY_STATUS_CLASS: Record<VerificationStatus, string> = {
  pending:  'pill-pending',
  approved: 'pill-approved',
  rejected: 'bg-red-50 text-red-700 border-red-300',
}

// ─── Activity dot colour ──────────────────────────────────
export const ACTIVITY_DOT: Record<string, string> = {
  job_completed:     'bg-green-600',
  payment_received:  'bg-gold',
  escrow_released:   'bg-gold',
  rider_approved:    'bg-maroon',
  rider_applied:     'bg-maroon',
  ticket_opened:     'bg-red-500',
  qr_scanned:        'bg-blue-600',
  otp_confirmed:     'bg-green-600',
  client_registered: 'bg-blue-400',
  rider_blacklisted: 'bg-red-700',
}

// ─── Calculate cut amounts ────────────────────────────────
export function calcCuts(total: number) {
  const platformCut = Math.round(total * 0.15)
  const riderCut    = total - platformCut
  return { riderCut, platformCut }
}

// ─── Mask phone number for display ───────────────────────
export const maskPhone = (p: string) => p.replace(/(\+\d{4})\d+(\d{3})/, '$1•••••$2')
