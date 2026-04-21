import Image from 'next/image'

/**
 * PayPal + Lemon Squeezy marks for landing and portal footers (logos in `/public/payment-logos`).
 */
export default function PaymentPartnerLogos({
  className = '',
  variant = 'default',
}: {
  className?: string
  /** `compact` uses smaller logos for narrow portal layout */
  variant?: 'default' | 'compact'
}) {
  const h = variant === 'compact' ? 22 : 28
  const paypalW = variant === 'compact' ? 72 : 90
  const lemonW = variant === 'compact' ? 120 : 150
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-8 md:gap-10 ${className}`}
      aria-label="Global payment partners"
    >
      <Image
        src="/payment-logos/paypal.svg"
        alt="PayPal"
        width={paypalW}
        height={h}
        className="h-[22px] w-auto opacity-90 md:h-[28px]"
        unoptimized
      />
      <Image
        src="/payment-logos/lemon-squeezy.svg"
        alt="Lemon Squeezy"
        width={lemonW}
        height={h}
        className="h-[22px] w-auto opacity-90 md:h-[28px]"
        unoptimized
      />
    </div>
  )
}
