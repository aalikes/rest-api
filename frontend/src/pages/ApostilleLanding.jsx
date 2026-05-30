import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const stats = [
  { value: '2,000+', label: 'Documents Apostilled' },
  { value: '50', label: 'States Served' },
  { value: '4.9★', label: 'Customer Rating' },
  { value: '0', label: 'Documents Lost' },
];

const testimonials = [
  {
    text: 'I needed my birth certificate apostilled for my visa application in Spain. MetroPrints handled everything in under a week. So easy!',
    name: 'Maria G.',
    location: 'Miami, FL',
    rating: 5,
  },
  {
    text: 'Got my FBI background check apostilled with Priority Processing. The entire process was seamless — they kept me updated the entire time.',
    name: 'James T.',
    location: 'Houston, TX',
    rating: 5,
  },
  {
    text: 'I was so confused about state vs federal apostille. They explained everything and got my documents done fast. Highly recommended!',
    name: 'Ana L.',
    location: 'New York, NY',
    rating: 5,
  },
];

const howItWorks = [
  {
    icon: '📄',
    title: 'Upload Your Document',
    desc: 'Upload a clear copy of your document during checkout. We accept birth certificates, FBI reports, diplomas, and more.',
  },
  {
    icon: '✅',
    title: 'We Handle the Apostille',
    desc: 'Our team submits your documents to the correct authority — U.S. Department of State or Secretary of State — and manages the entire process.',
  },
  {
    icon: '📦',
    title: 'We Ship It Back to You',
    desc: 'Your apostilled documents are shipped directly to your door with tracking. Domestic and international shipping available.',
  },
];

const serviceCards = [
  {
    icon: '🔍',
    title: 'FBI Background Check Apostille',
    desc: 'Need your FBI background check apostilled for international employment, immigration, or residency? We handle the federal apostille process through the U.S. Department of State. Most common for visa applications abroad.',
    tags: ['Federal apostille', 'U.S. Department of State'],
  },
  {
    icon: '📋',
    title: 'Birth Certificate Apostille',
    desc: "Getting married abroad or applying for dual citizenship? Your birth certificate needs a state apostille from the Secretary of State where it was issued. We manage the entire process for every state.",
    tags: ['State apostille', 'All 50 states'],
  },
  {
    icon: '💍',
    title: 'Marriage Certificate Apostille',
    desc: 'Relocating internationally or need your marriage recognized abroad? We apostille marriage certificates through the correct state authority. Fast processing for couples or a timeline.',
    tags: ['State apostille', 'Expedited available'],
  },
  {
    icon: '🏢',
    title: 'Business & Corporate Document Apostille',
    desc: 'Expanding your business internationally? We apostille Articles of Incorporation, Certificates of Good Standing, corporate resolutions, and other business documents required for international commerce.',
    tags: ['Federal & state', 'Corporate documents'],
  },
];

const benefits = [
  {
    icon: '⚠️',
    title: 'Avoid Delays & Rejections',
    desc: 'Incorrectly submitted documents get rejected. We ensure your apostille is done right the first time.',
  },
  {
    icon: '👁️',
    title: 'Handled By Professionals',
    desc: 'Our trained team has processed thousands of apostilles. Your documents are in expert hands.',
  },
  {
    icon: '⚡',
    title: 'Fast Turnaround Options',
    desc: 'Need it fast? Priority Processing gets your federal apostille done in ~10 business days instead of 5 weeks.',
  },
];

export default function ApostilleLanding() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/60" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-sm text-green-400 mb-2 flex items-center gap-2">
            <span>🏛️</span> Trusted by 2,000+ Customers Nationwide
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Fast Apostille Services<br />
            <span className="text-green-400">— Done For You</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            Skip the confusion and government hassle. We handle your entire apostille
            process — FBI background checks, birth certificates, and more — so your
            documents are accepted internationally, the first time.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
            <span>✓ Nationwide — all 50 states</span>
            <span>✓ Federal & state apostilles</span>
            <span>✓ Secure document handling</span>
            <span>✓ Priority Processing available</span>
            <span>✓ Handled correctly the first time</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/apostille-order')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
            >
              Get Your Apostille Now →
            </button>
            <a
              href="tel:+13053402911"
              className="border border-gray-400 text-gray-200 hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
            >
              📞 Call +1 (305) 340-2911
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-green-600">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="text-yellow-400 text-sm mb-2">{'★'.repeat(t.rating)}</div>
              <p className="text-sm text-gray-700 italic mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span>🔒 256-bit Encrypted uploads</span>
          <span>📦 Insured Shipping</span>
          <span>✅ 100% Acceptance Guarantee</span>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works — 3 Simple Steps</h2>
          <p className="mt-2 text-gray-600">No government offices. No confusing forms. We handle everything so you don't have to.</p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/apostille-order')}
            className="mt-10 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Start Your Apostille Order →
          </button>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Apostille Services We Offer</h2>
          <p className="mt-2 text-gray-600">Professional apostille processing for every document type. Federal and state — we handle both.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {serviceCards.map((card) => (
              <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900">{card.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Transparent Apostille Pricing</h2>
          <p className="mt-2 text-gray-600">No hidden fees. No surprises. You see exactly what you pay for.</p>
          <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* State Apostille */}
            <div className="border border-gray-200 rounded-lg p-6">
              <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
                State Apostille
              </span>
              <div className="text-4xl font-bold text-gray-900">$200</div>
              <div className="text-gray-500 text-sm">per document</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 text-left">
                <li>✓ 3-10 business days</li>
                <li>✓ All 50 states</li>
                <li>✓ Priority Processing: +$200</li>
                <li>✓ Expedited mail: +$100</li>
              </ul>
              <button
                onClick={() => navigate('/apostille-order')}
                className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Order now →
              </button>
            </div>

            {/* Federal Apostille */}
            <div className="border-2 border-green-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 right-4 flex gap-2">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  Federal Apostille
                </span>
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <div className="mt-2 text-4xl font-bold text-gray-900">$200</div>
              <div className="text-gray-500 text-sm">per document</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 text-left">
                <li>✓ 5 weeks standard</li>
                <li>✓ U.S. Department of State</li>
                <li>✓ Priority: +$200 (10 days)</li>
                <li>✓ International mail: +$100</li>
              </ul>
              <button
                onClick={() => navigate('/apostille-order')}
                className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Order now →
              </button>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-500">Additional documents: <strong>$50 each</strong></p>
          <p className="mt-2 text-sm text-green-600">💡 Most customers choose Priority Processing to avoid delays</p>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          {benefits.map((b) => (
            <div key={b.title}>
              <div className="text-2xl mb-2">{b.icon}</div>
              <h3 className="font-bold">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/apostille-order')}
            className="border border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg font-medium transition"
          >
            Get Your Apostille Now →
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <ApostilleFAQ />

      {/* CTA Footer */}
      <section className="bg-green-700 text-white py-12 px-6 text-center">
        <h2 className="text-2xl font-bold">Ready to Get Your Documents Apostilled?</h2>
        <p className="mt-2 text-green-100">Start your order in under 5 minutes. No government offices, no confusing paperwork.</p>
        <p className="mt-2 text-sm text-green-200">
          Questions? Call us at <a href="tel:+13053402911" className="underline">+1 (305) 340-2911</a>
        </p>
        <button
          onClick={() => navigate('/apostille-order')}
          className="mt-6 bg-white text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition"
        >
          Get Your Apostille Now →
        </button>
      </section>
    </div>
  );
}

function ApostilleFAQ() {
  const [open, setOpen] = useState(null);

  const questions = [
    {
      q: 'What is an apostille?',
      a: 'An apostille is a certificate issued by a designated authority that authenticates the origin of a public document. It is required for documents to be legally recognized in any of the 124 countries that are members of the Hague Apostille Convention. Without an apostille, your documents may be rejected abroad for employment, immigration, education, marriage, or business purposes.',
    },
    {
      q: 'How long does the apostille process take?',
      a: 'Processing times depend on the type of apostille. State apostilles typically take 3–10 business days depending on the issuing state. Federal apostilles through the U.S. Department of State take approximately 5 weeks with standard processing, or about 10 business days with our Priority Processing upgrade (+$200). Most customers choose Priority Processing to avoid delays.',
    },
    {
      q: 'Can you apostille an FBI background check?',
      a: 'Yes. FBI background check apostilles are one of our most requested services. Since FBI reports are federal documents, they must be apostilled by the U.S. Department of State — not by a state Secretary of State. We handle the entire process for you, including submission to the Department of State and secure return shipping.',
    },
    {
      q: 'Do I need to notarize my document before getting an apostille?',
      a: "It depends on the document type. Documents issued by a government agency (birth certificates, court orders, FBI reports) typically do not need notarization before apostille. However, private documents like personal letters, translations, or affidavits must first be notarized before they can be apostilled. We'll guide you through exactly what's needed for your specific document.",
    },
    {
      q: 'Do you offer same-day or rush apostille services?',
      a: "We offer Priority Processing for faster turnaround. Federal apostilles can be expedited to approximately 10 business days (vs. 5 weeks standard). State apostille expedited times vary by state. Select 'Priority Processing' during checkout to get your documents faster. We recommend this option for anyone with a deadline.",
    },
    {
      q: 'What documents can be apostilled?',
      a: "Most public documents can be apostilled, including: birth certificates, marriage certificates, death certificates, divorce decrees, court documents, FBI background checks, diplomas and transcripts, corporate documents (Articles of Incorporation, Certificates of Good Standing), powers of attorney, and notarized documents. If you're unsure whether your document qualifies, contact us at +1 (305) 340-2911.",
    },
    {
      q: "What's the difference between a federal and state apostille?",
      a: 'Federal apostilles are issued by the U.S. Department of State and are required for federally-issued documents like FBI background checks. State apostilles are issued by the Secretary of State in the state where the document was issued and cover documents like birth certificates, marriage licenses, notarized documents, and corporate filings. We handle both types.',
    },
    {
      q: 'How does shipping work?',
      a: 'We ship your apostilled documents directly to your address. Standard domestic shipping is included free. Expedited domestic mail is available for +$100. International shipping is available for +$100 (standard) or +$200 (expedited). All shipments include tracking information so you can monitor your documents every step of the way.',
    },
    {
      q: 'Is my document safe with you?',
      a: "Absolutely. We treat every document with the highest level of care and confidentiality. Your uploaded files are encrypted and stored securely. Original documents are handled by trained professionals and shipped back to you via trackable, insured mail. We've processed thousands of apostilles without a single lost document.",
    },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Frequently Asked Questions About Apostille Services</h2>
        <p className="mt-2 text-center text-gray-600">Everything you need to know before ordering your apostille.</p>
        <div className="mt-10 space-y-3">
          {questions.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-gray-900"
              >
                {item.q}
                <svg className={`w-5 h-5 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
