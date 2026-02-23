import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Simplefysed Solutions',
  description:
    'Terms of Service for Simplefysed Solutions, governing the use of our website and services including web development, automation, and digital transformation.',
}

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-8 lg:px-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary text-lg">
            Terms governing the use of our website and services.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-bg-secondary">
        <div className="max-w-4xl mx-auto space-y-12 text-text-secondary leading-relaxed">
          {/* 1. Service Provider */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              1. Service Provider
            </h2>
            <p>Simplefysed Solutions</p>
            <p>Thuringia, Germany</p>
            <p className="mt-2">
              Email:{' '}
              <a
                href="mailto:info@simplefysed.com"
                className="text-neon-cyan hover:underline"
              >
                info@simplefysed.com
              </a>
            </p>
            <p>Phone: Available on request</p>
          </div>

          {/* 2. Scope of Application */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              2. Scope of Application
            </h2>
            <p>
              These Terms of Service govern the use of our website and all
              services provided by Simplefysed Solutions. By accessing our
              website or using our services, you agree to be bound by these
              terms.
            </p>
            <p className="mt-3">
              These terms apply to all users, clients, and visitors of our
              website and services, including but not limited to web application
              development, automation solutions, and digital transformation
              consulting.
            </p>
          </div>

          {/* 3. Services */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              3. Services
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              3.1 Service Description
            </h3>
            <p>Simplefysed Solutions provides the following services:</p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
              <li>Custom web application development</li>
              <li>Process automation and optimization</li>
              <li>Digital transformation consulting</li>
              <li>AI and machine learning solutions</li>
              <li>System integration services</li>
              <li>Technical consulting and support</li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              3.2 Service Delivery
            </h3>
            <p>
              All services are provided based on individual agreements and
              specifications. Detailed project scope, timelines, and
              deliverables will be outlined in separate service agreements or
              contracts.
            </p>
            <p className="mt-3">
              We reserve the right to modify or discontinue services with
              appropriate notice to affected clients.
            </p>
          </div>

          {/* 4. Client Obligations */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              4. Client Obligations
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              4.1 Cooperation
            </h3>
            <p>
              Clients are obligated to provide necessary cooperation, including
              but not limited to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
              <li>Providing accurate and complete information</li>
              <li>Timely feedback and approvals</li>
              <li>Access to necessary systems and data</li>
              <li>Designation of competent contact persons</li>
            </ul>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              4.2 Acceptable Use
            </h3>
            <p>
              Clients must use our services in compliance with applicable laws
              and regulations. Any illegal, harmful, or unethical use of our
              services is strictly prohibited.
            </p>
          </div>

          {/* 5. Intellectual Property */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              5. Intellectual Property
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              5.1 Ownership
            </h3>
            <p>
              Unless otherwise agreed in writing, all intellectual property
              rights in work products created by Simplefysed Solutions remain
              with the company until full payment is received.
            </p>
            <p className="mt-3">
              Upon full payment, clients receive the agreed-upon license or
              ownership rights as specified in the individual service agreement.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              5.2 Third-Party Rights
            </h3>
            <p>
              We respect third-party intellectual property rights and expect
              clients to do the same. Clients are responsible for ensuring they
              have the right to use any materials, content, or systems they
              provide to us.
            </p>
          </div>

          {/* 6. Payment Terms */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              6. Payment Terms
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              6.1 Fees and Payment
            </h3>
            <p>
              All fees and payment terms are specified in individual service
              agreements. Unless otherwise agreed, invoices are due within 30
              days of issuance.
            </p>
            <p className="mt-3">
              Late payments may incur interest charges as permitted by
              applicable law.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              6.2 Taxes
            </h3>
            <p>
              All prices are exclusive of applicable taxes, which will be added
              as required by law.
            </p>
          </div>

          {/* 7. Liability and Warranties */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              7. Liability and Warranties
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              7.1 Limitation of Liability
            </h3>
            <p>
              Our liability is limited to the extent permitted by German law. In
              no event shall our liability exceed the total amount paid by the
              client for the specific service giving rise to the claim.
            </p>
            <p className="mt-3">
              We shall not be liable for indirect, consequential, or incidental
              damages, including but not limited to loss of profits or business
              interruption.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              7.2 Force Majeure
            </h3>
            <p>
              We shall not be liable for any failure or delay in performance due
              to circumstances beyond our reasonable control, including but not
              limited to natural disasters, government actions, or technical
              failures.
            </p>
          </div>

          {/* 8. Confidentiality */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              8. Confidentiality
            </h2>
            <p>
              We treat all client information as confidential and will not
              disclose it to third parties without explicit consent, except as
              required by law or court order.
            </p>
            <p className="mt-3">
              This confidentiality obligation survives the termination of our
              business relationship.
            </p>
          </div>

          {/* 9. Termination */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              9. Termination
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              9.1 Termination Rights
            </h3>
            <p>
              Either party may terminate ongoing services with appropriate
              notice as specified in the individual service agreement.
            </p>
            <p className="mt-3">
              We reserve the right to terminate services immediately in case of
              breach of these terms or non-payment.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              9.2 Effect of Termination
            </h3>
            <p>
              Upon termination, all outstanding payments become immediately due,
              and we will provide completed work products as agreed upon.
            </p>
          </div>

          {/* 10. Data Protection */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              10. Data Protection
            </h2>
            <p>
              We process personal data in accordance with the General Data
              Protection Regulation (GDPR) and applicable German data
              protection laws.
            </p>
            <p className="mt-3">
              For detailed information about our data handling practices, please
              refer to our{' '}
              <Link
                href="/privacy"
                className="text-neon-cyan hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* 11. Governing Law */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              11. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by German law. Any disputes
              arising from or in connection with these terms shall be resolved
              by German courts.
            </p>
            <p className="mt-3">
              The place of jurisdiction is Thuringia, Germany, unless mandatory
              consumer protection laws provide otherwise.
            </p>
          </div>

          {/* 12. Changes to Terms */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              12. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms of Service at any time.
              Changes will be communicated through our website or direct
              notification to clients.
            </p>
            <p className="mt-3">
              Continued use of our services after changes constitutes acceptance
              of the modified terms.
            </p>
          </div>

          {/* 13. Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              13. Contact Information
            </h2>
            <p>
              For questions regarding these Terms of Service, please contact us:
            </p>
            <p className="mt-2">
              Email:{' '}
              <a
                href="mailto:info@simplefysed.com"
                className="text-neon-cyan hover:underline"
              >
                info@simplefysed.com
              </a>
            </p>
            <p>Address: Thuringia, Germany</p>
            <p>Phone: Available on request</p>
          </div>

          {/* Footer note */}
          <div className="border-t border-border-primary pt-8 text-text-muted text-sm">
            <p>Effective Date: January 2026</p>
            <p className="mt-2">
              These Terms of Service were created in accordance with German
              commercial law and consumer protection regulations.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
