import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const documentTypes = [
  'FBI Background Check',
  'Birth Certificate',
  'Marriage Certificate',
  'Divorce Decree',
  'Power of Attorney',
  'Business Documents',
  'Other',
];

const countries = [
  'N/A', 'United States', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon',
  'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Guatemala', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan',
  'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Malaysia',
  'Mexico', 'Moldova', 'Monaco', 'Morocco', 'Mozambique', 'Netherlands', 'New Zealand',
  'Nicaragua', 'Nigeria', 'Norway', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'Uruguay', 'Venezuela', 'Vietnam',
];

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

const referralSources = ['Google Search', 'Social Media', 'Friend/Referral', 'Provn Fingerprinting Client', 'Other'];

export default function ApostilleOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState([
    { type: '', country: '', inProgress: false, file: null },
  ]);
  const [options, setOptions] = useState({
    apostilleType: 'state',
    state: '',
    priority: false,
  });
  const [shipping, setShipping] = useState({
    destination: 'domestic',
    speed: 'standard',
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    addressLine2: '',
    region: '',
    postalCode: '',
  });
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    referral: '',
  });
  const [coupon, setCoupon] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const basePrice = 200;
  const additionalDocPrice = 50;
  const docCount = documents.length;
  const docTotal = basePrice + (docCount > 1 ? (docCount - 1) * additionalDocPrice : 0);
  const priorityCost = options.priority ? 200 : 0;
  const shippingCost = getShippingCost();
  const total = docTotal + priorityCost + shippingCost;

  function getShippingCost() {
    if (shipping.destination === 'domestic') {
      return shipping.speed === 'standard' ? 0 : 100;
    }
    return shipping.speed === 'standard' ? 100 : 200;
  }

  function getEstimatedCompletion() {
    if (options.apostilleType === 'federal') {
      return options.priority ? '~10 business days' : '~5 weeks';
    }
    return options.priority ? '3-5 business days' : '3-10 business days (varies by state)';
  }

  function addDocument() {
    setDocuments([...documents, { type: '', country: '', inProgress: false, file: null }]);
  }

  function updateDocument(index, field, value) {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  }

  function canProceedStep1() {
    return documents.every(d => d.type && d.country && (d.inProgress || d.file));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
        <p className="text-gray-600">Your apostille order has been received. We'll send you a confirmation email with next steps.</p>
        <button onClick={() => navigate('/apostille')} className="mt-6 text-green-600 hover:text-green-700 font-medium">
          ← Back to Apostille Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/apostille')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Apostille Service</h1>
        <div />
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              s <= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s}
            </div>
            {s < 5 && (
              <div className={`w-12 sm:w-20 h-0.5 ${s < step ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Document Upload */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="border border-green-200 bg-green-50 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">🛡️</span>
              <div>
                <h3 className="font-bold text-gray-900">Secure Document Portal</h3>
                <p className="text-sm text-gray-600">Your documents are encrypted with 256-bit SSL</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>🔒 Government-grade encryption</span>
                  <span>⚙️ CJIS-compliant security</span>
                  <span>🗑️ Auto-deleted after processing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-medium text-gray-900">📋 Upload clear copies of your documents</p>
            <p className="text-sm text-amber-700 mt-1">Accepted formats: PDF, JPG, PNG, WEBP (max 20MB each). Add each document separately with its type and destination country.</p>
          </div>

          {documents.map((doc, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                📄 Document {i + 1}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Document Type <span className="text-red-500">*</span></label>
                  <select
                    value={doc.type}
                    onChange={(e) => updateDocument(i, 'type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700"
                  >
                    <option value="">Required — select document type</option>
                    {documentTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🌐 Destination Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={doc.country}
                      onChange={(e) => updateDocument(i, 'country', e.target.value)}
                      className="w-full border border-amber-300 bg-amber-50 rounded-lg px-4 py-2.5 text-gray-700"
                    >
                      <option value="">Required — country where apostille will be used</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={doc.inProgress}
                      onChange={(e) => updateDocument(i, 'inProgress', e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-gray-900">⏳ Document in Progress</span>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Don't have it yet? (e.g., FBI background check pending) — continue now and email it later. We'll start processing as soon as you send it.
                      </p>
                    </div>
                  </label>
                </div>

                {!doc.inProgress && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-red-200 bg-red-50 rounded-lg p-8 text-center cursor-pointer hover:border-red-300 transition">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => updateDocument(i, 'file', e.target.files[0])}
                        className="hidden"
                        id={`file-upload-${i}`}
                      />
                      <label htmlFor={`file-upload-${i}`} className="cursor-pointer">
                        <div className="text-green-600 text-2xl mb-2">⬆️</div>
                        <p className="font-medium text-gray-700">Click to upload your document</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG, WEBP up to 20MB</p>
                      </label>
                      {doc.file && (
                        <p className="mt-2 text-sm text-green-700 font-medium">✓ {doc.file.name}</p>
                      )}
                    </div>
                    {!doc.file && (
                      <p className="mt-1 text-xs text-red-500">⚠️ Required to continue — or check "Document in Progress" above</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addDocument}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 text-green-600 font-medium hover:border-green-400 hover:bg-green-50 transition"
          >
            + Add Another Document
          </button>

          <div className="text-center text-sm text-gray-600">
            ${basePrice} first document{docCount > 1 ? ` + $${(docCount - 1) * additionalDocPrice} additional` : ''} = <strong>${docTotal}</strong>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue to Service Options
          </button>
        </div>
      )}

      {/* Step 2: Service Options */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🛡️ Apostille Service Options
            </h2>

            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800">
              <strong>{documents.length} document(s)</strong> uploaded — {documents.map(d => d.type || 'Document').join(', ')}
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Apostille Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  options.apostilleType === 'state' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="apostilleType"
                    value="state"
                    checked={options.apostilleType === 'state'}
                    onChange={(e) => setOptions({ ...options, apostilleType: e.target.value })}
                    className="mr-2"
                  />
                  <span className="font-medium">State Apostille</span>
                  <p className="text-xs text-gray-500 mt-1">3-10 days processing</p>
                </label>
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                  options.apostilleType === 'federal' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="apostilleType"
                    value="federal"
                    checked={options.apostilleType === 'federal'}
                    onChange={(e) => setOptions({ ...options, apostilleType: e.target.value })}
                    className="mr-2"
                  />
                  <span className="font-medium">Federal Apostille</span>
                  <p className="text-xs text-gray-500 mt-1">5 weeks standard</p>
                </label>
              </div>
            </div>

            {options.apostilleType === 'state' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Which state issued your document?</label>
                <select
                  value={options.state}
                  onChange={(e) => setOptions({ ...options, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
                >
                  <option value="">Select a state</option>
                  {usStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div>
                <h3 className="font-bold text-gray-900">Priority Processing (+$200)</h3>
                <p className="text-sm text-gray-500">
                  {options.apostilleType === 'federal' ? 'Reduces processing to ~10 business days' : 'Faster processing time'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.priority}
                  onChange={(e) => setOptions({ ...options, priority: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
              </label>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between text-sm">
              <span>Base apostille service</span>
              <span>${docTotal.toFixed(2)}</span>
            </div>
            {priorityCost > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span>Priority Processing</span>
                <span>+${priorityCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Shipping</span>
              <span>Selected at next step</span>
            </div>
            <div className="flex justify-between font-bold mt-3 pt-3 border-t">
              <span>Total</span>
              <span className="text-green-600">${(docTotal + priorityCost).toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">⏱️ Estimated completion: {getEstimatedCompletion()}</p>
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue to Shipping
          </button>
        </div>
      )}

      {/* Step 3: Shipping */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              📍 Shipping Address
            </h2>
            <p className="text-sm text-gray-500 mt-1">Where should we ship your apostilled documents?</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <label className={`border-2 rounded-lg p-4 cursor-pointer text-center transition ${
                shipping.destination === 'domestic' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <input type="radio" name="dest" value="domestic" checked={shipping.destination === 'domestic'}
                  onChange={() => setShipping({ ...shipping, destination: 'domestic', speed: 'standard' })} className="sr-only" />
                <div className="text-2xl mb-1">📍</div>
                <div className="font-medium">Domestic (US)</div>
              </label>
              <label className={`border-2 rounded-lg p-4 cursor-pointer text-center transition ${
                shipping.destination === 'international' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}>
                <input type="radio" name="dest" value="international" checked={shipping.destination === 'international'}
                  onChange={() => setShipping({ ...shipping, destination: 'international', speed: 'standard' })} className="sr-only" />
                <div className="text-2xl mb-1">🌐</div>
                <div className="font-medium">International</div>
              </label>
            </div>

            {shipping.destination === 'domestic' ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input type="text" placeholder="123 Main St" value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apt, Suite, Unit (optional)</label>
                  <input type="text" placeholder="Apt 4B" value={shipping.apt}
                    onChange={(e) => setShipping({ ...shipping, apt: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" placeholder="Miami" value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                      <option value="">State</option>
                      {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input type="text" placeholder="33137" value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <select value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                    <option value="">Select country</option>
                    {countries.filter(c => c !== 'N/A' && c !== 'United States').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input type="text" placeholder="Street address or P.O. Box" value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (optional)</label>
                  <input type="text" placeholder="Apartment, floor, building, etc." value={shipping.addressLine2}
                    onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" placeholder="City" value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province / Region</label>
                    <input type="text" placeholder="Region (optional)" value={shipping.region}
                      onChange={(e) => setShipping({ ...shipping, region: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input type="text" placeholder="Postal / ZIP code (optional)" value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
                </div>
              </div>
            )}
          </div>

          {/* Shipping Speed */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">📦 Shipping Speed</h3>
            <div className="mt-4 space-y-3">
              {shipping.destination === 'domestic' ? (
                <>
                  <label className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition ${
                    shipping.speed === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="speed" value="standard" checked={shipping.speed === 'standard'}
                        onChange={() => setShipping({ ...shipping, speed: 'standard' })} />
                      <div>
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-xs text-gray-500">Regular USPS mail delivery</div>
                      </div>
                    </div>
                    <span className="text-green-600 font-medium text-sm">Included</span>
                  </label>
                  <label className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition ${
                    shipping.speed === 'expedited' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="speed" value="expedited" checked={shipping.speed === 'expedited'}
                        onChange={() => setShipping({ ...shipping, speed: 'expedited' })} />
                      <div>
                        <div className="font-medium">Expedited Domestic Mail</div>
                        <div className="text-xs text-gray-500">Priority shipping for faster delivery</div>
                      </div>
                    </div>
                    <span className="font-medium text-sm">+$100</span>
                  </label>
                </>
              ) : (
                <>
                  <label className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition ${
                    shipping.speed === 'standard' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="speed" value="standard" checked={shipping.speed === 'standard'}
                        onChange={() => setShipping({ ...shipping, speed: 'standard' })} />
                      <div>
                        <div className="font-medium">Standard International Shipping</div>
                        <div className="text-xs text-gray-500">International mail delivery</div>
                      </div>
                    </div>
                    <span className="font-medium text-sm">+$100</span>
                  </label>
                  <label className={`flex items-center justify-between border-2 rounded-lg p-4 cursor-pointer transition ${
                    shipping.speed === 'expedited' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="speed" value="expedited" checked={shipping.speed === 'expedited'}
                        onChange={() => setShipping({ ...shipping, speed: 'expedited' })} />
                      <div>
                        <div className="font-medium">Expedited International Shipping</div>
                        <div className="text-xs text-gray-500">Priority international delivery</div>
                      </div>
                    </div>
                    <span className="font-medium text-sm">+$200</span>
                  </label>
                </>
              )}
            </div>
            {shippingCost > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
                🚀 Shipping fee: <strong>${shippingCost.toFixed(2)}</strong> will be added to your total.
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue to Details
          </button>
        </div>
      )}

      {/* Step 4: Contact Information */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="border border-green-200 bg-green-50 rounded-lg p-5">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              <p>🛡️ {options.apostilleType === 'federal' ? 'Federal' : 'State'} Apostille</p>
              <p>⏱️ Est. completion: {getEstimatedCompletion()}</p>
              <p>📍 Ship to: {shipping.city}{shipping.state ? `, ${shipping.state}` : ''}</p>
            </div>
            <div className="mt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              👤 Your Contact Information
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" placeholder="John Smith" value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" placeholder="john@example.com" value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" placeholder="(305) 555-1234" value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                <select value={contact.referral} onChange={(e) => setContact({ ...contact, referral: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                  <option value="">Select an option</option>
                  {referralSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-medium transition"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {/* Step 5: Review & Payment */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>🛡️ {options.apostilleType === 'federal' ? 'Federal' : 'State'} Apostille</p>
              <p>📄 {documents.length} document(s)</p>
              <p>⏱️ Est: {getEstimatedCompletion()}</p>
              <p>📍 {shipping.street}{shipping.city ? `, ${shipping.city}` : ''}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zip}</p>
            </div>
            <div className="mt-4 border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span>Base apostille service</span><span>${docTotal.toFixed(2)}</span></div>
              {priorityCost > 0 && <div className="flex justify-between"><span>Priority Processing</span><span>+${priorityCost.toFixed(2)}</span></div>}
              {shippingCost > 0 && <div className="flex justify-between"><span>Shipping</span><span>+${shippingCost.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">🏷️ Have a coupon code?</h3>
            <div className="mt-2 flex gap-2">
              <input type="text" placeholder="Enter coupon code" value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2" />
              <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Apply
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">💳 Secure Payment</h2>
            <p className="text-sm text-gray-500 mt-1">🔒 Secured by Stripe. Your payment information is encrypted.</p>
            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-bold transition"
            >
              Pay ${total.toFixed(2)} — Book Your Apostille Now
            </button>
            <p className="mt-3 text-xs text-gray-500 text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
