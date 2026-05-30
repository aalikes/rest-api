import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          ← Back to Home
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 mb-8">
        <p className="font-bold text-gray-900">Provn LLC – Fingerprinting & Apostille Services</p>
        <p className="text-sm text-gray-500">Effective Date: August 25, 2025</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900">1. Introduction</h2>
          <p className="text-gray-700">
            Provn LLC ("Company," "we," "our," or "us") values your privacy and is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, store, and share information when you use our fingerprinting and apostille services.
          </p>
          <p className="text-gray-700">By using our services, you agree to the terms of this Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
          <p className="text-gray-700">We may collect the following types of information:</p>
          <p className="text-gray-700">
            <strong>Personal Identification Information:</strong> Full name, date of birth, Social Security Number (when required), address, phone number, email, and government-issued ID details.
          </p>
          <p className="text-gray-700">
            <strong>Biometric Data:</strong> Fingerprints collected for submission to authorized agencies (FDLE, FBI, or other approved organizations).
          </p>
          <p className="text-gray-700">
            <strong>Payment Information:</strong> Billing details necessary to process payments. We do not store full credit card numbers.
          </p>
          <p className="text-gray-700">
            <strong>Technical Data:</strong> Appointment details, service location, and related operational information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">3. How We Use Your Information</h2>
          <p className="text-gray-700">
            We use your information for the following purposes: to capture, process, and transmit fingerprints as required by state or federal agencies;
            to verify your identity and ensure compliance with legal requirements; to provide receipts, confirmations, and customer support;
            to process payments for services rendered; and to improve our services and maintain accurate business records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">4. Disclosure of Information</h2>
          <p className="text-gray-700">
            We do not sell or rent your personal information. <strong>Mobile phone contact information will not be shared or sold to third parties for marketing purposes.</strong> We only share information as follows:
          </p>
          <p className="text-gray-700">
            <strong>Authorized Agencies:</strong> Fingerprints and personal data are transmitted directly to FDLE, FBI, or other authorized requesting agencies.
          </p>
          <p className="text-gray-700">
            <strong>Service Providers:</strong> Third-party payment processors may receive necessary billing information.
          </p>
          <p className="text-gray-700">
            <strong>Legal Compliance:</strong> We may disclose information if required by law, court order, or government request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">5. Data Storage & Security</h2>
          <p className="text-gray-700">
            Fingerprint data is collected and transmitted through secure, encrypted systems approved by FDLE/FBI.
            We do not retain fingerprint images after transmission. Personal data is stored only as long as necessary to fulfill service obligations and legal requirements.
            Access to client data is restricted to authorized personnel only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">6. Your Rights</h2>
          <p className="text-gray-700">
            As a client, you have the right to: request a copy of the information we maintain about you (excluding data controlled by FDLE/FBI once submitted),
            correct or update inaccurate personal information in our records, and request clarification on how your data is being used.
          </p>
          <p className="text-gray-700">To exercise these rights, contact us at info@provn.co.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">7. Children's Privacy</h2>
          <p className="text-gray-700">Our services are not directed to individuals under the age of 18 without parental or guardian consent.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">8. Retention of Information</h2>
          <p className="text-gray-700">
            Biometric fingerprint data is not stored beyond the submission process. Transaction and appointment records may be retained for business and compliance purposes in accordance with Florida law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">9. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. The updated version will be posted with a revised effective date.
            Continued use of our services after changes indicates acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">10. SMS & Text Message Communications</h2>
          <p className="text-gray-700">
            <strong>Collection and Use of Phone Numbers:</strong> We collect mobile phone numbers to provide appointment confirmations, service updates, and status notifications via SMS text messages.
          </p>
          <p className="text-gray-700">
            <strong>Consent and Frequency:</strong> By providing your phone number and consenting to receive text messages, you agree to receive recurring automated messages from Provn LLC. Message frequency varies based on appointment activity and service updates.
          </p>
          <p className="text-gray-700">
            <strong>Opt-Out and Help:</strong> You may opt out of text messages at any time by replying STOP to any message or contacting us directly. Reply HELP for assistance. Consent to receive text messages is not a condition of purchasing our services.
          </p>
          <p className="text-gray-700">
            <strong>Carrier Charges:</strong> Standard message and data rates may apply according to your mobile carrier's plan. We are not responsible for these charges.
          </p>
          <p className="text-gray-700">
            <strong>Third-Party Services:</strong> We use Twilio and other compliant messaging services to deliver SMS communications in accordance with TCPA regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">11. Contact Information</h2>
          <p className="text-gray-700">If you have any questions or concerns regarding this Privacy Policy, please contact:</p>
          <div className="bg-gray-50 rounded-lg p-4 mt-2 text-sm text-gray-700">
            <p className="font-medium">Provn LLC</p>
            <p>2125 Biscayne Blvd, Suite 303</p>
            <p>Miami, FL 33137</p>
            <p>Phone: +1 (305) 340-2911</p>
            <p>Email: info@provn.co</p>
          </div>
        </section>
      </div>
    </div>
  );
}
