import Link from 'next/link'
import { CheckCircle, MessageSquare, BarChart3, FileText, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Updated Next.js Version */}
      <nav className="flex justify-between items-center px-12 py-4 bg-white border-b border-gray-200">
        <div className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins', letterSpacing: '-0.5px' }}>
          Carrot<span className="text-primary">Cash</span>
        </div>
        <div className="flex gap-8 flex-1 justify-center">
          <Link href="#features" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Features</Link>
          <Link href="#pricing" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Pricing</Link>
          <Link href="#blog" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Blog</Link>
          <Link href="#support" className="text-gray-600 font-medium hover:text-gray-900 transition-colors">Support</Link>
        </div>
        <Link href="#pricing" className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="bg-white px-12 py-20 relative overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-primary/8"></div>
        <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-primary/5"></div>
        
        <div className="flex items-center gap-16 relative z-20 max-w-7xl mx-auto">
          <div className="flex-1 max-w-[560px]">
            <div className="inline-flex items-center gap-2 bg-primary-light border border-primary-border px-4 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                Built for Indian Solopreneurs
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-navy leading-[70px] tracking-tight mb-5">
              Stop Chasing.<br />
              <span className="text-primary">Start Getting</span><br />
              Paid.
            </h1>
            <p className="text-lg text-gray-600 leading-[30px] mb-9">
              Create GST-compliant invoices, send them via WhatsApp, and get paid 3× faster. Built for Indian freelancers who value their time.
            </p>
            <div className="flex gap-3.5 flex-wrap mb-4">
              <Link href="#pricing" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors">
                Start Free Trial
              </Link>
              <Link href="#features" className="border border-gray-300 text-gray-900 px-7 py-4 rounded-xl font-semibold text-base hover:border-gray-400 transition-colors">
                See Features
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Intro */}
      <section className="bg-cream px-12 py-20 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-sm font-bold text-primary uppercase tracking-wider mb-4">
            The features you need. All in one place.
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-navy text-center leading-[52px] tracking-tight mb-12">
            Everything a freelancer needs to get paid on time
          </h2>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="bg-white px-12 py-20" id="features">
        <div className="grid grid-cols-3 gap-5 max-w-7xl mx-auto">
          {/* Large Invoicing Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 row-span-2 min-h-[400px] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">
              Invoicing
            </h3>
            <p className="text-base text-gray-600 leading-6 mb-5">
              Professional GST-compliant invoices that auto-calculate CGST, SGST & IGST based on your client's state.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Unlimited GST invoices',
                'Auto CGST/SGST calculation',
                'HSN & SAC codes',
                'PDF export ready'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-900 font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Delivery Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[180px] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">
              WhatsApp Delivery
            </h3>
            <p className="text-base text-gray-600 leading-6">
              Send invoices directly to WhatsApp where clients actually respond.
            </p>
          </div>

          {/* Real-time Analytics Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 min-h-[180px] hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">
              Real-time Analytics
            </h3>
            <p className="text-base text-gray-600 leading-6">
              Live dashboard showing revenue, expenses, and net profit in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-cream px-12 py-20 text-center" id="pricing">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free, scale as you grow
          </p>
          
          <div className="flex gap-8 max-w-4xl mx-auto">
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 text-center relative hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-navy mb-2">
                Starter
              </h3>
              <div className="text-5xl font-bold text-navy mb-2">
                Free
              </div>
              <p className="text-sm text-gray-600 leading-[22px] mb-6">
                Perfect for freelancers just getting started
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  'Unlimited invoices',
                  '5 clients',
                  'Basic analytics'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-left">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-900 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <a href="https://lemonsqueezy.com" className="border border-gray-300 text-gray-900 px-8 py-3.5 rounded-lg font-semibold text-sm block w-full hover:border-gray-400 transition-colors">
                Get Started
              </a>
            </div>
            
            <div className="flex-1 bg-white border-2 border-primary rounded-2xl p-8 text-center relative scale-105 hover:shadow-xl transition-shadow">
              <div className="absolute -top-3 bg-primary px-4 py-1.5 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">
                Professional
              </h3>
              <div className="text-5xl font-bold text-navy mb-2">
                ₹299<span className="text-lg font-normal text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600 leading-[22px] mb-6">
                For growing freelancers who need more power
              </p>
              <div className="flex flex-col gap-3 mb-8">
                {[
                  'Everything in Starter',
                  'Unlimited clients',
                  'WhatsApp delivery',
                  'Advanced analytics',
                  'Priority support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-left">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-gray-900 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <a href="https://lemonsqueezy.com" className="bg-primary text-white px-8 py-3.5 rounded-lg font-semibold text-sm block w-full hover:bg-primary/90 transition-colors">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-navy text-white px-12 py-14">
        <div className="flex justify-center max-w-7xl mx-auto">
          {[
            { num: '500+', label: 'Active freelancers' },
            { num: '₹4Cr+', label: 'Revenue tracked' },
            { num: '3×', label: 'Faster payments' },
            { num: '10 hrs', label: 'Saved per month' }
          ].map((stat, i) => (
            <div key={i} className="flex-1 text-center py-5 border-r border-white/10 last:border-r-0">
              <div className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-1.5">
                {stat.num}
              </div>
              <div className="text-sm text-white/50 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-12 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Ready to get paid faster?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 500+ Indian freelancers who've already switched to CarrotCash
          </p>
          <div className="flex gap-4 justify-center">
            <a href="https://lemonsqueezy.com" className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="#features" className="border border-gray-300 text-gray-900 px-8 py-4 rounded-xl font-semibold text-base hover:border-gray-400 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-12 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-12 mb-12">
            <div className="flex-2">
              <div className="text-2xl font-bold text-white tracking-tight mb-3">
                Carrot<span className="text-primary">Cash</span>
              </div>
              <p className="text-sm text-white/40 leading-6 mb-5">
                Built for Indian freelancers.<br />
                With ❤️ from Chennai.
              </p>
              <div className="flex gap-4">
                <a href="#twitter" className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4.22s1.89 1.81 4.86 2.66a4.48 4.48 0 001.92-2.48 10.78 10.78 0 013.07 3.66 4.48 4.48 0 00-1.92-2.48 4.48 4.48 0 00-4.48 4.48 4.48 4.48 0 00-4.48-4.48A10.78 10.78 0 011.94 3.66 10.66 10.66 0 003 4.22a10.9 10.9 0 01-3.14 1.53"/>
                  </svg>
                </a>
                <a href="#linkedin" className="text-white/40 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Product
              </h3>
              <div className="flex flex-col gap-2.5">
                <Link href="#features" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Features
                </Link>
                <Link href="#pricing" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Pricing
                </Link>
                <Link href="#templates" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Templates
                </Link>
                <Link href="#integrations" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Integrations
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Company
              </h3>
              <div className="flex flex-col gap-2.5">
                <Link href="#about" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  About
                </Link>
                <Link href="#blog" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Blog
                </Link>
                <Link href="#careers" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Careers
                </Link>
                <Link href="#contact" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Support
              </h3>
              <div className="flex flex-col gap-2.5">
                <Link href="#help" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Help Centre
                </Link>
                <Link href="#whatsapp" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  WhatsApp Support
                </Link>
                <Link href="#status" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Status Page
                </Link>
                <Link href="#privacy" className="text-sm text-white/40 hover:text-white block mb-2.5">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-6 border-t border-white/10">
            <div className="text-sm text-white/25">
              © 2026 CarrotCash. All rights reserved. Built by A. Sathish Kumar
            </div>
            <div className="text-sm text-white/25">
              🇮🇳 Made in India
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
