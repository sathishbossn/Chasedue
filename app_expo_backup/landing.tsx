import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isWide = width > 900;

// ── Design Tokens ─────────────────────────────────────────────────
const PINK        = '#ED13C4';
const PINK_LIGHT  = '#FDF0FB';
const PINK_BORDER = 'rgba(237,19,196,0.2)';

const BG          = '#FFFFFF';
const BG_CREAM    = '#FAF9F5';
const BG_WARM     = '#F7F4EE';
const BG_SECTION  = '#F4F2EC';

const NAVY        = '#111827';
const TEXT        = '#374151';
const TEXT_MID    = '#6B7280';
const TEXT_LIGHT  = '#9CA3AF';
const BORDER      = '#E5E7EB';
const BORDER_MID  = '#D1D5DB';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.10,
  shadowRadius: 24,
  elevation: 6,
};

const SM_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 3,
};

// ── Image paths ───────────────────────────────────────────────────
// Copy 1c.jpeg–5c.jpeg and istockphoto-*.jpg to assets/images/
const IMGS = {
  invoicing : require('../../assets/images/4c.jpeg'),
  whatsapp  : require('../../assets/images/3c.jpeg'),
  analytics : require('../../assets/images/2c.jpeg'),
  reports   : require('../../assets/images/1c.jpeg'),
  hero      : require('../../assets/images/5c.jpeg'),
  support   : require('../../assets/images/istockphoto-1413761479-612x612.jpg'),
};

// ── Feature Sections ──────────────────────────────────────────────
const FEATURES = [
  {
    tag: 'Invoicing',
    title: 'Create & send GST invoices in seconds',
    desc: "Professional GST-compliant invoices that auto-calculate CGST, SGST & IGST based on your client's state. No CA needed, no manual math.",
    points: [
      'Unlimited GST invoices',
      'Auto CGST / SGST / IGST calculation',
      'HSN & SAC code support',
      'PDF export + print-ready format',
    ],
    image: IMGS.invoicing,
    caption: 'GST-compliant invoices on any device',
  },
  {
    tag: 'Billing & Payments',
    title: 'Get paid 3× faster with WhatsApp billing',
    desc: "Send invoices directly to WhatsApp where your clients actually respond. Automated follow-up reminders chase payments so you don't have to.",
    points: [
      'One-tap WhatsApp delivery',
      'Automated payment reminders',
      'UPI & bank transfer links',
      'Real-time "viewed" receipts',
    ],
    image: IMGS.whatsapp,
    caption: 'Clients receive and pay instantly via WhatsApp',
  },
  {
    tag: 'Analytics',
    title: 'Real-time revenue insights. No spreadsheets.',
    desc: 'A live dashboard that shows revenue, expenses, and net profit updated in real-time. Know exactly how your business is performing at a glance.',
    points: [
      'Live revenue & expense dashboard',
      'Monthly & quarterly comparisons',
      'Client-wise revenue breakdown',
      'Cash flow forecasting',
    ],
    image: IMGS.analytics,
    caption: 'Live analytics — presented anywhere',
  },
  {
    tag: 'Reports & Tax',
    title: 'Tax-ready reports your CA will love',
    desc: 'One-click GST summary reports, P&L statements, and expense breakdowns — formatted exactly the way your CA needs them, every quarter.',
    points: [
      'GSTR-1 ready summaries',
      'Profit & Loss statements',
      'Expense category reports',
      'CA handoff in one click',
    ],
    image: IMGS.reports,
    caption: 'Share reports with your CA instantly',
  },
];

const TESTIMONIALS = [
  {
    quote: 'CarrotCash is so easy to use. It definitely makes accounting simpler for non-accountants. I spend 10 minutes instead of a full day on GST.',
    name: 'Priya Menon',
    role: 'Freelance Designer, Chennai',
    initials: 'PM',
  },
  {
    quote: 'I was chasing payments for weeks. After switching to WhatsApp invoicing, clients pay within 24 hours. Absolute game changer for solo work.',
    name: 'Ravi Shankar',
    role: 'Strategy Consultant, Bangalore',
    initials: 'RS',
  },
  {
    quote: 'Finally a tool built for Indian freelancers. GST auto-calc, WhatsApp send, and the analytics dashboard is cleaner than anything I have tried.',
    name: 'Ananya Krishnan',
    role: 'Brand Consultant, Hyderabad',
    initials: 'AK',
  },
];

const FAQS = [
  { q: 'What can I use CarrotCash for?',               a: 'CarrotCash is built for Indian freelancers and solopreneurs. Create GST-compliant invoices, track expenses, send payment reminders via WhatsApp, and generate tax-ready reports — all in one place.' },
  { q: 'How does CarrotCash handle GST compliance?',   a: 'CarrotCash auto-calculates CGST, SGST, and IGST based on your client\'s billing state. All invoices are GST-compliant and can be exported as GSTR-1 ready summaries.' },
  { q: 'Can I customize my invoice templates?',        a: 'Yes! Add your logo, choose accent colors, and customize the layout. All templates are print-ready and PDF-exportable.' },
  { q: 'Does CarrotCash support international billing?', a: 'Yes. Full multi-currency support — USD, EUR, GBP, AED and more. Automatically displays amounts in your preferred currency.' },
  { q: 'Is my financial data secure?',                 a: 'Absolutely. Bank-level encryption, row-level security via Supabase, and zero third-party data sharing. Only you can access your data.' },
  { q: 'What does CarrotCash cost?',                   a: 'CarrotCash starts free with unlimited invoices. Paid plans start at ₹299/month and include WhatsApp delivery, analytics, and priority support.' },
  { q: 'Can I migrate from Zoho, Vyapar, or Excel?',  a: 'Yes. Import your client list and invoice history from CSV. Our team assists with migration from any tool.' },
  { q: 'Does CarrotCash offer customer support?',      a: 'Yes — WhatsApp support, email, and a searchable help centre in English and Tamil. Most queries resolved within 2 hours.' },
];

// ── Component ─────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const go = () => router.push('/(auth)/login');

  return (
    <SafeAreaView style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── NAV ─────────────────────────────────────────────── */}
        <View style={s.nav}>
          <Text style={s.logo}>Carrot<Text style={s.logoAccent}>Cash</Text></Text>
          {isWide && (
            <View style={s.navLinks}>
              {['Features','Pricing','Blog','Support'].map(l => (
                <Text key={l} style={s.navLink}>{l}</Text>
              ))}
            </View>
          )}
          <View style={s.navCtas}>
            <TouchableOpacity style={s.btnNavPink} onPress={() => {}}>
              <Text style={s.btnNavPinkTxt}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── HERO ────────────────────────────────────────────── */}
        <View style={s.hero}>
          <View style={s.heroGradient} />
          <View style={s.heroGradient2} />
          <Animated.View entering={FadeInLeft.duration(700)} style={s.heroLeft}>
            <View style={s.badge}>
              <View style={s.badgeDot} />
              <Text style={s.badgeTxt}>Built for Indian Solopreneurs</Text>
            </View>
            <Text style={s.heroTitle}>
              Stop Chasing.{'\n'}
              <Text style={s.heroPink}>Start Getting</Text>{'\n'}
              Paid.
            </Text>
            <Text style={s.heroSub}>
              GST invoices, WhatsApp billing & live analytics — built for Indian freelancers who mean business.
            </Text>
            <View style={s.heroBtns}>
              <TouchableOpacity style={s.btnBig} onPress={go}>
                <Text style={s.btnBigTxt}>Start Free — No Card</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnBigGhost} onPress={go}>
                <Text style={s.btnBigGhostTxt}>Try It Free</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.heroNote}>No credit card required · Cancel anytime</Text>
            <View style={s.socialProof}>
              <View style={s.avatarRow}>
                {['PM','RS','AK','VR'].map((ini, i) => (
                  <View key={ini} style={[s.miniAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 4-i }]}>
                    <Text style={s.miniAvatarTxt}>{ini}</Text>
                  </View>
                ))}
              </View>
              <View>
                <View style={s.stars}>
                  {[1,2,3,4,5].map(n => <Ionicons key={n} name="star" size={13} color="#FBBF24" />)}
                </View>
                <Text style={s.socialTxt}>Loved by 500+ Indian freelancers</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInRight.duration(700)} style={s.heroRight}>
            <View style={[s.heroImgWrap, CARD_SHADOW]}>
              <Image source={IMGS.hero} style={s.heroImg} resizeMode="cover" />
              <View style={[s.heroFloat, SM_SHADOW]}>
                <View style={s.heroFloatRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                  <Text style={s.heroFloatLabel}>Invoice #INV-0042 paid</Text>
                </View>
                <Text style={s.heroFloatAmt}>₹17,700 received</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* ─── TRUST BAR ───────────────────────────────────────── */}
        <View style={s.trustBar}>
          <Text style={s.trustLabel}>Trusted by freelancers across India</Text>
          <View style={s.trustLogos}>
            {['Zoho','Razorpay','Supabase','Expo','GitHub'].map(l => (
              <Text key={l} style={s.trustLogo}>{l}</Text>
            ))}
          </View>
        </View>

        {/* ─── FEATURES INTRO ──────────────────────────────────── */}
        <View style={s.featIntro}>
          <Text style={s.featIntroTag}>The features you need. All in one place.</Text>
          <Text style={s.featIntroTitle}>
            Everything a freelancer needs{'\n'}to get paid on time
          </Text>
        </View>

        {/* ─── BENTO GRID FEATURES ─────────────────────────────── */}
        <View style={s.bentoSection}>
          <View style={s.bentoGrid}>
            {/* Large Invoicing Card (2x2) */}
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[s.bentoCard, s.bentoLarge]}>
              <View style={s.bentoIcon}>
                <Ionicons name="document-text" size={32} color={PINK} />
              </View>
              <Text style={s.bentoTitle}>Invoicing</Text>
              <Text style={s.bentoDesc}>
                Professional GST-compliant invoices that auto-calculate CGST, SGST & IGST based on your client's state.
              </Text>
              <View style={s.bentoFeatures}>
                {['Unlimited GST invoices', 'Auto CGST/SGST calculation', 'HSN & SAC codes', 'PDF export'].map((feature, i) => (
                  <View key={i} style={s.bentoFeature}>
                    <Ionicons name="checkmark-circle" size={16} color={PINK} />
                    <Text style={s.bentoFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* WhatsApp Delivery Card */}
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[s.bentoCard, s.bentoSmall]}>
              <View style={s.bentoIcon}>
                <Ionicons name="logo-whatsapp" size={24} color={PINK} />
              </View>
              <Text style={s.bentoTitle}>WhatsApp Delivery</Text>
              <Text style={s.bentoDesc}>
                Send invoices directly to WhatsApp where clients actually respond.
              </Text>
            </Animated.View>

            {/* Real-time Analytics Card */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[s.bentoCard, s.bentoSmall]}>
              <View style={s.bentoIcon}>
                <Ionicons name="bar-chart" size={24} color={PINK} />
              </View>
              <Text style={s.bentoTitle}>Real-time Analytics</Text>
              <Text style={s.bentoDesc}>
                Live dashboard showing revenue, expenses, and net profit in real-time.
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* ─── PRICING ──────────────────────────────────────────── */}
        <View style={s.pricingSection}>
          <Text style={s.pricingTitle}>Simple, transparent pricing</Text>
          <Text style={s.pricingSub}>Start free, scale as you grow</Text>
          
          <View style={s.pricingCards}>
            <View style={[s.pricingCard, s.pricingCardFree]}>
              <Text style={s.pricingCardTitle}>Starter</Text>
              <Text style={s.pricingCardPrice}>Free</Text>
              <Text style={s.pricingCardDesc}>Perfect for freelancers just getting started</Text>
              <View style={s.pricingFeatures}>
                {['Unlimited invoices', '5 clients', 'Basic analytics'].map((feature, i) => (
                  <View key={i} style={s.pricingFeature}>
                    <Ionicons name="checkmark" size={16} color={PINK} />
                    <Text style={s.pricingFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.btnPricingFree}>
                <Text style={s.btnPricingFreeTxt}>Get Started</Text>
              </TouchableOpacity>
            </View>
            
            <View style={[s.pricingCard, s.pricingCardPro]}>
              <View style={s.pricingBadge}>
                <Text style={s.pricingBadgeTxt}>Most Popular</Text>
              </View>
              <Text style={s.pricingCardTitle}>Professional</Text>
              <Text style={s.pricingCardPrice}>₹299<span style={s.pricingCardPeriod}>/month</span></Text>
              <Text style={s.pricingCardDesc}>For growing freelancers who need more power</Text>
              <View style={s.pricingFeatures}>
                {['Everything in Starter', 'Unlimited clients', 'WhatsApp delivery', 'Advanced analytics', 'Priority support'].map((feature, i) => (
                  <View key={i} style={s.pricingFeature}>
                    <Ionicons name="checkmark" size={16} color={PINK} />
                    <Text style={s.pricingFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={s.btnPricingPro}>
                <Text style={s.btnPricingProTxt}>Start Free Trial</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ─── STATS STRIP ─────────────────────────────────────── */}
        <View style={s.statsStrip}>
          {[
            { num: '500+',   lbl: 'Active freelancers' },
            { num: '₹4Cr+',  lbl: 'Revenue tracked'   },
            { num: '3×',     lbl: 'Faster payments'    },
            { num: '10 hrs', lbl: 'Saved per month'    },
          ].map((st, i) => (
            <View key={i} style={[s.statItem, i < 3 && s.statBorder]}>
              <Text style={s.statNum}>{st.num}</Text>
              <Text style={s.statLbl}>{st.lbl}</Text>
            </View>
          ))}
        </View>

        {/* ─── TESTIMONIALS ────────────────────────────────────── */}
        <View style={s.testimonialSec}>
          <Text style={s.testimonialPre}>Don't take our word for it,</Text>
          <Text style={s.testimonialHead}>take theirs</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.testimonialScroll}
          >
            {TESTIMONIALS.map((t, i) => (
              <View key={i} style={[s.tCard, SM_SHADOW]}>
                <View style={s.stars}>
                  {[1,2,3,4,5].map(n => <Ionicons key={n} name="star" size={14} color="#FBBF24" />)}
                </View>
                <Text style={s.tQuote}>"{t.quote}"</Text>
                <View style={s.tAuthor}>
                  <View style={s.tAvatar}>
                    <Text style={s.tAvatarTxt}>{t.initials}</Text>
                  </View>
                  <View>
                    <Text style={s.tName}>{t.name}</Text>
                    <Text style={s.tRole}>{t.role}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ─── SUPPORT ─────────────────────────────────────────── */}
        <View style={s.supportSec}>
          <View style={s.supportLeft}>
            <Text style={s.supportEye}>Support that actually supports you 💜</Text>
            <Text style={s.supportTitle}>We're here whenever{'\n'}you need us</Text>
            <Text style={s.supportDesc}>
              Real humans answer within 2 hours. WhatsApp support, email, and a searchable help centre — in English and Tamil.
            </Text>
            <View style={s.supportBtns}>
              <TouchableOpacity style={s.btnBig} onPress={go}>
                <Text style={s.btnBigTxt}>Start Free</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnBigGhost} onPress={go}>
                <Text style={s.btnBigGhostTxt}>Help Centre</Text>
              </TouchableOpacity>
            </View>
            <View style={s.supportStats}>
              {[{v:'4.9★',l:'App rating'},{v:'<2hr',l:'Response time'},{v:'24/7',l:'Help centre'}].map(st => (
                <View key={st.l} style={s.supportStat}>
                  <Text style={s.supportStatV}>{st.v}</Text>
                  <Text style={s.supportStatL}>{st.l}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={s.supportRight}>
            <View style={[s.supportImgCard, CARD_SHADOW]}>
              <Image source={IMGS.support} style={s.supportImg} resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* ─── INTEGRATIONS PINK BANNER ────────────────────────── */}
        <View style={s.integBanner}>
          <Text style={s.integSub}>100+ integrations · Infinite possibilities</Text>
          <Text style={s.integTitle}>More reasons to love CarrotCash</Text>
          <View style={s.integChips}>
            {['Zapier','Razorpay','Tally','Excel','WhatsApp','Gmail','Stripe','Cashfree'].map(app => (
              <View key={app} style={s.integChip}>
                <Text style={s.integChipTxt}>{app}</Text>
              </View>
            ))}
          </View>
          <View style={s.integStats}>
            {[{n:'160+',l:'Invoice templates'},{n:'₹7K+',l:'Crore invoiced'},{n:'30M+',l:'Invoices sent'}].map((st,i) => (
              <View key={i} style={[s.integStat, i > 0 && s.integStatBorder]}>
                <Text style={s.integStatN}>{st.n}</Text>
                <Text style={s.integStatL}>{st.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── FAQ ─────────────────────────────────────────────── */}
        <View style={s.faqSec}>
          <Text style={s.faqTitle}>Frequently Asked Questions</Text>
          <View style={s.faqList}>
            {FAQS.map((faq, i) => (
              <View key={i} style={s.faqItem}>
                <TouchableOpacity
                  style={s.faqQ}
                  onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.faqQTxt, expandedFaq === i && s.faqQActive]}>{faq.q}</Text>
                  <View style={[s.faqChev, expandedFaq === i && s.faqChevActive]}>
                    <Ionicons name={expandedFaq === i ? 'chevron-up' : 'chevron-down'} size={16}
                      color={expandedFaq === i ? PINK : TEXT_LIGHT} />
                  </View>
                </TouchableOpacity>
                {expandedFaq === i && (
                  <Animated.View entering={FadeIn.duration(200)}>
                    <Text style={s.faqA}>{faq.a}</Text>
                  </Animated.View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ─── CTA BANNER ──────────────────────────────────────── */}
        <View style={s.ctaBanner}>
          <View style={s.ctaInner}>
            <View style={s.ctaLeft}>
              <Text style={s.ctaTitle}>Ready to get started?</Text>
              <Text style={s.ctaDesc}>
                Join 500+ Indian freelancers already using CarrotCash to get paid faster and stress less about GST.
              </Text>
              <View style={s.ctaBtns}>
                <TouchableOpacity style={s.btnBig} onPress={go}>
                  <Text style={s.btnBigTxt}>Start Free</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnCtaGhost} onPress={go}>
                  <Text style={s.btnCtaGhostTxt}>Try It Free</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.ctaRight}>
              <View style={[s.ctaMockup, CARD_SHADOW]}>
                <View style={s.ctaMHead}>
                  <Text style={s.ctaMHeadTxt}>CarrotCash Dashboard</Text>
                  <View style={s.ctaDots}>
                    {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                      <View key={c} style={[s.ctaDot, { backgroundColor: c }]} />
                    ))}
                  </View>
                </View>
                <View style={s.ctaMBody}>
                  <Text style={s.ctaMLbl}>Total Revenue · Oct 2026</Text>
                  <Text style={s.ctaMVal}>₹1,24,500</Text>
                  <View style={s.ctaBarTrack}>
                    <View style={s.ctaBarFill} />
                  </View>
                  <View style={s.ctaMRow}>
                    <Text style={s.ctaMGreen}>↑ 23% vs last month</Text>
                    <Text style={s.ctaMBadge}>84% collected</Text>
                  </View>
                  <View style={s.ctaMStats}>
                    {[{l:'Invoices',v:'12'},{l:'Clients',v:'8'},{l:'Pending',v:'₹19.8K'}].map(st => (
                      <View key={st.l} style={s.ctaMStat}>
                        <Text style={s.ctaMStatV}>{st.v}</Text>
                        <Text style={s.ctaMStatL}>{st.l}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ─── FOOTER ──────────────────────────────────────────── */}
        <View style={s.footer}>
          <View style={s.footerTop}>
            <View style={s.footerBrand}>
              <Text style={s.footerLogo}>Carrot<Text style={s.logoAccent}>Cash</Text></Text>
              <Text style={s.footerTag}>Built for Indian freelancers.{'\n'}With ❤️ from Chennai.</Text>
              <View style={s.footerSocials}>
                {['logo-twitter','logo-linkedin','logo-instagram'].map(ic => (
                  <View key={ic} style={s.footerSIcon}>
                    <Ionicons name={ic as any} size={15} color="rgba(255,255,255,0.45)" />
                  </View>
                ))}
              </View>
            </View>
            {[
              { h: 'Product',  ls: ['Features','Pricing','Templates','Integrations','Changelog'] },
              { h: 'Company',  ls: ['About','Blog','Careers','Press','Contact'] },
              { h: 'Support',  ls: ['Help Centre','WhatsApp Support','Status Page','Privacy Policy','Terms'] },
            ].map(col => (
              <View key={col.h} style={s.footerCol}>
                <Text style={s.footerColH}>{col.h}</Text>
                {col.ls.map(l => <Text key={l} style={s.footerLink}>{l}</Text>)}
              </View>
            ))}
          </View>
          <View style={s.footerBottom}>
            <Text style={s.footerCopy}>© 2026 CarrotCash. All rights reserved. Built by A. Sathish Kumar</Text>
            <Text style={s.footerMade}>🇮🇳 Made in India</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // NAV
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: isWide ? 48 : 20, paddingVertical: 16,
    backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  logo: { fontSize: 22, fontWeight: '800', color: NAVY, letterSpacing: -0.5, fontFamily: 'Poppins' },
  logoAccent: { color: PINK },
  navLinks: { flexDirection: 'row', gap: 32, flex: 1, justifyContent: 'center' },
  navLink: { fontSize: 15, color: TEXT_MID, fontWeight: '500' },
  navCtas: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  navLogin: { fontSize: 15, color: TEXT, fontWeight: '600' },
  btnNavPink: { backgroundColor: PINK, paddingVertical: 10, paddingHorizontal: 22, borderRadius: 8 },
  btnNavPinkTxt: { fontSize: 14, color: '#fff', fontWeight: '700' },

  // HERO
  hero: {
    backgroundColor: BG,
    paddingHorizontal: isWide ? 48 : 20,
    paddingTop: isWide ? 80 : 48,
    paddingBottom: isWide ? 80 : 48,
    flexDirection: isWide ? 'row' : 'column',
    alignItems: 'center',
    gap: isWide ? 64 : 40,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute',
    top: -200,
    right: -200,
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: 'rgba(237, 19, 196, 0.08)',
  },
  heroGradient2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(237, 19, 196, 0.05)',
  },
  heroLeft: { flex: 1, maxWidth: 560 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    backgroundColor: PINK_LIGHT, borderWidth: 1, borderColor: PINK_BORDER,
    paddingVertical: 6, paddingHorizontal: 14, borderRadius: 100, marginBottom: 24,
  },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: PINK },
  badgeTxt: { fontSize: 12, fontWeight: '700', color: PINK, textTransform: 'uppercase', letterSpacing: 0.8 },
  heroTitle: {
    fontSize: isWide ? 60 : 40, fontWeight: '800', color: NAVY,
    lineHeight: isWide ? 70 : 50, letterSpacing: -2.5, marginBottom: 20,
    fontFamily: 'Poppins',
  },
  heroPink: { color: PINK },
  heroSub: { fontSize: 18, color: TEXT_MID, lineHeight: 30, marginBottom: 36, fontWeight: '400', fontFamily: 'Lora' },
  heroBtns: { flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginBottom: 16 },
  btnBig: { backgroundColor: PINK, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 10 },
  btnBigTxt: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnBigGhost: {
    borderWidth: 1.5, borderColor: BORDER_MID,
    paddingVertical: 16, paddingHorizontal: 28, borderRadius: 10, backgroundColor: BG,
  },
  btnBigGhostTxt: { color: TEXT, fontSize: 16, fontWeight: '600' },
  heroNote: { fontSize: 13, color: TEXT_LIGHT, marginBottom: 32 },
  socialProof: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarRow: { flexDirection: 'row' },
  miniAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: PINK_LIGHT, borderWidth: 2, borderColor: BG,
    alignItems: 'center', justifyContent: 'center',
  },
  miniAvatarTxt: { fontSize: 10, fontWeight: '800', color: PINK },
  stars: { flexDirection: 'row', gap: 2, marginBottom: 2 },
  socialTxt: { fontSize: 13, color: TEXT_MID, fontWeight: '500' },
  heroRight: { flex: 1, alignItems: 'center' },
  heroImgWrap: {
    width: isWide ? 520 : width - 40,
    borderRadius: 20, overflow: 'hidden', position: 'relative',
  },
  heroImg: { width: '100%', height: isWide ? 420 : 280, borderRadius: 20 },
  heroFloat: {
    position: 'absolute', bottom: 20, left: 20,
    backgroundColor: BG, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16,
    borderWidth: 1, borderColor: BORDER,
  },
  heroFloatRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  heroFloatLabel: { fontSize: 13, color: TEXT, fontWeight: '600' },
  heroFloatAmt: { fontSize: 15, fontWeight: '800', color: PINK, letterSpacing: -0.5 },

  // TRUST BAR
  trustBar: {
    backgroundColor: BG_WARM, paddingVertical: 20,
    paddingHorizontal: isWide ? 48 : 20,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: BORDER,
    flexDirection: isWide ? 'row' : 'column', alignItems: 'center', gap: 20,
  },
  trustLabel: { fontSize: 13, color: TEXT_LIGHT, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  trustLogos: { flexDirection: 'row', gap: 32, flexWrap: 'wrap', justifyContent: 'center' },
  trustLogo: { fontSize: 15, color: TEXT_MID, fontWeight: '700' },

  // FEATURES INTRO
  featIntro: {
    paddingHorizontal: isWide ? 48 : 20, paddingTop: 72, paddingBottom: 48, alignItems: 'center',
  },
  featIntroTag: {
    fontSize: 14, color: PINK, fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: 1.2, marginBottom: 16, textAlign: 'center',
  },
  featIntroTitle: {
    fontSize: isWide ? 42 : 28, fontWeight: '800', color: NAVY,
    letterSpacing: -1.5, textAlign: 'center', lineHeight: isWide ? 52 : 36,
  },

  // FEATURE ROWS
  featRow: {
    flexDirection: isWide ? 'row' : 'column',
    paddingHorizontal: isWide ? 48 : 20,
    paddingVertical: isWide ? 80 : 48,
    gap: isWide ? 64 : 40, alignItems: 'center',
  },
  featWhite: { backgroundColor: BG },
  featCream: { backgroundColor: BG_CREAM },
  featReverse: { flexDirection: 'row-reverse' },
  featTxt: { flex: 1, maxWidth: isWide ? 460 : '100%' },
  tagPill: {
    alignSelf: 'flex-start', backgroundColor: PINK_LIGHT,
    borderWidth: 1, borderColor: PINK_BORDER,
    paddingVertical: 5, paddingHorizontal: 14, borderRadius: 100, marginBottom: 18,
  },
  tagPillTxt: { fontSize: 12, color: PINK, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  featTitle: {
    fontSize: isWide ? 32 : 24, fontWeight: '800', color: NAVY,
    letterSpacing: -1, lineHeight: isWide ? 40 : 32, marginBottom: 14, fontFamily: 'Poppins',
  },
  featDesc: { fontSize: 16, color: TEXT_MID, lineHeight: 27, marginBottom: 28, fontFamily: 'Lora' },
  featPoints: { gap: 14, marginBottom: 28 },
  featPt: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featPtDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: PINK_LIGHT, borderWidth: 1, borderColor: PINK_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featPtTxt: { fontSize: 15, color: TEXT, fontWeight: '500', flex: 1 },
  featLink: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  featLinkTxt: { fontSize: 15, color: PINK, fontWeight: '700' },
  featImgWrap: { flex: 1, alignItems: 'center' },
  featImgCard: { width: isWide ? 500 : width - 40, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  featImg: { width: '100%', height: isWide ? 380 : 240, borderRadius: 20 },
  featImgOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,24,39,0.5)',
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  featImgCaption: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  // PRICING
  pricingSection: {
    paddingHorizontal: isWide ? 48 : 20,
    paddingVertical: 80,
    backgroundColor: BG_CREAM,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: isWide ? 42 : 28,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  pricingSub: {
    fontSize: 18,
    color: TEXT_MID,
    textAlign: 'center',
    marginBottom: 48,
    fontFamily: 'Lora',
  },
  pricingCards: {
    flexDirection: isWide ? 'row' : 'column',
    gap: 32,
    maxWidth: 800,
    width: '100%',
  },
  pricingCard: {
    flex: 1,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  pricingCardFree: {},
  pricingCardPro: {
    borderWidth: 2,
    borderColor: PINK,
    transform: [{ scale: isWide ? 1.05 : 1 }],
  },
  pricingBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: PINK,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  pricingBadgeTxt: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pricingCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  pricingCardPrice: {
    fontSize: 48,
    fontWeight: '800',
    color: NAVY,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  pricingCardPeriod: {
    fontSize: 18,
    fontWeight: '400',
    color: TEXT_MID,
    fontFamily: 'Poppins',
  },
  pricingCardDesc: {
    fontSize: 14,
    color: TEXT_MID,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Lora',
  },
  pricingFeatures: {
    gap: 12,
    marginBottom: 32,
    width: '100%',
  },
  pricingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pricingFeatureText: {
    fontSize: 14,
    color: TEXT,
    fontWeight: '500',
  },
  btnPricingFree: {
    borderWidth: 1.5,
    borderColor: BORDER_MID,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
  },
  btnPricingFreeTxt: {
    fontSize: 15,
    color: TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },
  btnPricingPro: {
    backgroundColor: PINK,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
  },
  btnPricingProTxt: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },

  // STATS STRIP
  statsStrip: {
    backgroundColor: NAVY, flexDirection: isWide ? 'row' : 'column',
    justifyContent: 'center', paddingVertical: 56, paddingHorizontal: isWide ? 48 : 20,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: isWide ? 0 : 20 },
  statBorder: {
    borderRightWidth: isWide ? 1 : 0, borderBottomWidth: isWide ? 0 : 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNum: { fontSize: isWide ? 44 : 36, fontWeight: '800', color: PINK, letterSpacing: -2, marginBottom: 6 },
  statLbl: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },

  // TESTIMONIALS
  testimonialSec: {
    backgroundColor: BG_CREAM, paddingTop: 72, paddingBottom: 72,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  testimonialPre: { fontSize: isWide ? 36 : 26, fontWeight: '800', color: NAVY, textAlign: 'center', letterSpacing: -1 },
  testimonialHead: { fontSize: isWide ? 36 : 26, fontWeight: '800', color: PINK, textAlign: 'center', letterSpacing: -1, marginBottom: 40 },
  testimonialScroll: { paddingHorizontal: isWide ? 48 : 20, gap: 20 },
  tCard: { width: isWide ? 360 : width - 80, backgroundColor: BG, borderRadius: 16, padding: 28, borderWidth: 1, borderColor: BORDER },
  tQuote: { fontSize: 15, color: TEXT, lineHeight: 25, fontStyle: 'italic', marginTop: 10, marginBottom: 24 },
  tAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: PINK_LIGHT,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: PINK_BORDER,
  },
  tAvatarTxt: { fontSize: 13, fontWeight: '800', color: PINK },
  tName: { fontSize: 14, fontWeight: '700', color: NAVY },
  tRole: { fontSize: 12, color: TEXT_LIGHT, marginTop: 1 },

  // SUPPORT
  supportSec: {
    flexDirection: isWide ? 'row' : 'column',
    paddingHorizontal: isWide ? 48 : 20, paddingVertical: isWide ? 80 : 48,
    gap: isWide ? 64 : 40, alignItems: 'center', backgroundColor: BG,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  supportLeft: { flex: 1 },
  supportEye: { fontSize: 14, color: TEXT_MID, fontWeight: '600', marginBottom: 14 },
  supportTitle: {
    fontSize: isWide ? 38 : 26, fontWeight: '800', color: NAVY,
    letterSpacing: -1.5, lineHeight: isWide ? 48 : 34, marginBottom: 16,
  },
  supportDesc: { fontSize: 16, color: TEXT_MID, lineHeight: 27, marginBottom: 32 },
  supportBtns: { flexDirection: 'row', gap: 14, marginBottom: 40, flexWrap: 'wrap' },
  supportStats: { flexDirection: 'row', gap: 36 },
  supportStat: {},
  supportStatV: { fontSize: 28, fontWeight: '800', color: PINK, letterSpacing: -1, marginBottom: 2 },
  supportStatL: { fontSize: 12, color: TEXT_LIGHT, fontWeight: '500' },
  supportRight: { flex: 1, alignItems: 'center' },
  supportImgCard: { width: isWide ? 480 : width - 40, borderRadius: 20, overflow: 'hidden' },
  supportImg: { width: '100%', height: isWide ? 380 : 240, borderRadius: 20 },

  // INTEGRATIONS BANNER
  integBanner: {
    backgroundColor: PINK, paddingHorizontal: isWide ? 48 : 20, paddingVertical: 64, alignItems: 'center',
  },
  integSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
  integTitle: { fontSize: isWide ? 36 : 24, fontWeight: '800', color: '#fff', letterSpacing: -1, marginBottom: 36, textAlign: 'center' },
  integChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 48 },
  integChip: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)', paddingVertical: 9, paddingHorizontal: 18, borderRadius: 100,
  },
  integChipTxt: { fontSize: 14, color: '#fff', fontWeight: '600' },
  integStats: { flexDirection: 'row' },
  integStat: { alignItems: 'center', paddingHorizontal: isWide ? 56 : 24 },
  integStatBorder: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' },
  integStatN: { fontSize: isWide ? 38 : 28, fontWeight: '800', color: '#fff', letterSpacing: -1.5, marginBottom: 4 },
  integStatL: { fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },

  // FAQ
  faqSec: { backgroundColor: BG_CREAM, paddingHorizontal: isWide ? 48 : 20, paddingVertical: 72 },
  faqTitle: { fontSize: isWide ? 38 : 26, fontWeight: '800', color: NAVY, textAlign: 'center', letterSpacing: -1.5, marginBottom: 48 },
  faqList: { maxWidth: 760, alignSelf: 'center', width: '100%' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: BORDER },
  faqQ: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 22, gap: 20 },
  faqQTxt: { flex: 1, fontSize: 16, fontWeight: '600', color: NAVY },
  faqQActive: { color: PINK },
  faqChev: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: BG_SECTION,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  faqChevActive: { backgroundColor: PINK_LIGHT },
  faqA: { fontSize: 15, color: TEXT_MID, lineHeight: 26, paddingBottom: 22 },

  // CTA BANNER
  ctaBanner: { backgroundColor: NAVY },
  ctaInner: {
    flexDirection: isWide ? 'row' : 'column', alignItems: 'center',
    paddingHorizontal: isWide ? 64 : 20, paddingVertical: isWide ? 80 : 56, gap: isWide ? 64 : 48,
  },
  ctaLeft: { flex: 1 },
  ctaTitle: { fontSize: isWide ? 44 : 30, fontWeight: '800', color: '#fff', letterSpacing: -2, marginBottom: 14, lineHeight: isWide ? 52 : 38 },
  ctaDesc: { fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 27, marginBottom: 36 },
  ctaBtns: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  btnCtaGhost: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 10 },
  btnCtaGhostTxt: { color: '#fff', fontSize: 16, fontWeight: '600' },
  ctaRight: { flex: 1, alignItems: 'center' },
  ctaMockup: {
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16,
    width: isWide ? 320 : width - 40, overflow: 'hidden',
  },
  ctaMHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  ctaMHeadTxt: { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  ctaDots: { flexDirection: 'row', gap: 5 },
  ctaDot: { width: 8, height: 8, borderRadius: 4 },
  ctaMBody: { padding: 20 },
  ctaMLbl: { fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  ctaMVal: { fontSize: 34, fontWeight: '800', color: '#fff', letterSpacing: -1.5, marginBottom: 14 },
  ctaBarTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' },
  ctaBarFill: { height: '100%', width: '84%', backgroundColor: PINK, borderRadius: 2 },
  ctaMRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  ctaMGreen: { fontSize: 12, color: '#4ADE80', fontWeight: '600' },
  ctaMBadge: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
  ctaMStats: { flexDirection: 'row', justifyContent: 'space-between' },
  ctaMStat: { alignItems: 'center' },
  ctaMStatV: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  ctaMStatL: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  // BENTO GRID
  bentoSection: { paddingHorizontal: isWide ? 48 : 20, paddingVertical: 80, backgroundColor: BG },
  bentoGrid: {
    flexDirection: isWide ? 'row' : 'column',
    gap: 20,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  bentoCard: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 24,
    flex: 1,
  },
  bentoLarge: {
    flex: isWide ? 2 : 1,
    minHeight: isWide ? 400 : 300,
  },
  bentoSmall: {
    flex: 1,
    minHeight: isWide ? 180 : 140,
  },
  bentoIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: PINK_LIGHT,
    borderWidth: 1,
    borderColor: PINK_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bentoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NAVY,
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  bentoDesc: {
    fontSize: 15,
    color: TEXT_MID,
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'Lora',
  },
  bentoFeatures: {
    gap: 12,
  },
  bentoFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bentoFeatureText: {
    fontSize: 14,
    color: TEXT,
    fontWeight: '500',
  },

  // FOOTER
  footer: { backgroundColor: '#0D0D1A', paddingHorizontal: isWide ? 48 : 20, paddingTop: 56, paddingBottom: 32 },
  footerTop: { flexDirection: isWide ? 'row' : 'column', gap: isWide ? 48 : 36, marginBottom: 48 },
  footerBrand: { flex: 2 },
  footerLogo: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5, marginBottom: 12 },
  footerTag: { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 22, marginBottom: 20 },
  footerSocials: { flexDirection: 'row', gap: 10 },
  footerSIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  footerCol: { flex: 1, gap: 10 },
  footerColH: { fontSize: 12, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  footerLink: { fontSize: 14, color: 'rgba(255,255,255,0.4)' },
  footerBottom: {
    flexDirection: isWide ? 'row' : 'column', justifyContent: 'space-between',
    alignItems: isWide ? 'center' : 'flex-start', gap: 8,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingTop: 24,
  },
  footerCopy: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },
  footerMade: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },
});