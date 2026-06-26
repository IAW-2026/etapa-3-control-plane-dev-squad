// app/api/admin/payments/transferencias/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const incoming = req.nextUrl.searchParams.toString()
  const url = `${process.env.NEXT_PUBLIC_PAYMENTS_API_URL}/api/admin/transferencias${incoming ? `?${incoming}` : ''}`

  try {
    const res = await fetch(url, {
      headers: { 'x-api-key': process.env.PAYMENTS_API_KEY! },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ items: [], totalPages: 1 }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ items: [], totalPages: 1 }, { status: 502 })
  }
}