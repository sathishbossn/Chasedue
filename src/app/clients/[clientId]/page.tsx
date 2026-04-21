import { notFound, redirect } from 'next/navigation'
import { getClientDetailForUser } from '@/app/clients/actions'
import ClientDetailContent from '@/components/clients/client-detail-content'

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const result = await getClientDetailForUser(clientId)

  if (result.ok === false) {
    if (result.error === 'unauthorized') {
      redirect('/login')
    }
    notFound()
  }

  return <ClientDetailContent client={result.client} invoices={result.invoices} />
}
