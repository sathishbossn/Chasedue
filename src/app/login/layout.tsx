import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — ChaseDue',
  description: 'Sign in to your ChaseDue workspace — GST invoices, reminders, and insights.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
