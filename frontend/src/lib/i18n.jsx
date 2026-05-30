import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: {
      services: 'Services',
      faq: 'FAQ',
      blog: 'Blog',
    },
    services: {
      title: 'Our Services',
      subtitle: 'Professional fingerprinting, apostille, and FBI background check services in Miami, FL',
      fingerprint: 'Fingerprinting',
      fingerprintDesc: 'Professional ink and electronic fingerprint capture for all purposes.',
      perCard: 'per card',
      inOffice: 'In-office only',
      processing: '~20 min processing',
      apostille: 'Apostille',
      apostilleDesc: 'State and federal document authentication for international use.',
      perDoc: 'per document',
      stateFederal: 'State & Federal documents',
      priorityProcessing: 'Priority processing available (+$200)',
      expeditedMail: 'Expedited mail (+$100)',
      intlShipping: 'International shipping (+$200)',
      fbi: 'FBI Background Check',
      fbiDesc: 'Identity history summary (rap sheet) via FBI CJIS electronic submission.',
      resident: '+ tax (resident)',
      nonResident: '+ tax (non-resident)',
      residentsLabel: 'U.S. Residents / Citizens: $129',
      nonResidentsLabel: 'Non-Residents / Non-Citizens: $179',
      includesFingerprint: 'Includes electronic fingerprint capture',
      bundle: 'Bundle: FBI + Apostille',
      bundleDesc: 'Need your FBI background check apostilled for international use? Save with our combo pricing.',
      residentCitizen: 'Resident / U.S. Citizen',
      nonResidentCitizen: 'Non-Resident / Non-Citizen',
      visitUs: 'Visit Us',
      location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'All fingerprinting services are in-office only. Apostille processing available online.',
      bookNow: 'Book Now',
    },
    intake: {
      title: 'Book Appointment',
      subtitle: 'Fill out the form below to schedule your service.',
      service: 'Service',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Preferred Date',
      time: 'Preferred Time',
      notes: 'Additional Notes',
      residency: 'Residency Status',
      selectResidency: 'Select residency status',
      residentOption: 'U.S. Resident / Citizen',
      nonResidentOption: 'Non-Resident / Non-Citizen',
      submit: 'Submit Request',
      submitting: 'Submitting...',
      success: 'Your appointment request has been submitted! We will contact you to confirm.',
      back: '← Back to Services',
    },
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Find answers to common questions about our services.',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Learn why people need our services and stay informed.',
      readMore: 'Read More',
    },
    footer: {
      address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      tagline: 'Fingerprints • Apostilles • FBI Background Checks',
    },
  },
  es: {
    nav: {
      services: 'Servicios',
      faq: 'Preguntas',
      blog: 'Blog',
    },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Servicios profesionales de huellas dactilares, apostillas y verificación de antecedentes FBI en Miami, FL',
      fingerprint: 'Huellas Dactilares',
      fingerprintDesc: 'Captura profesional de huellas dactilares con tinta y electrónica para todos los propósitos.',
      perCard: 'por tarjeta',
      inOffice: 'Solo en oficina',
      processing: '~20 min de procesamiento',
      apostille: 'Apostilla',
      apostilleDesc: 'Autenticación de documentos estatales y federales para uso internacional.',
      perDoc: 'por documento',
      stateFederal: 'Documentos estatales y federales',
      priorityProcessing: 'Procesamiento prioritario disponible (+$200)',
      expeditedMail: 'Correo acelerado (+$100)',
      intlShipping: 'Envío internacional (+$200)',
      fbi: 'Verificación de Antecedentes FBI',
      fbiDesc: 'Resumen de historial de identidad a través de CJIS del FBI por envío electrónico.',
      resident: '+ impuesto (residente)',
      nonResident: '+ impuesto (no residente)',
      residentsLabel: 'Residentes / Ciudadanos: $129',
      nonResidentsLabel: 'No residentes / No ciudadanos: $179',
      includesFingerprint: 'Incluye captura electrónica de huellas',
      bundle: 'Paquete: FBI + Apostilla',
      bundleDesc: '¿Necesita apostillar su verificación de antecedentes FBI para uso internacional? Ahorre con nuestro precio combinado.',
      residentCitizen: 'Residente / Ciudadano',
      nonResidentCitizen: 'No Residente / No Ciudadano',
      visitUs: 'Visítenos',
      location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'Todos los servicios de huellas son solo en oficina. Procesamiento de apostillas disponible en línea.',
      bookNow: 'Reservar',
    },
    intake: {
      title: 'Reservar Cita',
      subtitle: 'Complete el formulario a continuación para programar su servicio.',
      service: 'Servicio',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      date: 'Fecha Preferida',
      time: 'Hora Preferida',
      notes: 'Notas Adicionales',
      residency: 'Estado de Residencia',
      selectResidency: 'Seleccione estado de residencia',
      residentOption: 'Residente / Ciudadano de EE.UU.',
      nonResidentOption: 'No Residente / No Ciudadano',
      submit: 'Enviar Solicitud',
      submitting: 'Enviando...',
      success: '¡Su solicitud de cita ha sido enviada! Nos comunicaremos para confirmar.',
      back: '← Volver a Servicios',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Encuentre respuestas a preguntas comunes sobre nuestros servicios.',
    },
    blog: {
      title: 'Blog',
      subtitle: 'Aprenda por qué las personas necesitan nuestros servicios y manténgase informado.',
      readMore: 'Leer Más',
    },
    footer: {
      address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      tagline: 'Huellas Dactilares • Apostillas • Verificación FBI',
    },
  },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('provn-lang') || 'en');

  function setLanguage(l) {
    setLang(l);
    localStorage.setItem('provn-lang', l);
  }

  const t = translations[lang] || translations.en;

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
