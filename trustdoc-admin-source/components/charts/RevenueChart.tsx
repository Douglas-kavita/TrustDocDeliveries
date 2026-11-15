'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { DASHBOARD_STATS } from '../../lib/mockData'
import { fmtKsh } from '../../lib/utils'
import Link from 'next/link'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const data = DAYS.map((day, i) => ({
  day,
  Revenue:    DASHBOARD_STATS.weekRevenue[i],
  'Platform': DASHBOARD_STATS.weekPlatformCut[i],
}))

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

export default function RevenueChart() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h2 className="section-title">Revenue — Last 7 Days</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Total: {fmtKsh(DASHBOARD_STATS.weekRevenue.reduce((a, b) => a + b, 0))}
          </p>
        </div>
        <Link href="/reports" className="section-action">Monthly →</Link>
      </div>

      <div className="p-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0E9EB" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#9E8184' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9E8184' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${Math.round(v / 1000)}k`}
              width={32}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
            />
            <Bar dataKey="Revenue"  fill="#6B0F1A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Platform" fill="#B8922A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend note */}
      <div className="px-4 pb-3 flex gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-maroon inline-block" /> Total revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold inline-block" /> Platform cut (15%)
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          Rider share: 85%
        </span>
      </div>
    </div>
  )
}
