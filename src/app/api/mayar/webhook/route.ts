import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// We use service role key for webhook because it skips RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Mayar Webhook Received:', body)

    // Mayar webhook structure usually contains 'event' and 'data'
    // Event: 'payment.received' or 'payment.success'
    const { event, data } = body

    if (event === 'payment.received' || event === 'payment.success') {
      const invoiceId = data.metadata?.invoiceId
      const invoiceIds = data.metadata?.invoiceIds // Comma separated string for batch

      if (invoiceIds) {
        const ids = invoiceIds.split(',').map((id: string) => id.trim())
        const { error } = await supabaseAdmin
          .from('payment_invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .in('id', ids)

        if (error) {
          console.error('Batch update error:', error)
          return NextResponse.json({ error: 'Failed to update invoices' }, { status: 500 })
        }
      } else if (invoiceId) {
        const { error } = await supabaseAdmin
          .from('payment_invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', invoiceId)

        if (error) {
          console.error('Database update error:', error)
          return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook Error:', error)
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
