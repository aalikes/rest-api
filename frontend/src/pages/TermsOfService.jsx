import { useNavigate } from 'react-router-dom';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          ← Back to Home
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-5 mb-8">
        <p className="font-bold text-gray-900">Provn LLC – Fingerprinting & Apostille Services</p>
        <p className="text-sm text-gray-500">Effective Date: 8.25.2026</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By scheduling, purchasing, or receiving fingerprinting services from Provn LLC ("Company," "we," "our," or "us"),
            you ("Client" or "you") agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">2. Services Provided</h2>
          <p className="text-gray-700">
            We provide fingerprint capture services for purposes including, but not limited to: background checks (FDLE, FBI, or other authorized agencies),
            employment or licensing requirements, professional certifications, and other lawful purposes requiring fingerprinting.
          </p>
          <p className="text-gray-700">
            We are not responsible for determining whether you are required to be fingerprinted; it is your responsibility to verify requirements with the requesting agency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">3. Service Area & Appointments</h2>
          <p className="text-gray-700">
            Services are provided at our office location at 2125 Biscayne Blvd Suite 303, Miami, FL 33137.
            Appointment times are approximate; unforeseen delays (traffic, technical issues, etc.) may occur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">4. Client Responsibilities</h2>
          <p className="text-gray-700">
            Provide accurate personal information and government-issued photo identification at the time of service.
            Ensure that the requested agency's ORI number or submission details are correct.
            We are not liable for rejected submissions caused by client error. Maintain proper conduct during the service appointment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">5. Fees & Payment</h2>
          <p className="text-gray-700">
            Payment is due at the time of booking or service. Fees may include: fingerprinting service fee, government submission fee, and shipping fee.
            All sales are final. Refunds are only provided if we are unable to perform the service due to our error.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">6. Rejections & Resubmissions</h2>
          <p className="text-gray-700">
            Fingerprint quality is subject to acceptance by the receiving agency. If prints are rejected due to poor ridge quality (a biological factor outside our control),
            the client is responsible for any resubmission costs. If rejection is due to operator or equipment error, we will reprint at no cost.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">7. Confidentiality & Data Protection</h2>
          <p className="text-gray-700">
            We collect and transmit biometric data only to authorized agencies in compliance with FDLE, FBI, and state/federal regulations.
            We do not sell, share, or use your personal data for any unauthorized purpose.
            Once transmitted, responsibility for processing lies with the receiving agency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">8. Limitations of Liability</h2>
          <p className="text-gray-700">
            We are not responsible for decisions made by employers, agencies, or licensing boards based on fingerprint/background results.
            We are not liable for delays caused by government processing times.
            Our total liability for any claim related to services will not exceed the amount paid by the client for that service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">9. Cancellations & Rescheduling</h2>
          <p className="text-gray-700">
            Appointments canceled less than 24 hours before the scheduled time may be subject to a cancellation fee.
            Rescheduling is permitted based on availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">10. Governing Law & Venue</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of the State of Florida.
            Any disputes shall be resolved in courts located in Miami-Dade County, Florida.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">11. Amendments</h2>
          <p className="text-gray-700">
            We reserve the right to update or modify these Terms at any time. Updated versions will be posted on our website and effective immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">12. SMS & Text Message Communications</h2>
          <p className="text-gray-700">
            By providing your phone number and opting in to receive text messages, you consent to receive recurring automated text messages from Provn LLC
            related to service updates and appointment reminders. Message frequency may vary. Consent is not a condition of purchase.
          </p>
          <p className="text-gray-700">
            Message and data rates may apply according to your mobile carrier's plan. We are not responsible for carrier charges.
            To opt out of text messages at any time, reply STOP to any message or contact us directly at +1 (305) 340-2911 or info@provn.co.
          </p>
          <p className="text-gray-700">
            You may also receive help information by replying HELP to any message. Our text messaging system is operated in compliance with TCPA (Telephone Consumer Protection Act) regulations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">13. Contact Information</h2>
          <p className="text-gray-700">For questions about these Terms, please contact:</p>
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
