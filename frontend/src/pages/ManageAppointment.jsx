import { useState } from 'react';
import { useI18n } from '../lib/i18n';

const statusSteps = {
  apostille: [
    { key: 'received', label: 'Received' },
    { key: 'processing', label: 'Processing' },
    { key: 'submitted_to_agency', label: 'Submitted to Agency' },
    { key: 'completed', label: 'Completed' },
    { key: 'shipped', label: 'Shipped' },
  ],
  fbi: [
    { key: 'submitted', label: 'Fingerprints Submitted' },
    { key: 'processing', label: 'FBI Processing' },
    { key: 'results_received', label: 'Results Received' },
    { key: 'completed', label: 'Completed' },
  ],
};

export default function ManageAppointment() {
  const { t } = useI18n();
  const [lookupEmail, setLookupEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [found, setFound] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [editing, setEditing] = useState(null);
  const [oriNumber, setOriNumber] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [saved, setSaved] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    // Simulate finding an appointment
    setAppointment({
      id: 'APT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      service: 'FBI Background Check',
      serviceType: 'fbi',
      date: '2026-06-05',
      time: '10:00 AM',
      status: 'processing',
      ori: '',
      name: 'Client',
      email: lookupEmail,
      fbiStatus: 'processing',
      apostilleStatus: null,
    });
    setFound(true);
  };

  const handleSaveDate = () => {
    setAppointment((prev) => ({ ...prev, date: newDate || prev.date, time: newTime || prev.time }));
    setEditing(null);
    setSaved('Appointment date/time updated successfully.');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleSaveOri = () => {
    setAppointment((prev) => ({ ...prev, ori: oriNumber }));
    setEditing(null);
    setSaved('ORI number saved successfully.');
    setTimeout(() => setSaved(''), 3000);
  };

  const getStatusIndex = (type, current) => {
    const steps = statusSteps[type];
    if (!steps) return -1;
    return steps.findIndex((s) => s.key === current);
  };

  if (!found) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage My Appointment</h1>
        <p className="text-gray-600 mb-6">Look up your appointment to make changes or check your status.</p>

        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the email you booked with"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Code</label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. APT-X7K2M9"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
          >
            Look Up Appointment
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage My Appointment</h1>

      {saved && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {saved}
        </div>
      )}

      {/* Appointment Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Appointment Details</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {appointment.id}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Service:</span>
            <p className="font-medium text-gray-900">{appointment.service}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p className="font-medium text-gray-900">{appointment.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <p className="font-medium text-gray-900">{appointment.date}</p>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <p className="font-medium text-gray-900">{appointment.time}</p>
          </div>
          {appointment.ori && (
            <div>
              <span className="text-gray-500">ORI Number:</span>
              <p className="font-medium text-gray-900">{appointment.ori}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {/* Change Date/Time */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Change Date & Time</h3>
              <p className="text-sm text-gray-500">Reschedule your appointment</p>
            </div>
            {editing !== 'date' && (
              <button
                onClick={() => { setEditing('date'); setNewDate(appointment.date); setNewTime(appointment.time); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change
              </button>
            )}
          </div>
          {editing === 'date' && (
            <div className="mt-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Time</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
                      '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
                      '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveDate} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                  Save Changes
                </button>
                <button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add ORI Number */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">ORI Number</h3>
              <p className="text-sm text-gray-500">Add or update your Originating Agency Identifier</p>
            </div>
            {editing !== 'ori' && (
              <button
                onClick={() => { setEditing('ori'); setOriNumber(appointment.ori || ''); }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {appointment.ori ? 'Edit' : 'Add'}
              </button>
            )}
          </div>
          {editing === 'ori' && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">ORI Number</label>
                <input
                  type="text"
                  value={oriNumber}
                  onChange={(e) => setOriNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. FL920010Z"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                />
                <p className="mt-1 text-xs text-gray-400">The ORI code identifies the requesting agency for your fingerprints</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveOri} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                  Save ORI
                </button>
                <button onClick={() => setEditing(null)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FBI Status */}
        {(appointment.serviceType === 'fbi' || appointment.serviceType === 'fbi-apostille') && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-medium text-gray-900 mb-1">FBI Background Check Status</h3>
            <p className="text-sm text-gray-500 mb-4">Track the progress of your FBI identity history summary</p>
            <div className="flex items-center gap-1">
              {statusSteps.fbi.map((step, i) => {
                const currentIdx = getStatusIndex('fbi', appointment.fbiStatus);
                const isActive = i <= currentIdx;
                return (
                  <div key={step.key} className="flex-1">
                    <div className={`h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <p className={`mt-1 text-xs ${isActive ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-sm text-blue-800">
                <strong>Current status:</strong> FBI Processing — Your fingerprints have been submitted to the FBI CJIS Division. Results are typically returned within 3-5 business days.
              </p>
            </div>
          </div>
        )}

        {/* Apostille Status */}
        {(appointment.serviceType === 'apostille' || appointment.serviceType === 'fbi-apostille') && appointment.apostilleStatus && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-medium text-gray-900 mb-1">Apostille Status</h3>
            <p className="text-sm text-gray-500 mb-4">Track the progress of your document apostille</p>
            <div className="flex items-center gap-1">
              {statusSteps.apostille.map((step, i) => {
                const currentIdx = getStatusIndex('apostille', appointment.apostilleStatus);
                const isActive = i <= currentIdx;
                return (
                  <div key={step.key} className="flex-1">
                    <div className={`h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <p className={`mt-1 text-xs ${isActive ? 'text-blue-700 font-medium' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Check Apostille Status (standalone) — always show option */}
        {appointment.serviceType !== 'apostille' && !appointment.apostilleStatus && (
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-medium text-gray-900 mb-1">Check Apostille Status</h3>
            <p className="text-sm text-gray-500 mb-3">If you have a separate apostille order, check its status here.</p>
            <button
              onClick={() => setAppointment((prev) => ({ ...prev, apostilleStatus: 'processing', serviceType: 'fbi-apostille' }))}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
            >
              Check Apostille Status
            </button>
          </div>
        )}
      </div>

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => { setFound(false); setAppointment(null); }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Look up a different appointment
        </button>
      </div>
    </div>
  );
}
