import Link from 'next/link'
import { CheckCircle, MessageSquare, BarChart3, FileText, ArrowRight, Star, Zap, Shield } from 'lucide-react'
import HeroSection from '@/components/hero-section'
import BenefitsSection from '@/components/benefits-section'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <nav className="nav-premium sticky top-0 z-50">
        <div className="container-premium">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900">
                Chase<span className="gradient-text">Due</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="nav-premium-a">Features</Link>
              <Link href="#pricing" className="nav-premium-a">Pricing</Link>
              <Link href="#testimonials" className="nav-premium-a">Testimonials</Link>
              <Link href="#support" className="nav-premium-a">Support</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="#pricing" className="btn-premium btn-premium-secondary">
                Sign In
              </Link>
              <Link href="#pricing" className="btn-premium btn-premium-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />

      {/* Features Intro */}
      <section className="section-padding bg-subtle">
        <div className="container-premium text-center">
          <div className="eyebrow mx-auto">The features you need</div>
          <h2 className="section-title max-w-4xl mx-auto text-balance">
            Everything a freelancer needs to get paid on time, without the complexity
          </h2>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="section-padding" id="features">
        <div className="container-premium">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Large Invoicing Card */}
            <div className="feature-card lg:col-span-2 lg:row-span-2">
              <div className="feature-icon">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Smart Invoicing</h3>
              <p className="text-muted mb-6 text-pretty">
                Professional GST-compliant invoices that auto-calculate CGST, SGST & IGST based on your client's state. 
                No more manual calculations, no more mistakes.
              </p>
              <div className="space-y-3">
                {[
                  'Unlimited GST invoices',
                  'Auto CGST/SGST calculation', 
                  'HSN & SAC codes included',
                  'PDF export ready'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Delivery Card */}
            <div className="feature-card">
              <div className="feature-icon">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">WhatsApp Delivery</h3>
              <p className="text-muted text-pretty">
                Send invoices directly to WhatsApp where clients actually respond and pay faster.
              </p>
            </div>

            {/* Analytics Card */}
            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Real-time Analytics</h3>
              <p className="text-muted text-pretty">
                Live dashboard showing revenue, expenses, and net profit in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection />

      {/* Pricing Section */}
      <section className="section-padding bg-subtle" id="pricing">
        <div className="container-premium">
          <div className="text-center mb-16">
            <div className="eyebrow mx-auto">Simple, transparent pricing</div>
            <h2 className="section-title max-w-2xl mx-auto text-balance">
              Start free, scale as you grow
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="pricing-card">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Starter</h3>
                <div className="text-5xl font-display font-black gradient-text mb-2">Free</div>
                <p className="text-muted">Perfect for freelancers just getting started</p>
              </div>
              <div className="space-y-3 mb-8">
                {['Unlimited invoices', '5 clients', 'Basic analytics'].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <a href="https://lemonsqueezy.com" className="btn-premium btn-premium-secondary w-full">
                Get Started
              </a>
            </div>
            
            <div className="pricing-card featured">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="stat-chip">
                  Most Popular
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">Professional</h3>
                <div className="text-5xl font-display font-black gradient-text mb-2">
                  ₹299<span className="text-xl font-normal text-muted">/month</span>
                </div>
                <p className="text-muted">For growing freelancers who need more power</p>
              </div>
              <div className="space-y-3 mb-8">
                {[
                  'Everything in Starter',
                  'Unlimited clients', 
                  'WhatsApp delivery',
                  'Advanced analytics',
                  'Priority support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <a href="https://lemonsqueezy.com" className="btn-premium btn-premium-primary w-full">
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-premium text-center">
          <h2 className="section-title max-w-2xl mx-auto mb-6 text-balance">
            Ready to get paid 3× faster?
          </h2>
          <p className="hero-subtitle mx-auto mb-8 text-pretty">
            Join 500+ Indian freelancers who've already switched to ChaseDue and never looked back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://lemonsqueezy.com" className="btn-premium btn-premium-primary group">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="#features" className="btn-premium btn-premium-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-premium section-padding">
        <div className="container-premium">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-display font-bold text-white">
                  Chase<span className="gradient-text">Due</span>
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Built for Indian freelancers.<br />
                With ❤️ from Chennai.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4.22s1.89 1.81 4.86 2.66a4.48 4.48 0 001.92-2.48 10.78 10.78 0 013.07 3.66 4.48 4.48 0 00-1.92-2.48 4.48 4.48 0 00-4.48 4.48 4.48 4.48 0 00-4.48-4.48A10.78 10.78 0 011.94 3.66 10.66 10.66 0 003 4.22a10.9 10.9 0 01-3.14 1.53"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white mb-4">Product</h3>
              <div className="space-y-3">
                <Link href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</Link>
                <Link href="#pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="#templates" className="block text-gray-400 hover:text-white transition-colors">Templates</Link>
                <Link href="#integrations" className="block text-gray-400 hover:text-white transition-colors">Integrations</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white mb-4">Company</h3>
              <div className="space-y-3">
                <Link href="#about" className="block text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="#blog" className="block text-gray-400 hover:text-white transition-colors">Blog</Link>
                <Link href="#careers" className="block text-gray-400 hover:text-white transition-colors">Careers</Link>
                <Link href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2026 ChaseDue. All rights reserved. Built by A. Sathish Kumar
            </div>
            <div className="text-gray-400 text-sm">
              🇮🇳 Made in India
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
