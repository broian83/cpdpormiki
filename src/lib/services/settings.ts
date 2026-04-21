import { createClient } from '@supabase/supabase-js'

/**
 * Fetches a system setting value by ID from the database using service role.
 * This runs on the server side/edge only.
 */
export async function getSystemSetting(id: string): Promise<string | null> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabaseAdmin
    .from('system_settings')
    .select('value')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error(`Error fetching system setting ${id}:`, error)
    return null
  }

  return data?.value || null
}
