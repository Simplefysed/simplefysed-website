import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Simplefysed Solutions',
  description:
    'Privacy policy for Simplefysed Solutions. Learn how we collect, use, and protect your personal data in compliance with GDPR.',
}

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-8 lg:px-12 bg-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary text-lg">
            How we collect, use, and protect your personal data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 sm:px-8 lg:px-12 bg-bg-secondary">
        <div className="max-w-4xl mx-auto space-y-12 text-text-secondary leading-relaxed">
          {/* 1. Data Controller */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              1. Data Controller
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

          {/* 2. General Information */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              2. General Information
            </h2>
            <p>
              The following information provides a simple overview of what
              happens to your personal data when you visit this website. Personal
              data is any data that can be used to personally identify you.
              Detailed information on data protection can be found in our privacy
              policy listed below this text.
            </p>
          </div>

          {/* 3. Data Collection on This Website */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              3. Data Collection on This Website
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              Who is responsible for data collection on this website?
            </h3>
            <p>
              Data processing on this website is carried out by the website
              operator. You can find the contact details in the &quot;Data
              Controller&quot; section of this privacy policy.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              How do we collect your data?
            </h3>
            <p>
              Your data is collected when you provide it to us. This could be
              data you enter into a contact form, for example.
            </p>
            <p className="mt-3">
              Other data is collected automatically or with your consent when you
              visit the website through our IT systems. This is primarily
              technical data (e.g. internet browser, operating system, or time of
              page access).
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              What do we use your data for?
            </h3>
            <p>
              Some data is collected to ensure error-free provision of the
              website. Other data may be used to analyze your user behavior.
            </p>
          </div>

          {/* 4. Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              4. Contact Form
            </h2>
            <p>
              When you send us inquiries via the contact form, your details from
              the inquiry form, including the contact data you provide, will be
              stored by us for the purpose of processing the inquiry and in case
              of follow-up questions.
            </p>
            <p className="mt-3">
              The processing of this data is based on Art. 6 (1) lit. b GDPR,
              provided your inquiry is related to the fulfillment of a contract
              or is necessary for the implementation of pre-contractual measures.
            </p>
            <p className="mt-3">
              We do not share this data without your consent.
            </p>
          </div>

          {/* 5. Server Log Files */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              5. Server Log Files
            </h2>
            <p>
              The provider of the pages automatically collects and stores
              information in so-called server log files, which your browser
              automatically transmits to us. These are:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
              <li>Browser type and browser version</li>
              <li>Operating system used</li>
              <li>Referrer URL</li>
              <li>Hostname of the accessing computer</li>
              <li>Time of the server request</li>
              <li>IP address</li>
            </ul>
            <p className="mt-3">
              This data is not combined with other data sources. The collection
              of this data is based on Art. 6 (1) lit. f GDPR.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              6. Your Rights
            </h2>
            <p>
              You have the right at any time to receive information free of
              charge about the origin, recipients and purpose of your stored
              personal data. You also have the right to request the correction or
              deletion of this data.
            </p>
            <p className="mt-3">
              For this and other questions on the subject of data protection, you
              can contact us at any time using the contact details provided in
              this privacy policy.
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              Your Rights in Detail:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Right to information (Art. 15 GDPR)</li>
              <li>Right to rectification (Art. 16 GDPR)</li>
              <li>Right to erasure (Art. 17 GDPR)</li>
              <li>Right to restriction of processing (Art. 18 GDPR)</li>
              <li>Right to data portability (Art. 20 GDPR)</li>
              <li>Right to object (Art. 21 GDPR)</li>
              <li>
                Right to lodge a complaint with a supervisory authority (Art. 77
                GDPR)
              </li>
            </ul>
          </div>

          {/* 7. Hosting */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              7. Hosting
            </h2>
            <p>
              We host the content of our website with an external service
              provider. The personal data collected on this website is stored on
              the host&apos;s servers.
            </p>
            <p className="mt-3">
              The use of the host is for the purpose of contract fulfillment
              towards our potential and existing customers (Art. 6 (1) lit. b
              GDPR) and in the interest of secure, fast and efficient provision
              of our online offering by a professional provider (Art. 6 (1) lit.
              f GDPR).
            </p>
          </div>

          {/* 8. External Tools and Services */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              8. External Tools and Services
            </h2>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              Make.com (formerly Integromat)
            </h3>
            <p>
              We use the Make.com service to process contact inquiries. When you
              use our contact form, your data is transmitted to Make.com and
              processed there.
            </p>
            <p className="mt-3">
              Make.com is GDPR-compliant and processes your data exclusively for
              the purpose of processing contact inquiries. The legal basis is
              Art. 6 (1) lit. b GDPR.
            </p>
            <p className="mt-3">
              For more information, see Make.com&apos;s privacy policy:{' '}
              <a
                href="https://www.make.com/en/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline break-all"
              >
                https://www.make.com/en/privacy-policy
              </a>
            </p>

            <h3 className="text-lg font-medium text-text-primary mt-6 mb-2">
              Cal.com
            </h3>
            <p>
              We use the Cal.com service for appointment booking. When using this
              service, personal data such as name, email address and appointment
              preferences are transmitted to Cal.com.
            </p>
            <p className="mt-3">
              For more information, see Cal.com&apos;s privacy policy:{' '}
              <a
                href="https://cal.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline"
              >
                https://cal.com/privacy
              </a>
            </p>
          </div>

          {/* 9. Changes to This Privacy Policy */}
          <div>
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We reserve the right to adapt this privacy policy so that it always
              complies with current legal requirements or to implement changes to
              our services in the privacy policy.
            </p>
            <p className="mt-3">
              The new privacy policy will then apply to your next visit.
            </p>
          </div>

          {/* Footer note */}
          <div className="border-t border-border-primary pt-8 text-text-muted text-sm">
            <p>Status of this Privacy Policy: January 2026</p>
            <p className="mt-2">
              This privacy policy was created in accordance with the General Data
              Protection Regulation (GDPR) and the Federal Data Protection Act
              (BDSG).
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
