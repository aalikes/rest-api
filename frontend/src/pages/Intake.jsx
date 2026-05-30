import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const services = [
  { id: 'fingerprint', price: 99, label: 'Fingerprinting' },
  { id: 'apostille', price: 200, label: 'Apostille' },
  { id: 'fbi', price: 129, label: 'FBI Background Check' },
  { id: 'fbi-apostille', price: 329, label: 'FBI + Apostille Bundle' },
];

export default function Intake() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialService = params.get('service') || 'fingerprint';

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    service: initialService,
    residency: 'resident',
    priority: false,
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
    coupon: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  function getPrice() {
    const svc = services.find((s) => s.id === form.service);
    let price = svc?.price || 99;
    if ((form.service === 'fbi' || form.service === 'fbi-apostille') && form.residency === 'non-resident') {
      price += 50;
    }
    if (form.priority) price += 200;
    return price;
  }

  function nextStep() {
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">{t.intake.success}</p>
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
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step ? 'bg-indigo-600 text-white' :
              s === step ? 'bg-indigo-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {s < step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </div>
            {s < 3 && (
              <div className={`w-16 sm:w-24 h-0.5 ${s < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mb-8 text-xs text-gray-500 px-2">
        <span className={step >= 1 ? 'text-indigo-600 font-medium' : ''}>Customize Service</span>
        <span className={step >= 2 ? 'text-indigo-600 font-medium' : ''}>Your Details</span>
        <span className={step >= 3 ? 'text-indigo-600 font-medium' : ''}>Complete Booking</span>
      </div>

      {/* Step 1: Customize Service */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Customize Your Service</h2>
          <p className="text-sm text-gray-500 mb-6">Choose the service and options that fit your needs.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.intake.service}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc) => (
                  <label
                    key={svc.id}
                    className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition ${
                      form.service === svc.id
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={svc.id}
                      checked={form.service === svc.id}
                      onChange={handleChange}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{svc.label}</p>
                      <p className="text-xs text-gray-500">from ${svc.price}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {(form.service === 'fbi' || form.service === 'fbi-apostille') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.intake.residency}</label>
                <div className="flex gap-3">
                  <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition ${
                    form.residency === 'resident' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" name="residency" value="resident" checked={form.residency === 'resident'} onChange={handleChange} className="sr-only" />
                    <p className="text-sm font-medium">{t.intake.residentOption}</p>
                    <p className="text-xs text-gray-500">$129</p>
                  </label>
                  <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition ${
                    form.residency === 'non-resident' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}>
                    <input type="radio" name="residency" value="non-resident" checked={form.residency === 'non-resident'} onChange={handleChange} className="sr-only" />
                    <p className="text-sm font-medium">{t.intake.nonResidentOption}</p>
                    <p className="text-xs text-gray-500">$179</p>
                  </label>
                </div>
              </div>
            )}

            {(form.service === 'apostille' || form.service === 'fbi-apostille') && (
              <label className="flex items-center gap-3 border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                <input
                  type="checkbox"
                  name="priority"
                  checked={form.priority}
                  onChange={handleChange}
                  className="rounded text-indigo-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Priority Processing</p>
                  <p className="text-xs text-gray-500">+$200 — expedited processing time</p>
                </div>
              </label>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-700">
              {t.intake.back}
            </button>
            <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Your Details */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Your Details</h2>
          <p className="text-sm text-gray-500 mb-6">We need your information to schedule the appointment.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.intake.name}</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.intake.email}</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.intake.phone}</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange} required
                  className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="(305) 555-0123"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.intake.date}</label>
                <input
                  type="date" name="date" value={form.date} onChange={handleChange} required
                  className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.intake.time}</label>
                <input
                  type="time" name="time" value={form.time} onChange={handleChange} required
                  className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t.intake.notes}</label>
              <textarea
                name="notes" value={form.notes} onChange={handleChange} rows={2}
                className="mt-1 block w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any special requirements or questions..."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={prevStep} className="text-sm text-gray-500 hover:text-gray-700">
              ← Back
            </button>
            <button onClick={nextStep} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
              Next Step →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Complete Booking */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Complete Your Booking</h2>
          <p className="text-sm text-gray-500 mb-6">Review your details and confirm.</p>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-gray-900">{services.find((s) => s.id === form.service)?.label}</span>
              </div>
              {(form.service === 'fbi' || form.service === 'fbi-apostille') && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Residency</span>
                  <span className="font-medium text-gray-900">{form.residency === 'resident' ? 'U.S. Resident' : 'Non-Resident'}</span>
                </div>
              )}
              {form.priority && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority Processing</span>
                  <span className="font-medium text-gray-900">+$200</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment</span>
                <span className="font-medium text-gray-900">{form.date} at {form.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Client</span>
                <span className="font-medium text-gray-900">{form.name || '—'}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-indigo-600">${getPrice()}</span>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
            <div className="flex gap-2">
              <input
                type="text" name="coupon" value={form.coupon} onChange={handleChange}
                className="flex-1 rounded-lg border-gray-300 border px-3 py-2 text-sm"
                placeholder="Enter code"
              />
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Apply
              </button>
            </div>
          </div>

          {/* Payment Section (Demo) */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Payment</p>
            <p className="text-xs text-blue-600 mt-1">Payment will be collected at the office on your appointment date.</p>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={prevStep} className="text-sm text-gray-500 hover:text-gray-700">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Complete Booking — $${getPrice()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
