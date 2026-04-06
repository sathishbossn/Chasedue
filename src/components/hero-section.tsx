import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap, FileText } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="eyebrow">Built for Indian Freelancers</div>
            
            <h1 className="hero-title text-balance">
              Stop Chasing Payments.{' '}
              <span className="text-gradient">Start Growing</span>{' '}
              Your Business.
            </h1>
            
            <p className="hero-subtitle text-pretty">
              ChaseDue delivers GST-compliant invoices directly to WhatsApp where clients actually respond. 
              Get paid 3× faster while you focus on what matters most - growing your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#pricing" className="btn btn-primary group">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="btn btn-secondary">
                See How It Works
              </Link>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-brand-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-brand-500" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-4-3 surface-floating rounded-2xl overflow-hidden animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-white to-accent-light"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                  <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-display font-black text-primary">₹4Cr+</div>
                    <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Revenue Processed</div>
                    <div className="text-xs text-muted">Across 500+ Indian freelancers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
