import ActivityFeed from '../../components/ui/ActivityFeed'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

export default function ActivityPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Live Activity" />

        <div style={{ padding: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
            Activity
          </h1>

          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
