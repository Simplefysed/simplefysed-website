import Link from 'next/link'
import { LegalDocument, SubHead, linkClass, type LegalClause } from '@/components/legal'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'Terms of Service for Simplefysed Solutions, governing the use of our website and services including web development, automation, and digital transformation.',
  path: '/terms',
})

const listClass = 'list-disc space-y-1.5 pl-5 marker:text-ink/40'

const clauses: LegalClause[] = [
  {
    id: 'service-provider',
    index: '01',
    title: 'Service Provider',
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
    id: 'scope',
    index: '02',
    title: 'Scope of Application',
    body: (
      <>
        <p>
          These Terms of Service govern the use of our website and all services
          provided by Simplefysed Solutions. By accessing our website or using
          our services, you agree to be bound by these terms.
        </p>
        <p>
          These terms apply to all users, clients, and visitors of our website
          and services, including but not limited to web application development,
          automation solutions, and digital transformation consulting.
        </p>
      </>
    ),
  },
  {
    id: 'services',
    index: '03',
    title: 'Services',
    body: (
      <>
        <SubHead>Service Description</SubHead>
        <p>Simplefysed Solutions provides the following services:</p>
        <ul className={listClass}>
          <li>Custom web application development</li>
          <li>Process automation and optimization</li>
          <li>Digital transformation consulting</li>
          <li>AI and machine learning solutions</li>
          <li>System integration services</li>
          <li>Technical consulting and support</li>
        </ul>
        <SubHead>Service Delivery</SubHead>
        <p>
          All services are provided based on individual agreements and
          specifications. Detailed project scope, timelines, and deliverables
          will be outlined in separate service agreements or contracts.
        </p>
        <p>
          We reserve the right to modify or discontinue services with appropriate
          notice to affected clients.
        </p>
      </>
    ),
  },
  {
    id: 'client-obligations',
    index: '04',
    title: 'Client Obligations',
    body: (
      <>
        <SubHead>Cooperation</SubHead>
        <p>
          Clients are obligated to provide necessary cooperation, including but
          not limited to:
        </p>
        <ul className={listClass}>
          <li>Providing accurate and complete information</li>
          <li>Timely feedback and approvals</li>
          <li>Access to necessary systems and data</li>
          <li>Designation of competent contact persons</li>
        </ul>
        <SubHead>Acceptable Use</SubHead>
        <p>
          Clients must use our services in compliance with applicable laws and
          regulations. Any illegal, harmful, or unethical use of our services is
          strictly prohibited.
        </p>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    index: '05',
    title: 'Intellectual Property',
    body: (
      <>
        <SubHead>Ownership</SubHead>
        <p>
          Unless otherwise agreed in writing, all intellectual property rights in
          work products created by Simplefysed Solutions remain with the company
          until full payment is received.
        </p>
        <p>
          Upon full payment, clients receive the agreed-upon license or ownership
          rights as specified in the individual service agreement.
        </p>
        <SubHead>Third-Party Rights</SubHead>
        <p>
          We respect third-party intellectual property rights and expect clients
          to do the same. Clients are responsible for ensuring they have the
          right to use any materials, content, or systems they provide to us.
        </p>
      </>
    ),
  },
  {
    id: 'payment',
    index: '06',
    title: 'Payment Terms',
    body: (
      <>
        <SubHead>Fees and Payment</SubHead>
        <p>
          All fees and payment terms are specified in individual service
          agreements. Unless otherwise agreed, invoices are due within 30 days of
          issuance.
        </p>
        <p>
          Late payments may incur interest charges as permitted by applicable
          law.
        </p>
        <SubHead>Taxes</SubHead>
        <p>
          All prices are exclusive of applicable taxes, which will be added as
          required by law.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    index: '07',
    title: 'Liability and Warranties',
    body: (
      <>
        <SubHead>Limitation of Liability</SubHead>
        <p>
          Our liability is limited to the extent permitted by German law. In no
          event shall our liability exceed the total amount paid by the client
          for the specific service giving rise to the claim.
        </p>
        <p>
          We shall not be liable for indirect, consequential, or incidental
          damages, including but not limited to loss of profits or business
          interruption.
        </p>
        <SubHead>Force Majeure</SubHead>
        <p>
          We shall not be liable for any failure or delay in performance due to
          circumstances beyond our reasonable control, including but not limited
          to natural disasters, government actions, or technical failures.
        </p>
      </>
    ),
  },
  {
    id: 'confidentiality',
    index: '08',
    title: 'Confidentiality',
    body: (
      <>
        <p>
          We treat all client information as confidential and will not disclose
          it to third parties without explicit consent, except as required by law
          or court order.
        </p>
        <p>
          This confidentiality obligation survives the termination of our
          business relationship.
        </p>
      </>
    ),
  },
  {
    id: 'termination',
    index: '09',
    title: 'Termination',
    body: (
      <>
        <SubHead>Termination Rights</SubHead>
        <p>
          Either party may terminate ongoing services with appropriate notice as
          specified in the individual service agreement.
        </p>
        <p>
          We reserve the right to terminate services immediately in case of
          breach of these terms or non-payment.
        </p>
        <SubHead>Effect of Termination</SubHead>
        <p>
          Upon termination, all outstanding payments become immediately due, and
          we will provide completed work products as agreed upon.
        </p>
      </>
    ),
  },
  {
    id: 'data-protection',
    index: '10',
    title: 'Data Protection',
    body: (
      <>
        <p>
          We process personal data in accordance with the General Data Protection
          Regulation (GDPR) and applicable German data protection laws.
        </p>
        <p>
          For detailed information about our data handling practices, please
          refer to our{' '}
          <Link href="/privacy" className={linkClass}>
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    index: '11',
    title: 'Governing Law',
    body: (
      <>
        <p>
          These Terms of Service are governed by German law. Any disputes arising
          from or in connection with these terms shall be resolved by German
          courts.
        </p>
        <p>
          The place of jurisdiction is Thuringia, Germany, unless mandatory
          consumer protection laws provide otherwise.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    index: '12',
    title: 'Changes to Terms',
    body: (
      <>
        <p>
          We reserve the right to modify these Terms of Service at any time.
          Changes will be communicated through our website or direct notification
          to clients.
        </p>
        <p>
          Continued use of our services after changes constitutes acceptance of
          the modified terms.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    index: '13',
    title: 'Contact Information',
    body: (
      <>
        <p>For questions regarding these Terms of Service, please contact us:</p>
        <p>
          Email:{' '}
          <a href="mailto:info@simplefysed.com" className={linkClass}>
            info@simplefysed.com
          </a>
        </p>
        <p>Address: Thuringia, Germany</p>
        <p>Phone: Available on request</p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Service"
      standfirst="Terms governing the use of our website and services."
      updated="January 2026"
      clauses={clauses}
      complianceTag="German commercial & consumer law"
      complianceNote="These Terms of Service were created in accordance with German commercial law and consumer protection regulations."
    />
  )
}
