import { redirect } from 'next/navigation'
import { getAnalyticsSnapshot } from '@/app/analytics/actions'
import AnalyticsPageContent from '@/components/analytics/analytics-page-content'

export default async function AnalyticsPage() {
  const res = await getAnalyticsSnapshot()

  if (res.ok === false) {
    if (res.error === 'unauthorized') {
      redirect('/login?next=/analytics')
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {res.message ?? 'Could not load analytics.'}
        </p>
      </div>
    )
  }

  return <AnalyticsPageContent data={res.data} />
}
