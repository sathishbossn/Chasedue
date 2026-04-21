import type { Metadata } from 'next'
import LegalPageShell from '@/components/legal/legal-page-shell'

export const metadata: Metadata = {
  title: 'Terms of Service — ChaseDue',
  description: 'Terms of Service for ChaseDue, operated by A. Sathish Kumar.',
}

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of <strong>ChaseDue</strong>{' '}
        (&quot;ChaseDue,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including our websites, applications,
        and related services (collectively, the &quot;Service&quot;). The Service is made available by{' '}
        <strong>A. Sathish Kumar</strong> (&quot;Operator&quot;). By creating an account, clicking to accept, or using
        the Service, you agree to these Terms and to our Privacy Policy.
      </p>

      <h2>1. The Service</h2>
      <p>
        ChaseDue provides tools to create and manage invoices, track expenses, log categories, scan or upload receipts
        (including simulated or third-party extraction where offered), send payment reminders, and integrate with
        third-party services such as payment providers and the WhatsApp Cloud API. Features may change as we improve
        the product. The Service is provided for business and professional use unless we expressly agree otherwise.
      </p>

      <h2>2. Eligibility and accounts</h2>
      <p>
        You must be at least the age of majority in your jurisdiction and have authority to bind yourself or your
        business. You must provide accurate registration information and keep your credentials secure. You are responsible
        for all activity under your account. Notify us promptly of any unauthorized use.
      </p>

      <h2>3. Your content and data</h2>
      <p>
        You retain ownership of content you submit (such as client, invoice, and expense data). You grant ChaseDue a
        worldwide, non-exclusive, royalty-free license to host, process, transmit, and display that content solely to
        provide and improve the Service — including sending messages you configure, processing payments you initiate,
        and generating exports or PDFs you request.
      </p>
      <p>
        You represent that you have the rights and, where required, consents to use and share client contact information
        in connection with the Service, including for WhatsApp or email delivery.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service unlawfully, fraudulently, or to harass, threaten, or spam others;</li>
        <li>Circumvent security, quotas, or technical limits, or probe systems without authorization;</li>
        <li>Upload malware, scrape the Service in bulk without permission, or reverse engineer except as permitted by law;</li>
        <li>Use the Service in violation of Meta, WhatsApp, payment network, or export control rules.</li>
      </ul>

      <h2>5. Third-party services</h2>
      <p>
        The Service may integrate with Supabase, Google, Meta (WhatsApp), Razorpay, and others. Your use of those
        services is subject to their respective terms and privacy policies. ChaseDue is not responsible for third-party
        failures, outages, or policy changes beyond our reasonable control.
      </p>

      <h2>6. Fees</h2>
      <p>
        Certain plans or features may be paid. Fees, billing cycles, renewal, and taxes will be presented at purchase.
        Unless stated otherwise or required by law, fees are non-refundable. Failure to pay may result in suspension or
        termination of access.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM EXTENT PERMITTED BY LAW,
        CHASEDUE AND THE OPERATOR DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION OR THAT
        DEFECTS WILL BE CORRECTED. AI OR OCR FEATURES MAY PRODUCE INACCURATE RESULTS; YOU ARE RESPONSIBLE FOR VERIFYING
        AMOUNTS AND ENTRIES BEFORE RELYING ON THEM FOR TAX OR LEGAL PURPOSES.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER CHASEDUE NOR A. SATHISH KUMAR WILL BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL. OUR
        AGGREGATE LIABILITY FOR CLAIMS RELATING TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID
        US FOR THE SERVICE IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS (USD $100), IF
        APPLICABLE.
      </p>

      <h2>9. Indemnity</h2>
      <p>
        You will defend, indemnify, and hold harmless ChaseDue, the Operator, and their affiliates from claims, damages,
        losses, and expenses (including reasonable attorneys&apos; fees) arising from your content, your use of the
        Service, or your violation of these Terms or applicable law.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate access for breach of these Terms, non-payment, or operational or legal reasons. You
        may stop using the Service at any time. Provisions that by nature should survive (including disclaimers,
        limitations, indemnity, and governing law) will survive termination.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of India, without regard to conflict-of-law principles, subject to
        mandatory consumer protections in your country of residence where they cannot be waived. Courts located in
        India shall have jurisdiction, unless a different mandatory venue applies to consumers in your jurisdiction.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may modify these Terms by posting an updated version. Continued use after the effective date may constitute
        acceptance. For material changes, we will provide notice where required by law.
      </p>

      <h2>13. Contact</h2>
      <p>
        For questions about these Terms or ChaseDue, contact us through the channels provided on our website. The
        Service is operated by A. Sathish Kumar on behalf of ChaseDue users.
      </p>
    </LegalPageShell>
  )
}
