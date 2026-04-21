'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export type ExpenseListRow = {
  id: string
  description: string
  amount: number
  category: string | null
  expense_date: string
  created_at: string
}

const CATEGORY_SET = new Set(['Hardware', 'Software', 'Marketing', 'Other'])

function currentMonthPrefix(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const DEFAULT_MONTHLY_BUDGET_INR = 50_000

/** Monthly expense budget in paise (INR × 100). Configurable via NEXT_PUBLIC_EXPENSE_MONTHLY_BUDGET_INR. */
export async function monthlyBudgetCentsFromEnv(): Promise<number> {
  const raw = process.env.NEXT_PUBLIC_EXPENSE_MONTHLY_BUDGET_INR
  const trimmed = raw == null ? '' : String(raw).trim()
  if (trimmed === '') {
    return Math.round(DEFAULT_MONTHLY_BUDGET_INR * 100)
  }
  const parsed = Number(trimmed.replace(/,/g, ''))
  if (!Number.isFinite(parsed) || parsed < 0) {
    return Math.round(DEFAULT_MONTHLY_BUDGET_INR * 100)
  }
  return Math.round(parsed * 100)
}

export async function listExpensesForPage(): Promise<
  | {
      ok: true
      expenses: ExpenseListRow[]
      monthBurnCents: number
      totalExpensesCents: number
      monthlyBudgetCents: number
      remainingBudgetCents: number
    }
  | { ok: false; error: 'unauthorized' | 'unknown'; message?: string }
> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'unauthorized' }
  }

  const { data, error } = await supabase
    .from('expenses')
    .select('id, description, amount, category, expense_date, created_at')
    .eq('user_id', user.id)
    .order('expense_date', { ascending: false })

  if (error) {
    return { ok: false, error: 'unknown', message: error.message }
  }

  const expenses = (data ?? []) as ExpenseListRow[]
  const prefix = currentMonthPrefix()
  let monthBurnCents = 0
  let totalExpensesCents = 0
  for (const e of expenses) {
    const c = Math.round(Number(e.amount) * 100)
    totalExpensesCents += c
    if (String(e.expense_date).startsWith(prefix)) {
      monthBurnCents += c
    }
  }

  const monthlyBudgetCents = await monthlyBudgetCentsFromEnv()
  const remainingBudgetCents = Math.max(0, monthlyBudgetCents - monthBurnCents)

  return {
    ok: true,
    expenses,
    monthBurnCents,
    totalExpensesCents,
    monthlyBudgetCents,
    remainingBudgetCents,
  }
}

export async function createExpense(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'You must be signed in.' }
  }

  const description = String(formData.get('description') ?? '').trim()
  const amountRaw = String(formData.get('amount') ?? '').trim()
  const categoryRaw = String(formData.get('category') ?? 'Other').trim()
  const expenseDateRaw = String(formData.get('expense_date') ?? '').trim()

  if (!description) {
    return { ok: false, error: 'Description is required.' }
  }

  const amount = Number(amountRaw)
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: 'Enter a valid amount greater than zero.' }
  }

  const category = CATEGORY_SET.has(categoryRaw) ? categoryRaw : 'Other'

  let expenseDate = expenseDateRaw
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expenseDate)) {
    expenseDate = new Date().toISOString().slice(0, 10)
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    description,
    amount,
    category,
    expense_date: expenseDate,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  revalidatePath('/expenses')
  revalidatePath('/dashboard')
  revalidatePath('/analytics')
  return { ok: true }
}
