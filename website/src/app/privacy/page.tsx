import { LegalDocument, SubHead, linkClass, type LegalClause } from '@/components/legal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Privacy policy for Simplefysed Solutions. Learn how we collect, use, and protect your personal data in compliance with GDPR.',
  path: '/privacy',
})

const listClass = 'list-disc space-y-1.5 pl-5 marker:text-ink/40'

const clauses: LegalClause[] = [
  {
    id: 'data-controller',
    index: '01',
    title: 'Data Controller',
    body: (
      <>
        <p>Simplefysed Solutions</p>
        <p>Thuringia, Germany</p>
        <p>
          Email:{' '}
          <a href="mailto:info@simplefysed.com" className={linkClass}>
            info@simplefysed.com
          </a>
        </p>
        <p>Phone: Available on request</p>
      </>
    ),
  },
  {
    id: 'general-information',
    index: '02',
    title: 'General Information',
    body: (
      <p>
        The following information provides a simple overview of what happens to
        your personal data when you visit this website. Personal data is any
        data that can be used to personally identify you. Detailed information on
        data protection can be found in our privacy policy listed below this
        text.
      </p>
    ),
  },
  {
    id: 'data-collection',
    index: '03',
    title: 'Data Collection on This Website',
    body: (
      <>
        <SubHead>Who is responsible for data collection on this website?</SubHead>
        <p>
          Data processing on this website is carried out by the website
          operator. You can find the contact details in the &quot;Data
          Controller&quot; section of this privacy policy.
        </p>
        <SubHead>How do we collect your data?</SubHead>
        <p>
          Your data is collected when you provide it to us. This could be data
          you enter into a contact form, for example.
        </p>
        <p>
          Other data is collected automatically or with your consent when you
          visit the website through our IT systems. This is primarily technical
          data (e.g. internet browser, operating system, or time of page
          access).
        </p>
        <SubHead>What do we use your data for?</SubHead>
        <p>
          Some data is collected to ensure error-free provision of the website.
          Other data may be used to analyze your user behavior.
        </p>
      </>
    ),
  },
  {
    id: 'contact-form',
    index: '04',
    title: 'Contact Form',
    body: (
      <>
        <p>
          When you send us inquiries via the contact form, your details from the
          inquiry form, including the contact data you provide, will be stored by
          us for the purpose of processing the inquiry and in case of follow-up
          questions.
        </p>
        <p>
          The processing of this data is based on Art. 6 (1) lit. b GDPR,
          provided your inquiry is related to the fulfillment of a contract or is
          necessary for the implementation of pre-contractual measures.
        </p>
        <p>We do not share this data without your consent.</p>
      </>
    ),
  },
  {
    id: 'server-log-files',
    index: '05',
    title: 'Server Log Files',
    body: (
      <>
        <p>
          The provider of the pages automatically collects and stores information
          in so-called server log files, which your browser automatically
          transmits to us. These are:
        </p>
        <ul className={listClass}>
          <li>Browser type and browser version</li>
          <li>Operating system used</li>
          <li>Referrer URL</li>
          <li>Hostname of the accessing computer</li>
          <li>Time of the server request</li>
          <li>IP address</li>
        </ul>
        <p>
          This data is not combined with other data sources. The collection of
          this data is based on Art. 6 (1) lit. f GDPR.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    index: '06',
    title: 'Your Rights',
    body: (
      <>
        <p>
          You have the right at any time to receive information free of charge
          about the origin, recipients and purpose of your stored personal data.
          You also have the right to request the correction or deletion of this
          data.
        </p>
        <p>
          For this and other questions on the subject of data protection, you can
          contact us at any time using the contact details provided in this
          privacy policy.
        </p>
        <SubHead>Your rights in detail</SubHead>
        <ul className={listClass}>
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
      </>
    ),
  },
  {
    id: 'hosting',
    index: '07',
    title: 'Hosting',
    body: (
      <>
        <p>
          We host the content of our website with an external service provider.
          The personal data collected on this website is stored on the
          host&apos;s servers.
        </p>
        <p>
          The use of the host is for the purpose of contract fulfillment towards
          our potential and existing customers (Art. 6 (1) lit. b GDPR) and in
          the interest of secure, fast and efficient provision of our online
          offering by a professional provider (Art. 6 (1) lit. f GDPR).
        </p>
      </>
    ),
  },
  {
    id: 'external-tools',
    index: '08',
    title: 'External Tools and Services',
    body: (
      <>
        <SubHead>Resend</SubHead>
        <p>
          We use Resend (operated by Plus Five Five, Inc.) to deliver the emails
          generated by our contact form. When you submit the form, the details
          you provide (name, email address, company, and message) are transmitted
          to Resend so your inquiry can be sent to us and a confirmation sent to
          you.
        </p>
        <p>
          Resend processes this data solely to deliver these emails. The legal
          basis is Art. 6 (1) lit. b GDPR. As a US-based provider, Resend may
          process the data in the United States under the transfer safeguards set
          out in its privacy policy.
        </p>
        <p>
          For more information, see Resend&apos;s privacy policy:{' '}
          <a
            href="https://resend.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} break-all`}
          >
            https://resend.com/legal/privacy-policy
          </a>
        </p>
        <SubHead>Calendly</SubHead>
        <p>
          We use Calendly for appointment scheduling. When you book a call through
          our Calendly link, personal data such as your name, email address, and
          appointment details are transmitted to and processed by Calendly.
        </p>
        <p>
          The legal basis is Art. 6 (1) lit. b GDPR. As a US-based provider,
          Calendly may process the data in the United States under the transfer
          safeguards set out in its privacy notice.
        </p>
        <p>
          For more information, see Calendly&apos;s privacy notice:{' '}
          <a
            href="https://calendly.com/legal/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} break-all`}
          >
            https://calendly.com/legal/privacy-notice
          </a>
        </p>
        <SubHead>Google reCAPTCHA</SubHead>
        <p>
          Our contact form is protected against spam and abuse by Google reCAPTCHA.
          To tell humans from bots, reCAPTCHA evaluates signals such as your IP
          address, browser and device characteristics, and how you interact with the
          form, and transmits them to Google.
        </p>
        <p>
          The legal basis is Art. 6 (1) lit. f GDPR: we have a legitimate interest in
          protecting our form from automated abuse. As a US-based provider, Google may
          process this data in the United States. Google&apos;s privacy policy and
          terms apply:{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} break-all`}
          >
            https://policies.google.com/privacy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} break-all`}
          >
            https://policies.google.com/terms
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: 'policy-changes',
    index: '09',
    title: 'Changes to This Privacy Policy',
    body: (
      <>
        <p>
          We reserve the right to adapt this privacy policy so that it always
          complies with current legal requirements or to implement changes to our
          services in the privacy policy.
        </p>
        <p>The new privacy policy will then apply to your next visit.</p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      standfirst="How we collect, use, and protect your personal data."
      updated="January 2026"
      clauses={clauses}
      complianceTag="GDPR (DSGVO) · BDSG"
      complianceNote="This privacy policy was created in accordance with the General Data Protection Regulation (GDPR) and the Federal Data Protection Act (BDSG)."
    />
  )
}
