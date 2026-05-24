import { useState } from 'react';
import { api } from '../lib/api';

export default function Quote() {
  const [tab, setTab] = useState('apostille');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Apostille form
  const [apostilleType, setApostilleType] = useState('state');
  const [priority, setPriority] = useState('standard');
  const [docCount, setDocCount] = useState(1);
  const [shipping, setShipping] = useState('standard');

  // FBI form
  const [residency, setResidency] = useState('resident');

  async function getApostilleQuote(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/apostille/quote', {
        apostille_type: apostilleType,
        priority,
        document_count: docCount,
        shipping: shipping === 'standard' ? null : shipping,
      });
      setResult({ type: 'apostille', data: res.data });
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function getFbiQuote(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/apostille/fbi-quote', { residency_type: residency });
      setResult({ type: 'fbi', data: res.data });
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function getComboQuote(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/apostille/combo-quote', {
        residency_type: residency,
        apostille_type: apostilleType,
        priority,
        document_count: docCount,
        shipping: shipping === 'standard' ? null : shipping,
      });
      setResult({ type: 'combo', data: res.data });
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Get a Quote</h1>
      <p className="text-center text-gray-600 mt-2">Instant pricing for our services. No account required.</p>

      {/* Tabs */}
      <div className="flex gap-1 mt-8 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'apostille', label: 'Apostille' },
          { id: 'fbi', label: 'FBI Check' },
          { id: 'combo', label: 'FBI + Apostille' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition ${
              tab === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Apostille Tab */}
      {tab === 'apostille' && (
        <form onSubmit={getApostilleQuote} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              value={apostilleType}
              onChange={(e) => setApostilleType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="state">State Document (Birth Cert, Marriage, etc.)</option>
              <option value="federal">Federal Document (FBI Report, etc.)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="priority">Priority (+$200)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Documents</label>
            <input
              type="number"
              min="1"
              max="20"
              value={docCount}
              onChange={(e) => setDocCount(parseInt(e.target.value) || 1)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping</label>
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="standard">Standard (included)</option>
              <option value="expedited">Expedited (+$100)</option>
              <option value="international">International (+$200)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Get Apostille Quote'}
          </button>
        </form>
      )}

      {/* FBI Tab */}
      {tab === 'fbi' && (
        <form onSubmit={getFbiQuote} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Residency Status</label>
            <select
              value={residency}
              onChange={(e) => setResidency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="resident">U.S. Resident / Citizen</option>
              <option value="non_resident">Non-Resident / Non-Citizen</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Get FBI Quote'}
          </button>
        </form>
      )}

      {/* Combo Tab */}
      {tab === 'combo' && (
        <form onSubmit={getComboQuote} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Residency Status</label>
            <select
              value={residency}
              onChange={(e) => setResidency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="resident">U.S. Resident / Citizen</option>
              <option value="non_resident">Non-Resident / Non-Citizen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apostille Document Type</label>
            <select
              value={apostilleType}
              onChange={(e) => setApostilleType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="state">State Document</option>
              <option value="federal">Federal Document</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="standard">Standard</option>
              <option value="priority">Priority (+$200)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Documents</label>
            <input
              type="number"
              min="1"
              max="20"
              value={docCount}
              onChange={(e) => setDocCount(parseInt(e.target.value) || 1)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping</label>
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm"
            >
              <option value="standard">Standard (included)</option>
              <option value="expedited">Expedited (+$100)</option>
              <option value="international">International (+$200)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Get Combo Quote'}
          </button>
        </form>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-lg border bg-white p-6">
          {result.type === 'error' ? (
            <p className="text-red-600">{result.message}</p>
          ) : result.type === 'apostille' ? (
            <div>
              <h3 className="font-bold text-lg text-gray-900">Apostille Quote</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-2">${result.data.total}</p>
              <p className="text-sm text-gray-500 mt-1">Estimated {result.data.processingDays} business days</p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>Base: ${result.data.breakdown.base}</p>
                {result.data.breakdown.priority > 0 && <p>Priority: +${result.data.breakdown.priority}</p>}
                {result.data.breakdown.additionalDocs > 0 && <p>Additional docs: +${result.data.breakdown.additionalDocs}</p>}
                {result.data.breakdown.shipping > 0 && <p>Shipping: +${result.data.breakdown.shipping}</p>}
              </div>
            </div>
          ) : result.type === 'fbi' ? (
            <div>
              <h3 className="font-bold text-lg text-gray-900">FBI Background Check Quote</h3>
              <p className="text-3xl font-bold text-green-700 mt-2">${result.data.base} <span className="text-sm font-normal text-gray-500">+ tax</span></p>
              <p className="text-sm text-gray-500 mt-1">{result.data.note}</p>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-lg text-gray-900">FBI + Apostille Combo Quote</h3>
              <p className="text-3xl font-bold text-indigo-700 mt-2">${result.data.total} <span className="text-sm font-normal text-gray-500">+ tax</span></p>
              <p className="text-sm text-gray-500 mt-1">Estimated {result.data.processingDays} business days</p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>FBI Background Check: ${result.data.breakdown.fbi_background_check}</p>
                <p>Apostille: ${result.data.breakdown.apostille}</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">{result.data.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
