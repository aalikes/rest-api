import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const statusOrder = ['received', 'processing', 'submitted_to_agency', 'completed', 'shipped'];
const statusLabels = {
  received: 'Received',
  processing: 'Processing',
  submitted_to_agency: 'Submitted',
  completed: 'Completed',
  shipped: 'Shipped',
};
const statusColors = {
  received: 'border-blue-300 bg-blue-50',
  processing: 'border-yellow-300 bg-yellow-50',
  submitted_to_agency: 'border-orange-300 bg-orange-50',
  completed: 'border-green-300 bg-green-50',
  shipped: 'border-purple-300 bg-purple-50',
};

export default function Pipeline() {
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPipeline(); }, []);

  async function loadPipeline() {
    try {
      const res = await api.get('/apostille/pipeline');
      setPipeline({
        stages: res.data?.pipeline || {},
        summary: res.data?.summary || {},
      });
    } catch {
      setPipeline(null);
    } finally {
      setLoading(false);
    }
  }

  async function transitionOrder(orderId, newStatus) {
    try {
      await api.patch(`/apostille/orders/${orderId}/transition`, { status: newStatus });
      loadPipeline();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading pipeline...</div>;
  if (!pipeline) return <div className="text-center py-12 text-red-500">Failed to load pipeline. Please login.</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apostille Pipeline</h1>
          <p className="text-gray-600 text-sm mt-1">Kanban view of all apostille orders</p>
        </div>
        {pipeline.summary && (
          <div className="text-right">
            <p className="text-sm text-gray-500">{pipeline.summary.total || 0} orders</p>
            <p className="text-sm font-medium text-indigo-700">${pipeline.summary.revenue || 0} revenue</p>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusOrder.map((status) => {
          const orders = pipeline.stages?.[status] || [];
          return (
            <div key={status} className={`rounded-lg border-2 p-3 min-h-[200px] ${statusColors[status]}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-900">{statusLabels[status]}</h3>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium">{orders.length}</span>
              </div>
              <div className="space-y-2">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    status={status}
                    onTransition={transitionOrder}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, status, onTransition }) {
  const nextStatus = statusOrder[statusOrder.indexOf(status) + 1];

  return (
    <div className="bg-white rounded-md border p-3 shadow-sm">
      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
      <p className="text-xs text-gray-500 mt-1">{order.clientName || `Client #${order.clientId}`}</p>
      {order.totalPrice && (
        <p className="text-xs text-indigo-600 font-medium mt-1">${order.totalPrice}</p>
      )}
      {order.priorityLevel && order.priorityLevel !== 'standard' && (
        <span className="inline-block mt-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
          {order.priorityLevel}
        </span>
      )}
      {nextStatus && (
        <button
          onClick={() => onTransition(order.id, nextStatus)}
          className="mt-2 w-full text-xs bg-indigo-50 text-indigo-700 py-1 rounded hover:bg-indigo-100 font-medium transition"
        >
          Move to {statusLabels[nextStatus]}
        </button>
      )}
    </div>
  );
}
