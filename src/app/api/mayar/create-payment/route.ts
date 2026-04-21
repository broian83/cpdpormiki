import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { invoiceId, invoiceIds, amount, description, customerName, customerEmail } = await request.json()
    
    const supabase = createServerClient()
    
    // Fetch MAYAR_API_KEY from database settings
    const { data: settings } = await supabase
      .from('system_settings')
      .select('value')
      .eq('id', 'MAYAR_API_KEY')
      .single()

    const apiKey = settings?.value || process.env.MAYAR_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Mayar API Key tidak ditemukan. Mohon konfigurasi di Admin Settings.' }, { status: 500 })
    }

    // Determine Base URL (Sandbox or Production) - Default to production for HL usually
    const baseUrl = 'https://api.mayar.id/hl/v1'

    // 1. Create Payment link via Mayar Headless API (Payment Link method)
    const response = await fetch(`${baseUrl}/payment/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: customerName || 'Member PMIK',
        email: customerEmail || 'member@example.com',
        amount: amount,
        description: description || `Pembayaran Iuran PMIK`,
        mobile: '', // Optional
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?status=success`,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/mayar/webhook`,
        metadata: {
          invoiceId: invoiceId,
          invoiceIds: invoiceIds // Comma separated IDs
        }
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Gagal membuat pembayaran ke Mayar' }, { status: response.status })
    }

    return NextResponse.json({ 
      paymentUrl: data.data.link,
      paymentId: data.data.id 
    })

  } catch (error: any) {
    console.error('Mayar Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
