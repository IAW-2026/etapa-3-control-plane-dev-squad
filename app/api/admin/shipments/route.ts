import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.SHIPPING_API_KEY!
const API_BASE = process.env.SHIPPING_APP_URL!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const res = await fetch(`${API_BASE}/api/superadmin/shipments?${searchParams}`, {
    headers: { "x-api-key": API_KEY },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}