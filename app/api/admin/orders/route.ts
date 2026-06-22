import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString()

  try {
    const cookie = req.headers.get('cookie') || ''

    const res = await fetch(`${process.env.BUYER_API_URL}/api/admin/orders${searchParams ? `?${searchParams}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BUYER_API_KEY || '',
        cookie,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ data: [], pagination: { page: 1, limit: 10 } }, { status: res.status })
    }

    const body = await res.json()
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ data: [], pagination: { page: 1, limit: 10 } }, { status: 502 })
  }
}
