'use client';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  iconOnly?: boolean;
  className?: string;
  fontWeight?: 'font-bold' | 'font-extrabold' | 'font-black';
}

const iconSizes = { sm: 28, md: 36, lg: 44 };
const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' };

export function Logo({
  theme = 'dark',
  size = 'md',
  href,
  iconOnly = false,
  className = '',
  fontWeight = 'font-bold',
}: LogoProps) {
  const iconPx = iconSizes[size];
  const chaseColor = theme === 'dark' ? 'text-white' : 'text-gray-900';

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo-icon.png"
        alt="ChaseDue icon"
        width={iconPx}
        height={iconPx}
        priority
        unoptimized
        className="object-contain flex-shrink-0"
      />
      {!iconOnly && (
        <span className={`${fontWeight} leading-none ${textSizes[size]}`}>
          <span className={chaseColor}>Chase</span>
          <span className="text-orange-500">Due</span>
        </span>
      )}
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
