import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const categoryIcons = {
  fingerprint: '🖐️',
  apostille: '📜',
  fbi: '🔍',
};

const categoryColors = {
  fingerprint: 'bg-blue-50 border-blue-200',
  apostille: 'bg-purple-50 border-purple-200',
  fbi: 'bg-green-50 border-green-200',
};

export default function Services() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/apostille/pricing')
      .then((res) => setPricing(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading services...</div>;
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
        <p className="mt-2 text-gray-600">Professional fingerprinting, apostille, and FBI background check services in Miami, FL</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Fingerprint Card */}
        <div className={`rounded-xl border-2 p-6 ${categoryColors.fingerprint}`}>
          <div className="text-3xl mb-3">{categoryIcons.fingerprint}</div>
          <h2 className="text-xl font-bold text-gray-900">Fingerprinting</h2>
          <p className="text-gray-600 mt-2 text-sm">Professional ink and electronic fingerprint capture for all purposes.</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-blue-700">${pricing?.fingerprint?.base || 99}</span>
            <span className="text-gray-500 ml-1">per card</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>In-office only</li>
            <li>~20 min processing</li>
            <li>2125 Biscayne Blvd Suite 303</li>
          </ul>
        </div>

        {/* Apostille Card */}
        <div className={`rounded-xl border-2 p-6 ${categoryColors.apostille}`}>
          <div className="text-3xl mb-3">{categoryIcons.apostille}</div>
          <h2 className="text-xl font-bold text-gray-900">Apostille</h2>
          <p className="text-gray-600 mt-2 text-sm">State and federal document authentication for international use.</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-purple-700">
              ${pricing?.state_apostille?.base || 200}
            </span>
            <span className="text-gray-500 ml-1">per document</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>State &amp; Federal documents</li>
            <li>Priority processing available (+$200)</li>
            <li>Expedited mail (+$100)</li>
            <li>International shipping (+$200)</li>
          </ul>
        </div>

        {/* FBI Background Check Card */}
        <div className={`rounded-xl border-2 p-6 ${categoryColors.fbi}`}>
          <div className="text-3xl mb-3">{categoryIcons.fbi}</div>
          <h2 className="text-xl font-bold text-gray-900">FBI Background Check</h2>
          <p className="text-gray-600 mt-2 text-sm">Identity history summary (rap sheet) via FBI CJIS electronic submission.</p>
          <div className="mt-4">
            <div>
              <span className="text-3xl font-bold text-green-700">
                ${pricing?.fbi_background_check?.resident || 129}
              </span>
              <span className="text-gray-500 ml-1">+ tax (resident)</span>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold text-green-700">
                ${pricing?.fbi_background_check?.non_resident || 179}
              </span>
              <span className="text-gray-500 ml-1">+ tax (non-resident)</span>
            </div>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>U.S. Residents / Citizens: $129</li>
            <li>Non-Residents / Non-Citizens: $179</li>
            <li>Includes electronic fingerprint capture</li>
          </ul>
        </div>
      </div>

      {/* Combo Pricing */}
      <div className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h2 className="text-xl font-bold text-gray-900">Bundle: FBI + Apostille</h2>
        <p className="text-gray-600 mt-1 text-sm">Need your FBI background check apostilled for international use? Save with our combo pricing.</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm font-medium text-gray-500">Resident / U.S. Citizen</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">$329 <span className="text-sm font-normal text-gray-500">+ tax</span></p>
            <p className="text-xs text-gray-500 mt-1">$129 FBI + $200 Apostille</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm font-medium text-gray-500">Non-Resident / Non-Citizen</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">$379 <span className="text-sm font-normal text-gray-500">+ tax</span></p>
            <p className="text-xs text-gray-500 mt-1">$179 FBI + $200 Apostille</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mt-10 text-center bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold text-gray-900">Visit Us</h2>
        <p className="text-gray-600 mt-2">2125 Biscayne Blvd Suite 303, Miami, FL 33137</p>
        <p className="text-sm text-gray-500 mt-1">All fingerprinting services are in-office only. Apostille processing available online.</p>
      </div>
    </div>
  );
}
