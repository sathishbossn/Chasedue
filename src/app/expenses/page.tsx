import { redirect } from 'next/navigation'
import ExpensesPageContent from '@/components/expenses/expenses-page-content'
import { listExpensesForPage } from '@/app/expenses/actions'

export default async function ExpensesPage() {
  const res = await listExpensesForPage()

  if (res.ok === false) {
    if (res.error === 'unauthorized') {
      redirect('/login?next=/expenses')
    }
    return (
      <div className="px-4 py-16 text-center text-red-300">
        {res.message ?? 'Could not load expenses.'}
      </div>
    )
  }

  return (
    <ExpensesPageContent
      expenses={res.expenses}
      monthBurnCents={res.monthBurnCents}
      totalExpensesCents={res.totalExpensesCents}
      monthlyBudgetCents={res.monthlyBudgetCents}
      remainingBudgetCents={res.remainingBudgetCents}
    />
  )
}
