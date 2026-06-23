import { NextRequest, NextResponse } from 'next/server'
import { updateReview } from '../../../../../services/feedback-api'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const review = await updateReview(id, body)
    return NextResponse.json(review)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno'
    const status =
      error instanceof Object && 'status' in (error as object)
        ? (error as { status: number }).status
        : 500
    return NextResponse.json({ error: message }, { status })
  }
}
