// TrustDoc — Job Pricing Tiers
// Standard: normal turnaround
// Premium:  priority rider, faster service

export type PricingTier = 'standard' | 'premium'

export const PRICING = {
  standard: {
    label:       'Standard',
    description: 'Normal turnaround · 2–4 hrs',
    check:       350,    // KSh
    delivery:    1000,   // KSh
    riderCut:    0.85,   // 85% to rider
    platformCut: 0.15,   // 15% to platform
    color:       'gold',
    badge:       'pill-check',
  },
  premium: {
    label:       'Premium',
    description: 'Priority rider · 1–2 hrs',
    check:       500,    // KSh
    delivery:    1500,   // KSh
    riderCut:    0.85,
    platformCut: 0.15,
    color:       'maroon',
    badge:       'pill-delivery',
  },
} as const

// Government offices with available services
export const OFFICES = [
  { id: 'huduma-westlands',   name: 'Huduma Centre — Westlands',       area: 'Westlands' },
  { id: 'huduma-cbd',         name: 'Huduma Centre — CBD',             area: 'CBD' },
  { id: 'huduma-embakasi',    name: 'Huduma Centre — Embakasi',        area: 'Embakasi' },
  { id: 'ecitizen-cbd',       name: 'eCitizen Office — CBD',           area: 'CBD' },
  { id: 'registrar-gpo',      name: 'Registrar of Persons — GPO',      area: 'CBD' },
  { id: 'kra-times-tower',    name: 'KRA — Times Tower',               area: 'Upperhill' },
  { id: 'ntsa-upperhill',     name: 'NTSA — Upper Hill',               area: 'Upperhill' },
  { id: 'immigration-nyayo',  name: 'Immigration — Nyayo House',       area: 'CBD' },
  { id: 'lands-ardhi',        name: 'Lands Office — Ardhi House',      area: 'CBD' },
] as const

// Document types per office
export const OFFICE_DOCUMENTS: Record<string, string[]> = {
  'huduma-westlands': [
    'Birth Certificate', 'National ID', 'Death Certificate',
    'Marriage Certificate', 'Good Conduct Certificate',
  ],
  'huduma-cbd': [
    'Birth Certificate', 'National ID', 'Death Certificate',
    'Marriage Certificate', 'Good Conduct Certificate', 'Driving Licence',
  ],
  'huduma-embakasi': [
    'Birth Certificate', 'National ID', 'Death Certificate', 'Marriage Certificate',
  ],
  'ecitizen-cbd': [
    'Passport', 'eCitizen Services', 'Good Conduct Certificate',
  ],
  'registrar-gpo': [
    'National ID', 'Birth Certificate', 'Death Certificate', 'Marriage Certificate',
  ],
  'kra-times-tower': [
    'KRA PIN Certificate', 'Tax Compliance Certificate', 'iTax Documents',
  ],
  'ntsa-upperhill': [
    'Driving Licence', 'Logbook', 'Vehicle Inspection', 'NTSA Certificate',
  ],
  'immigration-nyayo': [
    'Passport', 'Work Permit', 'Alien Card', 'Travel Document',
  ],
  'lands-ardhi': [
    'Title Deed', 'Land Search', 'Rates Clearance', 'Mutation Form',
  ],
}

// Mock availability status per office+document
// In production this comes from the API / rider check reports
export type AvailabilityStatus = 'available' | 'not_ready' | 'not_found' | 'unknown'

export const MOCK_AVAILABILITY: Record<string, AvailabilityStatus> = {
  'huduma-westlands|Birth Certificate':      'available',
  'huduma-westlands|National ID':            'not_ready',
  'huduma-westlands|Good Conduct Certificate':'available',
  'huduma-cbd|Passport':                     'available',
  'huduma-cbd|National ID':                  'available',
  'ecitizen-cbd|Passport':                   'available',
  'ecitizen-cbd|Good Conduct Certificate':   'not_ready',
  'registrar-gpo|National ID':               'not_found',
  'kra-times-tower|KRA PIN Certificate':     'available',
  'ntsa-upperhill|Driving Licence':          'available',
  'ntsa-upperhill|Logbook':                  'not_ready',
  'immigration-nyayo|Passport':              'available',
}
