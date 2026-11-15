import Topbar            from '../../components/layout/Topbar'
import StatCards         from '../../components/ui/StatCards'
import JobsTable         from '../../components/ui/JobsTable'
import ActivityFeed      from '../../components/ui/ActivityFeed'
import VerificationQueue from '../../components/ui/VerificationQueue'
import EscrowPanel       from '../../components/ui/EscrowPanel'
import QuickActions      from '../../components/ui/QuickActions'
import RevenueChart      from '../../components/charts/RevenueChart'
import TopRiders         from '../../components/ui/TopRiders'

export default function DashboardPage() {
  const now = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Dashboard Overview"
        subtitle={`${now} · Nairobi, Kenya`}
        actions={
          <div className="flex gap-2">
            <button className="btn-gold text-xs px-3 py-1.5">↓ Export</button>
            <button className="btn-primary text-xs px-3 py-1.5">+ New Job</button>
          </div>
        }
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Row 1 — 6 stat cards */}
        <StatCards />

        {/* Row 2 — Jobs table (2/3) + Activity feed (1/3) */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <JobsTable />
          </div>
          <div className="col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Row 3 — Verification queue + Escrow panel + Quick actions */}
        <div className="grid grid-cols-3 gap-4">
          <VerificationQueue />
          <EscrowPanel />
          <QuickActions />
        </div>

        {/* Row 4 — Revenue chart (1/2) + Top riders (1/2) */}
        <div className="grid grid-cols-2 gap-4">
          <RevenueChart />
          <TopRiders />
        </div>

      </div>
    </div>
  )
}
