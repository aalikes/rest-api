import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const serviceNames = {
  fingerprint: { en: 'Fingerprinting ($99)', es: 'Huellas Dactilares ($99)' },
  apostille: { en: 'Apostille ($200/doc)', es: 'Apostilla ($200/doc)' },
  fbi: { en: 'FBI Background Check', es: 'Verificación FBI' },
  'fbi-apostille': { en: 'FBI + Apostille Bundle', es: 'Paquete FBI + Apostilla' },
};

export default function Intake() {
  const { lang, t } = useI18n();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const service = params.get('service') || 'fingerprint';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    residency: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const showResidency = service === 'fbi' || service === 'fbi-apostille';

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission (in production this would call the API)
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.intake.success}</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {t.intake.back}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t.intake.title}</h1>
      <p className="text-center text-gray-600 mt-2 text-sm">{t.intake.subtitle}</p>

      <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
        <p className="text-sm text-indigo-800 font-medium">
          {t.intake.service}: {serviceNames[service]?.[lang] || serviceNames[service]?.en || service}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.intake.name}</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.intake.email}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.intake.phone}</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
          />
        </div>

        {showResidency && (
          <div>
            <label className="block text-sm font-medium text-gray-700">{t.intake.residency}</label>
            <select
              name="residency"
              value={form.residency}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="">{t.intake.selectResidency}</option>
              <option value="resident">{t.intake.residentOption}</option>
              <option value="non-resident">{t.intake.nonResidentOption}</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t.intake.date}</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t.intake.time}</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.intake.notes}</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? t.intake.submitting : t.intake.submit}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {t.intake.back}
        </button>
      </div>
    </div>
  );
}
