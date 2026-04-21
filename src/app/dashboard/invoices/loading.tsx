export default function DashboardInvoicesLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[#F97316] border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-slate-soft">Loading invoices…</p>
    </div>
  )
}
