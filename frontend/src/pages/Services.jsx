import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';

const categoryIcons = {
  fingerprint: '🖐️',
  apostille: '📜',
  fbi: '🔍',
};

const categoryColors = {
  fingerprint: 'bg-blue-50 border-blue-200 hover:shadow-lg hover:border-blue-400',
  apostille: 'bg-purple-50 border-purple-200 hover:shadow-lg hover:border-purple-400',
  fbi: 'bg-green-50 border-green-200 hover:shadow-lg hover:border-green-400',
};

export default function Services() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useI18n();

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
      {/* Hero Image */}
      <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
        <img
          src="/provn-hero.jpg"
          alt="Provn biometric technician capturing fingerprints"
          className="w-full h-64 sm:h-80 object-cover"
        />
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{t.services.title}</h1>
        <p className="mt-2 text-gray-600">{t.services.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Fingerprint Card */}
        <div
          onClick={() => navigate('/book?service=fingerprint')}
          className={`rounded-xl border-2 p-6 cursor-pointer transition-all ${categoryColors.fingerprint}`}
        >
          <div className="text-3xl mb-3">{categoryIcons.fingerprint}</div>
          <h2 className="text-xl font-bold text-gray-900">{t.services.fingerprint}</h2>
          <p className="text-gray-600 mt-2 text-sm">{t.services.fingerprintDesc}</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-blue-700">${pricing?.fingerprint?.base || 99}</span>
            <span className="text-gray-500 ml-1">{t.services.perCard}</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>{t.services.inOffice}</li>
            <li>{t.services.processing}</li>
            <li>2125 Biscayne Blvd Suite 303</li>
          </ul>
          <div className="mt-5">
            <span className="inline-block bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md">
              {t.services.bookNow}
            </span>
          </div>
        </div>

        {/* Apostille Card */}
        <div
          onClick={() => navigate('/book?service=apostille')}
          className={`rounded-xl border-2 p-6 cursor-pointer transition-all ${categoryColors.apostille}`}
        >
          <div className="text-3xl mb-3">{categoryIcons.apostille}</div>
          <h2 className="text-xl font-bold text-gray-900">{t.services.apostille}</h2>
          <p className="text-gray-600 mt-2 text-sm">{t.services.apostilleDesc}</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-purple-700">
              ${pricing?.state_apostille?.base || 200}
            </span>
            <span className="text-gray-500 ml-1">{t.services.perDoc}</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>{t.services.stateFederal}</li>
            <li>{t.services.priorityProcessing}</li>
            <li>{t.services.expeditedMail}</li>
            <li>{t.services.intlShipping}</li>
          </ul>
          <div className="mt-5">
            <span className="inline-block bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-md">
              {t.services.bookNow}
            </span>
          </div>
        </div>

        {/* FBI Background Check Card */}
        <div
          onClick={() => navigate('/book?service=fbi')}
          className={`rounded-xl border-2 p-6 cursor-pointer transition-all ${categoryColors.fbi}`}
        >
          <div className="text-3xl mb-3">{categoryIcons.fbi}</div>
          <h2 className="text-xl font-bold text-gray-900">{t.services.fbi}</h2>
          <p className="text-gray-600 mt-2 text-sm">{t.services.fbiDesc}</p>
          <div className="mt-4">
            <div>
              <span className="text-3xl font-bold text-green-700">
                ${pricing?.fbi_background_check?.resident || 129}
              </span>
              <span className="text-gray-500 ml-1">{t.services.resident}</span>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-bold text-green-700">
                ${pricing?.fbi_background_check?.non_resident || 179}
              </span>
              <span className="text-gray-500 ml-1">{t.services.nonResident}</span>
            </div>
          </div>
          <ul className="mt-4 space-y-1 text-sm text-gray-600">
            <li>{t.services.residentsLabel}</li>
            <li>{t.services.nonResidentsLabel}</li>
            <li>{t.services.includesFingerprint}</li>
          </ul>
          <div className="mt-5">
            <span className="inline-block bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md">
              {t.services.bookNow}
            </span>
          </div>
        </div>
      </div>

      {/* Combo Pricing */}
      <div
        onClick={() => navigate('/book?service=fbi-apostille')}
        className="mt-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all"
      >
        <h2 className="text-xl font-bold text-gray-900">{t.services.bundle}</h2>
        <p className="text-gray-600 mt-1 text-sm">{t.services.bundleDesc}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm font-medium text-gray-500">{t.services.residentCitizen}</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">$329 <span className="text-sm font-normal text-gray-500">+ tax</span></p>
            <p className="text-xs text-gray-500 mt-1">$129 FBI + $200 Apostille</p>
          </div>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm font-medium text-gray-500">{t.services.nonResidentCitizen}</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">$379 <span className="text-sm font-normal text-gray-500">+ tax</span></p>
            <p className="text-xs text-gray-500 mt-1">$179 FBI + $200 Apostille</p>
          </div>
        </div>
        <div className="mt-5">
          <span className="inline-block bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-md">
            {t.services.bookNow}
          </span>
        </div>
      </div>

      {/* Location */}
      <div className="mt-10 text-center bg-white rounded-xl border p-6">
        <h2 className="text-lg font-bold text-gray-900">{t.services.visitUs}</h2>
        <p className="text-gray-600 mt-2">{t.services.location}</p>
        <p className="text-sm text-gray-500 mt-1">{t.services.locationNote}</p>
      </div>
    </div>
  );
}
