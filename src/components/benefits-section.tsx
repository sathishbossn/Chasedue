import { CheckCircle, MessageSquare, Clock, TrendingUp, Zap } from 'lucide-react'

export default function BenefitsSection() {
  return (
    <section className="section bg-gradient-to-br from-brand-50 via-white to-accent-light">
      <div className="container">
        <div className="text-center mb-20">
          <div className="eyebrow mx-auto">The Switch That Changes Everything</div>
          <h2 className="section-title max-w-3xl mx-auto text-balance">
            Why Indian freelancers are switching from email invoices to WhatsApp
          </h2>
          <p className="hero-subtitle mx-auto text-pretty max-w-2xl">
            Email invoices get lost in crowded inboxes. WhatsApp gets seen, read, and paid.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            {
              num: '3×',
              label: 'Faster Payments',
              desc: 'WhatsApp reminders get paid 3× faster than email',
              icon: <Zap className="w-5 h-5" />
            },
            {
              num: '95%',
              label: 'Message Seen Rate',
              desc: 'vs 22% for email invoices',
              icon: <MessageSquare className="w-5 h-5" />
            },
            {
              num: '15 hrs',
              label: 'Time Saved Weekly',
              desc: 'No more manual follow-ups and payment chasing',
              icon: <Clock className="w-5 h-5" />
            },
            {
              num: '89%',
              label: 'On-Time Payments',
              desc: 'Professional GST invoices get paid when due',
              icon: <TrendingUp className="w-5 h-5" />
            }
          ].map((benefit, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-brand-600">
                  {benefit.icon}
                </div>
              </div>
              <div className="text-5xl font-display font-black text-gradient mb-3">
                {benefit.num}
              </div>
              <div className="text-lg font-display font-bold text-primary mb-2">
                {benefit.label}
              </div>
              <div className="text-sm text-muted leading-relaxed">
                {benefit.desc}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-display font-bold text-primary">
                Stop the email chase. Start the WhatsApp conversation.
              </h3>
              <p className="text-body text-pretty">
                You're spending hours each week sending follow-up emails that never get read. 
                Your clients are busy, their inbox is crowded, and your invoice is just another email 
                in a sea of promotions.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-red-900">The Email Problem</h4>
                  <p className="text-sm text-red-700">
                    22% open rate, 3% response rate, endless follow-ups, delayed payments
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-12 h-0.5 bg-border"></div>
                <span className="text-sm font-display font-bold text-muted uppercase tracking-wider">VS</span>
                <div className="w-12 h-0.5 bg-border"></div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-green-900">The ChaseDue Solution</h4>
                  <p className="text-sm text-green-700">
                    95% seen rate, instant responses, smart reminders, 3× faster payments
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-display font-bold text-primary">What makes ChaseDue different:</h4>
              <div className="space-y-3">
                {[
                  'Instant WhatsApp delivery with read receipts',
                  'Smart timing based on client payment patterns',
                  'Polite automated follow-ups that feel personal',
                  'GST-compliant invoices that look professional',
                  'Real-time payment tracking and cash-flow insights'
                ].map((point, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-brand-600" />
                    </div>
                    <span className="text-body">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-4-3 surface-floating rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-white to-accent-light"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6 p-8">
                  <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-display font-black text-primary">95%</div>
                    <div className="text-sm font-semibold text-brand-600 uppercase tracking-wider">Message Seen Rate</div>
                    <div className="text-xs text-muted">vs 22% for traditional email invoices</div>
                    <div className="text-xs font-bold text-brand-600 mt-2">That's 4.3× better visibility</div>
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
