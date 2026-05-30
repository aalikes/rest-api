import { useState } from 'react';
import { useI18n } from '../lib/i18n';

const articles = {
  en: [
    {
      id: 1,
      title: 'Why You Need an Apostille for Moving Abroad',
      excerpt: 'Planning to relocate internationally? Here\'s why apostilled documents are essential for your move and what you need to prepare.',
      body: `Moving to another country is exciting, but it comes with a mountain of paperwork. One of the most critical steps many people overlook is getting their documents apostilled.

An apostille is an international certification that verifies the authenticity of public documents. Under the Hague Convention of 1961, member countries recognize apostilles as proof that a document is legitimate.

**When do you need an apostille?**

- Applying for a work visa or residence permit
- Enrolling in a foreign university
- Getting married abroad
- Starting a business in another country
- Transferring professional licenses

**Common documents that need apostilling:**

- Birth certificates
- Marriage certificates
- FBI background checks
- Academic diplomas and transcripts
- Corporate documents (articles of incorporation, etc.)

**The process:** You can't simply take your documents to the destination country. First, they must be authenticated by the issuing authority (state or federal), then apostilled. State-issued documents go through the Secretary of State; federal documents go through the U.S. Department of State.

At Provn, we handle the entire process for you — from document review to apostille procurement to international shipping. Standard processing takes 5-7 business days, with priority options available.`,
      date: '2026-05-15',
      category: 'Apostille',
    },
    {
      id: 2,
      title: 'FBI Background Checks: Who Needs Them and Why',
      excerpt: 'From immigration to employment, FBI background checks are required more often than you think. Learn who needs one and how to get it done quickly.',
      body: `An FBI Identity History Summary — commonly called an FBI background check — is a comprehensive record of your interactions with law enforcement agencies across the United States.

**Who needs an FBI background check?**

1. **Immigration applicants** — Nearly every country requires a police clearance from your home country when you apply for long-term residency. The FBI background check is the U.S. equivalent.

2. **International adoption** — Both U.S. and foreign authorities require FBI checks for prospective adoptive parents.

3. **Employment** — Government positions, defense contractors, financial institutions, and childcare organizations often require FBI clearance.

4. **Professional licensing** — Healthcare workers, attorneys, and educators moving between states or countries may need FBI verification.

5. **Visa renewals** — Many countries require updated background checks every few years for residence permit renewals.

**The process:**

FBI background checks require electronic fingerprint submission through an approved channeler. Here's how it works:

1. Visit our office for electronic fingerprint capture (~20 minutes)
2. We submit your prints electronically to the FBI
3. Results typically arrive within 3-5 business days
4. If needed, we can apostille the results for international use

**Resident vs. Non-Resident pricing:**

- U.S. Residents/Citizens: $129 + tax
- Non-Residents/Non-Citizens: $179 + tax (additional verification required)

The most popular package is our FBI + Apostille combo ($329/$379), which covers everything needed for international use in one visit.`,
      date: '2026-05-10',
      category: 'FBI',
    },
    {
      id: 3,
      title: 'Fingerprinting 101: What to Expect at Your Appointment',
      excerpt: 'Never been fingerprinted before? Here\'s everything you need to know about the process, what to bring, and how to prepare.',
      body: `Whether you need fingerprints for a background check, professional license, or government application, the process is quick and straightforward.

**What to bring:**

- A valid government-issued photo ID (driver's license, passport, or state ID)
- Any paperwork or forms from the requesting agency
- Payment (credit card, debit card, or cash)

**What to expect:**

1. **Check-in** — Our staff will verify your identity and collect any required forms.
2. **Fingerprint capture** — We use electronic (livescan) technology that captures your prints digitally. This is cleaner and more accurate than traditional ink methods.
3. **Quality check** — Our technician verifies print quality before submission.
4. **Submission** — Prints are transmitted electronically to the appropriate agency.

**Tips for a successful appointment:**

- Keep your hands clean and dry
- Avoid using lotion on the day of your appointment
- Don't worry about small cuts or dry skin — our technicians are experienced with all conditions
- If you have naturally faint prints (common with age), we have techniques to improve capture quality

**How long does it take?**

The entire appointment typically takes 15-20 minutes. Electronic results are submitted immediately. For ink cards, we prepare them the same day.

**Walk-ins welcome** — While appointments are preferred, we accept walk-ins during business hours. Visit us at 2125 Biscayne Blvd Suite 303, Miami.`,
      date: '2026-05-05',
      category: 'Fingerprinting',
    },
    {
      id: 4,
      title: 'State vs. Federal Apostille: Understanding the Difference',
      excerpt: 'Not all apostilles are the same. Learn the difference between state and federal apostilles and which one your documents require.',
      body: `One of the most common questions we hear is "What type of apostille do I need?" The answer depends on who issued your document.

**State Apostille:**

A state apostille is issued by the Secretary of State in the state where the document was created. You need a state apostille for:

- Birth certificates
- Marriage certificates
- Divorce decrees
- Notarized documents
- State court orders
- Academic transcripts from state universities
- Business documents filed with the state

Each state has its own Secretary of State office that handles apostilles. If your document was issued in Florida, you need a Florida state apostille.

**Federal Apostille:**

A federal apostille is issued by the U.S. Department of State in Washington, D.C. You need a federal apostille for:

- FBI background checks
- Federal court documents
- Documents signed by a federal official
- Patent and trademark documents
- Documents certified by a federal agency

**Key differences:**

| Feature | State | Federal |
|---------|-------|---------|
| Issuing authority | Secretary of State | U.S. Dept. of State |
| Processing time | 3-7 days | 5-10 days |
| Document types | State-issued | Federal-issued |
| Location | State capital | Washington, D.C. |

**Common mistakes to avoid:**

- Don't send a state document to the federal office (or vice versa)
- Ensure your document is a certified copy, not a photocopy
- Some documents need notarization before apostille
- County-issued documents may need state certification first

At Provn, we determine the correct apostille path for your documents and handle the entire process, so you don't have to worry about routing errors or delays.`,
      date: '2026-04-28',
      category: 'Apostille',
    },
    {
      id: 5,
      title: 'Moving to Another Country? Your Complete Document Checklist',
      excerpt: 'A comprehensive checklist of documents you\'ll need authenticated before your international move — don\'t leave anything behind.',
      body: `Relocating to another country requires extensive document preparation. Missing even one authenticated document can delay your visa or residence permit by weeks or months.

**Essential documents for most international moves:**

☐ Birth certificate (apostilled)
☐ Marriage certificate (if applicable, apostilled)
☐ FBI background check (apostilled)
☐ Academic diplomas and transcripts (apostilled)
☐ Professional licenses (apostilled)
☐ Medical records (may need translation + apostille)
☐ Driver's license (for conversion in destination country)
☐ Financial statements (some countries require proof of funds)

**Country-specific requirements:**

Different countries have different requirements. Here are some common ones:

**Europe (Schengen countries):**
- FBI check apostilled and translated into local language
- Birth certificate apostilled
- Proof of health insurance
- Financial means documentation

**Latin America:**
- All civil documents apostilled
- FBI check apostilled
- Professional degree apostilled (for work visas)
- Documents may need sworn translation

**Middle East:**
- Documents often need embassy attestation AFTER apostille
- Additional authentication steps may apply
- Some countries require document legalization instead

**Timeline to prepare:**

We recommend starting the document authentication process at least 8-12 weeks before your planned move date:

- Week 1-2: Gather all original documents
- Week 2-3: Order certified copies if needed
- Week 3-5: Submit for apostille processing
- Week 5-7: Arrange translations if required
- Week 7-8: Final review and shipping

**Pro tip:** Some documents expire. FBI background checks are typically valid for 6-12 months depending on the requesting country. Time your apostille accordingly.

At Provn, we offer a complete relocation document package. We'll review your destination country's requirements and handle all apostilles, so you can focus on your move.`,
      date: '2026-04-20',
      category: 'General',
    },
  ],
  es: [
    {
      id: 1,
      title: 'Por Qué Necesita una Apostilla para Mudarse al Extranjero',
      excerpt: '¿Planea reubicarse internacionalmente? Aquí está por qué los documentos apostillados son esenciales para su mudanza.',
      body: 'Mudarse a otro país es emocionante, pero viene con una montaña de trámites. Uno de los pasos más críticos que muchas personas pasan por alto es apostillar sus documentos.\n\nUna apostilla es una certificación internacional que verifica la autenticidad de documentos públicos. Bajo la Convención de La Haya de 1961, los países miembros reconocen las apostillas como prueba de que un documento es legítimo.\n\nEn Provn, manejamos todo el proceso por usted — desde la revisión de documentos hasta la obtención de la apostilla y el envío internacional.',
      date: '2026-05-15',
      category: 'Apostilla',
    },
    {
      id: 2,
      title: 'Verificaciones FBI: Quién las Necesita y Por Qué',
      excerpt: 'Desde inmigración hasta empleo, las verificaciones FBI se requieren más a menudo de lo que piensa.',
      body: 'Un Resumen de Historial de Identidad del FBI es un registro completo de sus interacciones con agencias policiales en todo Estados Unidos.\n\nSe necesita para: solicitudes de inmigración, adopción internacional, empleo gubernamental, licencias profesionales y renovaciones de visa.\n\nEl proceso requiere la presentación electrónica de huellas dactilares. Visite nuestra oficina para la captura (~20 minutos), enviamos electrónicamente al FBI, y los resultados llegan en 3-5 días hábiles.',
      date: '2026-05-10',
      category: 'FBI',
    },
    {
      id: 3,
      title: 'Huellas Dactilares 101: Qué Esperar en Su Cita',
      excerpt: '¿Nunca le han tomado huellas? Aquí tiene todo lo que necesita saber sobre el proceso.',
      body: 'Ya sea que necesite huellas para una verificación de antecedentes, licencia profesional o solicitud gubernamental, el proceso es rápido y sencillo.\n\nQué traer: identificación con foto válida, cualquier formulario de la agencia solicitante, y forma de pago.\n\nEl proceso toma aproximadamente 15-20 minutos. Usamos tecnología electrónica (livescan) que captura sus huellas digitalmente.',
      date: '2026-05-05',
      category: 'Huellas',
    },
    {
      id: 4,
      title: 'Apostilla Estatal vs. Federal: Entendiendo la Diferencia',
      excerpt: 'No todas las apostillas son iguales. Aprenda la diferencia y cuál necesitan sus documentos.',
      body: 'La apostilla estatal es emitida por el Secretario de Estado del estado donde se creó el documento. La apostilla federal es emitida por el Departamento de Estado de EE.UU. en Washington, D.C.\n\nNecesita apostilla estatal para: actas de nacimiento, certificados de matrimonio, decretos de divorcio, documentos notarizados.\n\nNecesita apostilla federal para: verificaciones FBI, documentos de tribunales federales, documentos firmados por un oficial federal.',
      date: '2026-04-28',
      category: 'Apostilla',
    },
    {
      id: 5,
      title: '¿Se Muda a Otro País? Su Lista Completa de Documentos',
      excerpt: 'Una lista completa de documentos que necesitará autenticar antes de su mudanza internacional.',
      body: 'Reubicarse a otro país requiere una extensa preparación de documentos. Faltar incluso un documento autenticado puede retrasar su visa semanas o meses.\n\nDocumentos esenciales: acta de nacimiento apostillada, certificado de matrimonio, verificación FBI apostillada, diplomas académicos, licencias profesionales, registros médicos.\n\nRecomendamos comenzar el proceso de autenticación al menos 8-12 semanas antes de su fecha de mudanza planificada.',
      date: '2026-04-20',
      category: 'General',
    },
  ],
};

export default function Blog() {
  const { lang, t } = useI18n();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const posts = articles[lang] || articles.en;

  if (selectedArticle) {
    const article = posts.find((a) => a.id === selectedArticle);
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedArticle(null)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-6 inline-block"
        >
          ← {t.blog.title}
        </button>
        <article>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
              {article.category}
            </span>
            <span className="text-xs text-gray-500">{article.date}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {article.body}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{t.blog.title}</h1>
        <p className="mt-2 text-gray-600">{t.blog.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition cursor-pointer"
            onClick={() => setSelectedArticle(article.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                {article.category}
              </span>
              <span className="text-xs text-gray-500">{article.date}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{article.excerpt}</p>
            <span className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              {t.blog.readMore} →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
