import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const reasonOptions = [
  'Livescan',
  'FDLE / Florida Department of Law Enforcement',
  'ATF / Gun License',
  'Real Estate',
  'Medical',
  'Fingerprint Card',
  'Finance',
  'Lawyer',
  'Other Occupation',
  'Other Reason - Please Describe',
];

const referralOptions = [
  'Google Search',
  'Google Ad',
  'Facebook Ad',
  'Instagram Ad',
  'Referral from Friend/Family',
  'Business Referral',
  'Social Media (Organic)',
  'Word of Mouth',
  'Repeat Customer',
  'Other',
];

const locationOptions = [
  { id: 'miami', label: 'Miami — 2125 Biscayne Blvd Suite 336, Miami, FL 33137' },
  { id: 'ftlauderdale', label: 'Ft. Lauderdale — Coming Soon' },
];

export default function FBIIntakeForm() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    ssn: '',
    placeOfBirth: '',
    countryOfCitizenship: '',
    gender: '',
    race: '',
    height: '',
    weight: '',
    eyeColor: '',
    hairColor: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    ori: '',
    reason: '',
    reasonOther: '',
    referral: '',
    residency: 'resident',
    location: 'miami',
    consentSMS: true,
    consentPrivacy: false,
    consentDisclaimer: false,
    maidenName: '',
    aliases: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Intake Form Submitted</h2>
        <p className="text-gray-600 dark:text-gray-300">Your FBI background check intake form has been submitted. We will contact you to schedule your appointment.</p>
        <button onClick={() => navigate('/')} className="mt-6 text-teal-600 hover:text-teal-700 font-medium">
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/')} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">FBI Background Check Intake</h1>
        <div />
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              s <= step ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-300'
            }`}>{s}</div>
            {s < 3 && <div className={`w-12 sm:w-20 h-0.5 ${s < step ? 'bg-teal-600' : 'bg-gray-200 dark:bg-slate-600'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Personal Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Required for FBI background check processing</p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
                <input type="text" name="middleName" value={form.middleName} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maiden Name / Aliases</label>
                <input type="text" name="aliases" value={form.aliases} onChange={handleChange} placeholder="If applicable" className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Social Security Number *</label>
                <input type="text" name="ssn" value={form.ssn} onChange={handleChange} placeholder="XXX-XX-XXXX" required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
                <p className="text-xs text-gray-400 mt-1">Required by federal law for FBI submissions</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Place of Birth *</label>
                <input type="text" name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} placeholder="City, State or Country" required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Citizenship *</label>
                <input type="text" name="countryOfCitizenship" value={form.countryOfCitizenship} onChange={handleChange} placeholder="e.g. United States" required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Race</label>
                <select name="race" value={form.race} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="asian">Asian / Pacific Islander</option>
                  <option value="hispanic">Hispanic</option>
                  <option value="native">American Indian / Alaska Native</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height</label>
                <input type="text" name="height" value={form.height} onChange={handleChange} placeholder="5'10&quot;" className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (lbs)</label>
                <input type="text" name="weight" value={form.weight} onChange={handleChange} placeholder="170" className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eye Color</label>
                <select name="eyeColor" value={form.eyeColor} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="brown">Brown</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="hazel">Hazel</option>
                  <option value="black">Black</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hair Color</label>
                <select name="hairColor" value={form.hairColor} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="black">Black</option>
                  <option value="brown">Brown</option>
                  <option value="blonde">Blonde</option>
                  <option value="red">Red</option>
                  <option value="gray">Gray</option>
                  <option value="bald">Bald</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={() => setStep(2)} disabled={!form.firstName || !form.lastName || !form.dateOfBirth || !form.ssn}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition">
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Contact & Service */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP *</label>
                  <input type="text" name="zip" value={form.zip} onChange={handleChange} required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(305) 555-1234" required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>

            <label className="flex items-start gap-3 mt-4 p-3 border dark:border-slate-600 rounded-lg cursor-pointer">
              <input type="checkbox" name="consentSMS" checked={form.consentSMS} onChange={handleChange} className="mt-0.5 rounded text-teal-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">I consent to receive text messages from Proven LLC regarding my appointment status and service updates.</span>
            </label>
          </div>

          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Additional Information (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ORI Number</label>
                <input type="text" name="ori" value={form.ori} onChange={handleChange} placeholder="FL123456789" className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm uppercase" />
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">If you have an ORI number for your organization, you can provide it here. Ask your employer for the ORI code to expedite processing.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for fingerprint - Choose one that best describes</label>
                <select name="reason" value={form.reason} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select a reason</option>
                  {reasonOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {form.reason === 'Other Reason - Please Describe' && (
                  <input type="text" name="reasonOther" value={form.reasonOther} onChange={handleChange} placeholder="Describe your reason" className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm mt-2" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How did you hear about us?</label>
                <select name="referral" value={form.referral} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-sm">
                  <option value="">Select an option</option>
                  {referralOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Location</label>
                <div className="space-y-2">
                  {locationOptions.map((loc) => (
                    <label key={loc.id} className={`flex items-center gap-3 border dark:border-slate-600 rounded-lg p-3 cursor-pointer transition ${form.location === loc.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'hover:border-gray-300'}`}>
                      <input type="radio" name="location" value={loc.id} checked={form.location === loc.id} onChange={handleChange} className="text-teal-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{loc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Residency Status</label>
                <div className="flex gap-3">
                  <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition ${form.residency === 'resident' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-slate-600'}`}>
                    <input type="radio" name="residency" value="resident" checked={form.residency === 'resident'} onChange={handleChange} className="sr-only" />
                    <p className="text-sm font-medium dark:text-gray-200">U.S. Resident / Citizen</p>
                  </label>
                  <label className={`flex-1 border rounded-lg p-3 cursor-pointer text-center transition ${form.residency === 'non-resident' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-slate-600'}`}>
                    <input type="radio" name="residency" value="non-resident" checked={form.residency === 'non-resident'} onChange={handleChange} className="sr-only" />
                    <p className="text-sm font-medium dark:text-gray-200">Non-Resident / Non-Citizen</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>· Your personal information is encrypted and secure</p>
            <p>· No fingerprint images are stored in our system</p>
            <p>· We only use your contact info for appointment coordination</p>
          </div>

          <button onClick={() => setStep(3)} disabled={!form.email || !form.phone || !form.address}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition">
            Continue →
          </button>
        </div>
      )}

      {/* Step 3: Disclaimer & Submit */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy Act Statement & Disclaimer</h2>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 space-y-3 max-h-64 overflow-y-auto">
              <p className="font-bold">PRIVACY ACT STATEMENT</p>
              <p>Authority: 28 U.S.C. § 534; 28 CFR 0.85. The FBI's acquisition, preservation, and exchange of fingerprints and associated information is authorized.</p>
              <p className="font-bold mt-2">Purpose:</p>
              <p>Fingerprints and associated information submitted to the FBI will be searched against the FBI's Integrated Automated Fingerprint Identification System (IAFIS) for purposes of comparing your fingerprints against those on file to determine any prior criminal history.</p>
              <p className="font-bold mt-2">Routine Uses:</p>
              <p>Fingerprints and associated information may be disclosed to authorized entities for law enforcement, employment, licensing, or other authorized purposes consistent with the Privacy Act of 1974 and applicable regulations.</p>
              <p className="font-bold mt-2">Disclosure:</p>
              <p>Furnishing this information is voluntary; however, failure to provide the requested information may affect the ability to process your background check.</p>
              <p className="font-bold mt-2">Non-discrimination Statement:</p>
              <p>Services are provided without regard to race, color, national origin, sex, religion, age, disability, or any other protected status.</p>

              <hr className="my-3 border-gray-200 dark:border-slate-600" />

              <p className="font-bold">FINGERPRINT CARD (FD-258) INFORMATION</p>
              <p>Your fingerprints will be captured electronically and printed onto an official FD-258 card. Completed cards can be mailed to you or directly to the requesting organization. Fingerprints can also be sent as a PDF — not electronically.</p>
              <p>If your state or agency requires a fingerprint card, we capture your fingerprints electronically and print them onto an official FD-258 card. Your completed card can be mailed to you or directly to the requesting organization.</p>

              <hr className="my-3 border-gray-200 dark:border-slate-600" />

              <p className="font-bold">DISCLAIMER</p>
              <p>By submitting this form, you acknowledge and agree that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All information provided is accurate and truthful to the best of your knowledge.</li>
                <li>You understand that fingerprints and personal information will be transmitted to the FBI and/or other authorized agencies.</li>
                <li>You are responsible for verifying whether you need fingerprinting and for providing the correct ORI and agency information.</li>
                <li>Proven LLC is not responsible for processing times, results, or decisions made by the FBI or other agencies.</li>
                <li>Biometric data is not retained after transmission to the requesting agency.</li>
                <li>All fees are non-refundable once fingerprinting service has been performed.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-4 cursor-pointer">
              <input type="checkbox" name="consentPrivacy" checked={form.consentPrivacy} onChange={handleChange} required className="mt-0.5 rounded text-teal-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">I have read and agree to the <a href="/privacy" className="text-teal-600 underline">Privacy Policy</a> and understand how my personal data will be collected, used, and transmitted.</span>
            </label>

            <label className="flex items-start gap-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-4 cursor-pointer">
              <input type="checkbox" name="consentDisclaimer" checked={form.consentDisclaimer} onChange={handleChange} required className="mt-0.5 rounded text-teal-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">I acknowledge the Privacy Act Statement and Disclaimer above. I certify that all information provided is accurate and complete.</span>
            </label>
          </div>

          <button type="submit" disabled={!form.consentPrivacy || !form.consentDisclaimer}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white py-3.5 rounded-lg font-bold transition">
            Submit Intake Form
          </button>
        </form>
      )}
    </div>
  );
}
