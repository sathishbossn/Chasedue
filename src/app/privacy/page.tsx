import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/legal-page-shell'

export const metadata: Metadata = {
  title: 'Privacy Policy — ChaseDue',
  description:
    'Privacy Policy for ChaseDue: how A. Sathish Kumar operates the service and processes personal data.',
}

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p>
        This Privacy Policy describes how <strong>ChaseDue</strong> (&quot;ChaseDue,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information when you use our websites, applications,
        and related services (the &quot;Service&quot;). The Service is operated by{' '}
        <strong>A. Sathish Kumar</strong> (&quot;Operator&quot;) as an independent product offering. By using the
        Service, you agree to this Privacy Policy together with our Terms of Service.
      </p>

      <h2>1. Who we are</h2>
      <p>
        ChaseDue provides invoicing, expense tracking, payment-related workflows, and integrations such as WhatsApp
        messaging and payment providers. The Operator responsible for the Service is <strong>A. Sathish Kumar</strong>.
        Contact for privacy inquiries may be made through the channels published on the ChaseDue website or within the
        product.
      </p>

      <h2>2. Information we collect</h2>
      <p>Depending on how you use ChaseDue, we may process:</p>
      <ul>
        <li>
          <strong>Account and identity data</strong> — such as your name, email address, and authentication identifiers
          when you register or sign in (for example via Google OAuth).
        </li>
        <li>
          <strong>Business and invoice data</strong> — client names, contact details, invoice amounts, due dates,
          statuses, descriptions, and notes you choose to store.
        </li>
        <li>
          <strong>Expense data</strong> — descriptions, amounts, categories, and dates you log, including any files you
          upload for receipt scanning features where available.
        </li>
        <li>
          <strong>Payment and billing data</strong> — when you use integrated payment providers (such as Razorpay),
          payments are processed by those providers under their terms; we receive only the data needed to reconcile
          invoices and display status in your account.
        </li>
        <li>
          <strong>WhatsApp and messaging metadata</strong> — when you use features that send messages via the WhatsApp
          Cloud API, Meta processes message delivery and may provide delivery or read receipts. We store message and
          status logs as needed to show delivery history in the Service.
        </li>
        <li>
          <strong>Technical and security data</strong> — IP address, device and browser type, timestamps, and diagnostic
          logs used to secure accounts, prevent abuse, and improve reliability.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <p>We use personal data to:</p>
      <ul>
        <li>Provide, operate, and improve the Service;</li>
        <li>Authenticate users, enforce Row Level Security and access controls, and prevent fraud;</li>
        <li>Send transactional emails or in-product notices related to your account;</li>
        <li>Deliver reminders and messages you configure, including via WhatsApp where enabled;</li>
        <li>Comply with law, respond to lawful requests, and enforce our Terms.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>4. Legal bases (EEA, UK, and similar regions)</h2>
      <p>
        Where the GDPR or similar laws apply, we rely on: (i) performance of a contract with you; (ii) legitimate
        interests (for example securing our systems and preventing abuse), balanced against your rights; and (iii)
        consent where required for optional cookies, marketing, or non-essential analytics.
      </p>

      <h2>5. Sharing and subprocessors</h2>
      <p>We share information only with service providers necessary to run ChaseDue, including:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — database, authentication, and hosting infrastructure;
        </li>
        <li>
          <strong>Meta / WhatsApp</strong> — message delivery when you use WhatsApp features;
        </li>
        <li>
          <strong>Payment processors</strong> — such as Razorpay, for payment authorization and settlement;
        </li>
        <li>
          <strong>Analytics or error reporting</strong> — only if enabled, as described in-product.
        </li>
      </ul>
      <p>
        These providers process data under their own terms and, where applicable, as our subprocessors. We require
        appropriate contractual and technical safeguards.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal data for as long as your account is active and as needed to provide the Service, comply with
        legal obligations (including tax and accounting rules), resolve disputes, and enforce agreements. You may request
        deletion of your account subject to legal and contractual requirements.
      </p>

      <h2>7. Security</h2>
      <p>
        We use industry-standard measures including encryption in transit (HTTPS), access controls, and secure handling
        of secrets. No method of transmission or storage is completely secure; we work to protect your data and will
        notify you where required if we become aware of a breach affecting your personal data.
      </p>

      <h2>8. International transfers</h2>
      <p>
        Your information may be processed in countries where our providers operate (including outside your country of
        residence). Where required, we rely on appropriate safeguards such as Standard Contractual Clauses or equivalent
        mechanisms.
      </p>

      <h2>9. Your rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, delete, or export your personal data,
        restrict or object to certain processing, and withdraw consent where processing is consent-based. To exercise
        these rights, contact us using the details on our website. You may also lodge a complaint with your local data
        protection authority.
      </p>

      <h2>10. Children</h2>
      <p>
        ChaseDue is not directed at children under 16 (or the age required in your jurisdiction), and we do not knowingly
        collect personal information from children.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the revised policy on this page and update the
        &quot;Last updated&quot; date. Material changes may require additional notice where required by law.
      </p>

      <h2>12. Contact</h2>
      <p>
        For privacy-related requests or questions about how A. Sathish Kumar operates ChaseDue, contact us through the
        channels listed on the ChaseDue website or your account settings.
      </p>
    </LegalPageShell>
  )
}
