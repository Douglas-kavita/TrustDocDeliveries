'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'
import { CLIENTS } from '../../lib/mockData'
import { fmtDate, fmtKsh } from '../../lib/utils'
import { Search, Phone, MapPin, ShoppingBag } from 'lucide-react'
import clsx from 'clsx'

export default function ClientsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const filtered = CLIENTS.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.nationalId ?? '').includes(search)
  )

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Citizens / Clients"
          subtitle={`${CLIENTS.length} registered clients`}
        />

        <div className="flex-1 overflow-y-auto p-5">

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 mb-4 max-w-lg">
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              className="text-sm outline-none flex-1 bg-transparent"
              placeholder="Search by name, client ID, National ID or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-head">Client</th>
                  <th className="table-head">Client ID</th>
                  <th className="table-head">National ID</th>
                  <th className="table-head">Phone</th>
                  <th className="table-head">Location</th>
                  <th className="table-head">Orders</th>
                  <th className="table-head">Total Spent</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => (
                  <tr
                    key={client.id}
                    className="table-row-hover cursor-pointer"
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-pale border border-gold/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gold">
                            {client.fullName.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{client.fullName}</p>
                          <p className="text-[10px] text-gray-400">{client.email ?? 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs font-bold text-maroon">{client.id}</span>
                    </td>
                    <td className="table-cell">
                      <span className="font-mono text-xs text-gray-600">{client.nationalId ?? '—'}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={11} className="text-gray-400" />
                        {client.phone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin size={11} className="text-gray-400" />
                        {client.location}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <ShoppingBag size={12} className="text-gray-400" />
                        <span className="text-sm font-bold">{client.totalOrders}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm font-bold text-maroon">{fmtKsh(client.totalSpent)}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('pill',
                        client.accountStatus === 'active' ? 'pill-approved' : 'pill-rejected'
                      )}>
                        {client.accountStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className="text-xs text-gray-400">{fmtDate(client.joinedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">
                No clients match your search.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
