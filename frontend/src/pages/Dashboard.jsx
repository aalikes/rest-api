import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/business/dashboard')
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-12 text-red-500">Failed to load dashboard. Please login.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
      <p className="text-gray-600 mt-1">Overview of your business operations</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <KpiCard
          label="Total Revenue"
          value={`$${data.totalRevenue || 0}`}
          sub={`${data.totalOrders || 0} total orders`}
        />
        <KpiCard
          label="Active Orders"
          value={data.activeOrders || 0}
          sub="In pipeline"
        />
        <KpiCard
          label="Clients"
          value={data.totalClients || 0}
          sub={`${data.verifiedClients || 0} verified`}
        />
        <KpiCard
          label="Appointments"
          value={data.upcomingAppointments || 0}
          sub={`${data.todayAppointments || 0} today`}
        />
      </div>

      {/* Revenue by Service */}
      {data.revenueByService && data.revenueByService.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Revenue by Service</h2>
          <div className="mt-3 bg-white rounded-lg border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.revenueByService.map((s, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-sm text-gray-900">{s.name || s.serviceName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">${s.revenue || s.totalRevenue || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">{s.orders || s.orderCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Pipeline */}
      {data.ordersByStatus && data.ordersByStatus.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Order Pipeline</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {data.ordersByStatus.map((stage, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 min-w-[140px]">
                <p className="text-xs text-gray-500 uppercase">{(stage.status || '').replace(/_/g, ' ')}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stage.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services by Category */}
      {data.servicesByCategory && data.servicesByCategory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Services ({data.activeServices || 0} active)</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {data.servicesByCategory.map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 min-w-[140px]">
                <p className="text-xs text-gray-500 uppercase">{s.category}</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apostille Status */}
      {data.apostillesByStatus && data.apostillesByStatus.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Apostille Status</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {data.apostillesByStatus.map((s, i) => (
              <div key={i} className="bg-white rounded-lg border px-4 py-3 min-w-[140px]">
                <p className="text-xs text-gray-500 uppercase">{s.apostille_status || s.status}</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
