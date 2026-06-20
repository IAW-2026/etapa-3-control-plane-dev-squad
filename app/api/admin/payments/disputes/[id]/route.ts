// app/api/admin/payments/disputes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAYMENTS_API_URL}/api/disputes/${params.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.PAYMENTS_API_KEY!,
        },
        body: JSON.stringify(body),
      }
    )

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ error: 'No se pudo actualizar la disputa' }, { status: 502 })
  }
}