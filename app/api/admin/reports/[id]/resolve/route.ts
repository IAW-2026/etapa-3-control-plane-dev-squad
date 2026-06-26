import { NextRequest, NextResponse } from 'next/server'
import { resolveReport } from '../../../../../../services/feedback-api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: reportId } = await params
    if (!reportId) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const body = await req.json()
    const { action, adminId, comentarioAdmin } = body

    if (!action || !['dismiss', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'action debe ser "dismiss" o "remove"' }, { status: 400 })
    }
    if (!adminId || typeof adminId !== 'string') {
      return NextResponse.json({ error: 'adminId es requerido' }, { status: 400 })
    }

    const report = await resolveReport(reportId, { action, adminId, comentarioAdmin })
    return NextResponse.json(report)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno'
    const status = error instanceof Object && 'status' in (error as object) ? (error as { status: number }).status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
