import { NextRequest, NextResponse } from 'next/server'
import { getAllReports } from '../../../../services/feedback-api'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const search = url.searchParams.get('search') || undefined
    const resolvedParam = url.searchParams.get('resolved')
    const resolved = resolvedParam === 'true' ? true : resolvedParam === 'false' ? false : undefined
    const rating = url.searchParams.get('rating') ? Number(url.searchParams.get('rating')) : undefined
    const fechaDesde = url.searchParams.get('fechaDesde') || undefined
    const fechaHasta = url.searchParams.get('fechaHasta') || undefined

    const result = await getAllReports({ page, limit, search, resolved, rating, fechaDesde, fechaHasta })
    return NextResponse.json(result)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno'
    const status = error instanceof Object && 'status' in (error as object) ? (error as { status: number }).status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
