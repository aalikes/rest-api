import { useNavigate } from 'react-router-dom';

const steps = [
  {
    num: 1,
    title: 'Determine the Type of Apostille You Need',
    content: [
      'State-issued documents (birth certificates, marriage certificates, court documents, notarized documents) → processed by your state\'s Secretary of State.',
      'Federal documents (FBI background checks, federal court records) → processed by the U.S. Department of State, Office of Authentications in Washington, D.C.',
    ],
  },
  {
    num: 2,
    title: 'Obtain a Certified Copy of Your Document',
    content: [
      'Your document must be an original or certified copy issued by the appropriate authority.',
      'Photocopies, faxes, or unofficial copies are not accepted.',
      'For FBI background checks: submit fingerprints (FD-258 card) to the FBI CJIS Division and receive an official Identity History Summary.',
    ],
  },
  {
    num: 3,
    title: 'Submit Your Document for Authentication',
    content: [
      'For state documents: contact your state\'s Secretary of State office. Many states offer walk-in, mail-in, or online submission.',
      'For federal documents: mail to the U.S. Department of State, Office of Authentications, 600 19th Street NW, Washington, DC 20006.',
      'Include a cover letter specifying the destination country, the number of documents, and your return shipping preference.',
    ],
  },
  {
    num: 4,
    title: 'Pay the Required Fees',
    content: [
      'State-level fees vary by state (typically $2–$25 per document).',
      'Federal apostille fee: $20 per document (U.S. Department of State).',
      'Additional fees may apply for expedited or courier services.',
    ],
  },
  {
    num: 5,
    title: 'Wait for Processing',
    content: [
      'In-person / walk-in: 15 minutes to same-day service.',
      'State-level mail: 3 to 15 business days.',
      'Federal-level mail (U.S. Dept of State): approximately 3 to 5 weeks.',
      'Third-party couriers: 1 to 2 weeks (hand-delivery to speed up mail wait times).',
    ],
  },
  {
    num: 6,
    title: 'Receive Your Apostilled Document',
    content: [
      'The apostille is attached to your document as a certificate verifying its authenticity.',
      'Documents with a valid apostille are accepted in all 124+ Hague Convention member countries without further legalization.',
      'If your destination country is NOT a Hague Convention member, you may need embassy legalization instead.',
    ],
  },
];

const resources = [
  { label: 'U.S. Department of State — Apostille Requirements', url: 'https://travel.state.gov/content/travel/en/replace-certify-docs/authenticate-your-document/apostille-requirements.html' },
  { label: 'Office of Authentications — How to Request Services', url: 'https://travel.state.gov/content/travel/en/replace-certify-docs/authenticate-your-document/requesting-authentication-services.html' },
  { label: 'Contact the Office of Authentications', url: 'https://travel.state.gov/content/travel/en/contact-us/authentications.html' },
  { label: 'Hague Apostille Convention — Member Countries', url: 'https://www.hcch.net/en/instruments/conventions/status-table/?cid=41' },
];

export default function ApostilleProcess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">How to Get an Apostille</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        A step-by-step guide based on the U.S. Department of State requirements.
        An apostille authenticates U.S. public documents for use in countries that are members of the
        Hague Apostille Convention.
      </p>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.num} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {step.num}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h2>
                <ul className="mt-3 space-y-2">
                  {step.content.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timing Summary */}
      <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-300 mb-3">Processing Timeline Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-teal-700 dark:text-teal-400">Walk-in</span>
            <span className="font-medium text-teal-900 dark:text-teal-300">15 min – same day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-teal-700 dark:text-teal-400">State mail</span>
            <span className="font-medium text-teal-900 dark:text-teal-300">3 – 15 business days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-teal-700 dark:text-teal-400">Federal mail</span>
            <span className="font-medium text-teal-900 dark:text-teal-300">3 – 5 weeks</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-teal-700 dark:text-teal-400">Third-party courier</span>
            <span className="font-medium text-teal-900 dark:text-teal-300">1 – 2 weeks</span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300 mb-2">Important Notes</h3>
        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-400">
          <li>• State-issued documents are processed by your state's Secretary of State.</li>
          <li>• Federal documents (like FBI background checks) must go to the U.S. Department of State in Washington, D.C.</li>
          <li>• The apostille does not certify the content of the document — only that the signature and seal are genuine.</li>
          <li>• Some countries may require translation of the apostilled document into the local language.</li>
        </ul>
      </div>

      {/* Resources */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Official Resources</h3>
        <div className="space-y-2">
          {resources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm text-teal-600 dark:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              {r.label} →
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center bg-gray-900 dark:bg-slate-900 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-2">Let Provn Handle Your Apostille</h3>
        <p className="text-gray-400 text-sm mb-4">Skip the paperwork — we manage the entire process for you.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/apostille-order')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Start Your Apostille →
          </button>
          <a
            href="tel:+13053402911"
            className="border border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Call (305) 340-2911
          </a>
        </div>
      </div>
    </div>
  );
}
