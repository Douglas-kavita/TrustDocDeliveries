'use client'
import Link from 'next/link'
import { useState } from 'react'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { JOBS, PAYMENTS, RIDERS, CLIENTS, DASHBOARD_STATS } from '../../lib/mockData'
import { fmtKsh } from '../../lib/utils'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Download, Users, Bike, Briefcase, DollarSign , UserCog } from 'lucide-react'
import clsx from 'clsx'

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const weekData = DAYS.map((day, i) => ({
  day,
  Revenue:  DASHBOARD_STATS.weekRevenue[i],
  Platform: DASHBOARD_STATS.weekPlatformCut[i],
  Riders:   DASHBOARD_STATS.weekPlatformCut[i] * 5.67,
}))

const jobTypeData = [
  { name: 'Check Jobs',    value: JOBS.filter(j => j.type === 'check').length,    color: '#B8922A' },
  { name: 'Delivery Jobs', value: JOBS.filter(j => j.type === 'delivery').length, color: '#6B0F1A' },
]

const statusData = [
  { name: 'Completed',  value: JOBS.filter(j => j.status === 'completed').length,       color: '#155724' },
  { name: 'In Transit', value: JOBS.filter(j => j.status === 'in_transit').length,      color: '#6B0F1A' },
  { name: 'Escrow',     value: JOBS.filter(j => j.status === 'paid').length,            color: '#B8922A' },
  { name: 'Pending',    value: JOBS.filter(j => j.status === 'pending_payment').length, color: '#9E8184' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-bold text-gray-900 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {fmtKsh(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function ReportsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  const totalRevenue   = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.totalAmount, 0)
  const totalPlatform  = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.platformCut, 0)
  const totalRiderPay  = PAYMENTS.filter(p => p.status === 'released').reduce((s, p) => s + p.riderCut, 0)
  const completionRate = Math.round((JOBS.filter(j => j.status === 'completed').length / JOBS.length) * 100)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Reports & Analytics"
          subtitle="Platform performance overview"
          actions={
            <button className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1.5">
              <Download size={13} /> Export CSV
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue',    value: fmtKsh(totalRevenue),  sub: 'All completed jobs', icon: DollarSign, bg: 'bg-green-50',    color: 'text-green-600' },
              { label: 'Platform Earned',  value: fmtKsh(totalPlatform), sub: '15% of revenue', icon: TrendingUp, bg: 'bg-maroon-pale', color: 'text-maroon', href: '/reports/platform' },
              { label: 'Rider Payouts',    value: fmtKsh(totalRiderPay), sub: '85% of revenue', icon: Bike, bg: 'bg-gold-pale', color: 'text-gold', href: '/reports/riders' },
              { label: 'Agent Earnings',   value: fmtKsh(totalRiderPay * 0.18), sub: 'Commission deducted', icon: UserCog, bg: 'bg-blue-50', color: 'text-blue-600', href: '/reports/agents' },
              { label: 'Completion Rate',  value: `${completionRate}%`,  sub: 'Jobs completed',    icon: Briefcase,  bg: 'bg-blue-50',     color: 'text-blue-600'  },
            ].map(c => {
             const Icon = c.icon
if ((c as any).href) {
  return (
    <Link key={c.label} href={(c as any).href}
      className="card flex items-center gap-3 hover:shadow-md hover:border-[#8b1a2f]/30 transition-all cursor-pointer">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
        <Icon size={18} className={c.color} />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{c.label}</p>
        <p className="text-xl font-bold text-gray-900">{c.value}</p>
        <p className="text-[10px] text-[#8b1a2f] font-semibold">{c.sub} →</p>
      </div>
    </Link>
  )
}
return (
  <div key={c.label} className="card flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', c.bg)}>
                    <Icon size={18} className={c.color} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                    <p className="text-[10px] text-gray-400">{c.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Revenue chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title">Revenue — Last 7 Days</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Total: {fmtKsh(DASHBOARD_STATS.weekRevenue.reduce((a,b)=>a+b,0))}</p>
              </div>
              <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
                {(['week','month'] as const).map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className={clsx('px-4 py-1.5 text-xs font-semibold transition-colors capitalize',
                      period === p ? 'bg-maroon text-white' : 'text-gray-500 hover:bg-gray-100'
                    )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData} barCategoryGap="30%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E9EB" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9E8184' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9E8184' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v/1000)}k`} width={32} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Revenue"  fill="#6B0F1A" radius={[4,4,0,0]} />
                  <Bar dataKey="Platform" fill="#B8922A" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 pt-2 text-[10px] text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-maroon inline-block" /> Total revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gold inline-block" /> Platform cut (15%)</span>
              <span className="ml-auto">Rider share: 85%</span>
            </div>
          </div>

          {/* Pie charts row */}
          <div className="grid grid-cols-2 gap-4">

            {/* Job types */}
            <div className="card">
              <h2 className="section-title mb-4">Jobs by Type</h2>
              <div className="flex items-center gap-6">
                <div className="h-40 w-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={jobTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                        {jobTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v} jobs`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 flex-1">
                  {jobTypeData.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-700">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{d.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Total jobs</span>
                      <span className="font-bold">{JOBS.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job status */}
            <div className="card">
              <h2 className="section-title mb-4">Jobs by Status</h2>
              <div className="flex items-center gap-6">
                <div className="h-40 w-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`${v} jobs`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 flex-1">
                  {statusData.filter(d => d.value > 0).map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-gray-700">{d.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Users summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <Users size={24} className="text-gold mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{CLIENTS.length}</p>
              <p className="text-xs text-gray-400 mt-1">Total Clients</p>
            </div>
            <div className="card text-center">
              <Bike size={24} className="text-maroon mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{RIDERS.filter(r => r.verificationStatus === 'approved').length}</p>
              <p className="text-xs text-gray-400 mt-1">Active Riders</p>
            </div>
            <div className="card text-center">
              <Briefcase size={24} className="text-maroon mx-auto mb-2" />
              <p className="text-2xl font-black text-gray-900">{JOBS.length}</p>
              <p className="text-xs text-gray-400 mt-1">Total Jobs</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}



