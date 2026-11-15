export const C = {
  maroon:       '#6B0F1A',
  maroonDark:   '#4A0A12',
  maroonLight:  '#8B1A28',
  maroonPale:   '#F9ECED',
  gold:         '#B8922A',
  goldLight:    '#D4A843',
  goldPale:     '#FBF4E3',
  white:        '#FFFFFF',
  surface:      '#F7F4F2',
  border:       '#DDD0D2',
  text:         '#1A0A0C',
  textMuted:    '#6B5558',
  textHint:     '#9E8184',
  successBg:    '#D4EDDA',
  successText:  '#155724',
  successBd:    '#85C89A',
  warnBg:       '#FEF3CD',
  warnText:     '#856404',
  warnBd:       '#F0C040',
  dangerBg:     '#F8D7DA',
  dangerText:   '#721C24',
  dangerBd:     '#EBA3A8',
} as const

// Platform cut percentage (what admin keeps from each job)
export const PLATFORM_CUT_PERCENT = 15   // 15% of job total

// Rider cut percentage
export const RIDER_CUT_PERCENT    = 85   // 85% of job total

// Job pricing
export const JOB_PRICES = {
  check:    350,   // KSh 350 for a document check
  delivery: 1000,  // KSh 1,000 for full delivery
} as const

// Support contacts (shown on client/rider apps)
export const SUPPORT = {
  whatsapp: '+254700000000',
  email:    'support@TrustDoc.co.ke',
  phone:    '+254700000000',
} as const
