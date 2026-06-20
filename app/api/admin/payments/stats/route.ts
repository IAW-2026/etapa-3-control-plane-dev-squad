// app/api/admin/payments/stats/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENTS_API_URL}/api/admin/stats`, {
      headers: { 'x-api-key': process.env.PAYMENTS_API_KEY! },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ disputas: [] }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ disputas: [] }, { status: 502 })
  }
}