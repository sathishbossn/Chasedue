import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Plus_Jakarta_Sans, Fraunces, Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://chasedue.com'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'ChaseDue — Get paid faster. No awkward follow-ups.',
  description:
    'A single WhatsApp reminder gets you massive results — you get paid 68% of the time. Smart automated reminders for Indian freelancers.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'ChaseDue — Get paid faster. No awkward follow-ups.',
    description:
      'A single WhatsApp reminder gets you massive results — you get paid 68% of the time.',
    url: 'https://chasedue.com',
    siteName: 'ChaseDue',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'ChaseDue' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChaseDue — Get paid faster',
    description: 'WhatsApp-powered invoice chasing for Indian freelancers.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontInter.variable} ${fontSans.variable} ${fontDisplay.variable}`}>
      <body className="font-sans min-h-screen antialiased bg-charcoal text-white selection:bg-brand-500/35 selection:text-white">
        {/* Razorpay Checkout v1 — load early so /portal and in-app Pay buttons can open checkout without delay */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Toaster richColors position="top-center" theme="dark" closeButton />
        {children}
      </body>
    </html>
  )
}
