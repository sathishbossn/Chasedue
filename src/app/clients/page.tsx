import { redirect } from 'next/navigation'
import ClientsPageContent from '@/components/clients/clients-page-content'
import { listClientsWithStats } from '@/app/clients/actions'

export default async function ClientsPage() {
  const res = await listClientsWithStats()

  if (res.ok === false) {
    if (res.error === 'unauthorized') {
      redirect('/login?next=/clients')
    }
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {res.message ?? 'Could not load clients.'}
        </p>
      </div>
    )
  }

  return <ClientsPageContent clients={res.clients} />
}
