import { NextRequest, NextResponse } from 'next/server'

interface SellerFromApp {
  id: string
  name: string
  email: string
  description?: string
  active: boolean
  createdAt: string
  totalProducts: number
  totalSells: number
}

interface MappedUser {
  id: string
  name: string
  email: string
  image: null
  role: string
  _count: { products: number; orders: number }
  createdAt: string
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams.toString()
  const url = `${process.env.NEXT_PUBLIC_SELLER_APP_URL}/api/admin/vendedores${searchParams ? `?${searchParams}` : ''}`

  try {
    const res = await fetch(url, {
      headers: { 'X-Superadmin-Key': process.env.NEXT_PUBLIC_SUPERADMIN_KEY! },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Error al obtener vendedores' }, { status: res.status })
    }

    const sellers: SellerFromApp[] = await res.json()
    const users: MappedUser[] = sellers.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      image: null,
      role: 'seller',
      _count: { products: s.totalProducts, orders: s.totalSells },
      createdAt: s.createdAt,
    }))
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Error de conexión con el servicio de vendedores' }, { status: 502 })
  }
}
