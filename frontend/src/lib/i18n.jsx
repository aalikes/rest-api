import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: { services: 'Services', faq: 'FAQ', blog: 'Blog' },
    services: {
      title: 'Our Services',
      subtitle: 'Professional fingerprinting, apostille, and FBI background check services in Miami, FL',
      fingerprint: 'Fingerprinting', fingerprintDesc: 'Professional ink and electronic fingerprint capture for all purposes.',
      perCard: 'per card', inOffice: 'In-office only', processing: '~20 min processing',
      apostille: 'Apostille', apostilleDesc: 'State and federal document authentication for international use.',
      perDoc: 'per document', stateFederal: 'State & Federal documents',
      priorityProcessing: 'Priority processing available (+$200)', expeditedMail: 'Expedited mail (+$100)',
      intlShipping: 'International shipping (+$200)',
      fbi: 'FBI Background Check', fbiDesc: 'Identity history summary (rap sheet) via FBI CJIS electronic submission.',
      resident: '+ tax (resident)', nonResident: '+ tax (non-resident)',
      residentsLabel: 'U.S. Residents / Citizens: $129', nonResidentsLabel: 'Non-Residents / Non-Citizens: $179',
      includesFingerprint: 'Includes electronic fingerprint capture',
      bundle: 'Bundle: FBI + Apostille', bundleDesc: 'Need your FBI background check apostilled for international use? Save with our combo pricing.',
      residentCitizen: 'Resident / U.S. Citizen', nonResidentCitizen: 'Non-Resident / Non-Citizen',
      visitUs: 'Visit Us', location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'All fingerprinting services are in-office only. Apostille processing available online.',
      bookNow: 'Book Now',
    },
    intake: {
      title: 'Book Appointment', subtitle: 'Fill out the form below to schedule your service.',
      service: 'Service', name: 'Full Name', email: 'Email', phone: 'Phone',
      date: 'Preferred Date', time: 'Preferred Time', notes: 'Additional Notes',
      residency: 'Residency Status', selectResidency: 'Select residency status',
      residentOption: 'U.S. Resident / Citizen', nonResidentOption: 'Non-Resident / Non-Citizen',
      submit: 'Submit Request', submitting: 'Submitting...',
      success: 'Your appointment request has been submitted! We will contact you to confirm.',
      back: '← Back to Services',
    },
    faq: { title: 'Frequently Asked Questions', subtitle: 'Find answers to common questions about our services.' },
    blog: { title: 'Blog', subtitle: 'Learn why people need our services and stay informed.', readMore: 'Read More' },
    footer: { address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137', tagline: 'Fingerprints • Apostilles • FBI Background Checks' },
    menu: {
      dashboard: 'Dashboard', apostilleServices: 'Apostille Services', clientIntake: 'Client Intake Form',
      oriCodes: 'Florida ORI Codes', walkIn: 'Walk-In Booking', signOut: 'Sign Out', staffLogin: 'Staff Login',
    },
  },
  es: {
    nav: { services: 'Servicios', faq: 'Preguntas', blog: 'Blog' },
    services: {
      title: 'Nuestros Servicios',
      subtitle: 'Servicios profesionales de huellas dactilares, apostillas y verificación de antecedentes FBI en Miami, FL',
      fingerprint: 'Huellas Dactilares', fingerprintDesc: 'Captura profesional de huellas dactilares con tinta y electrónica para todos los propósitos.',
      perCard: 'por tarjeta', inOffice: 'Solo en oficina', processing: '~20 min de procesamiento',
      apostille: 'Apostilla', apostilleDesc: 'Autenticación de documentos estatales y federales para uso internacional.',
      perDoc: 'por documento', stateFederal: 'Documentos estatales y federales',
      priorityProcessing: 'Procesamiento prioritario disponible (+$200)', expeditedMail: 'Correo acelerado (+$100)',
      intlShipping: 'Envío internacional (+$200)',
      fbi: 'Verificación de Antecedentes FBI', fbiDesc: 'Resumen de historial de identidad a través de CJIS del FBI por envío electrónico.',
      resident: '+ impuesto (residente)', nonResident: '+ impuesto (no residente)',
      residentsLabel: 'Residentes / Ciudadanos: $129', nonResidentsLabel: 'No residentes / No ciudadanos: $179',
      includesFingerprint: 'Incluye captura electrónica de huellas',
      bundle: 'Paquete: FBI + Apostilla', bundleDesc: '¿Necesita apostillar su verificación de antecedentes FBI para uso internacional? Ahorre con nuestro precio combinado.',
      residentCitizen: 'Residente / Ciudadano', nonResidentCitizen: 'No Residente / No Ciudadano',
      visitUs: 'Visítenos', location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'Todos los servicios de huellas son solo en oficina. Procesamiento de apostillas disponible en línea.',
      bookNow: 'Reservar',
    },
    intake: {
      title: 'Reservar Cita', subtitle: 'Complete el formulario a continuación para programar su servicio.',
      service: 'Servicio', name: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono',
      date: 'Fecha Preferida', time: 'Hora Preferida', notes: 'Notas Adicionales',
      residency: 'Estado de Residencia', selectResidency: 'Seleccione estado de residencia',
      residentOption: 'Residente / Ciudadano de EE.UU.', nonResidentOption: 'No Residente / No Ciudadano',
      submit: 'Enviar Solicitud', submitting: 'Enviando...',
      success: '¡Su solicitud de cita ha sido enviada! Nos comunicaremos para confirmar.',
      back: '← Volver a Servicios',
    },
    faq: { title: 'Preguntas Frecuentes', subtitle: 'Encuentre respuestas a preguntas comunes sobre nuestros servicios.' },
    blog: { title: 'Blog', subtitle: 'Aprenda por qué las personas necesitan nuestros servicios y manténgase informado.', readMore: 'Leer Más' },
    footer: { address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137', tagline: 'Huellas Dactilares • Apostillas • Verificación FBI' },
    menu: {
      dashboard: 'Panel', apostilleServices: 'Servicios de Apostilla', clientIntake: 'Formulario de Admisión',
      oriCodes: 'Códigos ORI de Florida', walkIn: 'Reserva Sin Cita', signOut: 'Cerrar Sesión', staffLogin: 'Acceso Personal',
    },
  },
  ht: {
    nav: { services: 'Sèvis', faq: 'Kesyon', blog: 'Blog' },
    services: {
      title: 'Sèvis Nou Yo',
      subtitle: 'Sèvis pwofesyonèl anprent, apostiy, ak verifikasyon antecedents FBI nan Miami, FL',
      fingerprint: 'Anprent', fingerprintDesc: 'Kaptire anprent pwofesyonèl avèk lank ak elektronik pou tout rezon.',
      perCard: 'pa kat', inOffice: 'Nan biwo sèlman', processing: '~20 min tretman',
      apostille: 'Apostiy', apostilleDesc: 'Otantifikasyon dokiman leta ak federal pou itilizasyon entènasyonal.',
      perDoc: 'pa dokiman', stateFederal: 'Dokiman Leta ak Federal',
      priorityProcessing: 'Tretman priyorite disponib (+$200)', expeditedMail: 'Lapòs akselere (+$100)',
      intlShipping: 'Livrezon entènasyonal (+$200)',
      fbi: 'Verifikasyon Antecedents FBI', fbiDesc: 'Rezime istwa idantite atravè soumisyon elektronik FBI CJIS.',
      resident: '+ taks (rezidan)', nonResident: '+ taks (non-rezidan)',
      residentsLabel: 'Rezidan / Sitwayen Ameriken: $129', nonResidentsLabel: 'Non-Rezidan / Non-Sitwayen: $179',
      includesFingerprint: 'Enkli kaptire anprent elektronik',
      bundle: 'Pakèt: FBI + Apostiy', bundleDesc: 'Ou bezwen apostiye verifikasyon antecedents FBI ou pou itilizasyon entènasyonal? Ekonomize avèk pri konbine nou.',
      residentCitizen: 'Rezidan / Sitwayen', nonResidentCitizen: 'Non-Rezidan / Non-Sitwayen',
      visitUs: 'Vizite Nou', location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'Tout sèvis anprent yo se nan biwo sèlman. Tretman apostiy disponib sou entènèt.',
      bookNow: 'Rezève Kounye a',
    },
    intake: {
      title: 'Rezève Randevou', subtitle: 'Ranpli fòm ki anba a pou pwograme sèvis ou.',
      service: 'Sèvis', name: 'Non Konplè', email: 'Imèl', phone: 'Telefòn',
      date: 'Dat Prefere', time: 'Lè Prefere', notes: 'Nòt Adisyonèl',
      residency: 'Estati Rezidans', selectResidency: 'Chwazi estati rezidans',
      residentOption: 'Rezidan / Sitwayen Ameriken', nonResidentOption: 'Non-Rezidan / Non-Sitwayen',
      submit: 'Soumèt Demann', submitting: 'Ap soumèt...',
      success: 'Demann randevou ou a soumèt! Nou pral kontakte ou pou konfime.',
      back: '← Retounen nan Sèvis',
    },
    faq: { title: 'Kesyon yo Poze Souvan', subtitle: 'Jwenn repons pou kesyon komen sou sèvis nou yo.' },
    blog: { title: 'Blog', subtitle: 'Aprann poukisa moun bezwen sèvis nou yo epi rete enfòme.', readMore: 'Li Plis' },
    footer: { address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137', tagline: 'Anprent • Apostiy • Verifikasyon FBI' },
    menu: {
      dashboard: 'Tablo', apostilleServices: 'Sèvis Apostiy', clientIntake: 'Fòm Admisyon Kliyan',
      oriCodes: 'Kòd ORI Florida', walkIn: 'Randevou San Atann', signOut: 'Dekonekte', staffLogin: 'Koneksyon Anplwaye',
    },
  },
  pt: {
    nav: { services: 'Serviços', faq: 'Perguntas', blog: 'Blog' },
    services: {
      title: 'Nossos Serviços',
      subtitle: 'Serviços profissionais de impressão digital, apostila e verificação de antecedentes FBI em Miami, FL',
      fingerprint: 'Impressão Digital', fingerprintDesc: 'Captura profissional de impressões digitais com tinta e eletrônica para todos os fins.',
      perCard: 'por cartão', inOffice: 'Somente no escritório', processing: '~20 min de processamento',
      apostille: 'Apostila', apostilleDesc: 'Autenticação de documentos estaduais e federais para uso internacional.',
      perDoc: 'por documento', stateFederal: 'Documentos estaduais e federais',
      priorityProcessing: 'Processamento prioritário disponível (+$200)', expeditedMail: 'Correio expresso (+$100)',
      intlShipping: 'Envio internacional (+$200)',
      fbi: 'Verificação de Antecedentes FBI', fbiDesc: 'Resumo do histórico de identidade via submissão eletrônica FBI CJIS.',
      resident: '+ imposto (residente)', nonResident: '+ imposto (não residente)',
      residentsLabel: 'Residentes / Cidadãos: $129', nonResidentsLabel: 'Não residentes / Não cidadãos: $179',
      includesFingerprint: 'Inclui captura eletrônica de impressões',
      bundle: 'Pacote: FBI + Apostila', bundleDesc: 'Precisa apostilar sua verificação FBI para uso internacional? Economize com nosso preço combinado.',
      residentCitizen: 'Residente / Cidadão', nonResidentCitizen: 'Não Residente / Não Cidadão',
      visitUs: 'Visite-nos', location: '2125 Biscayne Blvd Suite 303, Miami, FL 33137',
      locationNote: 'Todos os serviços de impressão digital são somente no escritório. Processamento de apostila disponível online.',
      bookNow: 'Agendar Agora',
    },
    intake: {
      title: 'Agendar Consulta', subtitle: 'Preencha o formulário abaixo para agendar seu serviço.',
      service: 'Serviço', name: 'Nome Completo', email: 'E-mail', phone: 'Telefone',
      date: 'Data Preferida', time: 'Horário Preferido', notes: 'Notas Adicionais',
      residency: 'Status de Residência', selectResidency: 'Selecione status de residência',
      residentOption: 'Residente / Cidadão dos EUA', nonResidentOption: 'Não Residente / Não Cidadão',
      submit: 'Enviar Solicitação', submitting: 'Enviando...',
      success: 'Sua solicitação de consulta foi enviada! Entraremos em contato para confirmar.',
      back: '← Voltar aos Serviços',
    },
    faq: { title: 'Perguntas Frequentes', subtitle: 'Encontre respostas para perguntas comuns sobre nossos serviços.' },
    blog: { title: 'Blog', subtitle: 'Saiba por que as pessoas precisam de nossos serviços e mantenha-se informado.', readMore: 'Leia Mais' },
    footer: { address: '2125 Biscayne Blvd Suite 303, Miami, FL 33137', tagline: 'Impressões Digitais • Apostilas • Verificação FBI' },
    menu: {
      dashboard: 'Painel', apostilleServices: 'Serviços de Apostila', clientIntake: 'Formulário de Admissão',
      oriCodes: 'Códigos ORI da Flórida', walkIn: 'Reserva Imediata', signOut: 'Sair', staffLogin: 'Login de Funcionários',
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
