import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import FeatureDeepDiveClient from '@/components/features/feature-deep-dive-client'
import { FEATURE_SLUGS, getFeatureBySlug } from '@/lib/feature-pages'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return FEATURE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) {
    return { title: 'Feature | ChaseDue' }
  }
  return {
    title: `${feature.title} | ChaseDue`,
    description: feature.subtitle,
    openGraph: {
      title: `${feature.title} | ChaseDue`,
      description: feature.subtitle,
    },
  }
}

export default async function FeaturePage({ params }: Props) {
  const { slug } = await params
  const feature = getFeatureBySlug(slug)
  if (!feature) {
    notFound()
  }

  return <FeatureDeepDiveClient feature={feature} />
}
