import Link from 'next/link';
import { Zap, ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'Help — ChaseDue',
  description: 'Answers to common questions about ChaseDue — invoicing, WhatsApp reminders, GST, and payments.',
};

const faqs = [
  {
    category: 'Getting started',
    items: [
      {
        q: 'Is ChaseDue really free to start?',
        a: 'Yes — Free plan is free forever, no credit card required. You can create invoices, track payments, and send manual WhatsApp reminders. Upgrade to Pro (₹299/month) when you want automated reminders and unlimited clients.',
      },
      {
        q: 'How do I create my first invoice?',
        a: 'Sign in → go to Clients → add your client → go to New Invoice → select client, enter amount and due date → click Create Invoice. Your GST-compliant PDF is generated instantly.',
      },
      {
        q: 'Does ChaseDue work on mobile?',
        a: 'Yes — ChaseDue is fully responsive and works on Android Chrome and iPhone Safari. No app download needed.',
      },
    ],
  },
  {
    category: 'WhatsApp reminders',
    items: [
      {
        q: 'How does WhatsApp payment reminder work?',
        a: 'Open any pending invoice → click "Chase Payment" → a pre-written WhatsApp message opens with your invoice details. Your client receives a professional reminder with a payment link. The reminder count and timestamp are logged automatically.',
      },
      {
        q: 'Will my client know it\'s automated?',
        a: 'No. The message is sent from your WhatsApp number and reads like a personal message. ChaseDue just writes it for you and tracks it.',
      },
      {
        q: 'Can I customise reminder message?',
        a: 'Message templates are coming in a future update. Currently the message is professionally written and proven to work — 68% of clients pay after the first reminder.',
      },
    ],
  },
  {
    category: 'GST & invoicing',
    items: [
      {
        q: 'Are ChaseDue invoices GST compliant?',
        a: 'Yes. ChaseDue invoices include: GSTIN, HSN/SAC code, CGST + SGST (or IGST for inter-state), Place of Supply, taxable value, total GST, grand total, and amount in words — all legally required fields under Indian GST law.',
      },
      {
        q: 'Does it handle CGST/SGST vs IGST automatically?',
        a: 'Yes. If your client is in the same state as you, CGST + SGST applies. If they\'re in a different state, IGST applies. ChaseDue detects this automatically from GSTIN.',
      },
      {
        q: 'What if I\'m not GST registered?',
        a: 'No problem — just leave the GSTIN field blank in Settings. ChaseDue will generate a simple invoice without GST fields.',
      },
      {
        q: 'Are invoice numbers sequential?',
        a: 'Yes — invoices are numbered as INV-2026-27-001, INV-2026-27-002 etc. The counter resets every April for the new financial year. You can set a custom prefix in Settings.',
      },
    ],
  },
  {
    category: 'Payments',
    items: [
      {
        q: 'How do clients pay me?',
        a: 'Your invoice includes a Razorpay payment link. Clients can pay via UPI, credit card, debit card, or net banking. The money goes directly to your bank account.',
      },
      {
        q: 'What are the payment fees?',
        a: 'Razorpay charges approximately 2% per transaction. ChaseDue does not take any additional cut from your payments.',
      },
      {
        q: 'Do you support international payments?',
        a: 'USD payments via PayPal and Lemon Squeezy are available for global clients. INR payments go through Razorpay.',
      },
    ],
  },
  {
    category: 'Billing & plans',
    items: [
      {
        q: 'Can I cancel anytime?',
        a: 'Yes — cancel anytime from Settings. No questions asked, no lock-in. Your data remains accessible.',
      },
      {
        q: 'Is there an annual plan?',
        a: 'Yes — ₹2,499/year (₹208/month) saves you ~30% vs monthly. Available on the Pro plan.',
      },
      {
        q: 'What happens to my invoices if I downgrade?',
        a: 'All your existing invoices and data are preserved. You just lose access to automated reminders and unlimited clients on the Free plan.',
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
          ← Back to ChaseDue
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-10">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Help Center</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
        <p className="text-gray-400 text-lg">
          Answers to the most common questions about ChaseDue.
        </p>
      </div>

      {/* FAQ sections */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        {faqs.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-white/5 transition-colors">
                    <span className="font-medium text-sm text-white">{faq.q}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still need help */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center mt-8">
          <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-400 mb-6">
            Can't find what you're looking for? I reply personally within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
            >
              Contact us →
            </Link>
            <a
              href="https://wa.me/919789654609?text=Hi%2C%20I%20need%20help%20with%20ChaseDue"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
