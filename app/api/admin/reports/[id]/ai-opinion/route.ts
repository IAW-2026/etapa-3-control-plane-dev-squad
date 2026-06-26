import { NextRequest, NextResponse } from 'next/server'
import { getAIOpinion } from '../../../../../../services/feedback-api'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'id es requerido' }, { status: 400 })
    }

    const opinion = await getAIOpinion(id)
    return NextResponse.json({ opinion })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno'
    const status = error instanceof Object && 'status' in (error as object) ? (error as { status: number }).status : 500
    return NextResponse.json({ error: message }, { status })
  }
}
