import { SupabaseClient } from '@supabase/supabase-js'

export const FREE_LIMIT = 3

export async function getSubscriptionStatus(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .single()

  const isActive = data?.status === 'active'
  return { status: data?.status ?? 'free', isActive }
}

export async function getMonthlyInterpretationCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('suenos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('interpretacion', 'is', null)
    .gte('interpretado_en', startOfMonth.toISOString())

  return count ?? 0
}
