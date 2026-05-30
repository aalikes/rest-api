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
      a: 'Standard processing takes 5-7 business days. Priority processing (additional $200) reduces this to 2-3 business days. Expedited mail options are also available.',
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
      a: '2125 Biscayne Blvd Suite 303, Miami, FL 33137. We are conveniently located in the Edgewater neighborhood with easy access from I-95 and plenty of nearby parking.',
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
      a: 'El procesamiento estándar toma 5-7 días hábiles. El procesamiento prioritario (adicional $200) reduce esto a 2-3 días hábiles. También hay opciones de correo acelerado disponibles.',
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
      a: '2125 Biscayne Blvd Suite 303, Miami, FL 33137. Estamos convenientemente ubicados en el vecindario de Edgewater con fácil acceso desde la I-95 y mucho estacionamiento cercano.',
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
        <h1 className="text-3xl font-bold text-gray-900">{t.faq.title}</h1>
        <p className="mt-2 text-gray-600">{t.faq.subtitle}</p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-900 pr-4">{item.q}</span>
              <span className="text-gray-400 text-xl flex-shrink-0">
                {open === i ? '−' : '+'}
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
