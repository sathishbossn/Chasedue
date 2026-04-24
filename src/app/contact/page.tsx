import Link from 'next/link';
import { Mail, MessageCircle, Twitter, Clock, Zap } from 'lucide-react';

export const metadata = {
  title: 'Contact — ChaseDue',
  description: 'Get in touch with the ChaseDue team. We reply within 24 hours.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Nav back link */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
          ← Back to ChaseDue
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">Support</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          We're here to help
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
          ChaseDue is built by a solopreneur who genuinely cares. 
          Reach out — I reply to every message personally within 24 hours.
        </p>
      </div>

      {/* Contact cards */}
      <div className="max-w-3xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Email */}
          <a
            href="mailto:sathish@chasedue.com"
            className="group bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <Mail className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold text-white mb-1">Email</h3>
            <p className="text-sm text-gray-400 mb-3">Best for detailed questions</p>
            <span className="text-sm text-orange-500 font-medium">sathish@chasedue.com</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919789654609?text=Hi%20Sathish%2C%20I%20have%20a%20question%20about%20ChaseDue"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <MessageCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-400 mb-3">Fastest response</p>
            <span className="text-sm text-orange-500 font-medium">Message us directly</span>
          </a>

          {/* Twitter */}
          <a
            href="https://x.com/Chasedueweb"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-200"
          >
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
              <Twitter className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-semibold text-white mb-1">Twitter / X</h3>
            <p className="text-sm text-gray-400 mb-3">Updates and announcements</p>
            <span className="text-sm text-orange-500 font-medium">@Chasedueweb</span>
          </a>
        </div>

        {/* Response time banner */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Typical response time: under 24 hours</p>
            <p className="text-xs text-gray-400 mt-0.5">Monday to Saturday, 9am – 7pm IST. I read every message personally.</p>
          </div>
        </div>

        {/* Simple contact form */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-2">Send a message</h2>
          <p className="text-sm text-gray-400 mb-6">Prefer a form? Fill this in and I'll email you back.</p>
          
          <form
            action="https://formspree.io/f/YOUR_FORMSPREE_ID"
            method="POST"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rahul@example.com"
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                What's it about?
              </label>
              <select
                name="topic"
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-colors"
              >
                <option value="general">General question</option>
                <option value="billing">Billing / subscription</option>
                <option value="bug">Something is broken</option>
                <option value="feature">Feature request</option>
                <option value="invoice">Invoice / GST help</option>
                <option value="whatsapp">WhatsApp reminders</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Describe your question or issue..."
                className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Send message →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
