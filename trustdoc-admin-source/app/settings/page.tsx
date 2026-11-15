'use client'
import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { PRICING } from '../../constants/pricing'
import { SUPPORT } from '../../constants/theme'
import {
  Shield, Bell, CreditCard, Users, Save,
  Eye, EyeOff, CheckCircle,
} from 'lucide-react'
import clsx from 'clsx'

type Section = 'general' | 'pricing' | 'notifications' | 'security' | 'support'

export default function SettingsPage() {
  const [section, setSection]   = useState<Section>('general')
  const [saved, setSaved]       = useState(false)
  const [showKey, setShowKey]   = useState(false)

  // Editable state
  const [platformCut, setPlatformCut]   = useState(15)
  const [stdCheck, setStdCheck]         = useState<number>(PRICING.standard.check)
  const [stdDelivery, setStdDelivery]   = useState<number>(PRICING.standard.delivery)
  const [preCheck, setPreCheck]         = useState<number>(PRICING.premium.check)
  const [preDelivery, setPreDelivery]   = useState<number>(PRICING.premium.delivery)
  const [whatsapp, setWhatsapp]         = useState<string>(SUPPORT.whatsapp)
  const [email, setEmail]               = useState<string>(SUPPORT.email)
  const [notifNewRider, setNotifNewRider]       = useState(true)
  const [notifNewJob, setNotifNewJob]           = useState(true)
  const [notifPayment, setNotifPayment]         = useState(true)
  const [notifComplaint, setNotifComplaint]     = useState(true)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const SECTIONS: { key: Section; label: string; icon: any }[] = [
    { key: 'general',       label: 'General',       icon: Shield       },
    { key: 'pricing',       label: 'Pricing',       icon: CreditCard   },
    { key: 'notifications', label: 'Notifications', icon: Bell         },
    { key: 'support',       label: 'Support',       icon: Users        },
    { key: 'security',      label: 'Security',      icon: Shield       },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Settings" subtitle="Platform configuration" />

        <div className="flex-1 overflow-hidden flex">

          {/* Settings sidebar */}
          <div className="w-52 border-r border-border bg-white flex-shrink-0 py-3">
            {SECTIONS.map(s => {
              const Icon = s.icon
              return (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold border-l-2 transition-colors',
                    section === s.key
                      ? 'bg-maroon-pale text-maroon border-maroon'
                      : 'text-gray-500 border-transparent hover:bg-surface'
                  )}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Settings content */}
          <div className="flex-1 overflow-y-auto p-6">

            {saved && (
              <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs text-green-700 font-semibold">Settings saved successfully.</span>
              </div>
            )}

            {/* ── GENERAL ── */}
            {section === 'general' && (
              <div className="space-y-4 max-w-lg">
                <h2 className="text-sm font-bold text-gray-900">General Settings</h2>

                <div className="card space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Platform Name</label>
                    <input className="input" defaultValue="TrustDoc" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Operating City</label>
                    <input className="input" defaultValue="Nairobi, Kenya" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Currency</label>
                    <select className="input">
                      <option>KES — Kenyan Shilling</option>
                      <option>USD — US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                      Platform Commission (%)
                    </label>
                    <input
                      type="number" min={5} max={30}
                      className="input"
                      value={platformCut}
                      onChange={e => setPlatformCut(Number(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Currently: {platformCut}% platform · {100 - platformCut}% rider
                    </p>
                  </div>
                </div>

                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}

            {/* ── PRICING ── */}
            {section === 'pricing' && (
              <div className="space-y-4 max-w-lg">
                <h2 className="text-sm font-bold text-gray-900">Pricing Tiers</h2>

                {/* Standard */}
                <div className="card border-l-4 border-l-gold space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gold-pale flex items-center justify-center">
                      <span className="text-[10px] font-black text-gold">STD</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Standard</p>
                      <p className="text-[10px] text-gray-400">Normal turnaround · 2–4 hrs</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Check Job (KSh)</label>
                      <input type="number" className="input" value={stdCheck} onChange={e => setStdCheck(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Delivery Job (KSh)</label>
                      <input type="number" className="input" value={stdDelivery} onChange={e => setStdDelivery(Number(e.target.value))} />
                    </div>
                  </div>
                </div>

                {/* Premium */}
                <div className="card border-l-4 border-l-maroon space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-maroon-pale flex items-center justify-center">
                      <span className="text-[10px] font-black text-maroon">PRE</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Premium</p>
                      <p className="text-[10px] text-gray-400">Priority rider · 1–2 hrs</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Check Job (KSh)</label>
                      <input type="number" className="input" value={preCheck} onChange={e => setPreCheck(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Delivery Job (KSh)</label>
                      <input type="number" className="input" value={preDelivery} onChange={e => setPreDelivery(Number(e.target.value))} />
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Pricing
                </button>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {section === 'notifications' && (
              <div className="space-y-4 max-w-lg">
                <h2 className="text-sm font-bold text-gray-900">Admin Notifications</h2>
                <div className="card space-y-4">
                  {[
                    { label: 'New rider application',     sub: 'Alert when a rider submits for verification', val: notifNewRider,   set: setNotifNewRider   },
                    { label: 'New job created',            sub: 'Alert when a client places an order',         val: notifNewJob,     set: setNotifNewJob     },
                    { label: 'Payment received',           sub: 'Alert on every M-Pesa transaction',           val: notifPayment,    set: setNotifPayment    },
                    { label: 'Support ticket opened',      sub: 'Alert when a complaint is raised',            val: notifComplaint,  set: setNotifComplaint  },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{item.label}</p>
                        <p className="text-[10px] text-gray-400">{item.sub}</p>
                      </div>
                      <button
                        onClick={() => item.set(!item.val)}
                        className={clsx(
                          'w-10 h-5 rounded-full transition-colors relative flex-shrink-0',
                          item.val ? 'bg-maroon' : 'bg-gray-200'
                        )}
                      >
                        <span className={clsx(
                          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                          item.val ? 'translate-x-5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Preferences
                </button>
              </div>
            )}

            {/* ── SUPPORT ── */}
            {section === 'support' && (
              <div className="space-y-4 max-w-lg">
                <h2 className="text-sm font-bold text-gray-900">Support Contact Settings</h2>
                <p className="text-xs text-gray-500">
                  These contacts are shown to clients and riders in the app when they need help.
                  Messages sent here appear as tickets in the Complaints page.
                </p>
                <div className="card space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">WhatsApp Support Number</label>
                    <input className="input font-mono" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                    <p className="text-[10px] text-gray-400 mt-1">Clients/riders message this number → tickets appear in dashboard</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Support Email</label>
                    <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Support Hours</label>
                    <input className="input" defaultValue="Mon–Fri, 8:00 AM – 6:00 PM EAT" />
                  </div>
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Save Support Info
                </button>
              </div>
            )}

            {/* ── SECURITY ── */}
            {section === 'security' && (
              <div className="space-y-4 max-w-lg">
                <h2 className="text-sm font-bold text-gray-900">Security Settings</h2>

                <div className="card space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type={showKey ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" />
                      <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">New Password</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Confirm New Password</label>
                    <input type="password" className="input" placeholder="••••••••" />
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">Two-Factor Authentication</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Required for all admin logins</p>
                    </div>
                    <span className="pill pill-approved">Enabled</span>
                  </div>
                </div>

                <div className="card bg-red-50 border-red-200">
                  <p className="text-xs font-bold text-red-700 mb-1">Danger Zone</p>
                  <p className="text-[10px] text-red-600 mb-3">These actions cannot be undone.</p>
                  <button className="btn-danger text-xs px-3 py-2">Reset All Admin Sessions</button>
                </div>

                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={14} /> Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
