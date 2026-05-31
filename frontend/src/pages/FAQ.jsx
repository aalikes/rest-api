import { useState } from 'react';
import { useI18n } from '../lib/i18n';

const faqs = {
  en: [
    {
      q: 'What do I need to bring for fingerprinting?',
      a: 'Bring a valid government-issued photo ID (passport, driver\'s license, or state ID). No appointment is strictly necessary, but scheduling ensures minimal wait time.',
    },
    {
      q: 'How long does the fingerprinting process take?',
      a: 'The entire process takes approximately 15-20 minutes, including registration and capture. Electronic submissions are sent immediately to the requesting agency.',
    },
    {
      q: 'What is an apostille and why do I need one?',
      a: 'An apostille is a certificate that authenticates the origin of a public document (birth certificate, court order, diploma, etc.) for use in another country. If you\'re moving abroad, getting married internationally, or conducting business overseas, you likely need one.',
    },
    {
      q: 'How long does the apostille process take?',
      a: 'An apostille takes anywhere from 15 minutes to 5+ weeks, depending on the issuing authority, document type, and submission method: In-Person/Walk-in: 15 minutes to same-day (if your state office allows walk-ins). State-Level Mail: 3–15 business days. Federal-Level Mail (U.S. Dept of State): ~3–5 weeks. Third-Party Couriers: 1–2 weeks.',
    },
    {
      q: 'What documents can be apostilled?',
      a: 'Common documents include birth certificates, marriage certificates, divorce decrees, court orders, diplomas, transcripts, FBI background checks, corporate documents, and powers of attorney.',
    },
    {
      q: 'What is the difference between state and federal apostille?',
      a: 'State apostilles authenticate documents issued by state authorities (birth certificates, marriage licenses). Federal apostilles authenticate documents issued by federal agencies (FBI reports, federal court documents).',
    },
    {
      q: 'Why would I need an FBI background check?',
      a: 'FBI background checks are commonly required for immigration and visa applications, international adoption, employment in sensitive positions, professional licensing, and living or working abroad.',
    },
    {
      q: 'What\'s the difference in pricing for residents vs. non-residents?',
      a: 'U.S. residents and citizens pay $129 + tax. Non-residents and non-citizens pay $179 + tax due to additional verification requirements.',
    },
    {
      q: 'Can I get my FBI background check apostilled?',
      a: 'Yes! We offer a combo package: FBI background check + federal apostille for $329 (residents) or $379 (non-residents). This is the most common request for people moving abroad.',
    },
    {
      q: 'Do you offer walk-in services?',
      a: 'Yes, we accept walk-ins for fingerprinting services during business hours. However, we recommend booking an appointment to guarantee availability and minimize wait times.',
    },
    {
      q: 'What forms of payment do you accept?',
      a: 'We accept all major credit cards, debit cards, and cash. Payment is due at the time of service.',
    },
    {
      q: 'Where are you located?',
      a: '2125 Biscayne Blvd Suite 336, Miami, FL 33137. We are conveniently located in the Edgewater neighborhood with easy access from I-95 and plenty of nearby parking.',
    },
    {
      q: 'Can I mail in my fingerprints or get them as a PDF?',
      a: 'Yes! If your state or agency requires a fingerprint card, we capture your fingerprints electronically and print them onto an official FD-258 card. Your completed card can be mailed to you or directly to the requesting organization. We can also provide fingerprints as a PDF file — not electronically transmitted, but as a document you can print or forward as needed.',
    },
    {
      q: 'What is an ORI number and do I need one?',
      a: 'An ORI (Originating Agency Identifier) is a code assigned to organizations authorized to submit fingerprints for background checks. If your employer or licensing agency requires a background check, ask them for the ORI code — it helps expedite processing and ensures results go to the right place.',
    },
    {
      q: 'What is an FD-258 fingerprint card?',
      a: 'The FD-258 is the standard fingerprint card used by the FBI and other federal agencies. It includes fields for personal information, physical descriptors, reason for fingerprinting, and ten rolled fingerprint impressions. We capture fingerprints electronically and print them onto official FD-258 cards.',
    },
    {
      q: 'Do I need a state or federal apostille?',
      a: 'State-issued documents (birth certificates, marriage licenses, court documents) are processed by your state\'s Secretary of State. Federal documents (like FBI background checks) must go to the U.S. Department of State in Washington, D.C. We handle both types.',
    },
    {
      q: 'Is my personal information safe during the FBI background check?',
      a: 'Yes. We follow strict privacy protocols. Your personal information is encrypted during transmission. No fingerprint images are stored in our system after submission. We comply with the Privacy Act of 1974 and all applicable federal regulations regarding biometric data.',
    },
    {
      q: 'What countries accept apostilled documents?',
      a: 'Over 124 countries that are members of the Hague Apostille Convention accept apostilled documents. This includes most of Europe, South America, Japan, South Korea, Australia, and many more. Contact us or check our Consulate Directory for country-specific requirements.',
    },
  ],
  es: [
    {
      q: '¿Qué necesito traer para la toma de huellas dactilares?',
      a: 'Traiga una identificación con foto válida emitida por el gobierno (pasaporte, licencia de conducir o identificación estatal). No es estrictamente necesaria una cita, pero programar una asegura un tiempo mínimo de espera.',
    },
    {
      q: '¿Cuánto tiempo toma el proceso de huellas dactilares?',
      a: 'Todo el proceso toma aproximadamente 15-20 minutos, incluyendo registro y captura. Las presentaciones electrónicas se envían inmediatamente a la agencia solicitante.',
    },
    {
      q: '¿Qué es una apostilla y por qué la necesito?',
      a: 'Una apostilla es un certificado que autentica el origen de un documento público (acta de nacimiento, orden judicial, diploma, etc.) para su uso en otro país. Si se muda al extranjero, se casa internacionalmente o realiza negocios en el exterior, probablemente necesite una.',
    },
    {
      q: '¿Cuánto tiempo toma el proceso de apostilla?',
      a: 'Una apostilla toma entre 15 minutos y más de 5 semanas, dependiendo de la autoridad emisora: En persona: 15 minutos. Correo estatal: 3–15 días hábiles. Correo federal: 3–5 semanas. Servicio de mensajería: 1–2 semanas.',
    },
    {
      q: '¿Qué documentos se pueden apostillar?',
      a: 'Los documentos comunes incluyen actas de nacimiento, certificados de matrimonio, decretos de divorcio, órdenes judiciales, diplomas, transcripciones, verificaciones FBI, documentos corporativos y poderes notariales.',
    },
    {
      q: '¿Cuál es la diferencia entre apostilla estatal y federal?',
      a: 'Las apostillas estatales autentican documentos emitidos por autoridades estatales (actas de nacimiento, licencias matrimoniales). Las apostillas federales autentican documentos emitidos por agencias federales (informes FBI, documentos de tribunales federales).',
    },
    {
      q: '¿Por qué necesitaría una verificación de antecedentes FBI?',
      a: 'Las verificaciones FBI son comúnmente requeridas para solicitudes de inmigración y visa, adopción internacional, empleo en posiciones sensibles, licencias profesionales y vivir o trabajar en el extranjero.',
    },
    {
      q: '¿Cuál es la diferencia de precio entre residentes y no residentes?',
      a: 'Los residentes y ciudadanos de EE.UU. pagan $129 + impuesto. Los no residentes y no ciudadanos pagan $179 + impuesto debido a requisitos adicionales de verificación.',
    },
    {
      q: '¿Puedo apostillar mi verificación de antecedentes FBI?',
      a: '¡Sí! Ofrecemos un paquete combinado: verificación FBI + apostilla federal por $329 (residentes) o $379 (no residentes). Esta es la solicitud más común para personas que se mudan al extranjero.',
    },
    {
      q: '¿Aceptan servicio sin cita?',
      a: 'Sí, aceptamos visitas sin cita para servicios de huellas dactilares durante el horario comercial. Sin embargo, recomendamos reservar una cita para garantizar disponibilidad.',
    },
    {
      q: '¿Qué formas de pago aceptan?',
      a: 'Aceptamos todas las tarjetas de crédito principales, tarjetas de débito y efectivo. El pago se realiza al momento del servicio.',
    },
    {
      q: '¿Dónde están ubicados?',
      a: '2125 Biscayne Blvd Suite 336, Miami, FL 33137. Estamos convenientemente ubicados en el vecindario de Edgewater con fácil acceso desde la I-95 y mucho estacionamiento cercano.',
    },
  ],
};

export default function FAQ() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(null);
  const items = faqs[lang] || faqs.en;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.faq.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t.faq.subtitle}</p>
      </div>

      {/* Help Banner */}
      <div className="mb-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          <p className="text-sm font-medium text-teal-800 dark:text-teal-300">Need help? Call us at <a href="tel:+13053402911" className="underline">(305) 340-2911</a></p>
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">Or email <a href="mailto:info@provn.co" className="underline">info@provn.co</a> — we respond within 2 business hours.</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              <span className="font-medium text-gray-900 dark:text-white pr-4">{item.q}</span>
              <span className="text-gray-400 text-xl flex-shrink-0">
                {open === i ? '−' : '+'}
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-100 dark:border-slate-600 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
