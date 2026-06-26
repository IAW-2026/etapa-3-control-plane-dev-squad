import { NextRequest, NextResponse } from 'next/server'

const SELLER_API = process.env.NEXT_PUBLIC_SELLER_APP_URL
const API_KEY = process.env.NEXT_PUBLIC_SUPERADMIN_KEY

export async function GET() {
  try {
    const res = await fetch(`${SELLER_API}/api/admin/products`, {
      headers: { 'X-Superadmin-Key': API_KEY! },
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error de conexión con el servicio de productos' }, { status: 502 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch(`${SELLER_API}/api/admin/products`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Superadmin-Key': API_KEY!,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el producto' }, { status: 502 })
  }
}
