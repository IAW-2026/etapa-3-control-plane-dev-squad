import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  status?: string
  _count: { products: number; orders: number }
  createdAt: string
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString()

  try {
    const cookie = req.headers.get('cookie') || ''

    const [buyersRes, sellersRes] = await Promise.all([
      fetch(`${process.env.BUYER_API_URL}/api/admin/users${searchParams ? `?${searchParams}` : ''}`, {
        headers: {
          'Content-Type': 'application/json',
          'buyer-key': process.env.BUYER_API_KEY || '',
          cookie,
        },
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_SELLER_APP_URL}/api/admin/vendedores${searchParams ? `?${searchParams}` : ''}`, {
        headers: { 'X-Superadmin-Key': process.env.NEXT_PUBLIC_SUPERADMIN_KEY! },
        cache: 'no-store',
      }),
    ])

    let buyers: User[] = []
    if (buyersRes.ok) {
      const body = await buyersRes.json()
      const raw = Array.isArray(body) ? body : body.users ?? body.data ?? []
      buyers = raw.map((u: any) => ({
        id: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(' '),
        email: u.email || '',
        image: u.image || null,
        role: (u.role || '').toLowerCase() || 'user',
        status: u.status || 'ACTIVE',
        _count: { products: u._count?.products ?? 0, orders: u._count?.orders ?? 0 },
        createdAt: u.createdAt || '',
      }))
    }

    let sellers: User[] = []
    if (sellersRes.ok) {
      const body = await sellersRes.json()
      const raw = Array.isArray(body) ? body : body.sellers ?? body.data ?? []
      sellers = raw.map((s: any) => ({
        id: s.id,
        name: s.name || '',
        email: s.email || '',
        image: null,
        role: 'seller',
        status: s.active ? 'ACTIVE' : 'SUSPENDED',
        _count: { products: s.totalProducts ?? s._count?.products ?? 0, orders: s.totalSells ?? s._count?.orders ?? 0 },
        createdAt: s.createdAt || '',
      }))
    }

    const seen = new Set<string>()
    const all: User[] = []

    for (const u of [...sellers, ...buyers]) {
      const key = u.email.toLowerCase().trim()
      if (key && !seen.has(key)) {
        seen.add(key)
        all.push(u)
      } else if (!key) {
        all.push(u)
      }
    }

    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 502 })
  }
}
