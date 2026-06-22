import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.SHIPPING_API_KEY!
const API_BASE = process.env.SHIPPING_APP_URL!

export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const res = await fetch(`${API_BASE}/api/superadmin/shipments/${orderId}`, {
    headers: { "x-api-key": API_KEY },
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const body = await req.json()
  const res = await fetch(`${API_BASE}/api/superadmin/shipments/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}