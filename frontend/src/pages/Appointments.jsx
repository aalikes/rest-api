import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    client_id: '', service_id: '', scheduled_date: '', scheduled_time: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [apptRes, clientRes, svcRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/clients'),
        api.get('/services'),
      ]);
      setAppointments(apptRes.data?.appointments || []);
      setClients(clientRes.data?.clients || []);
      setServices(svcRes.data?.services || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/appointments', {
        client_id: parseInt(form.client_id),
        service_id: parseInt(form.service_id),
        scheduled_date: form.scheduled_date,
        scheduled_time: form.scheduled_time,
        notes: form.notes || undefined,
      });
      setShowForm(false);
      setForm({ client_id: '', service_id: '', scheduled_date: '', scheduled_time: '', notes: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      await api.patch(`/appointments/${id}`, { status });
      loadData();
    } catch {}
  }

  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-yellow-100 text-yellow-700',
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading appointments...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 text-sm mt-1">In-office fingerprinting appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Appointment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 bg-white border rounded-lg p-6 space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Client *</label>
              <select required value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service *</label>
              <select required value={form.service_id} onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Select service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (${s.basePrice})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input type="date" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time *</label>
              <input type="time" required value={form.scheduled_time} onChange={(e) => setForm({ ...form, scheduled_time: e.target.value })}
                className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" rows={2} />
          </div>
          <button type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Book Appointment'}
          </button>
        </form>
      )}

      {/* Appointments List */}
      <div className="mt-6 space-y-3">
        {appointments.length === 0 ? (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-500">No appointments yet.</div>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{a.clientName || `Client #${a.clientId}`}</p>
                <p className="text-sm text-gray-600">{a.serviceName || `Service #${a.serviceId}`}</p>
                <p className="text-sm text-gray-500">{a.scheduledDate} at {a.scheduledTime}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>
                  {a.status}
                </span>
                {a.status === 'scheduled' && (
                  <div className="flex gap-1">
                    <button onClick={() => updateStatus(a.id, 'completed')}
                      className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100">Complete</button>
                    <button onClick={() => updateStatus(a.id, 'no_show')}
                      className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-100">No Show</button>
                    <button onClick={() => updateStatus(a.id, 'cancelled')}
                      className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
